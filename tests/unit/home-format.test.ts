import { describe, expect, test } from "bun:test";
import { formatDurationLabel } from "../../src/features/site/format";

describe("home experiment formatting", () => {
  test("formats cold-start timings into readable minute and second labels", () => {
    expect(formatDurationLabel(430)).toBe("7m 10s");
    expect(formatDurationLabel(84)).toBe("1m 24s");
  });
});
