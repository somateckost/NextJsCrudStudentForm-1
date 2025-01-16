import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    mobilenumber: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Fetch students from the API
  const fetchStudents = async () => {
    try {
      const res = await fetch("/api/students");
      const data = await res.json();
      setStudents(data);
    } catch (error) {
      console.error("Failed to fetch students", error);
    }
  };

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validate form fields
  const validateForm = () => {
    if (!formData.name.trim()) return "Name is required.";
    if (!formData.mobilenumber.trim())
      return "Mobile number is required.";
    if (!/^\d{10}$/.test(formData.mobilenumber))
      return "Mobile number must be a 10-digit number.";
    if (!formData.address.trim()) return "Address is required.";
    return null;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errorMessage = validateForm();
    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    try {
      const res = await fetch(
        editingId ? `/api/students/${editingId}` : "/api/students/create",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) throw new Error("Failed to save student");

      fetchStudents();
      setFormData({ name: "", mobilenumber: "", address: "" });
      setEditingId(null);
      setError("");
    } catch (error) {
      console.error(error.message);
    }
  };

  // Handle edit
  const handleEdit = (student) => {
    setFormData({
      name: student.name,
      mobilenumber: student.mobilenumber,
      address: student.address,
    });
    setEditingId(student.id);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this student?")) return;

    try {
      const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete student");

      fetchStudents();
    } catch (error) {
      console.error(error.message);
    }
  };

  // Load students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-semibold text-gray-800 mb-8">Student Management</h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 mb-6 bg-white p-6 rounded-lg shadow-md">
          {/* Error Message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Name Field */}
          <div>
            <label className="block text-lg font-medium text-gray-700">
              Name:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </div>

          {/* Mobile Number Field */}
          <div>
            <label className="block text-lg font-medium text-gray-700">
              Mobile Number:
              <input
                type="text"
                name="mobilenumber"
                value={formData.mobilenumber}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </div>

          {/* Address Field */}
          <div>
            <label className="block text-lg font-medium text-gray-700">
              Address:
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            className="w-full py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {editingId ? "Update" : "Add"} Student
          </Button>
        </form>

        {/* Students Table */}
        <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-md">
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Mobile Number</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Address</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr className="hover:bg-gray-100" key={student.id}>
                  <td className="border border-gray-300 px-4 py-2">{student.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{student.mobilenumber}</td>
                  <td className="border border-gray-300 px-4 py-2">{student.address}</td>
                  <td className="px-4 py-2">
                    <button
                      className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                      onClick={() => handleEdit(student)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 ml-2"
                      onClick={() => handleDelete(student.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
