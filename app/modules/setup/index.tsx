import { Box, Button, toast } from "@operonstudio/ui";
import { SDK_PACKAGE } from "#/common/constants";
import { useSetup } from "./hooks";
import * as classes from "./style";

/**
 * Getting the SDK into a customer's app, and proving it worked.
 *
 * The order matters and is the whole point of the page: install, point it at
 * one environment, watch a real event arrive, then do the same for the next
 * environment. Promotion is the last step rather than a separate feature,
 * because the only thing that changes between environments is the key — the
 * code shipped is identical — and a page that shows both together is what makes
 * that obvious.
 */
export const SetupModule = () => {
  const {
    project,
    environment,
    environmentStatuses,
    keyPrefix,
    hasKey,
    minted,
    createKey,
    isCreatingKey,
    isReceiving,
    eventCount,
    isReady,
  } = useSetup();

  if (!isReady) {
    return (
      <Box {...classes.pageStyle}>
        <Box {...classes.bodyStyle}>
          Pick a project and an environment to see its install instructions.
        </Box>
      </Box>
    );
  }

  const environmentName = environment?.name ?? "this environment";
  const currentKey = minted[environment?.id ?? ""] ?? "";

  return (
    <Box {...classes.pageStyle}>
      <Step
        number={1}
        title={`Install the SDK in ${project?.name ?? "your app"}`}
        body="No dependencies. Runs in the browser."
      >
        <CodeBlock text={`npm install ${SDK_PACKAGE}`} />
      </Step>

      <Step
        number={2}
        title={`Create a key for ${environmentName}`}
        body="Publishable. It sends events and reads nothing back, so it is safe in your bundle."
      >
        {currentKey ? (
          <>
            <CodeBlock text={`VITE_OPERON_KEY=${currentKey}`} />
            <Box {...classes.warningStyle}>
              Copy this now. It is stored hashed and never shown again.
            </Box>
          </>
        ) : hasKey ? (
          <Box {...classes.rowStyle}>
            <Box {...classes.mutedStyle}>
              This environment already has a key, prefix{" "}
              <code>{keyPrefix}</code>. Its value cannot be read back.
            </Box>
            <Button
              size="sm"
              variant="ghost"
              disabled={isCreatingKey}
              onClick={() => createKey(environment?.id ?? "")}
            >
              Create a new one
            </Button>
          </Box>
        ) : (
          <Box {...classes.rowStyle}>
            <Button
              size="sm"
              disabled={isCreatingKey}
              onClick={() => createKey(environment?.id ?? "")}
            >
              {isCreatingKey ? "Creating…" : "Create key"}
            </Button>
          </Box>
        )}
      </Step>

      <Step
        number={3}
        title="Initialise it once"
        body="Where your app starts. Read the key from the environment, not from source."
      >
        <CodeBlock
          text={`import { init } from "${SDK_PACKAGE}";

init({
  uniqueId: "data-operon-id",
  apiKey: import.meta.env.VITE_OPERON_KEY,
});`}
        />
        <Box {...classes.bodyStyle}>
          Put <code>data-operon-id</code> on anything you want to bind an event
          to. What fires is decided in the Visual Editor, so adding one later
          needs no release.
        </Box>
      </Step>

      <Step
        number={4}
        title="Check it is working"
        body="Run your app and click something."
      >
        <Box {...classes.statusStyle}>
          <span
            {...classes.dotStyle}
            style={{
              ...classes.dotStyle.style,
              background: isReceiving
                ? "var(--operon-color-success, #0f8b4c)"
                : "var(--operon-color-text-subtle, #b4b0b3)",
            }}
          />
          {isReceiving
            ? `Receiving events. ${eventCount} in the recent window.`
            : `No events from ${environmentName} yet. This keeps checking.`}
        </Box>
        {!isReceiving && (
          <Box {...classes.bodyStyle}>
            If nothing arrives: check the key belongs to{" "}
            <strong>{environmentName}</strong>, that at least one tracker is
            enabled, and that the element you are clicking carries the attribute
            you passed as <code>uniqueId</code>.
          </Box>
        )}
      </Step>

      <Step
        number={5}
        title="Promote to another environment"
        body="Same code, different key."
      >
        {environmentStatuses.map((env) => (
          <Box key={env.id} {...classes.envRowStyle}>
            <Box>
              <Box {...classes.envNameStyle}>
                {env.name}
                {env.isCurrent ? " (selected)" : ""}
              </Box>
              <Box {...classes.mutedStyle}>
                {minted[env.id]
                  ? "Key created just now — copy it below"
                  : env.hasKey
                    ? `Has a key, prefix ${env.prefix}`
                    : env.isCurrent
                      ? "No key yet"
                      : "Switch to it to see or create its key"}
              </Box>
            </Box>
            <Button
              size="sm"
              variant={env.hasKey ? "ghost" : "primary"}
              disabled={isCreatingKey}
              onClick={() => createKey(env.id)}
            >
              {env.hasKey ? "New key" : "Create key"}
            </Button>
          </Box>
        ))}

        {Object.entries(minted)
          .filter(([envId]) => envId !== environment?.id)
          .map(([envId, value]) => {
            const name =
              environmentStatuses.find((e) => e.id === envId)?.name ?? envId;
            return (
              <Box key={envId}>
                <Box {...classes.bodyStyle}>Key for {name}:</Box>
                <CodeBlock text={`VITE_OPERON_KEY=${value}`} />
              </Box>
            );
          })}

        <Box {...classes.bodyStyle}>Add more environments in Studio.</Box>
      </Step>
    </Box>
  );
};

function Step({
  number,
  title,
  body,
  children,
}: {
  number: number;
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <Box {...classes.stepStyle}>
      <Box {...classes.stepHeaderStyle}>
        <span {...classes.stepNumberStyle}>{number}</span>
        <span {...classes.stepTitleStyle}>{title}</span>
      </Box>
      <Box {...classes.bodyStyle}>{body}</Box>
      {children}
    </Box>
  );
}

function CodeBlock({ text }: { text: string }) {
  return (
    <Box>
      <Box {...classes.codeBlockStyle}>{text}</Box>
      <Box {...classes.rowStyle} style={{ marginTop: "8px" }}>
        <Button
          size="sm"
          variant="ghost"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(text);
              toast.success("Copied");
            } catch {
              // Clipboard access is denied outside a secure context and in
              // some embedded browsers. The text is on screen either way, so
              // say what happened rather than failing silently.
              toast.error("Could not copy. Select the text and copy it.");
            }
          }}
        >
          Copy
        </Button>
      </Box>
    </Box>
  );
}
