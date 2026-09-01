// Shell-command tokenizer for CommandCodeBlock.astro — a light lexer that
// colours the example commands on the experiment detail pages.
//
// This lived in CommandCodeBlock.astro's frontmatter, where the unit suite
// could not import it: ~50 lines with eight token kinds and two pieces of
// state carried across tokens, driving the colour of 54 commands from the
// experiment catalog on every build. A mis-tokenized command still renders,
// just mis-coloured, so nothing failed loudly. The component's own comment
// noted the lexer had been "ported verbatim" from a deleted React module —
// carried across a framework rewrite untested.
//
// Extracted per CONTEXT.md: derivation logic belongs in a module, never in
// .astro frontmatter where no test can reach it. Sits beside its component
// like status.ts. The logic is unchanged from the version in the component.

export type Kind =
  | "program"
  | "flag"
  | "value"
  | "separator"
  | "variable"
  | "assignment"
  | "comment"
  | "plain";

export type Token = { kind: Kind; text: string };

// Split into whitespace runs, placeholders, operators, comments, quoted
// strings, and bare words — keeping whitespace as tokens so the rendered line
// preserves spacing.
//
// PLACEHOLDER must precede the operator alternative: alternation is ordered, so
// without it `<run-id>` is torn into `<` + `run-id` + `>` as though the angle
// brackets were shell redirects. A real redirect (`cmd > out.txt`) has no
// closing bracket hugging a word, so it still falls through to the operator
// case and stays a separator.
const PLACEHOLDER = String.raw`<[A-Za-z0-9][A-Za-z0-9._-]*>`;
const PARTS = new RegExp(
  String.raw`\s+|${PLACEHOLDER}|&&|\|\||[|;<>]=?|#[^\n]*|"[^"]*"|'[^']*'|[^\s|;&<>]+`,
  "g",
);

const IS_PLACEHOLDER = new RegExp(String.raw`^${PLACEHOLDER}$`);

const SEPARATOR = /^(?:&&|\|\||[|;<>]=?)$/;
const ASSIGNMENT = /^[A-Za-z_][A-Za-z0-9_]*=/;
const QUOTED = /^(['"]).*\1$/;
const WHITESPACE = /^\s+$/;

// Branch order is load-bearing and each case sets the state the NEXT token
// reads: a separator or an assignment means a program name comes next, and a
// flag means the following bare word is its value. Reordering these cases
// changes the output, so the order is pinned by tests.
export function tokenize(command: string): Token[] {
  const parts = command.match(PARTS) ?? [command];
  let expectingValue = false;
  let expectingProgram = true;

  return parts.map((part): Token => {
    if (WHITESPACE.test(part)) return { kind: "plain", text: part };

    if (part.startsWith("#")) {
      expectingProgram = false;
      expectingValue = false;
      return { kind: "comment", text: part };
    }
    if (SEPARATOR.test(part)) {
      expectingProgram = true;
      expectingValue = false;
      return { kind: "separator", text: part };
    }
    if (ASSIGNMENT.test(part)) {
      // `FOO=bar cmd` — an env assignment still leaves a program expected.
      expectingProgram = true;
      expectingValue = false;
      return { kind: "assignment", text: part };
    }
    if (part.startsWith("$")) {
      expectingProgram = false;
      expectingValue = false;
      return { kind: "variable", text: part };
    }
    // `<run-id>` stands in for a value the reader supplies, so it reads as one.
    if (IS_PLACEHOLDER.test(part) || QUOTED.test(part)) {
      expectingProgram = false;
      expectingValue = false;
      return { kind: "value", text: part };
    }
    if (part.startsWith("-")) {
      expectingProgram = false;
      expectingValue = true;
      return { kind: "flag", text: part };
    }
    // Checked BEFORE the path case: in `--out /tmp/x` the path is the flag's
    // value, not a second program. Only a token in program position is a
    // program.
    if (expectingValue) {
      expectingProgram = false;
      expectingValue = false;
      return { kind: "value", text: part };
    }
    if (part.startsWith("./") || part.startsWith("/") || expectingProgram) {
      expectingProgram = false;
      expectingValue = false;
      return { kind: "program", text: part };
    }

    expectingProgram = false;
    return { kind: "plain", text: part };
  });
}
