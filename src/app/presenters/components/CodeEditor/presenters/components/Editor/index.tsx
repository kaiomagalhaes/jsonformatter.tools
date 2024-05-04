"use client";
import { forwardRef, useEffect, useRef, useImperativeHandle } from "react";
import { EditorState, StateEffect, StateField } from "@codemirror/state";
import { EditorView, Decoration } from "@codemirror/view";
import { basicSetup } from "@codemirror/basic-setup";
import { json } from "@codemirror/lang-json";

const errorHighlightField = StateField.define({
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

const updateDecorations = StateEffect.define({
  map(value, mapping) {
    return value?.map(mapping);
  },
});

type Props = {
  content: string;
};

const Editor = forwardRef(({ content }: Props, ref) => {
  const editorDiv = useRef(null);
  const editorViewRef = useRef<EditorView | null>(null);

  useImperativeHandle(ref, () => ({
    getContent: () => editorViewRef?.current?.state.doc.toString(),
    updateContent: (newContent: string) => {
      const editorView = editorViewRef.current;
      editorView?.dispatch({
        changes: {
          from: 0,
          to: editorView.state.doc.length || 0,
          insert: newContent,
        },
        effects: updateDecorations.of(Decoration.none),
      });
    },
    onJSONParserError: (position) => {
      const editorView = editorViewRef.current;
      if (!position || !editorView) return;

      // Ensure the range is not empty
      const from = position.from;
      let to = position.to;

      // If 'from' and 'to' are the same, adjust 'to' to ensure the range is not empty
      if (from === to) {
        // Check if 'to' can be incremented without going out of bounds
        to = Math.min(editorView.state.doc.length, to + 1);
      }

      const decoration = Decoration.mark({
        className: "cm-error",
        attributes: { style: "background-color: red;" },
      }).range(from, to);

      editorView.dispatch({
        effects: updateDecorations.of(Decoration.set([decoration])),
      });
    },
  }));

  useEffect(() => {
    if (editorDiv.current) {
      const extensions = [basicSetup, json(), errorHighlightField];
      const state = EditorState.create({
        doc: content,
        extensions,
      });

      editorViewRef.current = new EditorView({
        state,
        parent: editorDiv.current,
      });

      return () => editorViewRef.current?.destroy();
    }
  }, [content]);

  return <div ref={editorDiv} />;
});

Editor.displayName = "Editor";
export default Editor;
