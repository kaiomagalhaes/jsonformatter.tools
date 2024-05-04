"use client";
import { Open_Sans, Roboto } from "next/font/google";
import { createTheme } from "@mui/material/styles";

const openSans = Open_Sans({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const theme = createTheme({
  typography: {
    fontFamily: `${openSans.style.fontFamily}, sans-serif`,
  },
});

export default theme;
