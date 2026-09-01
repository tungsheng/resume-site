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

// Both of these were defects the extraction made visible: the tokenizer was
// unreachable from any test for as long as it existed, so nothing caught them.
describe("tokenize: placeholders are values, not shell redirects", () => {
  test("<placeholder> is one token, and the following flag stays a flag", () => {
    expect(kinds("cmd --id <id> --other")).toEqual([
      "cmd:program",
      "--id:flag",
      "<id>:value",
      "--other:flag",
    ]);
  });

  // The exact shape used across the experiment catalog. Before the fix this
  // split into `<` + `run-id` + `>`, and because `>` leaves a program expected,
  // --with-profiling rendered in program green. 14 flags were mis-coloured.
  test("the real catalog shape colours every flag correctly", () => {
    expect(kinds("./scripts/benchmark --run-id <run-id> --with-profiling")).toEqual([
      "./scripts/benchmark:program",
      "--run-id:flag",
      "<run-id>:value",
      "--with-profiling:flag",
    ]);
  });

  // The fix must not swallow genuine redirects: those have no closing bracket
  // hugging a word, so they fall through to the operator case.
  test("a real redirect is still a separator", () => {
    expect(only("cmd > out.txt", "separator")).toEqual([">"]);
    expect(only("cmd < in.txt", "separator")).toEqual(["<"]);
  });
});

describe("tokenize: a path in value position is a value", () => {
  test("a path after a flag is that flag's value, not a second program", () => {
    expect(kinds("cmd --out /tmp/x")).toEqual([
      "cmd:program",
      "--out:flag",
      "/tmp/x:value",
    ]);
    expect(kinds("cmd --file ./x.json")).toEqual([
      "cmd:program",
      "--file:flag",
      "./x.json:value",
    ]);
  });

  test("a path in program position is still a program", () => {
    expect(kinds("./run.sh")).toEqual(["./run.sh:program"]);
    expect(kinds("a && /usr/bin/env")).toEqual([
      "a:program",
      "&&:separator",
      "/usr/bin/env:program",
    ]);
  });
});
