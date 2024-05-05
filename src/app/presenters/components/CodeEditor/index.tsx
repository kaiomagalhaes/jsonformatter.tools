"use client";
import { useRef, useState } from "react";
import Editor from "./presenters/components/Editor";
import {
  addLinePadding,
  formatJson,
  getJSONParseErrorPosition,
  removeNullValues,
  sortJsonKeys,
} from "./utils/json";
import { Button, Grid } from "@mui/material";

type Actions = {
  getContent: () => string;
  updateContent: (content: string) => void;
  onJSONParserError: (position: { from: number; to: number }) => void;
};

export const MINIMUM_LINES = 40;

const CodeEditor = () => {
  const defaultContent = addLinePadding("");
  const [content] = useState(defaultContent);
  const [decorations, setDecorations] = useState<any[]>([]);
  const addDecoration = (decoration: any) => {
    setDecorations([...decorations, decoration]);
  };

  const removeDecoration = (decoration: any) => {
    setDecorations(decorations.filter((d) => d !== decoration));
  };

  const editorRef = useRef<Actions>(null);

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
    <>
      <Grid container spacing={1} pb={2}>
        <Grid item>
          <Button
            onClick={() => formatToJson()}
            variant="contained"
            color="primary"
          >
            Format
          </Button>
        </Grid>
        <Grid item>
          <Button onClick={sortKeys} variant="contained" color="primary">
            Sort keys
          </Button>
        </Grid>
        <Grid item>
          <Button onClick={removeNull} variant="contained" color="primary">
            Remove null values
          </Button>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <Editor
            ref={editorRef}
            content={content}
            decorations={decorations}
            removeDecoration={removeDecoration}
            addDecoration={addDecoration}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default CodeEditor;
