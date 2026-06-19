import React from "react";

export const renderFormattedText = (text: string) => {
  if (!text) return null;

  return text.split("\n").map((line, index) => {
    const cleanLine = line.trim();
    if (!cleanLine) return <div key={index} style={{ height: "0.75rem" }} />;

    // Bold parsing: replace **text** with strong elements
    const boldRegex = /\*\*(.*?)\*\*/g;
    const parts: (string | React.ReactNode)[] = [];
    let lastIndex = 0;
    let match;

    while ((match = boldRegex.exec(cleanLine)) !== null) {
      if (match.index > lastIndex) {
        parts.push(cleanLine.substring(lastIndex, match.index));
      }
      parts.push(
        <strong key={match.index} style={{ color: "white", fontWeight: 700 }}>
          {match[1]}
        </strong>
      );
      lastIndex = boldRegex.lastIndex;
    }

    if (lastIndex < cleanLine.length) {
      parts.push(cleanLine.substring(lastIndex));
    }

    const contentNode = parts.length > 0 ? parts : cleanLine;

    // List items check
    if (cleanLine.startsWith("-") || cleanLine.startsWith("*")) {
      const bulletText = cleanLine.substring(1).trim();

      // Bold parsing inside list item
      const listParts: (string | React.ReactNode)[] = [];
      let listLastIndex = 0;
      let listMatch;
      boldRegex.lastIndex = 0; // reset regex state
      while ((listMatch = boldRegex.exec(bulletText)) !== null) {
        if (listMatch.index > listLastIndex) {
          listParts.push(bulletText.substring(listLastIndex, listMatch.index));
        }
        listParts.push(
          <strong key={listMatch.index} style={{ color: "white", fontWeight: 700 }}>
            {listMatch[1]}
          </strong>
        );
        listLastIndex = boldRegex.lastIndex;
      }
      if (listLastIndex < bulletText.length) {
        listParts.push(bulletText.substring(listLastIndex));
      }

      return (
        <li key={index} style={{ marginLeft: "1.25rem", marginBottom: "0.4rem", color: "hsl(var(--text-secondary))", listStyleType: "disc", lineHeight: "1.6" }}>
          {listParts.length > 0 ? listParts : bulletText}
        </li>
      );
    }

    // Headers check
    if (cleanLine.startsWith("###")) {
      return (
        <h4 key={index} style={{ fontSize: "1.1rem", marginTop: "1rem", marginBottom: "0.4rem", color: "hsl(var(--accent-purple))", fontWeight: 700 }}>
          {cleanLine.replace(/^###\s*/, "")}
        </h4>
      );
    }
    if (cleanLine.startsWith("##")) {
      return (
        <h3 key={index} style={{ fontSize: "1.25rem", marginTop: "1.25rem", marginBottom: "0.6rem", color: "hsl(var(--accent-purple))", fontWeight: 700 }}>
          {cleanLine.replace(/^##\s*/, "")}
        </h3>
      );
    }
    if (cleanLine.startsWith("#")) {
      return (
        <h2 key={index} style={{ fontSize: "1.4rem", marginTop: "1.5rem", marginBottom: "0.8rem", color: "hsl(var(--accent-purple))", fontWeight: 800 }}>
          {cleanLine.replace(/^#\s*/, "")}
        </h2>
      );
    }

    return (
      <p key={index} style={{ marginBottom: "0.75rem", color: "hsl(var(--text-secondary))", lineHeight: "1.6" }}>
        {contentNode}
      </p>
    );
  });
};
