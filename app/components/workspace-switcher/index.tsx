import {
  type Workspace,
  createWorkspaceOptions,
  getWorkspacesOptions,
} from "#/common/workspace-api";
import { Check, ChevronDown, Plus } from "@operon/icons";
import { Box, Button, toast } from "@operon/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

const ACTIVE_WORKSPACE_KEY = "operon_active_workspace_id";

function getStoredWorkspaceId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACTIVE_WORKSPACE_KEY);
}

function storeWorkspaceId(id: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(ACTIVE_WORKSPACE_KEY, id);
  }
}

export function useActiveWorkspace() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: workspaces = [] } = useQuery(getWorkspacesOptions);
  const [activeId, setActiveId] = useState<string | null>(getStoredWorkspaceId);

  const handleRedirect = () => {
    const pathname = router.state.location.pathname;
    if (pathname.startsWith("/projects/")) router.navigate({ to: "/projects" as any });
    else if (pathname.startsWith("/rule-engine/")) router.navigate({ to: "/rule-engine" as any });
    else if (pathname.startsWith("/api-keys/")) router.navigate({ to: "/api-keys" as any });
  };

  useEffect(() => {
    if (workspaces.length > 0 && !activeId) {
      const id = workspaces[0].id;
      setActiveId(id);
      storeWorkspaceId(id);
      queryClient.invalidateQueries();
      handleRedirect();
    }
  }, [workspaces, activeId, queryClient, router]);

  const activeWorkspace = workspaces.find((w) => w.id === activeId) ?? workspaces[0] ?? null;

  const switchWorkspace = (id: string) => {
    setActiveId(id);
    storeWorkspaceId(id);
    queryClient.invalidateQueries();
    handleRedirect();
  };

  return { workspaces, activeWorkspace, switchWorkspace };
}

interface WorkspaceSwitcherProps {
  compact?: boolean;
}

