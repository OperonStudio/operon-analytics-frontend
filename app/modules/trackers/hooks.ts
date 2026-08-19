import { toast } from "@operon/ui";
import { useEffect, useState } from "react";

const DEFAULT_TRACKERS = [
  {
    id: "tr-1",
    name: "Add Collection Click",
    selector: "button#add-new-collection",
    eventType: "click",
    triggersCount: 1420,
    status: "Active",
    lastFired: "2 mins ago",
    category: "User Action",
  },
  {
    id: "tr-2",
    name: "Rule Engine Execution",
    selector: ".rule-execution-node",
    eventType: "rule_eval",
    triggersCount: 8930,
    status: "Active",
    lastFired: "Just now",
    category: "System Core",
  },
  {
    id: "tr-3",
    name: "Team Invitation Sent",
    selector: "form#team-invite-form",
    eventType: "submit",
    triggersCount: 312,
    status: "Active",
    lastFired: "15 mins ago",
    category: "Workspace",
  },
  {
    id: "tr-4",
    name: "Environment Switched",
    selector: "select.env-switcher",
    eventType: "change",
    triggersCount: 654,
    status: "Active",
    lastFired: "1 hour ago",
    category: "Settings",
  },
];

export function useTrackers() {
  const [trackers, setTrackers] = useState(DEFAULT_TRACKERS);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [selector, setSelector] = useState("");
  const [eventType, setEventType] = useState("click");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("operon_analytics_configs");
      if (raw) {
        const parsed = JSON.parse(raw);
        const customItems = Object.keys(parsed).map((key, idx) => ({
          id: `custom-${idx}`,
          name: parsed[key].name || `Element Tracker (${key})`,
          selector: parsed[key].selector || `[data-operon-id="${key}"]`,
          eventType: "click",
          triggersCount: Math.floor(Math.random() * 200) + 50,
          status: "Active",
          lastFired: "Recently",
          category: "Visual Editor",
        }));
        if (customItems.length > 0) {
          setTrackers((prev) => [...customItems, ...prev]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleCreate = () => {
    if (!name.trim() || !selector.trim()) return;
    const item = {
      id: `tr-${Date.now()}`,
      name: name.trim(),
      selector: selector.trim(),
      eventType,
      triggersCount: 1,
      status: "Active",
      lastFired: "Just now",
      category: "Custom Tracker",
    };
    setTrackers([item, ...trackers]);
    toast.success(`Event Tracker "${item.name}" attached!`);
    setIsAddOpen(false);
    setName("");
    setSelector("");
  };

  return {
    trackers,
    isAddOpen,
    setIsAddOpen,
    name,
    setName,
    selector,
    setSelector,
    eventType,
    setEventType,
    handleCreate,
  };
}
