import React from "react";
import CodeEditor from "./presenters/components/CodeEditor";
import Footer from "./presenters/components/Footer";
import Grid from "@mui/material/Grid";

export default function Home() {
  return (
    <Grid container>
      <Grid item xs={12}>
        <CodeEditor />
      </Grid>

      <Grid item xs={12}>
        <Footer />
      </Grid>
    </Grid>
  );
}
