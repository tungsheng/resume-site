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
  backgroundColor: alpha(theme.palette.common.white, 0.68),
  border: `1px solid ${alpha(theme.palette.text.primary, 0.075)}`,
  boxShadow: `inset 0 1px 0 ${alpha(theme.palette.common.white, 0.7)}`,
});

export const subtlePanelBaseSx: SxProps<Theme> = (theme) => ({
  minWidth: 0,
  borderRadius: 2,
  backgroundColor: alpha(theme.palette.common.white, 0.38),
  border: `1px solid ${alpha(theme.palette.text.primary, 0.065)}`,
});

export const accentPanelBaseSx: SxProps<Theme> = (theme) => ({
  minWidth: 0,
  borderRadius: 2,
  backgroundColor: alpha(theme.palette.secondary.light, 0.035),
  border: `1px solid ${alpha(theme.palette.secondary.light, 0.14)}`,
});

export const warningPanelBaseSx: SxProps<Theme> = (theme) => ({
  minWidth: 0,
  borderRadius: 2,
  backgroundColor: alpha(theme.palette.warning.light, 0.46),
  border: `1px solid ${alpha(theme.palette.warning.main, 0.18)}`,
});

export const successPanelBaseSx: SxProps<Theme> = (theme) => ({
  minWidth: 0,
  borderRadius: 2,
  backgroundColor: alpha(theme.palette.success.light, 0.075),
  border: `1px solid ${alpha(theme.palette.success.dark, 0.12)}`,
});

export const mutedChipSx: SxProps<Theme> = (theme) => ({
  backgroundColor: alpha(theme.palette.common.white, 0.44),
  borderColor: alpha(theme.palette.text.primary, 0.085),
  color: alpha(theme.palette.text.primary, 0.68),
  fontWeight: 600,
});

export const accentChipSx: SxProps<Theme> = (theme) => ({
  backgroundColor: alpha(theme.palette.secondary.light, 0.04),
  borderColor: alpha(theme.palette.secondary.light, 0.14),
  color: alpha(theme.palette.text.primary, 0.7),
  fontWeight: 600,
});
