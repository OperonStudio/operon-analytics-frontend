import { Box, Button, Input, Modal } from "@operonstudio/ui";
import { useEffect, useState } from "react";

export interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (value: string) => void;
  title: string;
  message?: string;
  placeholder?: string;
  submitText?: string;
  cancelText?: string;
}

export const PromptModal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  message,
  placeholder = "Enter value...",
  submitText = "Submit",
  cancelText = "Cancel",
}: PromptModalProps) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (isOpen) {
      setValue("");
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!value.trim()) return;
    onSubmit(value);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <Box display="flex" justify="flex-end" gap={12}>
          <Button variant="outline" onClick={onClose}>
            {cancelText}
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {submitText}
          </Button>
        </Box>
      }
    >
      <Box display="flex" direction="column" gap={16}>
        {message && (
          <p
            style={{
              margin: 0,
              color: "var(--operon-color-text)",
              fontSize: "14px",
            }}
          >
            {message}
          </p>
        )}
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
          autoFocus
        />
      </Box>
    </Modal>
  );
};
