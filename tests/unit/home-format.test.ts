import { describe, expect, test } from "bun:test";
import {
  formatBurstTtftLabel,
  formatDurationLabel,
} from "../../src/features/site/format";

describe("home experiment formatting", () => {
  test("formats burst TTFT into readable millisecond labels", () => {
    expect(formatBurstTtftLabel(0.1324375)).toBe("132 ms");
    expect(formatBurstTtftLabel(0.0902666)).toBe("90 ms");
  });

  test("formats cold-start timings into readable minute and second labels", () => {
    expect(formatDurationLabel(430)).toBe("7m 10s");
    expect(formatDurationLabel(84)).toBe("1m 24s");
  });
});
