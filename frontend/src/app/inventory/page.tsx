"use client";

import { PlusCircleIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import Header from "@/app/components/Header";
import CreateProductModal from "./CreateProductModal";

interface Product {
  productId: string;
  name: string;
  price: number;
  stockQuantity: number;
}

type ProductFormData = {
  name: string;
  price: number;
  stockQuantity: number;
};

const dummyProducts: Product[] = [
  { productId: "1", name: "Coffee", price: 4.99, stockQuantity: 100 },
  { productId: "2", name: "Tea", price: 3.99, stockQuantity: 150 },
  { productId: "3", name: "Sandwich", price: 8.99, stockQuantity: 50 },
  { productId: "4", name: "Cake", price: 5.99, stockQuantity: 75 },
];

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredProducts = dummyProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProduct = async (productData: ProductFormData) => {
    console.log("Creating product:", productData);
  };

  return (
    <div className="mx-auto pb-5 w-full">
      {/* SEARCH BAR */}
      <div className="mb-6">
        <div className="flex items-center border-2 border-gray-200 rounded">
          <SearchIcon className="w-5 h-5 text-gray-500 m-2" />
          <input
            className="w-full py-2 px-4 rounded bg-white"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* HEADER BAR */}
      <div className="flex justify-between items-center mb-6">
        <Header name="Products" />
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Create
          Product
        </button>
      </div>

      {/* BODY PRODUCTS LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg-grid-cols-3 gap-10 justify-between">
        {filteredProducts.map((product: Product) => (
          <div
            key={product.productId}
            className="border shadow rounded-md p-4 max-w-full w-full mx-auto"
          >
            <div className="flex flex-col items-center">
              <h3 className="text-lg text-gray-900 font-semibold">
                {product.name}
              </h3>
              <p className="text-gray-800">${product.price.toFixed(2)}</p>
              <div className="text-sm text-gray-600 mt-1">
                Stock: {product.stockQuantity}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      <CreateProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateProduct}
      />
    </div>
  );
};

export default Products;
