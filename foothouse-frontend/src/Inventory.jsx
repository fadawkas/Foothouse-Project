import React, { useState, useEffect } from "react";
import axios from "axios";
import Logo from "./assets/Foothouse-Logo.png";

function Inventory() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    brand: "",
    model: "",
    size: "",
    quantity: "",
    price: "",
    warehouse: "",
  });
  const [editQuantityId, setEditQuantityId] = useState(null);
  const [editQuantity, setEditQuantity] = useState(0);
  const [moveActionId, setMoveActionId] = useState(null);
  const [transferQuantity, setTransferQuantity] = useState(0);
  const [transferTarget, setTransferTarget] = useState("");

  // Extract the token from the URL
  const token = new URLSearchParams(window.location.search).get("token");

  const axiosInstance = axios.create({
    baseURL: "http://103.147.92.133:5000",
    headers: {
      Authorization: `Bearer ${token}`, // Add token to Authorization header
    },
  });

  const sortItemsByModel = (items) => {
    return items.sort((a, b) => a.model.localeCompare(b.model));
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const result = await axiosInstance.get("/inventory");
        setItems(sortItemsByModel(result.data));
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    };
    fetchItems();
  }, []);

  const handleAddItem = async () => {
    try {
      const result = await axiosInstance.post("/inventory/add", newItem);
      const updatedItems = [...items, result.data];
      setItems(sortItemsByModel(updatedItems));
      setNewItem({
        brand: "",
        model: "",
        size: "",
        quantity: "",
        price: "",
        warehouse: "",
      });
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await axiosInstance.delete(`/inventory/${id}`);
      const updatedItems = items.filter((item) => item._id !== id);
      setItems(sortItemsByModel(updatedItems));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleEditQuantity = async (id) => {
    try {
      await axiosInstance.put(`/inventory/${id}`, {
        quantity: editQuantity,
      });
      setEditQuantityId(null);
      const updatedItems = await axiosInstance.get("/inventory");
      setItems(sortItemsByModel(updatedItems.data));
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleMoveQuantity = async (id) => {
    try {
      const sourceItem = items.find((item) => item._id === id);
      const targetItem = items.find(
        (item) =>
          item.model === sourceItem.model &&
          item.size === sourceItem.size &&
          item.warehouse === transferTarget
      );

      if (transferQuantity > sourceItem.quantity) {
        alert("Not enough stock to transfer.");
        return;
      }

      if (!targetItem) {
        await axiosInstance.post("/inventory/add", {
          brand: sourceItem.brand,
          model: sourceItem.model,
          size: sourceItem.size,
          quantity: transferQuantity,
          price: sourceItem.price,
          warehouse: transferTarget,
        });
      } else {
        await axiosInstance.put(`/inventory/${targetItem._id}`, {
          quantity: targetItem.quantity + transferQuantity,
        });
      }

      await axiosInstance.put(`/inventory/${id}`, {
        quantity: sourceItem.quantity - transferQuantity,
      });

      setTransferQuantity(0);
      setTransferTarget("");
      setMoveActionId(null);
      const updatedItems = await axiosInstance.get("/inventory");
      setItems(sortItemsByModel(updatedItems.data));
    } catch (error) {
      console.error("Error moving quantity:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-navy-50">
      <main className="flex-1 p-6">
        <header className="flex flex-col items-start mb-6">
          <div className="flex items-center">
            <img src={Logo} alt="Foothouse Logo" className="w-12 h-12 mr-4" />
            <h1 className="text-4xl font-bold text-navy-900">Foothouse</h1>
          </div>
          <h2 className="text-3xl font-bold text-navy-900 mt-2">Inventory</h2>
        </header>

        <section className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-xl font-semibold mb-4 text-navy-900">
            Add New Item
          </h3>
          <div className="grid grid-cols-6 gap-4">
            <input
              type="text"
              placeholder="Brand"
              value={newItem.brand}
              onChange={(e) =>
                setNewItem({ ...newItem, brand: e.target.value })
              }
              className="p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Model"
              value={newItem.model}
              onChange={(e) =>
                setNewItem({ ...newItem, model: e.target.value })
              }
              className="p-2 border border-gray-300 rounded"
            />
            <input
              type="number"
              placeholder="Size"
              value={newItem.size}
              onChange={(e) => setNewItem({ ...newItem, size: e.target.value })}
              className="p-2 border border-gray-300 rounded"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={newItem.quantity}
              onChange={(e) =>
                setNewItem({ ...newItem, quantity: e.target.value })
              }
              className="p-2 border border-gray-300 rounded"
            />
            <input
              type="number"
              placeholder="Price"
              value={newItem.price}
              onChange={(e) =>
                setNewItem({ ...newItem, price: e.target.value })
              }
              className="p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Warehouse"
              value={newItem.warehouse}
              onChange={(e) =>
                setNewItem({ ...newItem, warehouse: e.target.value })
              }
              className="p-2 border border-gray-300 rounded"
            />
            <button
              onClick={handleAddItem}
              className="col-span-6 bg-navy-600 text-white px-4 py-2 rounded hover:bg-navy-700 transition"
            >
              Add Item
            </button>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow">
          <table className="min-w-full text-left border-collapse">
            <thead className="bg-navy-900 text-white">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Brand</th>
                <th className="px-4 py-2">Model</th>
                <th className="px-4 py-2">Size</th>
                <th className="px-4 py-2">Quantity</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Warehouse</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr
                  key={item._id}
                  className="border-b hover:bg-navy-100 transition"
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{item.brand}</td>
                  <td className="px-4 py-2">{item.model}</td>
                  <td className="px-4 py-2">{item.size}</td>
                  <td className="px-4 py-2">
                    {editQuantityId === item._id ? (
                      <>
                        <input
                          type="number"
                          defaultValue={item.quantity}
                          onChange={(e) =>
                            setEditQuantity(Number(e.target.value))
                          }
                          className="w-16 border border-gray-300 rounded"
                        />
                        <button
                          onClick={() => handleEditQuantity(item._id)}
                          className="ml-2 bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition"
                        >
                          Save
                        </button>
                      </>
                    ) : (
                      item.quantity
                    )}
                  </td>
                  <td className="px-4 py-2">Rp{item.price}</td>
                  <td className="px-4 py-2">{item.warehouse}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => setEditQuantityId(item._id)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                    {moveActionId === item._id ? (
                      <>
                        <input
                          type="number"
                          placeholder="Qty"
                          className="w-16 border border-gray-300 rounded"
                          onChange={(e) =>
                            setTransferQuantity(Number(e.target.value))
                          }
                        />
                        <input
                          type="text"
                          placeholder="Toko"
                          className="w-16 border border-gray-300 rounded"
                          onChange={(e) => setTransferTarget(e.target.value)}
                        />
                        <button
                          onClick={() => handleMoveQuantity(item._id)}
                          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition"
                        >
                          Confirm
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setMoveActionId(item._id)}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition"
                      >
                        Move
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

export default Inventory;
