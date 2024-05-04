import { Decoration, EditorView } from "@codemirror/view";
import { updateDecorations } from "./highlights";

export const cleanHighlightsListener = EditorView.updateListener.of(
  (update) => {
    if (update.docChanged) {
      update.view.dispatch({
        effects: updateDecorations.of(Decoration.none),
      });
    }
  }
);
