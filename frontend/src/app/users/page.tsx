"use client";

import React from "react";

export default function UsersPage(): React.ReactElement {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Staff & Faculty Management</h1>

      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by username..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Roles</option>
          <option value="faculty">Faculty</option>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>

        <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Device Count</option>
          <option value="0">No Devices</option>
          <option value="1-3">1-3 Devices</option>
          <option value="4+">4+ Devices</option>
        </select>
      </div>
    </div>
  );
}
