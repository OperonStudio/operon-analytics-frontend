import { Braces, Plus, Trash2 } from "@operonstudio/icons";
import { Box, Button, Dropdown, Input, Modal, toast } from "@operonstudio/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  contextVariablesQuery,
  deleteContextVariableMutation,
  saveContextVariableMutation,
} from "#/common/api/queries";
import { queryKeys } from "#/common/api/query-keys";
import type { ContextVariable } from "#/common/api/types";
import { useScope } from "#/common/scope";
import * as classes from "./styles";

const TYPES: ContextVariable["type"][] = ["string", "number", "boolean"];

/**
 * Context variables: the values a developer registers once and everyone else
 * references by name.
 *
 * The developer calls `operon.setContext({ userId, plan })` in their app. What
 * gets sent with which event is then decided here and in the editor, with
 * `{{ userId }}` in an event's properties, without touching the code again.
 */
export const ContextModule = () => {
  const queryClient = useQueryClient();
  const { scope } = useScope();
  const workspaceId = scope.workspaceId;
  const { data: variables = [], isLoading } = useQuery(
    contextVariablesQuery(workspaceId),
  );

  const [editing, setEditing] = useState<ContextVariable | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<ContextVariable["type"]>("string");
  const [description, setDescription] = useState("");

  const refresh = () =>
    queryClient.invalidateQueries({
      queryKey: queryKeys.contextVariables(workspaceId),
    });

  const save = useMutation({
    ...saveContextVariableMutation(workspaceId),
    onSuccess: () => {
      refresh();
      close();
      toast.success("Variable saved");
    },
    onError: (err: Error) => toast.error(err.message || "Could not save"),
  });

  const remove = useMutation({
    ...deleteContextVariableMutation(workspaceId),
    onSuccess: () => {
      refresh();
      toast.success("Variable removed");
    },
  });

  const open = (variable?: ContextVariable) => {
    setEditing(variable ?? null);
    setName(variable?.name ?? "");
    setType(variable?.type ?? "string");
    setDescription(variable?.description ?? "");
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setEditing(null);
  };

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("Give the variable a name");
      return;
    }
    // The name is what appears inside {{ }}, so anything the reference syntax
    // cannot express is rejected here rather than failing silently later.
    if (!/^[A-Za-z_][\w.]*$/.test(trimmed)) {
      toast.error("Use letters, numbers, underscores and dots only");
      return;
    }
    save.mutate({
      id: editing?.id,
      name: trimmed,
      type,
      description: description.trim() || undefined,
    });
  };

  return (
    <Box {...classes.pageStyle}>
      <Box {...classes.introStyle}>
        <Box {...classes.introTextStyle}>
          A developer registers these once with{" "}
          <code>operon.setContext(&#123; userId &#125;)</code>. You can then
          send any of them with any event by writing{" "}
          <code>&#123;&#123; userId &#125;&#125;</code> in its properties, and
          the SDK fills in the live value as the event fires.
        </Box>
        <Button size="sm" onClick={() => open()} style={{ gap: 6 }}>
          <Plus size={14} /> Add variable
        </Button>
      </Box>

      {isLoading && <Box {...classes.emptyStyle}>Loading…</Box>}

      {!isLoading && variables.length === 0 && (
        <Box {...classes.emptyCardStyle}>
          <Box {...classes.emptyIconStyle}>
            <Braces size={20} />
          </Box>
          <Box {...classes.emptyTitleStyle}>No context variables yet</Box>
          <Box {...classes.emptyBodyStyle}>
            Add the values your app already knows about, such as the signed-in
            user or their plan. They become available to every event without a
            code change.
          </Box>
        </Box>
      )}

      {variables.length > 0 && (
        <Box {...classes.tableStyle}>
          {variables.map((variable) => (
            <Box key={variable.id} {...classes.rowStyle}>
              <Box {...classes.refStyle}>{`{{ ${variable.name} }}`}</Box>
              <Box {...classes.typeStyle}>{variable.type}</Box>
              <Box {...classes.descriptionStyle}>
                {variable.description || "—"}
              </Box>
              <Box {...classes.actionsStyle}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => open(variable)}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label={`Remove ${variable.name}`}
                  onClick={() => remove.mutate(variable.id)}
                  iconOnly
                >
                  <Trash2 size={15} />
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      <Modal
        isOpen={isOpen}
        onClose={close}
        title={editing ? "Edit variable" : "Add variable"}
        size="sm"
        footer={
          <Box display="flex" gap="8px">
            <Button variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button onClick={submit} disabled={save.isPending}>
              {save.isPending ? "Saving…" : "Save"}
            </Button>
          </Box>
        }
      >
        <Box display="flex" direction="column" gap="14px">
          <Box>
            <label {...classes.labelStyle} htmlFor="context-name">
              Name
            </label>
            <Input
              id="context-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="userId"
              autoFocus
              fullWidth
            />
            <Box {...classes.hintStyle}>
              Referenced as <code>{`{{ ${name.trim() || "userId"} }}`}</code>.
              Must match the key the developer registers.
            </Box>
          </Box>

          <Box>
            <Box {...classes.labelStyle} id="context-type-label">
              Type
            </Box>
            <Dropdown
              onSelect={(value) => setType(value as ContextVariable["type"])}
              containerStyle={{ width: "100%" }}
              items={TYPES.map((t) => ({ value: t, label: t }))}
              trigger={
                <Button
                  variant="outline"
                  aria-labelledby="context-type-label"
                  style={{ width: "100%", justifyContent: "space-between" }}
                >
                  {type}
                </Button>
              }
            />
          </Box>

          <Box>
            <label {...classes.labelStyle} htmlFor="context-description">
              Description
            </label>
            <Input
              id="context-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What this holds, for whoever uses it next"
              fullWidth
            />
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};
