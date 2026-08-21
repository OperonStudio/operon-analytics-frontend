import { Box, Button, Modal } from "@operonstudio/ui";

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = false,
}: ConfirmModalProps) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <Box display="flex" justify="flex-end" gap={12}>
          <Button variant="outline" onClick={onClose}>
            {cancelText}
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            style={
              isDestructive
                ? {
                    backgroundColor: "var(--operon-color-danger, #ef4444)",
                    borderColor: "transparent",
                  }
                : {}
            }
          >
            {confirmText}
          </Button>
        </Box>
      }
    >
      <Box display="flex" direction="column" gap={16}>
        <p
          style={{
            margin: 0,
            color: "var(--operon-color-text, #1a1a2e)",
            fontSize: "15px",
            lineHeight: 1.6,
          }}
        >
          {message}
        </p>
      </Box>
    </Modal>
  );
};
