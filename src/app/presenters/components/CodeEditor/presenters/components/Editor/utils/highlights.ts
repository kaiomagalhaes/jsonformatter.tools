import { Position } from "@/app/presenters/types/Position";
import { StateEffect, StateField } from "@codemirror/state";
import { Decoration, DecorationSet, EditorView } from "@codemirror/view";

export const highlightExtension = StateField.define({
  create() {
    return Decoration.none;
  },
  update(decorations, transaction) {
    return transaction.effects.reduce(
      (acc, effect) => (effect.is(updateDecorations) ? effect.value : acc),
      decorations
    );
  },
  provide: (field) => EditorView.decorations.from(field),
});

export const updateDecorations = StateEffect.define<DecorationSet>({
  map(value, mapping) {
    return value.map(mapping);
  },
});

export const createDecoration = (
  contentSize: number,
  position: Position,
  className: string,
  backgroundColor: string
) => {
  const { from, to } = position;
  let processedTo = to;
  if (from === to) {
    processedTo = Math.min(contentSize, to + 1);
  }

  return Decoration.mark({
    className: className,
    attributes: { style: `background-color: ${backgroundColor};` },
  }).range(from, processedTo);
};
