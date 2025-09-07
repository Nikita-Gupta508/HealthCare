import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import profiePic from "../../assets/human6.jpg";
import axios from "axios";
import Swal from "sweetalert2";
import AdminSidebar from "./AdminSidebar";
import Loader from "../Shared/Loader";
import { adminService } from "../../services/adminService";

function AdminPatient() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const response = await adminService.getUsers();

        // const response = await axios.get(
        //   "https://healthcare-mvsv.onrender.com/admin/get-users"
        // );

        setUsers(response.data);
      } catch (error) {
        Swal.fire({
          title: "Error",
          icon: "error",
          text: "Error Fetching Data!",
        });
      }
    };

    fetchData();
  }, []);

  if (!users) {
    return <Loader />;
  }


  return (
    <section className="bg-slate-300 flex justify-center items-center min-h-screen">
      <div className="h-[85%] w-[85%] bg-white shadow-xl p-2 flex">
        {/* Sidebar */}
        <AdminSidebar userName={"Admin"} profiePic={profiePic} />
  
        {/* Main Content */}
        <div className="w-[70%] ms-24 p-4 flex flex-col justify-start gap-5">
          <p className="font-semibold text-3xl">Patients</p>
  
          {/* Table */}
          <div className="w-full">
            <div className="relative max-h-[70vh] overflow-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                  <tr>
                    <th scope="col" className="px-6 py-3">#</th>
                    <th scope="col" className="px-6 py-3">Patient Name</th>
                    <th scope="col" className="px-6 py-3">Patient Email</th>
                    <th scope="col" className="px-6 py-3">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users && users.length > 0 ? (
                    users.map((item, index) => (
                      <tr key={item._id} className="text-black border-b">
                        <td className="px-6 py-3">{index + 1}</td>
                        <td className="px-6 py-3">{item.userName}</td>
                        <td className="px-6 py-3">{item.email}</td>
                        <td className="px-6 py-3">{item.role}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-3 text-center text-gray-600"
                      >
                        No patients available!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
  
}

export default AdminPatient;
