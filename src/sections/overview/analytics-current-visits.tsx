import type { CardProps } from '@mui/material/Card';
import type { ChartOptions } from 'src/components/chart';

import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import GaugeChart from 'react-gauge-chart';

import { fNumber } from 'src/utils/format-number';
import { Chart, useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  judgeValue?: number; 
  chart: {
    colors?: string[];
    series: {
      label: string;
      value: number;
    }[];
    options?: ChartOptions;
  };
};

export function AnalyticsCurrentVisits({ title, subheader, judgeValue, chart, ...other }: Props) {
  const theme = useTheme();

  const chartSeries = chart.series.map((item) => item.value);

  const chartColors = chart.colors ?? [
    theme.palette.primary.main,
    theme.palette.warning.main,
    theme.palette.secondary.dark,
    theme.palette.error.main,
  ];

  const chartOptions = useChart({
    chart: { sparkline: { enabled: true } },
    colors: chartColors,
    labels: chart.series.map((item) => item.label),
    stroke: { width: 0 },
    dataLabels: { enabled: true, dropShadow: { enabled: false } },
    tooltip: {
      y: {
        formatter: (value: number) => fNumber(value),
        title: { formatter: (seriesName: string) => `${seriesName}` },
      },
    },
    plotOptions: { pie: { donut: { labels: { show: false } } } },
    ...chart.options,
  });

  return (
    <Card {...other}>
      <CardHeader 
        title={title} 
        subheader={subheader} 
      />

      <Chart
        type="pie"
        series={chartSeries}
        options={chartOptions}
        width={{ xs: 240, xl: 260 }}
        height={{ xs: 240, xl: 260 }}
        sx={{ my: 6, mx: 'auto' }}
      />

      <Divider sx={{ borderStyle: 'dashed' }} />


      {judgeValue !== undefined && (
        <>
          <Divider sx={{ borderStyle: 'dashed' }} />

          <GaugeChart
            id="judge-gauge"
            nrOfLevels={20}
            percent={Math.min(judgeValue / 100, 1)} // Assuming judgeValue is out of 100
            colors={['#FF5F6D', '#FFC371', '#00C851']}
            arcWidth={0.3}
            textColor="#000000"
            style={{ width: '80%', margin: '0 auto' }}
            formatTextValue={() => `${judgeValue}%`}
          />
          
          <div style={{ textAlign: 'center', padding: '16px', fontSize: '1.2em' }}>
            Judge Value: {fNumber(judgeValue)}
          </div>
        </>
      )}
    </Card>
  );
}
