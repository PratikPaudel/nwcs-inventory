"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Equipment {
  equipment_id: number;
  asset_tag: string;
  device_name: string;
  manufacturer: string;
  model: string;
  status: string;
  form_factor: string;
  serial_number: string;
  updated_at: string;
}

export default function InventoryPage() {
  const [inventoryData, setInventoryData] = useState<Equipment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/inventory/search`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: searchQuery,
          }),
        }
      );
      const result = await response.json();
      setInventoryData(result.data || []);
    } catch (error) {
      console.error("Error searching inventory:", error);
      setInventoryData([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== "") {
        handleSearch();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, handleSearch]);

  return (
    <div>
      <div className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by asset tag or serial number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 rounded-md border p-2"
          />
        </div>
      </div>

      {inventoryData.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset Tag</TableHead>
              <TableHead>Device Name</TableHead>
              <TableHead>Serial Number</TableHead>
              <TableHead>Form Factor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventoryData.map((item) => (
              <TableRow key={item.equipment_id}>
                <TableCell className="font-medium">{item.asset_tag}</TableCell>
                <TableCell>{item.device_name}</TableCell>
                <TableCell>{item.serial_number}</TableCell>
                <TableCell>{item.form_factor}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      item.status === "In Use"
                        ? "bg-green-100 text-green-800"
                        : item.status === "Available"
                        ? "bg-blue-100 text-blue-800"
                        : item.status === "In Repair"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {item.status}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(item.updated_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No equipment found.
        </div>
      )}
    </div>
  );
}
