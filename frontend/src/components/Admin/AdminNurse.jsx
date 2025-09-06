import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import profiePic from "../../assets/human6.jpg";
import axios from "axios";
import Swal from "sweetalert2";
import AdminSidebar from "./AdminSidebar";

function AdminNurse() {
  const [nurses, setNurses] = useState([]);

  const [nurname, setNurName] = useState("");
  const [nurdept, setNurDept] = useState("");
  const [nuremail, setNurEmail] = useState("");

  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://healthcare-mvsv.onrender.com/admin/get-department"
        );
        console.log("respone" , response);
        setDepartments(response.data);
      } catch (error) {
        console.log("error",error);
        Swal.fire({
          title: "Error",
          icon: "error",
          text: "Error Fetching Data!",
        });
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const getNurses = async () => {
      const data = await axios
        .get("https://healthcare-mvsv.onrender.com/nurse/get-nurses")
        .then((response) => {
          setNurses(response.data);
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.message,
          });
        });
    };

    getNurses();
  }, []);

  const handleAddNurse = async (e) => {
    e.preventDefault();
     await axios
      .post("https://healthcare-mvsv.onrender.com/nurse/add-nurse", {
        name: nurname,
        email: nuremail,
        department: nurdept,
        
      })
      .then((res) => {
        if (res.data.message ==="Success") {
          Swal.fire({
            title: "Success",
            icon: "success",
            text: "Nurse Added Successfully!",
          });
        }
      })
      .catch((e) => {
        Swal.fire({
          title: "Error",
          icon: "error",
          text: e,
        });
      });
  };

  const [isCreate, setIsCreate] = useState(false);

  const handleCreate = () => {
    setIsCreate(!isCreate);
  };

  const handleGoBack = () => {
    setIsCreate(!isCreate);
  };

  return (
    <section className="bg-slate-300 flex justify-center items-center min-h-screen">
      <div className="h-[85%] w-[85%] bg-white shadow-xl p-2 flex">
        {/* Sidebar */}
        <AdminSidebar userName={"Admin"} profiePic={profiePic} />
  
        {/* Main Content */}
        <div className="w-[70%] ms-24 p-4 flex flex-col justify-start gap-5">
          <p className="font-semibold text-3xl">Nurses</p>
  
          {/* Table */}
          <div className="w-full">
            <div className="relative max-h-[70vh] overflow-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th scope="col" className="px-6 py-3">S No</th>
                    <th scope="col" className="px-6 py-3">Nurse Name</th>
                    <th scope="col" className="px-6 py-3">Ward</th>
                    <th scope="col" className="px-6 py-3">Department</th>
                  </tr>
                </thead>
                <tbody>
                  {nurses && nurses.length > 0 ? (
                    nurses.map((item, index) => (
                      <tr
                        key={item._id}
                        className="text-black border-b hover:bg-gray-50"
                      >
                        <td className="px-6 py-3">{index + 1}</td>
                        <td className="px-6 py-3">{item.name}</td>
                        <td className="px-6 py-3">{item.ward}</td>
                        <td className="px-6 py-3">{item.department.name}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-3 text-center text-gray-600">
                        No nurses found!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
  
          {/* Create Button */}
          <button
            onClick={handleCreate}
            className="bg-slate-900 px-6 py-2 w-fit rounded-full hover:scale-110 duration-200 active:scale-90 text-white"
          >
            Create
          </button>
        </div>
  
        {/* Create Form */}
        {isCreate && (
          <div className="absolute h-[78%] w-[79%] z-50 bg-white shadow-lg rounded-lg">
            <form
              onSubmit={handleAddNurse}
              className="flex flex-col w-full h-full justify-center gap-6 items-center"
            >
              {/* Nurse Name */}
              <div className="flex flex-col w-[40%] items-start gap-1">
                <p className="font-medium">Enter Nurse Name:</p>
                <input
                  onChange={(e) => setNurName(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
                  type="text"
                  placeholder="Nurse Name"
                  required
                />
              </div>
  
              {/* Nurse Email */}
              <div className="flex flex-col w-[40%] items-start gap-1">
                <p className="font-medium">Enter Nurse Email:</p>
                <input
                  onChange={(e) => setNurEmail(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
                  type="email"
                  placeholder="Email"
                  required
                />
              </div>
  
              {/* Department Select */}
              <div className="flex flex-col w-[40%] items-start gap-1">
                <p className="font-medium">Select Nurse Department:</p>
                <select
                  onChange={(e) => setNurDept(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((department) => (
                    <option key={department._id} value={department._id}>
                      {department.name}
                    </option>
                  ))}
                </select>
              </div>
  
              {/* Buttons */}
              <div className="flex gap-4 mt-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-black text-white rounded-full text-md font-medium cursor-pointer hover:scale-110 duration-200 active:scale-90"
                >
                  Add Nurse
                </button>
                <button
                  type="button"
                  onClick={handleGoBack}
                  className="px-6 py-2 bg-gray-600 text-white rounded-full text-md font-medium cursor-pointer hover:scale-105 duration-200 active:scale-90"
                >
                  ← Go back
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
  
}

export default AdminNurse;
