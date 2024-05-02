const formatJson = (text: string) => {
  const json = JSON.parse(text);
  return JSON.stringify(json, null, 2);
};

const lineLength = (str: string) => str.split(/\r\n|\r|\n/).length;

export const addLinePadding = (text: string, lines: number) => {
  while (lineLength(text) <= lines) {
    text = text + "\n";
  }
  return text;
};

export const formatJsonWithLinePadding = (text: string, lines: 50) => {
  let json = formatJson(text);
  return addLinePadding(json, 50);
};
