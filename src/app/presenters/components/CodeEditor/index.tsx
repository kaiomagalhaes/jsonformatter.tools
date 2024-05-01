"use client";
import { useEffect, useRef } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { basicSetup } from "@codemirror/basic-setup";
import { json } from "@codemirror/lang-json";

function formatJson(editorView) {
  try {
    // Parse the current content of the editor
    const currentContent = editorView.state.doc.toString();
    const json = JSON.parse(currentContent);
    // Format the JSON with 2 spaces of indentation
    const formattedJson = JSON.stringify(json, null, 2);
    // Create a transaction that replaces the entire document with the formatted JSON
    editorView.dispatch({
      changes: {
        from: 0,
        to: editorView.state.doc.length,
        insert: formattedJson,
      },
    });
  } catch (error) {
    console.error("Failed to format JSON:", error);
    // Optionally, handle errors, e.g., show an error message to the user
  }
}

const CodeEditor = () => {
  const editorDiv = useRef(null);
  const editorViewRef = useRef(null);

  useEffect(() => {
    if (editorDiv.current) {
      const state = EditorState.create({
        doc: '{ "name": "John Doe" }',
        extensions: [basicSetup, json()],
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
      const json = JSON.parse(currentContent);
      const formattedJson = JSON.stringify(json, null, 2);
      editorView.dispatch({
        changes: {
          from: 0,
          to: editorView.state.doc.length,
          insert: formattedJson,
        },
      });
    } catch (error) {
      console.error("Failed to format JSON:", error);
    }
  };

  return (
    <div>
      <div ref={editorDiv} style={{ height: "500px" }} />
      <button onClick={() => formatJson(editorViewRef.current)}>
        Format JSON
      </button>
    </div>
  );
};

export default CodeEditor;
