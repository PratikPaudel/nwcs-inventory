"use client";

import { Dialog } from "@headlessui/react";
import { useState, useEffect } from "react";
import { XIcon, SearchIcon, ChevronDownIcon } from "lucide-react";

interface Location {
  location_id: number;
  room_number: string;
  floor_number: number;
  building: {
    building_name: string;
    building_short_name: string;
  } | null;
}

interface DeviceUser {
  device_user_id: number;
  first_name: string;
  last_name: string;
  department: {
    department_name: string;
  } | null;
}

interface EquipmentFormData {
  // Required Fields
  asset_tag: string;
  serial_number: string;
  status: string;
  manufacturer: string;
  model: string;

  // Optional Hardware Details
  form_factor?: string;
  ram?: string;
  storage_capacity?: string;
  storage_type?: string;
  operating_system?: string;

  // Support Details
  warranty_start_date?: string;
  warranty_end_date?: string;
  notes?: string;

  // Location
  location_id: number;

  // Assignment (Optional)
  create_assignment: boolean;
  device_user_id?: number;
  assignment_purpose?: string;
  assignment_start_date?: string;
}

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: EquipmentFormData) => void;
}

const CreateProductModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreateProductModalProps) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [users, setUsers] = useState<DeviceUser[]>([]);
  const [formData, setFormData] = useState<EquipmentFormData>({
    asset_tag: "",
    serial_number: "",
    status: "Available",
    manufacturer: "",
    model: "",
    form_factor: "",
    ram: "",
    storage_capacity: "",
    storage_type: "",
    operating_system: "",
    warranty_start_date: "",
    warranty_end_date: "",
    notes: "",
    location_id: 0,
    create_assignment: false,
  });
  const [userSearch, setUserSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<DeviceUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<DeviceUser | null>(null);
  const [locationSearch, setLocationSearch] = useState("");
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );

  useEffect(() => {
    // Fetch locations and users for dropdowns
    fetchLocations();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (userSearch) {
      const filtered = users.filter((user) =>
        `${user.first_name} ${user.last_name} ${
          user.department?.department_name || ""
        }`
          .toLowerCase()
          .includes(userSearch.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  }, [userSearch, users]);

  useEffect(() => {
    if (locationSearch) {
      const filtered = locations.filter((location) =>
        `${location.building?.building_name || ""} ${location.floor_number} ${
          location.room_number
        }`
          .toLowerCase()
          .includes(locationSearch.toLowerCase())
      );
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations([]);
    }
  }, [locationSearch, locations]);

  const fetchLocations = async () => {
    try {
      const response = await fetch("http://localhost:8000/locations");
      const data = await response.json();
      setLocations(data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8000/device-users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(formData);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAssignmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isAssigning = e.target.checked;
    setFormData((prev) => ({
      ...prev,
      create_assignment: isAssigning,
      status: isAssigning ? "In Use" : "Available",
    }));
  };

  const LocationSearchSection = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
        Location
      </h3>
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Search Location
        </label>
        <div className="relative">
          <input
            type="text"
            value={locationSearch}
            onChange={(e) => setLocationSearch(e.target.value)}
            placeholder="Search by building, floor, or room..."
            className="w-full rounded-lg border-gray-300 pl-10 pr-4 py-2 border shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>

        {/* Location Search Results */}
        {filteredLocations.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto py-2">
            {filteredLocations.map((location) => (
              <button
                key={location.location_id}
                type="button"
                className="w-full px-6 py-3 text-left hover:bg-gray-50 focus:bg-gray-50"
                onClick={() => {
                  setSelectedLocation(location);
                  setFormData((prev) => ({
                    ...prev,
                    location_id: location.location_id,
                  }));
                  setLocationSearch("");
                }}
              >
                <div className="font-medium">
                  {location.building?.building_name || "Unknown Building"}
                </div>
                <div className="text-sm text-gray-500">
                  Floor {location.floor_number}, Room {location.room_number}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedLocation && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="font-medium">
            Selected Location:{" "}
            {selectedLocation.building?.building_name || "Unknown Building"}
          </div>
          <div className="text-sm text-gray-600">
            Floor {selectedLocation.floor_number}, Room{" "}
            {selectedLocation.room_number}
          </div>
        </div>
      )}
    </div>
  );

  const SelectWithIcon = ({
    label,
    name,
    options,
    required = false,
  }: {
    label: string;
    name: keyof EquipmentFormData;
    options: { value: string; label: string }[];
    required?: boolean;
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <select
          name={name}
          required={required}
          className="w-full rounded-lg border-gray-300 px-4 py-2 border shadow-sm focus:border-blue-500 focus:ring-blue-500 appearance-none bg-white pr-10"
          value={formData[name] as string}
          onChange={handleInputChange}
        >
          <option value="">Select {label}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto w-full max-w-4xl bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center">
            <Dialog.Title className="text-xl font-semibold text-gray-900">
              Add New Equipment
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 p-2 rounded-full hover:bg-gray-100"
            >
              <XIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-8">
              {/* Required Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                  Required Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Asset Tag
                    </label>
                    <input
                      type="text"
                      name="asset_tag"
                      required
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 border"
                      value={formData.asset_tag}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Serial Number
                    </label>
                    <input
                      type="text"
                      name="serial_number"
                      required
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 border"
                      value={formData.serial_number}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* Hardware Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                  Hardware Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SelectWithIcon
                    label="Manufacturer"
                    name="manufacturer"
                    required
                    options={[
                      { value: "Dell", label: "Dell" },
                      { value: "HP", label: "HP" },
                      { value: "Lenovo", label: "Lenovo" },
                      { value: "Apple", label: "Apple" },
                    ]}
                  />
                  <SelectWithIcon
                    label="Form Factor"
                    name="form_factor"
                    options={[
                      { value: "Laptop", label: "Laptop" },
                      { value: "Desktop", label: "Desktop" },
                      { value: "Tablet", label: "Tablet" },
                      { value: "Mobile", label: "Mobile" },
                    ]}
                  />
                  <SelectWithIcon
                    label="RAM"
                    name="ram"
                    options={[
                      { value: "4GB", label: "4GB" },
                      { value: "8GB", label: "8GB" },
                      { value: "16GB", label: "16GB" },
                      { value: "32GB", label: "32GB" },
                    ]}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Model
                    </label>
                    <input
                      type="text"
                      name="model"
                      required
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 border"
                      value={formData.model}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <LocationSearchSection />

              {/* Assignment Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="create_assignment"
                    checked={formData.create_assignment}
                    onChange={handleAssignmentChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="text-lg font-medium text-gray-900">
                    Assign to User
                  </label>
                </div>

                {formData.create_assignment && (
                  <div className="space-y-4">
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Search User
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={userSearch}
                          onChange={(e) => setUserSearch(e.target.value)}
                          placeholder="Search by name or department..."
                          className="w-full rounded-lg border-gray-300 pl-10 pr-4 py-2 border shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>

                      {/* User Search Results */}
                      {filteredUsers.length > 0 && (
                        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto py-2">
                          {filteredUsers.map((user) => (
                            <button
                              key={user.device_user_id}
                              type="button"
                              className="w-full px-6 py-3 text-left hover:bg-gray-50 focus:bg-gray-50"
                              onClick={() => {
                                setSelectedUser(user);
                                setFormData((prev) => ({
                                  ...prev,
                                  device_user_id: user.device_user_id,
                                }));
                                setUserSearch("");
                              }}
                            >
                              <div className="font-medium">
                                {user.first_name} {user.last_name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.department?.department_name ||
                                  "No Department"}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {selectedUser && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="font-medium">
                          Selected: {selectedUser.first_name}{" "}
                          {selectedUser.last_name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {selectedUser.department?.department_name ||
                            "No Department"}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Assignment Date
                        </label>
                        <input
                          type="date"
                          name="assignment_start_date"
                          required
                          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 border"
                          value={formData.assignment_start_date}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Assignment Purpose
                      </label>
                      <textarea
                        name="assignment_purpose"
                        rows={3}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 border"
                        value={formData.assignment_purpose}
                        onChange={handleInputChange}
                        placeholder="Why is this equipment being assigned?"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions - Sticky Bottom */}
            <div className="sticky bottom-0 bg-white pt-6 pb-4 border-t mt-8">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create Equipment
                </button>
              </div>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default CreateProductModal;
