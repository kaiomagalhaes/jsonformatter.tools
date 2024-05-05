"use client";
import React, { useRef, useState } from "react";
import CodeEditor from "./presenters/components/CodeEditor";
import Footer from "./presenters/components/Footer";
import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";
import DiffMatchPatch from "diff-match-patch";
import { createDecoration } from "./presenters/components/CodeEditor/presenters/components/Editor/utils/highlights";

type Actions = {
  getContent: () => string;
  toJson: () => void;
  removeNullValues: () => void;
  sortKeys: () => void;
};

export default function Home() {
  const leftEditorRef = useRef<Actions>(null);
  const rightEditorRef = useRef<Actions>(null);

  const [isComparisonViewOpen, setIsComparisonViewOpen] = useState(false);
  const [leftDecorations, setLeftDecorations] = useState<any[]>([]);
  const [rightDecorations, setRightDecorations] = useState<any[]>([]);

  const compare = () => {
    const dmp = new DiffMatchPatch();
    const leftText = leftEditorRef.current?.getContent() || "";
    const rightText = rightEditorRef.current?.getContent() || "";

    // Compute the differences.
    const diffs = dmp.diff_main(leftText, rightText);
    dmp.diff_cleanupSemantic(diffs); // Optional: improve readability by eliminating noise

    const leftDiffPositions = [];
    const rightDiffPositions = [];
    let leftIndex = 0;
    let rightIndex = 0;

    diffs.forEach((part) => {
      const [type, text] = part;
      switch (type) {
        case 0: // No changes
          leftIndex += text.length;
          rightIndex += text.length;
          break;
        case -1: // Deletion (relative to left text)
          leftDiffPositions.push({
            from: leftIndex,
            to: leftIndex + text.length,
          });
          leftIndex += text.length;
          break;
        case 1: // Insertion (relative to right text)
          rightDiffPositions.push({
            from: rightIndex,
            to: rightIndex + text.length,
          });
          rightIndex += text.length;
          break;
      }
    });

    const leftMarks = leftDiffPositions.map((position) =>
      createDecoration(leftText.length, position, "diff-mark", "#c9f6c9")
    );

    setLeftDecorations(leftMarks);
    const rightMarks = rightDiffPositions.map((position) =>
      createDecoration(rightText.length, position, "diff-mark", "#c9f6c9")
    );
    setRightDecorations(rightMarks);
  };

  return (
    <>
      <Grid container spacing={1} pb={2}>
        <Grid item>
          <Button
            onClick={() => {
              console.log("alala");
              leftEditorRef.current?.toJson();
              rightEditorRef.current?.toJson();
            }}
            variant="contained"
            color="primary"
          >
            Format
          </Button>
        </Grid>
        <Grid item>
          <Button
            onClick={() => {
              leftEditorRef.current?.sortKeys();
              rightEditorRef.current?.sortKeys();
            }}
            variant="contained"
            color="primary"
          >
            Sort keys
          </Button>
        </Grid>
        <Grid item>
          <Button
            onClick={() => {
              leftEditorRef.current?.removeNullValues();
              rightEditorRef.current?.removeNullValues();
            }}
            variant="contained"
            color="primary"
          >
            Remove null values
          </Button>
        </Grid>
        {!isComparisonViewOpen && (
          <Grid item>
            <Button
              onClick={() => setIsComparisonViewOpen(true)}
              variant="contained"
              color="primary"
            >
              Open comparison view
            </Button>
          </Grid>
        )}
        {isComparisonViewOpen && (
          <Grid item>
            <Button
              onClick={() => compare()}
              variant="contained"
              color="primary"
            >
              Compare
            </Button>
          </Grid>
        )}
      </Grid>
      <Grid container>
        <Grid item xs={isComparisonViewOpen ? 6 : 12}>
          <CodeEditor ref={leftEditorRef} customDecorators={leftDecorations} />
        </Grid>
        {isComparisonViewOpen && (
          <Grid item xs={6}>
            <CodeEditor
              ref={rightEditorRef}
              customDecorators={rightDecorations}
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <Footer />
        </Grid>
      </Grid>
    </>
  );
}
