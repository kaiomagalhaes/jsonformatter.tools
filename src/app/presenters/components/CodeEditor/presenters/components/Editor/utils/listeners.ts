import { Decoration, EditorView } from "@codemirror/view";
import { updateDecorations } from "./highlights";
import { MINIMUM_LINES } from "../../../..";

export const cleanHighlightsListener = (removeDecorations: () => void) => {
  return EditorView.updateListener.of((update) => {
    if (update.docChanged) {
      update.view.dispatch({
        effects: updateDecorations.of(Decoration.none),
      });
      removeDecorations();
    }
  });
};

export const ensureLineCountListener = EditorView.updateListener.of(
  (update) => {
    if (update.docChanged) {
      const doc = update.state.doc;
      const lineCount = doc.lines;
      const requiredLines = MINIMUM_LINES;

      // Detect if the update is likely a paste (multiple changes or large single change)
      const isPaste = update.transactions.some(
        (tr) => tr.isUserEvent("input.paste") || tr.changes.inserted.length > 1
      );

      if (lineCount < requiredLines) {
        const changes = [];
        for (let i = 0; i < requiredLines - lineCount; i++) {
          changes.push({ from: doc.length, insert: "\n" });
        }
        update.view.dispatch({ changes });
      } else if (isPaste && lineCount > requiredLines) {
        // Check for excess empty lines at the end
        let emptyLinesAtEnd = 0;
        for (let i = lineCount; i > 0; i--) {
          const line = doc.line(i);
          if (line.text === "") {
            emptyLinesAtEnd++;
          } else {
            break;
          }
        }

        const excessLines = lineCount - requiredLines;
        if (emptyLinesAtEnd > excessLines) {
          // Calculate position to start removing empty lines
          const startRemove = doc.line(lineCount - excessLines).from;
          update.view.dispatch({
            changes: { from: startRemove, to: doc.length },
          });
        }
      }
    }
  }
);
