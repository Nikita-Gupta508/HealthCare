import React, { useState, useEffect } from "react";
import { adminService } from "../../services/adminService";
import Swal from "sweetalert2";
import AdminSidebar from "./AdminSidebar";
import { FaBuilding, FaPlus, FaTrash, FaEdit } from "react-icons/fa";

const AdminDepartment = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    head: "",
    staff: []
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await adminService.getDepartments();
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "Error fetching departments! Please check your connection.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "Department name is required!",
      });
      return;
    }

    try {
      // Prepare data for submission, only include head if it's not empty
      const submitData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        staff: formData.staff
      };

      // Only add head field if it's not empty
      if (formData.head.trim()) {
        submitData.head = formData.head.trim();
      }

      await adminService.addDepartment(submitData);
      Swal.fire({
        title: "Success",
        icon: "success",
        text: "Department added successfully!",
      });
      setFormData({ name: "", description: "", head: "", staff: [] });
      setShowAddForm(false);
      fetchDepartments();
    } catch (error) {
      console.error("Error adding department:", error);
      Swal.fire({
        title: "Error",
        icon: "error",
        text: error.response?.data?.error || "Error adding department!",
      });
    }
  };

  const handleDelete = async (departmentId, departmentName) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You want to delete department "${departmentName}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await adminService.deleteDepartment(departmentId);
        Swal.fire({
          title: "Deleted!",
          icon: "success",
          text: "Department has been deleted.",
        });
        fetchDepartments();
      } catch (error) {
        console.error("Error deleting department:", error);
        Swal.fire({
          title: "Error",
          icon: "error",
          text: "Error deleting department!",
        });
      }
    }
  };

  return (
    <section className="bg-slate-300 flex justify-center items-center min-h-screen">
      <div className="h-[85%] w-[85%] bg-white shadow-xl p-6 flex">
        <AdminSidebar userName={"Admin"} />
        
        {/* Department Management Content */}
        <div className="w-[70%] ms-24 p-6 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h1 className="font-semibold text-4xl flex items-center gap-3">
              <FaBuilding className="text-blue-600" />
              Department Management
            </h1>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
            >
              <FaPlus />
              {showAddForm ? "Cancel" : "Add Department"}
            </button>
          </div>

          {/* Add Department Form */}
          {showAddForm && (
            <div className="bg-gray-50 p-6 rounded-lg border">
              <h2 className="text-xl font-semibold mb-4">Add New Department</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter department name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department Head ID
                    </label>
                    <input
                      type="text"
                      name="head"
                      value={formData.head}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter doctor ID (optional)"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter department description"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Add Department
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Departments List */}
          <div className="bg-white rounded-lg border">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Departments ({departments.length})</h2>
            </div>
            
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading departments...</p>
              </div>
            ) : departments.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <FaBuilding className="mx-auto text-4xl mb-4 text-gray-300" />
                <p>No departments found. Add your first department!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Head
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Staff Count
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {departments.map((dept) => (
                      <tr key={dept._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {dept.name}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {dept.description || "No description"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {dept.head?.name || "Not assigned"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {dept.staff?.length || 0}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDelete(dept._id, dept.name)}
                            className="text-red-600 hover:text-red-900 p-2 rounded-md hover:bg-red-50 transition-colors"
                            title="Delete Department"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminDepartment;
