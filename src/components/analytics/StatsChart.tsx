import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  Filler,
} from "chart.js";
import { Line, Radar } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  Filler
);

interface StatData {
  labels?: string[];
  datasets?: { label: string; data: number[] }[];
  userValues?: number[];
  friendValues?: number[];
}

export default function StatsChart({
  stat,
  data,
}: {
  stat: string;
  data?: StatData;
}) {
  if (!data) return <div className="text-gray-300">No data</div>;

  if (stat === "Overall Stats" && data.labels && data.datasets) {
    const radarChartData = {
      labels: data.labels,
      datasets: data.datasets.map((dataset, index) => ({
        label: dataset.label,
        data: dataset.data,
        fill: true,
        backgroundColor:
          index === 0 ? "rgba(59, 130, 246, 0.2)" : "rgba(248, 113, 113, 0.2)",
        borderColor:
          index === 0 ? "rgba(59, 130, 246, 1)" : "rgba(248, 113, 113, 1)",
        pointBackgroundColor: "#fff",
      })),
    };

    return (
      <Radar
        data={radarChartData}
        options={{
          responsive: true,
          scales: {
            r: {
              angleLines: { display: true },
              ticks: {
                display: false,
              },
              grid: {
                circular: true,
              },
              pointLabels: {
                font: {
                  size: 12,
                },
              },
            },
          },
          plugins: {
            legend: { position: "top" },
          },
        }}
      />
    );
  }

  if (data.labels && data.userValues && data.friendValues) {
    const lineChartData = {
      labels: data.labels,
      datasets: [
        {
          label: "You",
          data: data.userValues,
          borderColor: "rgba(59,130,246,1)",
          backgroundColor: "rgba(59,130,246,0.1)",
          tension: 0.4,
          fill: true,
        },
        {
          label: "Friend",
          data: data.friendValues,
          borderColor: "rgba(234,88,12,1)",
          backgroundColor: "rgba(234,88,12,0.1)",
          tension: 0.4,
          fill: true,
        },
      ],
    };

    return (
      <Line
        data={lineChartData}
        options={{
          responsive: true,
          plugins: {
            legend: { position: "top" },
            tooltip: { mode: "index", intersect: false },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }}
      />
    );
  }

  return <div className="">Start Analyzing!</div>;
}
