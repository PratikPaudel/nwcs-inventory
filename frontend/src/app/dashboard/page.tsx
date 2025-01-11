"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type ChartData = {
  name: string;
  value: number;
};

type ChartType = "building" | "manufacturer" | "formFactor";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
];

export default function Dashboard() {
  const [chartType, setChartType] = useState<ChartType>("building");
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        let endpoint = "";
        switch (chartType) {
          case "building":
            endpoint = "/dashboard/devices-by-building";
            break;
          case "manufacturer":
            endpoint = "/dashboard/devices-by-manufacturer";
            break;
          case "formFactor":
            endpoint = "/dashboard/devices-by-form-factor";
            break;
        }

        const response = await fetch(`http://localhost:8000${endpoint}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (!result.data) {
          throw new Error("No data received from server");
        }
        setData(result.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [chartType]);

  const renderChart = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-[300px]">
          <div className="text-gray-500">Loading...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex justify-center items-center h-[300px]">
          <div className="text-red-500">Error: {error}</div>
        </div>
      );
    }

    if (!data || data.length === 0) {
      return (
        <div className="flex justify-center items-center h-[300px]">
          <div className="text-gray-500">No data available</div>
        </div>
      );
    }

    const maxValue = Math.max(...data.map((item) => item.value));
    const yAxisTicks = Array.from(
      { length: 5 },
      (_, i) => Math.ceil(maxValue / 20) * i * 4
    );

    switch (chartType) {
      case "building":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              barSize={20}
            >
              <XAxis
                dataKey="name"
                interval={0}
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                ticks={yAxisTicks}
                domain={[0, yAxisTicks[yAxisTicks.length - 1]]}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              />
              <Bar
                dataKey="value"
                name="Number of Devices"
                radius={[4, 4, 0, 0]}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      case "manufacturer":
      case "formFactor":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold mb-4">Dashboard</h1>
        <div className="flex space-x-4">
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value as ChartType)}
            className="w-full md:w-auto rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="building">Devices by Building</option>
            <option value="manufacturer">Devices by Manufacturer</option>
            <option value="formFactor">Devices by Form Factor</option>
          </select>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-4">{renderChart()}</div>
      </div>
    </div>
  );
}
