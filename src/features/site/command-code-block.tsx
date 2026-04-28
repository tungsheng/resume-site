import React from "react";
import { Box } from "@mui/material";
import { alpha, type SxProps, type Theme } from "@mui/material/styles";
import { monoStack } from "../../theme";

type CommandTokenKind = "program" | "flag" | "value" | "separator" | "plain";

interface CommandToken {
  kind: CommandTokenKind;
  text: string;
}

interface CommandCodeBlockProps {
  command: string;
  ariaLabel?: string;
  sx?: SxProps<Theme>;
}

function tokenizeCommand(command: string): CommandToken[] {
  const parts = command.match(/\s+|[^\s|]+|\|/g) ?? [command];
  let expectingValue = false;

  return parts.map((part) => {
    if (/^\s+$/.test(part)) {
      return { kind: "plain", text: part };
    }

    if (part === "|") {
      expectingValue = true;
      return { kind: "separator", text: part };
    }

    if (part.startsWith("./") || part.startsWith("/")) {
      expectingValue = false;
      return { kind: "program", text: part };
    }

    if (part.startsWith("-")) {
      expectingValue = true;
      return { kind: "flag", text: part };
    }

    if (expectingValue) {
      expectingValue = false;
      return { kind: "value", text: part };
    }

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
        (theme) => ({
          m: 0,
          minWidth: 0,
          maxWidth: "100%",
          overflowX: "hidden",
          px: 1.5,
          py: 1.25,
          borderRadius: 1.5,
          backgroundColor: alpha(theme.palette.text.primary, 0.045),
          border: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
          boxShadow: `inset 0 1px 0 ${alpha(theme.palette.common.white, 0.62)}`,
          color: theme.palette.text.primary,
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
            color: theme.palette.secondary.main,
            fontWeight: 700,
          },
          "& .command-token--flag": {
            color: "#0f6674",
            fontWeight: 700,
          },
          "& .command-token--value": {
            color: theme.palette.warning.dark,
            fontWeight: 600,
          },
          "& .command-token--separator": {
            color: alpha(theme.palette.text.primary, 0.52),
            fontWeight: 700,
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
