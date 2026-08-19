import { toast } from "@operon/ui";

export function useVisualEditor() {
  const handleSaveConfig = (config: any) => {
    console.log("Saving Analytics configuration for:", config.operonId);
    console.log("Payload:", config);

    try {
      const existingRaw = localStorage.getItem("operon_analytics_configs");
      const existing = existingRaw ? JSON.parse(existingRaw) : {};
      existing[config.operonId] = config;
      localStorage.setItem("operon_analytics_configs", JSON.stringify(existing));
      toast.success("Configuration saved locally!");
    } catch (err) {
      console.error("Failed to save config", err);
      toast.error("Failed to save configuration.");
    }
  };

  return { handleSaveConfig };
}
