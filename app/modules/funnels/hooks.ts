export function useFunnels() {
  const steps = [
    { step: "Step 1: Workspace Created", count: 1240, percent: 100, color: "#6366f1" },
    { step: "Step 2: Environment Configured", count: 1016, percent: 82, color: "#3b82f6" },
    { step: "Step 3: Decision Rule Deployed", count: 793, percent: 64, color: "#10b981" },
    { step: "Step 4: API Invocation Triggered", count: 632, percent: 51, color: "#f59e0b" },
  ];

  return { steps };
}
