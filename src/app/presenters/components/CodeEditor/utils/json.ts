const formatJson = (text: string | object) => {
  if (typeof text === "object") {
    return JSON.stringify(text, null, 2);
  }

  const json = JSON.parse(text);
  return JSON.stringify(json, null, 2);
};

const lineLength = (str: string) => str.split(/\r\n|\r|\n/).length;

export const addLinePadding = (text: string, lines = 40) => {
  while (lineLength(text) < lines) {
    text = text + "\n";
  }
  return text;
};

export const formatJsonWithLinePadding = (json: Record<string, any>) => {
  let text = formatJson(json);
  return addLinePadding(text);
};

export const getJSONParseErrorPosition = (message: string) => {
  const match = /at position (\d+)/.exec(message);
  if (match) {
    return { from: parseInt(match[1], 10), to: parseInt(match[1], 10) + 1 };
  }
  return {
    from: 0,
    to: 0,
  };
};

export const sortJsonKeys = (
  json: Record<string, any>
): Record<string, any> => {
  return Object.keys(json)
    .sort()
    .reduce((acc: Record<string, any>, key: string) => {
      const value = json[key];
      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        acc[key] = sortJsonKeys(value);
      } else {
        acc[key] = value;
      }
      return acc;
    }, {});
};

export const removeNullValues = (
  json: Record<string, any>
): Record<string, any> => {
  return Object.keys(json).reduce((acc: Record<string, any>, key: string) => {
    const value = json[key];
    if (value === null) {
      return acc;
    } else if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value)
    ) {
      acc[key] = removeNullValues(value);
    } else {
      acc[key] = value;
    }
    return acc;
  }, {});
};
