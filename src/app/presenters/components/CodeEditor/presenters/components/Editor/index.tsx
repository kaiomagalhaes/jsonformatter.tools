"use client";
import { forwardRef, useEffect, useRef, useImperativeHandle } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, Decoration } from "@codemirror/view";
import { basicSetup } from "@codemirror/basic-setup";
import { json } from "@codemirror/lang-json";
import { highlightExtension, updateDecorations } from "./utils/highlights";
import {
  cleanHighlightsListener,
  ensureLineCountListener,
} from "./utils/listeners";

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
          to: editorView.state.doc.length,
          insert: newContent,
        },
        effects: updateDecorations.of(Decoration.none),
      });
    },
    onJSONParserError: (position: { from: number; to: number }) => {
      const editorView = editorViewRef.current;
      if (!position || !editorView) return;

      const from = position.from;
      let to = position.to;

      if (from === to) {
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
      const extensions = [
        basicSetup,
        json(),
        highlightExtension,
        cleanHighlightsListener,
        ensureLineCountListener,
      ];
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
