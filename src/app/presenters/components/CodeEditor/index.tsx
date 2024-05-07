"use client";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Editor from "./presenters/components/Editor";
import {
  addLinePadding,
  formatJson,
  getJSONParseErrorPosition,
  removeNullValues,
  sortJsonKeys,
} from "./utils/json";
import { Grid } from "@mui/material";

type Actions = {
  getContent: () => string;
  updateContent: (content: string) => void;
  onJSONParserError: (position: { from: number; to: number }) => void;
};

export const MINIMUM_LINES = 40;

type Props = {
  customDecorators: any[];
};

const CodeEditor = forwardRef(({ customDecorators }: Props, ref) => {
  const editorRef = useRef<Actions>(null);
  const defaultContent = addLinePadding("");
  const [content] = useState(defaultContent);
  const [decorations, setDecorations] = useState<any[]>([]);
  const addDecoration = (decoration: any) => {
    const newDecorations = [...decorations, decoration];
    const sortedDecorations = newDecorations.sort(
      (a, b) => a.from - b.from || a.to - b.to
    );

    setDecorations(sortedDecorations);
  };

  const removeDecorations = (decorationsToRemove: any[]) => {
    const newDecorations = decorations.filter(
      (decoration) =>
        !decorationsToRemove.some(
          (decorationToRemove) =>
            decorationToRemove.from === decoration.from &&
            decorationToRemove.to === decoration.to
        )
    );

    setDecorations(newDecorations);
  };

  useImperativeHandle(ref, () => ({
    getContent: () => editorRef?.current?.getContent() || defaultContent,
    toJson: formatToJson,
    sortKeys: sortKeys,
    removeNullValues: removeNull,
  }));

  useEffect(() => {
    setDecorations(customDecorators);
  }, [customDecorators]);

  const getJsonObject = (text: string) => {
    try {
      return JSON.parse(text);
    } catch (e: any) {
      const position = getJSONParseErrorPosition(e.message);
      editorRef?.current?.onJSONParserError(position);
      return null;
    }
  };

  const formatToJson = (format?: (json: Record<string, any>) => string) => {
    let content = editorRef?.current?.getContent() || defaultContent;
    const json = getJsonObject(content);
    if (!json) return;
    let parsedJson = formatJson(json);
    if (format) {
      parsedJson = format(json);
    }

    editorRef?.current?.updateContent(parsedJson);
  };

  const sortKeys = () => {
    formatToJson((json) => {
      const sortedJson = sortJsonKeys(json);
      return formatJson(sortedJson);
    });
  };

  const removeNull = () => {
    formatToJson((json) => {
      const cleanedJson = removeNullValues(json);
      return formatJson(cleanedJson);
    });
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Editor
          ref={editorRef}
          content={content}
          decorations={decorations}
          addDecoration={addDecoration}
          removeDecorations={removeDecorations}
        />
      </Grid>
    </Grid>
  );
});

CodeEditor.displayName = "CodeEditor";
export default CodeEditor;
