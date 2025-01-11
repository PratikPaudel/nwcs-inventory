"use client";

import { PlusCircleIcon, SearchIcon } from "lucide-react";
import { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import CreateProductModal from "./CreateProductModal";

interface Equipment {
  equipment_id: number;
  asset_tag: string;
  device_name: string;
  status: string;
  manufacturer: string;
  model: string;
  location: {
    room_number: string;
    floor_number: number;
    building: {
      building_name: string;
      building_short_name: string;
    };
  };
}

type EquipmentFormData = {
  asset_tag: string;
  device_name: string;
  manufacturer: string;
  model: string;
  status: string;
};

const Equipment = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const response = await fetch("http://localhost:8000/equipment");
      const data = await response.json();
      setEquipment(data);
    } catch (error) {
      console.error("Error fetching equipment:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEquipment = equipment.filter(
    (item) =>
      item.device_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.asset_tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateEquipment = async (equipmentData: EquipmentFormData) => {
    try {
      const response = await fetch("http://localhost:8000/equipment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(equipmentData),
      });

      if (response.ok) {
        fetchEquipment(); // Refresh the list
        setIsModalOpen(false);
      } else {
        console.error("Failed to create equipment");
      }
    } catch (error) {
      console.error("Error creating equipment:", error);
    }
  };

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
            placeholder="Search equipment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* HEADER BAR */}
      <div className="flex justify-between items-center mb-6">
        <Header name="Equipment" />
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Add
          Equipment
        </button>
      </div>

      {/* EQUIPMENT LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipment.map((item: Equipment) => (
          <div
            key={item.equipment_id}
            className="border shadow rounded-lg p-4 bg-white"
          >
            <div className="flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {item.device_name}
                </h3>
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    item.status === "In Use"
                      ? "bg-green-100 text-green-800"
                      : item.status === "Available"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <p className="text-gray-600">Asset Tag: {item.asset_tag}</p>
              <p className="text-gray-600">
                {item.manufacturer} {item.model}
              </p>

              {item.location && (
                <p className="text-gray-500 text-sm mt-2">
                  Location: {item.location.building.building_short_name} - Floor{" "}
                  {item.location.floor_number}, Room {item.location.room_number}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      <CreateProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateEquipment}
      />
    </div>
  );
};

export default Equipment;