export const WorkspaceSwitcher = ({ compact = false }: WorkspaceSwitcherProps) => {
  const queryClient = useQueryClient();
  const { workspaces, activeWorkspace, switchWorkspace } = useActiveWorkspace();
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { mutate: createWorkspace, isPending } = useMutation({
    ...createWorkspaceOptions,
    onSuccess: (ws) => {
      toast.success(`Workspace "${ws.name}" created`);
      queryClient.invalidateQueries({ queryKey: getWorkspacesOptions.queryKey });
      switchWorkspace(ws.id);
      setIsCreating(false);
      setNewName("");
      setIsOpen(false);
    },
    onError: () => toast.error("Failed to create workspace"),
  });

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setIsCreating(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleCreate = () => {
    if (!newName.trim()) return;
    createWorkspace({ name: newName.trim() });
  };

  if (workspaces.length === 0 && !isOpen) {
    return (
      <Box
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid var(--operon-color-border, #e5e7eb)",
          marginBottom: "8px",
        }}
      >
        <Button
          variant="outline"
          size="sm"
          style={{ width: "100%", fontSize: "13px" }}
          onClick={() => {
            setIsOpen(true);
            setIsCreating(true);
          }}
        >
          <Plus size={14} style={{ marginRight: 6 }} />
          Create Workspace
        </Button>
      </Box>
    );
  }

  return (
    <Box
      ref={dropdownRef}
      style={{
        position: "relative",
        zIndex: 100,
        padding: "12px 16px",
        borderBottom: "1px solid var(--operon-color-border, #e5e7eb)",
        marginBottom: "8px",
      }}
    >
      {/* Trigger button */}
      <Box
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          cursor: "pointer",
          borderRadius: "var(--operon-radius-sm, 8px)",
          padding: "8px 10px",
          transition: "background 0.15s ease",
          background: isOpen
            ? "var(--operon-color-primary-ghost, rgba(99,102,241,0.08))"
            : "transparent",
        }}
        onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
          if (!isOpen) {
            (e.currentTarget as HTMLDivElement).style.background =
              "var(--operon-color-primary-ghost, rgba(99,102,241,0.08))";
          }
        }}
        onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
          if (!isOpen) {
            (e.currentTarget as HTMLDivElement).style.background = "transparent";
          }
        }}
      >
        {!compact && (
          <>
            <Box style={{ flex: 1, minWidth: 0 }}>
              <Box
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "var(--operon-color-text)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {activeWorkspace?.name ?? "Select Workspace"}
              </Box>
              <Box
                style={{
                  fontSize: "11px",
                  color: "var(--operon-color-text-muted)",
                }}
              >
                Workspace
              </Box>
            </Box>
            <ChevronDown
              size={14}
              color="var(--operon-color-text-muted)"
              style={{
                transition: "transform 0.2s",
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </>
        )}
      </Box>

      {/* Dropdown panel */}
      {isOpen && (
        <Box
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: "12px",
            right: "12px",
            background: "var(--operon-color-surface, #fff)",
            border: "1px solid var(--operon-color-border)",
            borderRadius: "var(--operon-radius-md, 10px)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            zIndex: 100,
            overflow: "hidden",
          }}
        >
          {/* Workspace list */}
          <Box style={{ maxHeight: "200px", overflowY: "auto", padding: "6px" }}>
            {workspaces.map((ws: Workspace) => (
              <Box
                key={ws.id}
                onClick={() => {
                  switchWorkspace(ws.id);
                  setIsOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 10px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: activeWorkspace?.id === ws.id ? 600 : 400,
                  color:
                    activeWorkspace?.id === ws.id
                      ? "var(--operon-color-primary)"
                      : "var(--operon-color-text)",
                  background:
                    activeWorkspace?.id === ws.id
                      ? "var(--operon-color-primary-ghost, rgba(99,102,241,0.08))"
                      : "transparent",
                  transition: "background 0.12s",
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                  if (activeWorkspace?.id !== ws.id) {
                    (e.currentTarget as HTMLDivElement).style.background =
                      "var(--operon-color-surface-raised, #f5f5ff)";
                  }
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                  if (activeWorkspace?.id !== ws.id) {
                    (e.currentTarget as HTMLDivElement).style.background = "transparent";
                  }
                }}
              >
                <Box
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "4px",
                    background: "var(--operon-color-primary-ghost, rgba(99,102,241,0.15))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--operon-color-primary)",
                    flexShrink: 0,
                  }}
                >
                  {ws.name.charAt(0).toUpperCase()}
                </Box>
                <Box style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {ws.name}
                </Box>
                {activeWorkspace?.id === ws.id && (
                  <Check size={13} color="var(--operon-color-primary)" />
                )}
              </Box>
            ))}
          </Box>

          {/* Divider */}
          <Box
            style={{
              height: "1px",
              background: "var(--operon-color-border)",
              margin: "4px 0",
            }}
          />

          {/* Create new workspace */}
          {isCreating ? (
            <Box style={{ padding: "8px 10px", display: "flex", gap: 6 }}>
              <input
                autoFocus
                placeholder="Workspace name..."
                value={newName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewName(e.target.value)
                }
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter") handleCreate();
                  if (e.key === "Escape") {
                    setIsCreating(false);
                    setNewName("");
                  }
                }}
                style={{
                  flex: 1,
                  minWidth: 0,
                  padding: "6px 10px",
                  fontSize: "13px",
                  border: "1px solid var(--operon-color-border)",
                  borderRadius: "6px",
                  outline: "none",
                  background: "var(--operon-color-background)",
                  color: "var(--operon-color-text)",
                }}
              />
              <Button
                size="sm"
                onClick={handleCreate}
                disabled={isPending || !newName.trim()}
              >
                {isPending ? "..." : "Add"}
              </Button>
            </Box>
          ) : (
            <Box
              onClick={() => setIsCreating(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 10px 10px",
                cursor: "pointer",
                fontSize: "13px",
                color: "var(--operon-color-text-muted)",
                transition: "color 0.12s",
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                (e.currentTarget as HTMLDivElement).style.color =
                  "var(--operon-color-primary)";
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                (e.currentTarget as HTMLDivElement).style.color =
                  "var(--operon-color-text-muted)";
              }}
            >
              <Plus size={14} />
              New workspace
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};
