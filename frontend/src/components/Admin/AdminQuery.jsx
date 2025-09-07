import React,{useState,useEffect} from "react";
import { NavLink } from "react-router-dom";
import profiePic from "../../assets/human6.jpg";
import axios from "axios";
import Swal from "sweetalert2";
import AdminSidebar from "./AdminSidebar";
import Loader from "../Shared/Loader";
import { adminService } from "../../services/adminService";

function AdminQuery() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await adminService.getContacts();
        setContacts(response.data);
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

  if (!contacts) {
    return <Loader />;
  }

  const deletePatient = async (contactId) => {
    try {
      await adminService.deleteContact(contactId);
      setContacts(contacts.filter(contact => contact._id !== contactId));
      Swal.fire({
        title: "Success",
        icon: "success",
        text: "Contact deleted successfully!",
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "Error deleting contact!",
      });
    }
  };

  return (
    <section className="bg-slate-300 flex justify-center items-center min-h-screen">
      <div className="h-[85%] w-[85%] bg-white shadow-xl p-2 flex">
        {/* Sidebar */}
        <AdminSidebar userName={"Admin"} profiePic={profiePic} />
  
        {/* Main Content */}
        <div className="w-[70%] ms-24 p-4 flex flex-col justify-start gap-5">
          <p className="font-semibold text-3xl">Patient Contacts</p>
  
          <div className="w-full">
            <div className="relative max-h-[70vh] overflow-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th scope="col" className="px-6 py-3">#</th>
                    <th scope="col" className="px-6 py-3">Patient Name</th>
                    <th scope="col" className="px-6 py-3">Patient Email</th>
                    <th scope="col" className="px-6 py-3">Message</th>
                    <th scope="col" className="px-6 py-3">Phone No</th>
                    <th scope="col" className="px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts && contacts.length > 0 ? (
                    contacts.map((item, index) => (
                      <tr key={item._id} className="text-black border-b hover:bg-gray-50">
                        <td className="px-6 py-3">{index + 1}</td>
                        <td className="px-6 py-3">{item.name}</td>
                        <td className="px-6 py-3">{item.email}</td>
                        <td className="px-6 py-3">{item.message}</td>
                        <td className="px-6 py-3">{item.phone}</td>
                        <td className="px-6 py-3">
                          <button
                            onClick={() => deletePatient(item._id)}
                            className="bg-red-600 text-white px-4 py-1 rounded-full hover:bg-red-700 active:scale-95 duration-200"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-3 text-center text-gray-600">
                        No patient contacts available!
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

export default AdminQuery;
