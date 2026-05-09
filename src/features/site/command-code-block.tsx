import React from "react";
import { Box } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import { monoStack } from "../../theme";

type CommandTokenKind =
  | "program"
  | "flag"
  | "value"
  | "separator"
  | "variable"
  | "assignment"
  | "comment"
  | "plain";

interface CommandToken {
  kind: CommandTokenKind;
  text: string;
}

interface CommandCodeBlockProps {
  command: string;
  ariaLabel?: string;
  sx?: SxProps<Theme>;
}

const githubDarkShell = {
  bg: "#0d1117",
  border: "#30363d",
  text: "#e6edf3",
  comment: "#8b949e",
  keyword: "#ff7b72",
  variable: "#ffa657",
  command: "#7ee787",
  constant: "#79c0ff",
  string: "#a5d6ff",
  shadow: "rgba(255, 255, 255, 0.06)",
};

function tokenizeCommand(command: string): CommandToken[] {
  const parts =
    command.match(/\s+|&&|\|\||[|;<>]=?|#[^\n]*|"[^"]*"|'[^']*'|[^\s|;&<>]+/g) ??
    [command];
  let expectingValue = false;
  let expectingProgram = true;

  return parts.map((part) => {
    if (/^\s+$/.test(part)) {
      return { kind: "plain", text: part };
    }

    if (part.startsWith("#")) {
      expectingProgram = false;
      expectingValue = false;
      return { kind: "comment", text: part };
    }

    if (/^(?:&&|\|\||[|;<>]=?)$/.test(part)) {
      expectingProgram = true;
      expectingValue = false;
      return { kind: "separator", text: part };
    }

    if (/^[A-Za-z_][A-Za-z0-9_]*=/.test(part)) {
      expectingProgram = true;
      expectingValue = false;
      return { kind: "assignment", text: part };
    }

    if (part.startsWith("$")) {
      expectingProgram = false;
      expectingValue = false;
      return { kind: "variable", text: part };
    }

    if (/^(['"]).*\1$/.test(part)) {
      expectingProgram = false;
      expectingValue = false;
      return { kind: "value", text: part };
    }

    if (part.startsWith("./") || part.startsWith("/") || expectingProgram) {
      expectingProgram = false;
      expectingValue = false;
      return { kind: "program", text: part };
    }

    if (part.startsWith("-")) {
      expectingProgram = false;
      expectingValue = true;
      return { kind: "flag", text: part };
    }

    if (expectingValue) {
      expectingProgram = false;
      expectingValue = false;
      return { kind: "value", text: part };
    }

    expectingProgram = false;
    return { kind: "plain", text: part };
  });
}

export function CommandCodeBlock({
  command,
  ariaLabel = "Command",
  sx,
}: CommandCodeBlockProps) {
  const tokens = tokenizeCommand(command);

  return (
    <Box
      component="pre"
      aria-label={ariaLabel}
      sx={[
        () => ({
          m: 0,
          minWidth: 0,
          maxWidth: "100%",
          overflowX: "hidden",
          px: 1.5,
          py: 1.25,
          borderRadius: 1.5,
          backgroundColor: githubDarkShell.bg,
          border: `1px solid ${githubDarkShell.border}`,
          boxShadow: `inset 0 1px 0 ${githubDarkShell.shadow}`,
          color: githubDarkShell.text,
          fontFamily: monoStack,
          fontSize: { xs: "0.82rem", sm: "0.86rem" },
          lineHeight: 1.55,
          overflowWrap: "anywhere",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          "& code": {
            fontFamily: "inherit",
            fontSize: "inherit",
            lineHeight: "inherit",
          },
          "& .command-token--program": {
            color: githubDarkShell.command,
            fontWeight: 600,
          },
          "& .command-token--flag": {
            color: githubDarkShell.constant,
            fontWeight: 600,
          },
          "& .command-token--value": {
            color: githubDarkShell.string,
            fontWeight: 500,
          },
          "& .command-token--variable, & .command-token--assignment": {
            color: githubDarkShell.variable,
            fontWeight: 500,
          },
          "& .command-token--separator": {
            color: githubDarkShell.keyword,
            fontWeight: 600,
          },
          "& .command-token--comment": {
            color: githubDarkShell.comment,
            fontStyle: "italic",
          },
        }),
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      <code>
        {tokens.map((token, index) => (
          <Box
            key={`${token.text}-${index}`}
            component="span"
            className={`command-token--${token.kind}`}
          >
            {token.text}
          </Box>
        ))}
      </code>
    </Box>
  );
}
