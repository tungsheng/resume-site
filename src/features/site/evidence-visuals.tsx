import React from "react";
import { Box, Chip, Typography } from "@mui/material";
import { alpha, type SxProps, type Theme } from "@mui/material/styles";
import { composeSx, softPanelBaseSx } from "./styles";

export type EvidenceTone = "success" | "info" | "warning" | "error" | "neutral";

export type DecisionReadoutItem = {
  label: string;
  statusLabel: string;
  value: string;
  detail?: string;
  tone?: EvidenceTone;
};

export type CompactBarRow = {
  label: string;
  value: number;
  valueLabel: string;
  max: number;
  tone?: EvidenceTone;
};

export type EvidenceMatrixColumn = {
  key: string;
  label: string;
  max: number;
  tone?: EvidenceTone;
};

export type EvidenceMatrixRow = {
  label: string;
  context?: string;
  values: Record<
    string,
    {
      value: number;
      label: string;
      tone?: EvidenceTone;
    }
  >;
};

export type TwoMetricEvidenceMatrixProps = {
  title: string;
  takeaway: string;
  sourceLabel?: string;
  columns: EvidenceMatrixColumn[];
  rows: EvidenceMatrixRow[];
};

function toneColor(theme: Theme, tone: EvidenceTone = "neutral") {
  if (tone === "success") return theme.palette.success.main;
  if (tone === "info") return theme.palette.info.main;
  if (tone === "warning") return theme.palette.warning.main;
  if (tone === "error") return theme.palette.error.main;
  return alpha(theme.palette.text.primary, 0.58);
}

function barWidth(value: number, max: number) {
  if (max <= 0 || value <= 0) return "0%";
  return `${Math.min(100, Math.max(4, (value / max) * 100))}%`;
}

const readoutGridSx: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    md: "repeat(2, minmax(0, 1fr))",
    xl: "repeat(4, minmax(0, 1fr))",
  },
  gap: { xs: 1, md: 1.1 },
};

const readoutItemSx: SxProps<Theme> = composeSx(softPanelBaseSx, {
  display: "grid",
  gap: 0.7,
  alignContent: "start",
  minHeight: "10.25rem",
  p: { xs: 1.25, sm: 1.35 },
});

const compactBarsSx: SxProps<Theme> = composeSx(softPanelBaseSx, {
  display: "grid",
  gap: 0.9,
  p: { xs: 1.15, sm: 1.25 },
});

const matrixSx: SxProps<Theme> = composeSx(softPanelBaseSx, {
  display: "grid",
  gap: { xs: 1, md: 1.1 },
  overflow: "hidden",
  p: { xs: 1.2, sm: 1.35, md: 1.5 },
});

const matrixRowSx: SxProps<Theme> = (theme) => ({
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    md: "minmax(10rem, 0.7fr) repeat(2, minmax(8rem, 1fr))",
  },
  gap: { xs: 0.75, md: 1.1 },
  alignItems: "center",
  minWidth: 0,
  pt: 1,
  "& + &": {
    borderTop: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
  },
});

const barTrackSx: SxProps<Theme> = (theme) => ({
  position: "relative",
  width: "100%",
  minWidth: 0,
  height: "0.7rem",
  borderRadius: 999,
  backgroundColor: alpha(theme.palette.text.primary, 0.07),
  overflow: "hidden",
});

function ToneChip({ tone, label }: { tone: EvidenceTone; label: string }) {
  const color =
    tone === "success"
      ? "success"
      : tone === "info"
        ? "info"
        : tone === "error"
          ? "error"
          : tone === "warning"
            ? "warning"
            : "default";

  return <Chip label={label} color={color} size="small" variant="outlined" />;
}

function EvidenceBar({
  value,
  max,
  tone,
}: {
  value: number;
  max: number;
  tone?: EvidenceTone;
}) {
  return (
    <Box sx={barTrackSx} aria-hidden="true">
      <Box
        sx={(theme) => ({
          width: barWidth(value, max),
          height: "100%",
          borderRadius: "inherit",
          backgroundColor: toneColor(theme, tone),
        })}
      />
    </Box>
  );
}

export function DecisionReadoutStrip({
  items,
  ariaLabel,
}: {
  items: DecisionReadoutItem[];
  ariaLabel: string;
}) {
  return (
    <Box sx={readoutGridSx} aria-label={ariaLabel}>
      {items.map((item) => (
        <Box key={`${item.label}-${item.value}`} component="section" sx={readoutItemSx}>
          <Box sx={{ display: "grid", gap: 0.55, minWidth: 0 }}>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 0.75,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="overline" sx={{ color: "secondary.dark" }}>
                {item.label}
              </Typography>
              <ToneChip tone={item.tone ?? "neutral"} label={item.statusLabel} />
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {item.value}
            </Typography>
          </Box>
          {item.detail ? (
            <Typography variant="body2" color="text.secondary">
              {item.detail}
            </Typography>
          ) : null}
        </Box>
      ))}
    </Box>
  );
}

export function CompactBarComparison({
  title,
  rows,
}: {
  title: string;
  rows: CompactBarRow[];
}) {
  return (
    <Box sx={compactBarsSx}>
      <Typography variant="body2" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
      {rows.map((row) => (
        <Box key={row.label} sx={{ display: "grid", gap: 0.35, minWidth: 0 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 1,
              alignItems: "baseline",
              minWidth: 0,
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              {row.label}
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, overflowWrap: "anywhere" }}>
              {row.valueLabel}
            </Typography>
          </Box>
          <EvidenceBar value={row.value} max={row.max} tone={row.tone} />
        </Box>
      ))}
    </Box>
  );
}

export function TwoMetricEvidenceMatrix({
  title,
  takeaway,
  sourceLabel,
  columns,
  rows,
}: TwoMetricEvidenceMatrixProps) {
  return (
    <Box component="section" sx={matrixSx}>
      <Box sx={{ display: "grid", gap: 0.45, minWidth: 0 }}>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {takeaway}
        </Typography>
      </Box>

      <Box sx={{ display: "grid", gap: 0.4, minWidth: 0 }}>
        {rows.map((row) => (
          <Box key={row.label} sx={matrixRowSx}>
            <Box sx={{ display: "grid", gap: 0.1, minWidth: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {row.label}
              </Typography>
              {row.context ? (
                <Typography variant="caption" color="text.secondary">
                  {row.context}
                </Typography>
              ) : null}
            </Box>
            {columns.map((column) => {
              const cell = row.values[column.key];
              if (!cell) return null;

              return (
                <Box key={column.key} sx={{ display: "grid", gap: 0.35, minWidth: 0 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 1,
                      alignItems: "baseline",
                      minWidth: 0,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      {column.label}
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700, overflowWrap: "anywhere" }}>
                      {cell.label}
                    </Typography>
                  </Box>
                  <EvidenceBar
                    value={cell.value}
                    max={column.max}
                    tone={cell.tone ?? column.tone}
                  />
                </Box>
              );
            })}
          </Box>
        ))}
      </Box>

      {sourceLabel ? (
        <Typography variant="caption" color="text.secondary">
          {sourceLabel}
        </Typography>
      ) : null}
    </Box>
  );
}
