"use client";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
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

// Define an effect to update the error decorations
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

  const updateContent = (content: string) => {
    const editorView = editorViewRef.current;
    editorView?.dispatch({
      changes: {
        from: 0,
        to: editorView.state.doc.length,
        insert: content,
      },
      effects: updateDecorations.of(Decoration.none),
    });
  };

  useImperativeHandle(ref, () => ({
    getContent: () => {
      return editorViewRef?.current?.state.doc.toString();
    },
    updateContent: updateContent,
    onJSONParserError: showError,
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

      return () => editorViewRef?.current?.destroy();
    }
  }, []);

  function showError(position) {
    const editorView = editorViewRef.current;

    if (!position) return;

    // Directly create a decoration to see if it is applied
    const decoration = Decoration.mark({
      className: "cm-error",
      attributes: { style: "background-color: red;" },
    }).range(position.from, position.to);

    editorView.dispatch({
      effects: updateDecorations.of(Decoration.set([decoration])),
    });
  }

  return <div ref={editorDiv} />;
});

Editor.displayName = "Editor";
export default Editor;
