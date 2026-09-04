import { ScopeSwitcher as SharedScopeSwitcher } from "@operonstudio/ui";
import { useScope } from "#/common/scope";
import { useScopeActions } from "./actions";

/**
 * Chooses which workspace, project and environment the console is looking at.
 *
 * All three matter: a tracker belongs to a project in one environment, so
 * "enabled" is a question you can only answer once all three are known.
 *
 * The control is the design system's, shared with Studio and built from the
 * switcher Compose already had. This file supplies the data and the create
 * handlers, nothing else.
 *
 * Nothing here links to Compose. It used to say "Create one in Compose" when a
 * level was empty, so somebody who had bought Analytics had to go and set up a
 * product they were not using. Each level creates its own record now, against
 * the platform API that owns it.
 */
export const ScopeSwitcher = () => {
  const {
    scope,
    workspaces,
    projects,
    environments,
    isLoading,
    setWorkspace,
    setProject,
    setEnvironment,
  } = useScope();

  const { createWorkspace, createEnvironment, createProject, isBusy } =
    useScopeActions(scope.workspaceId);

  return (
    <SharedScopeSwitcher
      isLoading={isLoading}
      levels={[
        {
          label: "Workspace",
          value: scope.workspaceId,
          options: workspaces,
          onChange: setWorkspace,
          onCreate: createWorkspace,
          isCreating: isBusy,
        },
        {
          label: "Project",
          value: scope.projectId,
          options: projects,
          onChange: setProject,
          onCreate: createProject,
          isCreating: isBusy,
          placeholder: "No project",
        },
        {
          label: "Environment",
          value: scope.environmentId,
          options: environments,
          onChange: setEnvironment,
          onCreate: createEnvironment,
          isCreating: isBusy,
          placeholder: "No environment",
        },
      ]}
    />
  );
};
