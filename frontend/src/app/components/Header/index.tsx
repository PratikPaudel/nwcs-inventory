"use client";

import React from "react";

interface PageHeaderProps {
  title: string;
  showSearch?: boolean;
  showAddButton?: boolean;
  addButtonText?: string;
  onAddClick?: () => void;
  filters?: Array<{
    label: string;
    options: Array<{ value: string; label: string }>;
  }>;
}

export default function PageHeader({
  title,
  showSearch = true,
  showAddButton = false,
  addButtonText = "Add New",
  onAddClick,
  filters = [],
}: PageHeaderProps): React.ReactElement {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        {showAddButton && (
          <button
            onClick={onAddClick}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {addButtonText}
          </button>
        )}
      </div>

      <div className="flex gap-4 flex-wrap">
        {showSearch && (
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {filters.map((filter, index) => (
          <select
            key={index}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{filter.label}</option>
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ))}
      </div>
    </div>
  );
}
