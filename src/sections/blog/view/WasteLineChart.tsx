import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Box, Typography } from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

// Register necessary chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface WasteData {
  timestamp: string;
  toxic_waste: number;
  non_toxic_waste: number;
  organic_waste: number;
}

interface WasteLineChartProps {
  reference: string;
}

const WasteLineChart: React.FC<WasteLineChartProps> = ({ reference }) => {
  const [wasteData, setWasteData] = useState<WasteData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    axios
      .get(`https://smartbin-backend.onrender.com/bins/waste-data/${reference}`)
      .then((response) => {
        console.log("Fetched Data:", response.data); // Debugging
        setWasteData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching waste data:", error);
        setLoading(false);
      });
  }, [reference]);

  if (loading) {
    return (
      <Typography color="white" textAlign="center">
        Loading data...
      </Typography>
    );
  }

  if (wasteData.length === 0) {
    return (
      <Typography color="red" textAlign="center">
        No data available for reference: {reference}
      </Typography>
    );
  }

  // Prepare the chart data
  const chartData = {
    labels: wasteData.map((data) =>
      new Date(data.timestamp).toISOString().split("T")[0]
    ),
    datasets: [
      {
        label: "Toxic Waste",
        data: wasteData.map((data) => data.toxic_waste),
        borderColor: "#FF5733",
        backgroundColor: "rgba(255, 87, 51, 0.3)",
        pointBorderColor: "#FF5733",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Non-Toxic Waste",
        data: wasteData.map((data) => data.non_toxic_waste),
        borderColor: "#3498DB",
        backgroundColor: "rgba(52, 152, 219, 0.3)",
        pointBorderColor: "#3498DB",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Organic Waste",
        data: wasteData.map((data) => data.organic_waste),
        borderColor: "#2ECC71",
        backgroundColor: "rgba(46, 204, 113, 0.3)",
        pointBorderColor: "#2ECC71",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#EAEAEA",
          font: {
            size: 14,
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#EAEAEA",
          font: {
            size: 12,
          },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      y: {
        ticks: {
          color: "#EAEAEA",
          font: {
            size: 12,
          },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
    animation: {
      duration: 1000,
      easing: "easeInOutQuart" as const, // ✅ Fixed the TypeScript error here
    },
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "400px",
        backgroundColor: "#1E1E2F",
        p: 2,
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
      }}
    >
      <Typography variant="h6" color="#EAEAEA" sx={{ mb: 2, textAlign: "center" }}>
        Waste Data for Reference: {reference}
      </Typography>
      <Line data={chartData} options={chartOptions} />
    </Box>
  );
};

export default WasteLineChart;
