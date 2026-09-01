import { describe, expect, test } from "bun:test";
import { tokenize, type Kind } from "../../astro/components/command-tokens";

// The tokenizer that colours example commands on the experiment detail pages.
// It was unreachable from here until it was extracted from CommandCodeBlock's
// frontmatter — 54 commands from the experiment catalog run through it on every
// build, and a mis-tokenized command still renders, just mis-coloured, so
// nothing ever failed loudly.

// Compact view: drop whitespace, render as "text:kind" pairs.
const kinds = (command: string): string[] =>
  tokenize(command)
    .filter((t) => t.text.trim() !== "")
    .map((t) => `${t.text}:${t.kind}`);

const only = (command: string, kind: Kind): string[] =>
  tokenize(command).filter((t) => t.kind === kind).map((t) => t.text);

describe("tokenize: the eight kinds", () => {
  test("the first bare word is the program", () => {
    expect(kinds("ls")).toEqual(["ls:program"]);
  });

  test("an explicit path is a program wherever a program is expected", () => {
    expect(kinds("./run.sh")).toEqual(["./run.sh:program"]);
    expect(kinds("/usr/bin/env")).toEqual(["/usr/bin/env:program"]);
  });

  test("a leading dash is a flag", () => {
    expect(kinds("ls -la")).toEqual(["ls:program", "-la:flag"]);
  });

  test("quoted strings are values, single or double", () => {
    expect(only("echo 'a b'", "value")).toEqual(["'a b'"]);
    expect(only('echo "a b"', "value")).toEqual(['"a b"']);
  });

  test("$-prefixed words are variables", () => {
    expect(only("echo $HOME", "variable")).toEqual(["$HOME"]);
  });

  test("NAME= is an assignment", () => {
    expect(kinds("A=1 cmd")).toEqual(["A=1:assignment", "cmd:program"]);
  });

  test("shell operators are separators", () => {
    for (const op of ["&&", "||", "|", ";"]) {
      expect(only(`a ${op} b`, "separator")).toEqual([op]);
    }
  });

  test("# starts a comment that runs to end of line", () => {
    expect(only("cmd # note here", "comment")).toEqual(["# note here"]);
  });

  test("an unclaimed bare word is plain", () => {
    expect(kinds("cmd sub arg")).toEqual(["cmd:program", "sub:plain", "arg:plain"]);
  });
});

// Two flags are carried across tokens, so each case sets what the NEXT token
// may be. This is the part branch order encodes and nothing else recorded.
describe("tokenize: the state carried between tokens", () => {
  test("a flag makes the following bare word its value", () => {
    expect(kinds("cmd --out results.json")).toEqual([
      "cmd:program",
      "--out:flag",
      "results.json:value",
    ]);
  });

  test("a value is consumed once — the next bare word is plain again", () => {
    expect(kinds("cmd --out a b")).toEqual([
      "cmd:program",
      "--out:flag",
      "a:value",
      "b:plain",
    ]);
  });

  test("two flags in a row: the second is a flag, not a value", () => {
    expect(kinds("cmd --a --b")).toEqual(["cmd:program", "--a:flag", "--b:flag"]);
  });

  test("a separator means a program is expected again", () => {
    expect(kinds("a && b")).toEqual(["a:program", "&&:separator", "b:program"]);
  });

  test("an assignment also leaves a program expected (FOO=bar cmd)", () => {
    expect(kinds("A=1 B=2 cmd")).toEqual([
      "A=1:assignment",
      "B=2:assignment",
      "cmd:program",
    ]);
  });
});

describe("tokenize: structural guarantees", () => {
  test("tokens rejoin to exactly the input — whitespace is never lost", () => {
    for (const command of [
      "ls -la /tmp",
      "A=1 b --c d # note",
      'echo "x  y" | grep $HOME',
      "  leading and trailing  ",
    ]) {
      expect(tokenize(command).map((t) => t.text).join("")).toBe(command);
    }
  });

  test("an empty command yields a single token rather than throwing", () => {
    expect(() => tokenize("")).not.toThrow();
    expect(tokenize("")).toHaveLength(1);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Current behaviour, NOT endorsed. Both of these are defects the extraction
// made visible; they are pinned here so the fix is a deliberate, reviewable
// change rather than an accident.
describe("tokenize: known defects (documented, not endorsed)", () => {
  // FIRES ON THE LIVE SITE: 15 of the 54 catalog commands use <placeholder>
  // syntax, and 14 flags are currently coloured as program names because of it.
  test("DEFECT: <placeholder> is split as shell redirects, mis-colouring the next flag", () => {
    expect(kinds("cmd --id <id> --other")).toEqual([
      "cmd:program",
      "--id:flag",
      "<:separator",
      "id:program",
      ">:separator",
      "--other:program", // should be flag
    ]);
  });

  // Latent: no catalog command currently passes a path as a flag value.
  test("DEFECT: a path after a flag is a program, because the path branch wins", () => {
    expect(kinds("cmd --out /tmp/x")).toEqual([
      "cmd:program",
      "--out:flag",
      "/tmp/x:program", // should be value
    ]);
  });
});
