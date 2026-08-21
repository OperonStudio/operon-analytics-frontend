import { WebsiteEditor } from "@operonstudio/ui";
import { useVisualEditor } from "./hooks";
import * as classes from "./styles";

export const VisualEditorModule = () => {
  const { handleSaveConfig } = useVisualEditor();

  return (
    <div {...classes.editorContainerStyle}>
      <WebsiteEditor
        initialUrl="http://localhost:8085/test.html"
        onSaveConfig={handleSaveConfig}
      />
    </div>
  );
};
