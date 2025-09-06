import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import profiePic from "../../assets/human6.jpg";
import axios from "axios";
import Swal from "sweetalert2";
import Loader from "../Shared/Loader";
import AdminSidebar from "./AdminSidebar";

function AdminDoctor() {
  const [doctors, setDoctors] = useState([]);
  const userString = localStorage.getItem("user");

  const [docname, setDocName] = useState("");
  const [docspec, setDocSpecialization] = useState("");
  const [docemail, setDocEmail] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://healthcare-mvsv.onrender.com/doctor/get-doctors"
        );
        setDoctors(response.data);
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

  if (!doctors) {
    return <Loader />;
  }

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    await axios.post("https://healthcare-mvsv.onrender.com/doctor/add-doctor",{
        name:docname,
        specialization:docspec,
        email:docemail
      }).then((res)=>{
        if(res.data.message === "Success"){
          Swal.fire({
            title: "Success",
            icon: "success",
            text: "Doctor Added Successfully!",
          });
        }

      }).catch((e)=>{
        Swal.fire({
          title: "Error",
          icon: "error",
          text: "Error Adding Doctor!",
        });
      })
    fetchData();
  };

  const [isCreate, setIsCreate] = useState(false);

  const editPatient = async (id) => {
    await axios
      .put(`https://healthcare-mvsv.onrender.com/doctor/update-doctor/${id}`, {})
      .then((res) => {
        Swal.fire({
          title: "Success",
          icon: "success",
          text: "Doctor Updated Successfully!",
        });
      })
      .catch((err) => {
        Swal.fire({
          title: "Error",
          icon: "warning",
          text: "Could not update Doctor!",
        });
      });
  };

  const deletePatient = async (id) => {
    await axios
      .delete(`https://healthcare-mvsv.onrender.com/doctor/delete-doctor/${id}`,)
      .then((res) => {
        Swal.fire({
          title: "Success",
          icon: "success",
          text: "Patient Deleted Successfully!",
        });
      })
      .catch((err) => {
        Swal.fire({
          title: "Error",
          icon: "error",
          text: "Error Deleting Patient!",
        });
      });
  };

  const handleCreate = () => {
    setIsCreate(!isCreate);
  };

  const handleGoBack = () => {
    setIsCreate(!isCreate);
  };

  return (
    <section className="bg-slate-300 flex justify-center items-center min-h-screen">
      <div className="h-[85%] w-[85%] bg-white shadow-xl p-2 flex relative">
        {/* Sidebar */}
        <AdminSidebar userName={"Admin"} profiePic={profiePic} />
  
        {/* Main Content */}
        <div className="w-[70%] ms-24 p-4 flex flex-col justify-start gap-5">
          <p className="font-semibold text-3xl">Doctors</p>
  
          {/* Table */}
          <div className="w-full">
            <div className="relative max-h-[70vh] overflow-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                  <tr>
                    <th scope="col" className="px-6 py-3">#</th>
                    <th scope="col" className="px-6 py-3">Doctor Name</th>
                    <th scope="col" className="px-6 py-3">Doctor Email</th>
                    <th scope="col" className="px-6 py-3">Department</th>
                    <th scope="col" className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors && doctors.length > 0 ? (
                    doctors.map((item, index) => (
                      <tr key={item._id} className="text-black border-b">
                        <td className="px-6 py-3">{index + 1}</td>
                        <td className="px-6 py-3">{item.name}</td>
                        <td className="px-6 py-3">{item.email}</td>
                        <td className="px-6 py-3">{item.specialization}</td>
                        <td className="px-6 py-3">
                          <button
                            onClick={() => deletePatient(item._id)}
                            className="bg-red-600 text-white px-4 py-1 rounded-full hover:bg-red-700 hover:scale-105 duration-200 active:scale-90"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-3 text-center text-gray-600">
                        No doctors available!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
  
          {/* Create Doctor Button */}
          <button
            onClick={handleCreate}
            className="bg-slate-900 p-2 w-[10rem] rounded-full hover:scale-110 duration-200 active:scale-90 text-white"
          >
            + Create Doctor
          </button>
        </div>
  
        {/* Create Doctor Form Modal */}
        {isCreate && (
          <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-40 z-50">
            <div className="h-[80%] w-[60%] bg-white rounded-lg shadow-xl p-6 flex flex-col justify-center gap-4">
              <form className="flex flex-col w-full h-full justify-center gap-6 items-center">
                <div className="flex flex-col w-[80%]">
                  <label className="font-medium mb-1">Doctor Name</label>
                  <input
                    onChange={(e) => setDocName(e.target.value)}
                    className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                    type="text"
                    placeholder="Enter Doctor Name"
                  />
                </div>
  
                <div className="flex flex-col w-[80%]">
                  <label className="font-medium mb-1">Doctor Email</label>
                  <input
                    onChange={(e) => setDocEmail(e.target.value)}
                    className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                    type="email"
                    placeholder="Enter Email"
                  />
                </div>
  
                <div className="flex flex-col w-[80%]">
                  <label className="font-medium mb-1">Specialization</label>
                  <input
                    onChange={(e) => setDocSpecialization(e.target.value)}
                    className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                    type="text"
                    placeholder="Enter Specialization"
                  />
                </div>
  
                <div className="flex gap-4 w-[80%] justify-center">
                  <button
                    type="button"
                    onClick={handleAddDoctor}
                    className="flex-1 bg-black text-white rounded-full text-md font-medium p-2 hover:scale-110 duration-200 active:scale-90"
                  >
                    Add Doctor
                  </button>
                  <button
                    type="button"
                    onClick={handleGoBack}
                    className="flex-1 bg-gray-500 text-white rounded-full text-md font-medium p-2 hover:scale-105 duration-200 active:scale-90"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
  
}

export default AdminDoctor;
