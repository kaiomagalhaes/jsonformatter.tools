"use client";
import { useRef, useState } from "react";
import Editor from "./presenters/components/Editor";
import {
  addLinePadding,
  formatJsonWithLinePadding,
  getJSONParseErrorPosition,
} from "./utils/json";

type Actions = {
  getContent: () => string;
  updateContent: (content: string) => void;
  onJSONParserError: (position: { from: number; to: number }) => void;
};

const CodeEditor = () => {
  const defaultContent = addLinePadding("", 50);
  const [content, setContent] = useState(defaultContent);

  const editorRef = useRef<Actions>(null);
  const formatToJson = () => {
    let content = editorRef?.current?.getContent() || defaultContent;
    try {
      const json = formatJsonWithLinePadding(content);
      editorRef?.current?.updateContent(json);
    } catch (e: any) {
      content = addLinePadding(content, 50);
      editorRef?.current?.updateContent(content);

      const position = getJSONParseErrorPosition(e.message);
      editorRef?.current?.onJSONParserError(position);
    }
  };

  return (
    <>
      <button onClick={formatToJson}>Format JSON</button>
      <Editor ref={editorRef} content={content} />
    </>
  );
};

export default CodeEditor;
