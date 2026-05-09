import { alpha, type SxProps, type Theme } from "@mui/material/styles";

export function composeSx(
  ...items: Array<SxProps<Theme> | undefined>
): SxProps<Theme> {
  return items.flatMap((item) => {
    if (!item) return [];
    return Array.isArray(item) ? item : [item];
  }) as SxProps<Theme>;
}

export const softPanelBaseSx: SxProps<Theme> = (theme) => ({
  minWidth: 0,
  borderRadius: 2,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: "none",
});

export const accentPanelBaseSx: SxProps<Theme> = (theme) => ({
  minWidth: 0,
  borderRadius: 2,
  backgroundColor: alpha(theme.palette.secondary.light, 0.08),
  border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
});

export const warningPanelBaseSx: SxProps<Theme> = (theme) => ({
  minWidth: 0,
  borderRadius: 2,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderLeft: `3px solid ${alpha(theme.palette.warning.main, 0.62)}`,
});

export const successPanelBaseSx: SxProps<Theme> = (theme) => ({
  minWidth: 0,
  borderRadius: 2,
  backgroundColor: alpha(theme.palette.success.light, 0.48),
  border: `1px solid ${alpha(theme.palette.success.main, 0.22)}`,
});

export const mutedChipSx: SxProps<Theme> = (theme) => ({
  backgroundColor: alpha(theme.palette.secondary.light, 0.065),
  borderColor: alpha(theme.palette.secondary.main, 0.24),
  color: alpha(theme.palette.text.primary, 0.72),
  fontWeight: 600,
});

export const accentChipSx: SxProps<Theme> = (theme) => ({
  backgroundColor: alpha(theme.palette.secondary.light, 0.14),
  borderColor: alpha(theme.palette.secondary.main, 0.36),
  color: theme.palette.secondary.dark,
  fontWeight: 600,
});
