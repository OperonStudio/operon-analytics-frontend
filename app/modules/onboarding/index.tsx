import { Box, Button, Chip, Input } from "@operonstudio/ui";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { useOnboarding } from "./hooks";
import * as classes from "./style";

const WORKSPACE_SUGGESTIONS = ["Personal", "My Team", "Playground"];
const ENVIRONMENT_SUGGESTIONS = ["development", "staging", "production"];
const PROJECT_SUGGESTIONS = ["Web app", "Marketing site", "Docs"];

interface OnboardingGateProps {
  children: ReactNode;
}

/**
 * Blocks the console until the signed-in user has a workspace, an environment
 * and a project.
 *
 * All three are needed before anything here has a URL to call: a tracker
 * belongs to a project in one environment, and an event is filed against the
 * same pair. Letting someone past this point with any of them missing produced
 * a console of empty panels and 400s with nothing explaining what to do.
 *
 * Analytics stands on its own from here. None of these steps sends anyone to
 * another product to finish setting up the one they are in.
 */
export const OnboardingGate = ({ children }: OnboardingGateProps) => {
  const {
    step,
    isLoading,
    isErrored,
    createWorkspace,
    isCreatingWorkspace,
    createEnvironment,
    isCreatingEnvironment,
    createProject,
    isCreatingProject,
  } = useOnboarding();

  if (isLoading) {
    return <Box {...classes.centeredLoaderStyle}>Loading your workspace…</Box>;
  }

  if (isErrored) {
    return (
      <Box {...classes.backdropStyle}>
        <Box {...classes.errorPanelStyle}>
          <Box {...classes.titleStyle}>Something went wrong</Box>
          <Box {...classes.bodyStyle}>
            We couldn&apos;t reach the Operon platform API. Check that
            operon-homepage-backend is running on port 8081, then reload.
          </Box>
          <Box {...classes.actionsStyle}>
            <Button size="sm" onClick={() => window.location.reload()}>
              Reload
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

  if (step === "workspace") {
    return (
      <Step
        eyebrow="Step 1 of 3"
        title="Create your workspace"
        body="Holds your projects, environments and team."
        label="Workspace name"
        initial="Personal"
        placeholder="Personal"
        suggestions={WORKSPACE_SUGGESTIONS}
        submitLabel="Create workspace"
        onSubmit={createWorkspace}
        isSubmitting={isCreatingWorkspace}
      />
    );
  }

  if (step === "environment") {
    return (
      <Step
        eyebrow="Step 2 of 3"
        title="Add your first environment"
        body="One place your app runs. Each gets its own API key, so the same build points at whichever you give it."
        label="Environment name"
        initial="development"
        placeholder="development"
        suggestions={ENVIRONMENT_SUGGESTIONS}
        submitLabel="Create environment"
        onSubmit={createEnvironment}
        isSubmitting={isCreatingEnvironment}
      />
    );
  }

  if (step === "project") {
    return (
      <Step
        eyebrow="Step 3 of 3"
        title="Name your project"
        body="The app you are measuring. It spans every environment."
        label="Project name"
        initial=""
        placeholder="Web app"
        suggestions={PROJECT_SUGGESTIONS}
        submitLabel="Create project"
        onSubmit={createProject}
        isSubmitting={isCreatingProject}
      />
    );
  }

  return <>{children}</>;
};

function Step({
  eyebrow,
  title,
  body,
  label,
  initial,
  placeholder,
  suggestions,
  submitLabel,
  onSubmit,
  isSubmitting,
}: {
  eyebrow: string;
  title: string;
  body: string;
  label: string;
  initial: string;
  placeholder: string;
  suggestions: string[];
  submitLabel: string;
  onSubmit: (name: string) => void;
  isSubmitting: boolean;
}) {
  const [name, setName] = useState(initial);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const trimmed = name.trim();

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!trimmed || isSubmitting) return;
    onSubmit(trimmed);
  };

  return (
    <Box {...classes.backdropStyle}>
      <form onSubmit={handleSubmit} {...classes.cardStyle}>
        <Box {...classes.eyebrowStyle}>{eyebrow}</Box>
        <Box {...classes.titleStyle}>{title}</Box>
        <Box {...classes.bodyStyle}>{body}</Box>
        <Box {...classes.fieldGroupStyle}>
          <label {...classes.labelStyle} htmlFor="ob-name">
            {label}
          </label>
          <Input
            id="ob-name"
            ref={inputRef}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={placeholder}
            required
            autoComplete="off"
          />
          <Box {...classes.suggestionsRowStyle}>
            {suggestions.map((suggestion) => (
              <Chip
                key={suggestion}
                size="sm"
                variant="outline"
                color="secondary"
                label={suggestion}
                onClick={() => setName(suggestion)}
              />
            ))}
          </Box>
        </Box>
        <Box {...classes.actionsStyle}>
          <Button type="submit" size="sm" disabled={!trimmed || isSubmitting}>
            {isSubmitting ? "Creating…" : submitLabel}
          </Button>
        </Box>
      </form>
    </Box>
  );
}
