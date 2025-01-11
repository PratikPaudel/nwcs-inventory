"use client";

import Header from "@/app/components/Header";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

interface User {
  userId: string;
  name: string;
  email: string;
}

const columns: GridColDef[] = [
  { field: "userId", headerName: "ID", width: 90 },
  { field: "name", headerName: "Name", width: 200 },
  { field: "email", headerName: "Email", width: 200 },
];

// Add dummy data
const dummyUsers = [
  { userId: "1", name: "John Doe", email: "john@example.com" },
  { userId: "2", name: "Jane Smith", email: "jane@example.com" },
  { userId: "3", name: "Bob Johnson", email: "bob@example.com" },
  { userId: "4", name: "Alice Brown", email: "alice@example.com" },
];

const Users = () => {
  return (
    <div className="flex flex-col">
      <Header name="Users" />
      <DataGrid
        rows={dummyUsers}
        columns={columns}
        getRowId={(row: User) => row.userId}
        checkboxSelection
        className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
      />
    </div>
  );
};

export default Users;
