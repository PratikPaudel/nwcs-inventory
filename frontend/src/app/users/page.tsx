"use client";

import { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import { SearchIcon } from "lucide-react";

interface DeviceUser {
  device_user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  department: {
    department_name: string;
    department_short_name: string;
  } | null;
  employment_type: {
    employment_type_name: string;
  } | null;
}

const Users = () => {
  const [users, setUsers] = useState<DeviceUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8000/device-users");
      const data = await response.json();
      console.log("Fetched users:", data); // Debug log
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.department?.department_name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-auto pb-5 w-full">
      {/* SEARCH BAR */}
      <div className="mb-6">
        <div className="flex items-center border-2 border-gray-200 rounded">
          <SearchIcon className="w-5 h-5 text-gray-500 m-2" />
          <input
            className="w-full py-2 px-4 rounded bg-white"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* HEADER */}
      <div className="mb-6">
        <Header name="Device Users" />
      </div>

      {/* USERS LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div
            key={user.device_user_id}
            className="border shadow rounded-lg p-4 bg-white"
          >
            <div className="flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {user.first_name} {user.last_name}
                </h3>
                {user.employment_type && (
                  <span className="px-2 py-1 rounded text-sm bg-blue-100 text-blue-800">
                    {user.employment_type.employment_type_name}
                  </span>
                )}
              </div>

              <p className="text-gray-600">{user.email}</p>
              {user.phone && (
                <p className="text-gray-600">Phone: {user.phone}</p>
              )}

              <div className="mt-2 pt-2 border-t border-gray-100">
                <p className="text-gray-500 text-sm">
                  Department:{" "}
                  <span className="font-medium">
                    {user.department?.department_name || "Not Assigned"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
