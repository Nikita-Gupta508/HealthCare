import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";

import profiePic from "../../assets/adminimage.jpg";

import Swal from "sweetalert2";
import AdminSidebar from "./AdminSidebar";
import { adminService } from "../../services/adminService";
import { FaUserDoctor, FaUserNurse, FaUserInjured, FaBuilding } from "react-icons/fa6";
import { FaQuestionCircle } from "react-icons/fa";
function AdminDashboard() {
  const [docount, setdocount] = React.useState(0);
  const [nursecount, setnursecount] = React.useState(0);
  const [patientcount, setpatientcount] = React.useState(0);
  const [querieslef, setquerieslef] = React.useState(0);
  const [depts, setDepts] = React.useState(0);
   
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await adminService.getCounts();
        console.log("respone",response)
        setdocount(response.data.doccou);
        setnursecount(response.data.nursecou);
        setpatientcount(response.data.patientcou);
        setquerieslef(response.data.queriescou);
        setDepts(response.data.deptcou);
      } catch (err) {
        console.error("Error fetching admin data:", err);
        Swal.fire({
          title: "Error",
          icon: "error",
          text: "Error Fetching Data! Please check your connection.",
        });
      }
    };
    fetchInfo();
  }, []);


  return (
    <section className="bg-slate-300 flex justify-center items-center min-h-screen">
      <div className="h-[85%] w-[85%] bg-white shadow-xl p-6 flex">
        <AdminSidebar userName={"Admin"} profiePic={profiePic} />
  
        {/* Dashboard Content */}
        <div className="w-[70%] ms-24 p-6 flex flex-col gap-8">
          <p className="font-semibold text-4xl text-center">Dashboard</p>
  
          {/* Grid Layout for Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
            {/* Doctors */}
            <div className="flex flex-col items-center justify-center w-52 h-40 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300">
              <FaUserDoctor size={40} className="mb-3" />
              <span className="font-semibold text-lg">Doctors</span>
              <span className="text-2xl">{docount}</span>
            </div>
  
            {/* Nurses */}
            <div className="flex flex-col items-center justify-center w-52 h-40 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300">
              <FaUserNurse size={40} className="mb-3" />
              <span className="font-semibold text-lg">Nurses</span>
              <span className="text-2xl">{nursecount}</span>
            </div>
  
            {/* Patients */}
            <div className="flex flex-col items-center justify-center w-52 h-40 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300">
              <FaUserInjured size={40} className="mb-3" />
              <span className="font-semibold text-lg">Patients</span>
              <span className="text-2xl">{patientcount}</span>
            </div>
  
            {/* Queries */}
            <div className="flex flex-col items-center justify-center w-52 h-40 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300">
              <FaQuestionCircle size={40} className="mb-3" />
              <span className="font-semibold text-lg">Queries</span>
              <span className="text-2xl">{querieslef}</span>
            </div>
  
            {/* Departments */}
            <div className="flex flex-col items-center justify-center w-52 h-40 bg-gradient-to-r from-yellow-500 to-yellow-700 text-white rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300">
              <FaBuilding size={40} className="mb-3" />
              <span className="font-semibold text-lg">Departments</span>
              <span className="text-2xl">{depts}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
  
}

export default AdminDashboard;
