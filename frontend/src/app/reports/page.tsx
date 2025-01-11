"use client";

import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  Info,
  AlertTriangle,
  XCircle,
  RefreshCw,
  UserPlus,
  MapPin,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

// Define the getActivityColor function
function getActivityColor(activityType: string): string {
  switch (activityType) {
    case "info":
      return "bg-blue-100 text-blue-800";
    case "warning":
      return "bg-yellow-100 text-yellow-800";
    case "error":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

// Define the getActivityIcon function
function getActivityIcon(activityType: string): React.ReactElement {
  switch (activityType) {
    case "info":
      return <Info className="h-4 w-4 text-blue-800" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-yellow-800" />;
    case "error":
      return <XCircle className="h-4 w-4 text-red-800" />;
    default:
      return <Info className="h-4 w-4 text-gray-800" />;
  }
}

interface ReportFilters {
  equipmentType: string;
  department: string;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
}

interface ReportData {
  equipment_id: number;
  device_name: string;
  form_factor: string;
  status: string;
  updated_at: string;
}

// Define the type for an activity
interface Activity {
  id: number;
  type: string;
  description: string;
  created_at: string;
}

interface EquipmentHistory {
  history_id: number;
  equipment_id: number;
  location_id: number | null;
  status: string;
  device_user_id: number | null;
  assignment_start_date: string | null;
  assignment_end_date: string | null;
  change_date: string;
  change_made_by: number;
  // Joined fields
  device_name?: string;
  location_name?: string;
  user_name?: string;
  changed_by_name?: string;
}

const getHistoryMessage = (history: EquipmentHistory): string => {
  const messages = [];

  if (history.status) {
    messages.push(`Status changed to ${history.status}`);
  }

  if (history.device_user_id) {
    messages.push(
      history.assignment_end_date
        ? `Unassigned from ${history.user_name}`
        : `Assigned to ${history.user_name}`
    );
  }

  if (history.location_id) {
    messages.push(`Moved to ${history.location_name}`);
  }

  return messages.join(", ");
};

export default function ReportsPage() {
  const [filters, setFilters] = useState<ReportFilters>({
    equipmentType: "",
    department: "",
    status: "",
    startDate: null,
    endDate: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [showReport, setShowReport] = useState(false);
  const [activities] = useState<Activity[]>([
    {
      id: 1,
      type: "info",
      description: "System update completed",
      created_at: "2023-10-01T10:00:00Z",
    },
    {
      id: 2,
      type: "warning",
      description: "High memory usage detected",
      created_at: "2023-10-02T12:30:00Z",
    },
    {
      id: 3,
      type: "error",
      description: "Failed login attempt",
      created_at: "2023-10-03T14:45:00Z",
    },
  ]);
  const [equipmentHistory, setEquipmentHistory] = useState<EquipmentHistory[]>(
    []
  );

  const handleGenerateReport = async () => {
    setIsLoading(true);
    try {
      console.log("Sending filters:", filters);

      const response = await fetch(
        "http://localhost:8000/api/reports/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filters: {
              type: filters.equipmentType || null,
              department: filters.department || null,
              status: filters.status || null,
              start_date: filters.startDate?.toISOString() || null,
              end_date: filters.endDate?.toISOString() || null,
            },
          }),
        }
      );

      const data = await response.json();
      console.log("Received data:", data);

      setReportData(data.data);
      setShowReport(true);
    } catch (error) {
      console.error("Error generating report:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async (format: "pdf" | "excel") => {
    try {
      const response = await fetch("/api/reports/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filters,
          format,
        }),
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `equipment-report.${format === "excel" ? "xlsx" : "pdf"}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error(`Error exporting ${format}:`, error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Filters Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        <h2 className="text-lg font-semibold mb-4">Equipment Report</h2>

        {/* Filters Grid - Now 3 columns instead of 4 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Equipment Type Filter */}
          <Select
            value={filters.equipmentType}
            onValueChange={(value) =>
              setFilters({ ...filters, equipmentType: value })
            }
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Equipment Type" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="Laptop">Laptop</SelectItem>
              <SelectItem value="Desktop">Desktop</SelectItem>
              <SelectItem value="Monitor">Monitor</SelectItem>
              <SelectItem value="Tablet">Tablet</SelectItem>
              <SelectItem value="Phone">Phone</SelectItem>
              <SelectItem value="Printer">Printer</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>

          {/* Department Filter */}
          <Select
            value={filters.department}
            onValueChange={(value) =>
              setFilters({ ...filters, department: value })
            }
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="it">IT</SelectItem>
              <SelectItem value="hr">HR</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select
            value={filters.status}
            onValueChange={(value) => setFilters({ ...filters, status: value })}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="In Use">In Use</SelectItem>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="In Repair">In Repair</SelectItem>
              <SelectItem value="Retired">Retired</SelectItem>
              <SelectItem value="Lost">Lost</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Range - Simple date inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Start Date</label>
            <input
              type="date"
              className="w-full rounded-md border p-2"
              value={
                filters.startDate
                  ? filters.startDate.toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                setFilters({
                  ...filters,
                  startDate: e.target.value ? new Date(e.target.value) : null,
                })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">End Date</label>
            <input
              type="date"
              className="w-full rounded-md border p-2"
              value={
                filters.endDate
                  ? filters.endDate.toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                setFilters({
                  ...filters,
                  endDate: e.target.value ? new Date(e.target.value) : null,
                })
              }
            />
          </div>
        </div>

        {/* Generate Report Button */}
        <Button
          onClick={handleGenerateReport}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Show Report"
          )}
        </Button>
      </div>

      {/* Report Section */}
      {showReport && (
        <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Report Results</h3>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => handleExport("excel")}>
                Export to Excel
              </Button>
              <Button variant="outline" onClick={() => handleExport("pdf")}>
                Export to PDF
              </Button>
            </div>
          </div>

          {reportData.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Device Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.map((item: ReportData) => (
                  <TableRow key={item.equipment_id}>
                    <TableCell>{item.equipment_id}</TableCell>
                    <TableCell>{item.device_name}</TableCell>
                    <TableCell>{item.form_factor}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>
                      {format(new Date(item.updated_at), "PPP")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No results found for the selected filters.
            </div>
          )}
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
        <div className="bg-white rounded-lg shadow">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="p-4 border-b last:border-0 flex items-start space-x-3"
            >
              <div
                className={`p-2 rounded-full ${getActivityColor(
                  activity.type
                )}`}
              >
                {getActivityIcon(activity.type)}
              </div>
              <div>
                <p className="text-sm text-gray-900">{activity.description}</p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(activity.created_at), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Equipment History</h2>
        <div className="bg-white rounded-lg shadow">
          {equipmentHistory.map((history) => (
            <div
              key={history.history_id}
              className="p-4 border-b last:border-0 flex items-start space-x-3"
            >
              <div className="p-2 rounded-full bg-primary/10">
                {history.status && (
                  <RefreshCw className="h-4 w-4 text-primary" />
                )}
                {history.device_user_id && (
                  <UserPlus className="h-4 w-4 text-primary" />
                )}
                {history.location_id && (
                  <MapPin className="h-4 w-4 text-primary" />
                )}
              </div>
              <div>
                <p className="text-sm text-gray-900">
                  {getHistoryMessage(history)}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(history.change_date), {
                      addSuffix: true,
                    })}
                  </p>
                  <span className="text-xs text-gray-400">
                    by {history.changed_by_name}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
