"use client";
import { useState } from "react";

const CodeEditor = () => {
  const [text, setText] = useState("");
  const [style, setStyle] = useState({} as any);

  const stringToJson = (str: string) => {
    try {
      const json = JSON.stringify(JSON.parse(str), null, 2);
      setStyle({});
      return json;
    } catch (e) {
      setStyle({ border: "red solid 1px" });
      return str;
    }
  };

  const areaStyle = {
    ...style,
    width: "50%",
    height: "100vh",
  };

  return (
    <>
      <div>
        <button onClick={() => setText(stringToJson(text))}>Load Sample</button>
      </div>
      <div>
        <textarea
          style={areaStyle}
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
      </div>
    </>
  );
};

export default CodeEditor;
