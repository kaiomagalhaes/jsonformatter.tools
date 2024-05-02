"use client";
import { useEffect, useRef } from "react";
import { EditorState, StateEffect, StateField } from "@codemirror/state";
import { EditorView, Decoration } from "@codemirror/view";
import { basicSetup } from "@codemirror/basic-setup";
import { json } from "@codemirror/lang-json";
import { format } from "path";
import { addLinePadding, formatJsonWithLinePadding } from "./utils/json";
import { add } from "date-fns";

// Define a state field to manage error decorations
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
    return value.map(mapping);
  },
});

const CodeEditor = () => {
  const editorDiv = useRef(null);
  const editorViewRef = useRef(null);

  useEffect(() => {
    if (editorDiv.current) {
      const extensions = [basicSetup, json(), errorHighlightField];
      const state = EditorState.create({
        doc: '{ "name": "John Doe" }',
        extensions,
      });

      editorViewRef.current = new EditorView({
        state,
        parent: editorDiv.current,
      });

      return () => editorViewRef.current.destroy();
    }
  }, []);

  const formatJson = (editorView) => {
    try {
      const currentContent = editorView.state.doc.toString();
      const json = formatJsonWithLinePadding(currentContent, 50);

      editorView.dispatch({
        changes: {
          from: 0,
          to: editorView.state.doc.length,
          insert: json,
        },
        effects: updateDecorations.of(Decoration.none),
      });
    } catch (error) {
      let currentContent = editorView.state.doc.toString();
      currentContent = addLinePadding(currentContent, 50);

      editorView.dispatch({
        changes: {
          from: 0,
          to: editorView.state.doc.length,
          insert: currentContent,
        },
        effects: updateDecorations.of(Decoration.none),
      });
      const position = getErrorPosition(error.message);
      showError(editorView, position);
    }
  };

  function getErrorPosition(errorMessage) {
    const match = /at position (\d+)/.exec(errorMessage);
    if (match) {
      return { from: parseInt(match[1], 10), to: parseInt(match[1], 10) + 1 };
    }
    return null;
  }

  function showError(editorView, position) {
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

  useEffect(() => {
    formatJson(editorViewRef.current);
  }, []);

  return (
    <div>
      <button onClick={() => formatJson(editorViewRef.current)}>
        Format JSON
      </button>
      <div ref={editorDiv} />
    </div>
  );
};

export default CodeEditor;
