"use client";
import { useRef, useState } from "react";
import Editor from "./presenters/components/Editor";
import {
  addLinePadding,
  formatJsonWithLinePadding,
  getJSONParseErrorPosition,
  removeNullValues,
  sortJsonKeys,
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

  const formatToJson = (format?: (json: string) => string) => {
    let content = editorRef?.current?.getContent() || defaultContent;
    try {
      let json = formatJsonWithLinePadding(content);
      if (format) {
        json = format(json);
      }

      editorRef?.current?.updateContent(json);
    } catch (e: any) {
      content = addLinePadding(content, 50);
      editorRef?.current?.updateContent(content);

      const position = getJSONParseErrorPosition(e.message);
      editorRef?.current?.onJSONParserError(position);
    }
  };

  const sortKeys = () => {
    formatToJson((json) => {
      const sortedJson = sortJsonKeys(JSON.parse(json));
      return formatJsonWithLinePadding(JSON.stringify(sortedJson, null, 2));
    });
  };

  const removeNull = () => {
    formatToJson((json) => {
      const cleanedJson = removeNullValues(JSON.parse(json));
      return formatJsonWithLinePadding(JSON.stringify(cleanedJson, null, 2));
    });
  };
  return (
    <>
      <button onClick={formatToJson}>Format JSON</button>
      <button onClick={sortKeys}>Sort keys</button>
      <button onClick={removeNull}>Remove null</button>
      <Editor ref={editorRef} content={content} />
    </>
  );
};

export default CodeEditor;
