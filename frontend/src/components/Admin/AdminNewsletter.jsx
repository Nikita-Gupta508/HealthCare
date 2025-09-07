import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import profiePic from "../../assets/human6.jpg";
import axios from "axios";
import Swal from "sweetalert2";
import AdminSidebar from "./AdminSidebar";
import { adminService } from "../../services/adminService";

function AdminNewsletter() {

  const [subscribers, setSubscribers] = useState([]);

  const fetchSentMessages = async () => {
    try {
<<<<<<< HEAD
      const response = await adminService.getNewsletters();
      setSubscribers(response.data);
=======
      await axios.get(
        "https://healthcare-mvsv.onrender.com/admin/get-sent-newsletter"
      )
      .then((res) =>{
        setSubscribers(res.data);
      })
      
>>>>>>> 3d1fcc592930a5840510f06ae4b15e44039d57a3
    } catch (err) {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "Error Fetching Data!",
      });
    }
  };

  useEffect(() => {
    fetchSentMessages();
  }, []);


  return (
    <section className="bg-slate-300 flex justify-center items-center min-h-screen">
      <div className="h-[85%] w-[85%] bg-white shadow-xl p-2 flex">
        {/* Sidebar */}
        <AdminSidebar userName={"Admin"} profiePic={profiePic} />
  
        {/* Main Content */}
        <div className="w-[70%] ms-24 p-4 flex flex-col justify-start gap-5">
          <p className="font-semibold text-3xl">Subscribers</p>
  
          <div className="w-full">
            <div className="relative max-h-[70vh] overflow-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th scope="col" className="px-6 py-3">#</th>
                    <th scope="col" className="px-6 py-3">Subscriber's Email</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers && subscribers.length > 0 ? (
                    subscribers.map((email, index) => (
                      <tr
                        key={index}
                        className="text-black border-b hover:bg-gray-50"
                      >
                        <td className="px-6 py-3">{index + 1}</td>
                        <td className="px-6 py-3">{email.email}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="2"
                        className="px-6 py-3 text-center text-gray-600"
                      >
                        No subscribers found!
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

export default AdminNewsletter;
