import type { CardProps } from "@mui/material/Card";
import type { ColorType } from "src/theme/core/palette";
import type { ChartOptions } from "src/components/chart";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { useTheme } from "@mui/material/styles";

import { fNumber, fPercent, fShortenNumber } from "src/utils/format-number";

import { varAlpha, bgGradient } from "src/theme/styles";

import { Iconify } from "src/components/iconify";
import { SvgColor } from "src/components/svg-color";
import { Chart, useChart } from "src/components/chart";

// ----------------------------------------------------------------------

type Props = CardProps & {
  binReference: string;
  totalWaste: number;
  wasteType: string;
  trendPercent: number;
  color?: ColorType;
  icon: React.ReactNode;
  chart: {
    series: number[];
    categories: string[];
    options?: ChartOptions;
  };
};

export function OperationRoomBinWidget({
  icon,
  binReference,
  totalWaste,
  wasteType,
  chart,
  trendPercent,
  color = "warning",
  sx,
  ...other
}: Props) {
  const theme = useTheme();

  const chartColors = [theme.palette[color].dark];

  const chartOptions = useChart({
    chart: { sparkline: { enabled: true } },
    colors: chartColors,
    xaxis: { categories: chart.categories },
    grid: {
      padding: { top: 6, left: 6, right: 6, bottom: 6 },
    },
    tooltip: {
      y: { formatter: (value: number) => fNumber(value), title: { formatter: () => "" } },
    },
    ...chart.options,
  });

  const renderTrending = (
    <Box
      sx={{
        top: 16,
        gap: 0.5,
        right: 16,
        display: "flex",
        position: "absolute",
        alignItems: "center",
      }}
    >
      <Iconify
        width={20}
        icon={trendPercent < 0 ? "eva:trending-down-fill" : "eva:trending-up-fill"}
      />
      <Box component="span" sx={{ typography: "subtitle2" }}>
        {trendPercent > 0 && "+"}
        {fPercent(trendPercent)}
      </Box>
    </Box>
  );

  return (
    <Card
      sx={{
        ...bgGradient({
          color: `135deg, ${varAlpha(
            theme.vars.palette[color].lighterChannel,
            0.48
          )}, ${varAlpha(theme.vars.palette[color].lightChannel, 0.48)}`,
        }),
        p: 3,
        boxShadow: "none",
        position: "relative",
        color: "front",
        backgroundColor: "common.white",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: `0 8px 16px rgba(0, 0, 0, 0.15)`,
        },
        ...sx,
      }}
      {...other}
    >
      {/* Icon - Increased size */}
      <Box sx={{ width: 64, height: 64, mb: 3, display: "flex", justifyContent: "center", alignItems: "center" }}>
        {icon}
      </Box>

      {renderTrending}

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          justifyContent: "flex-end",
        }}
      >
        <Box sx={{ flexGrow: 1, minWidth: 112 }}>
          <Box sx={{ mb: 1, typography: "subtitle2" }}>{binReference}</Box>
          <Box sx={{ typography: "h4" }}>{fShortenNumber(totalWaste)} kg</Box>
          <Box sx={{ typography: "body2", color: "text.secondary" }}>
            {wasteType}: {fPercent(totalWaste)}
          </Box>
        </Box>

        <Chart
          type="line"
          series={[{ data: chart.series }]}
          options={chartOptions}
          width={96}
          height={64}
        />
      </Box>

      <SvgColor
        src="/assets/background/shape-square.svg"
        sx={{
          top: 0,
          left: -20,
          width: 240,
          zIndex: -1,
          height: 240,
          opacity: 0.24,
          position: "absolute",
          color: `${color}.main`,
        }}
      />
    </Card>
  );
}
