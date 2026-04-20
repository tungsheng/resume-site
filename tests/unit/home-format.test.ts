import { describe, expect, test } from "bun:test";
import { experimentsContent } from "../../src/features/site/content";
import {
  buildExperimentComparisonRows,
  formatDurationLabel,
} from "../../src/features/site/format";

describe("home experiment formatting", () => {
  test("builds comparison rows with secondary TTFT labeling", () => {
    const rows = buildExperimentComparisonRows(experimentsContent.profiles);

    expect(rows.map((row) => row.label)).toEqual([
      "Baseline GPU state",
      "First ready replica",
      "First public response",
      "Second ready replica",
      "Idle cost / hour",
      "Burst cost / run",
      "Burst TTFT (secondary metric)",
    ]);

    const ttftRow = rows[6];
    expect(ttftRow).toBeDefined();
    if (!ttftRow) {
      throw new Error("Expected a TTFT comparison row");
    }
    expect(ttftRow.zeroIdle).toBe("107 ms");
    expect(ttftRow.warmOne).toBe("91 ms");
  });

  test("formats cold-start timings into readable minute and second labels", () => {
    expect(formatDurationLabel(430)).toBe("7m 10s");
    expect(formatDurationLabel(84)).toBe("1m 24s");
  });
});
