import { toast } from "@operonstudio/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  setActiveEnvironmentId,
  setActiveProjectId,
  setActiveWorkspaceId,
} from "#/common/active-scope";
import {
  createEnvironmentMutation,
  createProjectMutation,
  createWorkspaceMutation,
  platformKeys,
} from "#/common/api/platform";
import type { Environment, Project, Workspace } from "#/common/api/types";

/**
 * The create handlers behind the switcher's "New …" rows.
 *
 * Each one selects what it just made, because somebody adding a staging
 * environment is about to work in it, and leaving the selection where it was
 * makes the new row look like it failed to appear.
 */
export function useScopeActions(workspaceId: string) {
  const qc = useQueryClient();

  const createWorkspace = useMutation({
    ...createWorkspaceMutation,
    onSuccess: (workspace: Workspace) => {
      setActiveWorkspaceId(workspace.id);
      qc.invalidateQueries({ queryKey: platformKeys.workspaces() });
      toast.success(`Workspace "${workspace.name}" created`);
    },
    onError: () => toast.error("Could not create the workspace"),
  });

  const createEnvironment = useMutation({
    ...createEnvironmentMutation(workspaceId),
    onSuccess: (environment: Environment) => {
      setActiveEnvironmentId(environment.id);
      qc.invalidateQueries({
        queryKey: platformKeys.environments(workspaceId),
      });
      toast.success(`Environment "${environment.name}" created`);
    },
    onError: () => toast.error("Could not create the environment"),
  });

  const createProject = useMutation({
    ...createProjectMutation(workspaceId),
    onSuccess: (project: Project) => {
      setActiveProjectId(project.id);
      qc.invalidateQueries({ queryKey: platformKeys.projects(workspaceId) });
      toast.success(`Project "${project.name}" created`);
    },
    onError: () => toast.error("Could not create the project"),
  });

  return {
    createWorkspace: (name: string) => createWorkspace.mutate(name),
    createEnvironment: (name: string) => {
      if (!workspaceId) return;
      createEnvironment.mutate(name);
    },
    createProject: (name: string) => {
      if (!workspaceId) return;
      createProject.mutate({ name });
    },
    isBusy:
      createWorkspace.isPending ||
      createEnvironment.isPending ||
      createProject.isPending,
  };
}
