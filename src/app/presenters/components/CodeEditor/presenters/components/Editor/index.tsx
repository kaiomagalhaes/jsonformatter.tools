"use client";
import { forwardRef, useEffect, useRef, useImperativeHandle } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, Decoration } from "@codemirror/view";
import { basicSetup } from "@codemirror/basic-setup";
import { json } from "@codemirror/lang-json";
import {
  createDecoration,
  highlightExtension,
  updateDecorations,
} from "./utils/highlights";
import {
  cleanHighlightsListener,
  ensureLineCountListener,
} from "./utils/listeners";
import { Position } from "@/app/presenters/types/Position";

type Props = {
  content: string;
  decorations: any[];
  addDecoration: (decoration: any) => void;
  removeDecorations: (decorations: any) => void;
};

const Editor = forwardRef(
  ({ content, decorations, addDecoration, removeDecorations }: Props, ref) => {
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
        });
      },
      onJSONParserError: (position: Position) => {
        const editorView = editorViewRef.current;
        if (!position || !editorView) return;

        const decoration = createDecoration(
          editorView.state.doc.length,
          position,
          "json-error",
          "#ff000078"
        );
        addDecoration(decoration);
      },
    }));

    useEffect(() => {
      const editorView = editorViewRef.current;
      editorView?.dispatch({
        effects: updateDecorations.of(Decoration.set(decorations)),
      });
    }, [decorations]);

    useEffect(() => {
      if (editorDiv.current) {
        const extensions = [
          basicSetup,
          json(),
          highlightExtension,
          cleanHighlightsListener(() => removeDecorations(decorations)),
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
  }
);

Editor.displayName = "Editor";
export default Editor;
