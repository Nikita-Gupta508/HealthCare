import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import profiePic from "../../../assets/doct2.jpg";
import axios from "axios";
import Swal from "sweetalert2";
import DoctorSidebar from "./DoctorSidebar";
import { useSelector } from "react-redux";
import { FaCalendarCheck, FaCheckCircle, FaClock, FaTimesCircle, FaEye } from "react-icons/fa";

function DoctorAppointmen() {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [appointmentNotes, setAppointmentNotes] = useState("");
  const [newSchedule, setNewSchedule] = useState({
    date: "",
    time: "",
    notes: ""
  });

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://healthcare-mvsv.onrender.com/appointment/get-appointment/${currentUser._id}`
        );
        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchData();
  }, [currentUser._id]);

  const updateAppointmentStatus = async (appointmentId, status, notes = "") => {
    try {
      await axios.put(`https://healthcare-mvsv.onrender.com/appointment/update-appointment/${appointmentId}`, {
        status,
        notes
      });
      
      // Update local state
      setAppointments(prev => 
        prev.map(apt => 
          apt._id === appointmentId 
            ? { ...apt, status, notes: notes || apt.notes }
            : apt
        )
      );
      
      Swal.fire({
        title: "Success",
        icon: "success",
        text: `Appointment ${status} successfully!`,
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "Failed to update appointment status!",
      });
    }
  };

  const rescheduleAppointment = async (appointmentId) => {
    if (!newSchedule.date || !newSchedule.time) {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "Please select both date and time!",
      });
      return;
    }

    try {
      await axios.put(`https://healthcare-mvsv.onrender.com/appointment/reschedule-appointment/${appointmentId}`, {
        appointmentDate: newSchedule.date,
        time: newSchedule.time,
        notes: newSchedule.notes,
        status: "Rescheduled"
      });
      
      // Update local state
      setAppointments(prev => 
        prev.map(apt => 
          apt._id === appointmentId 
            ? { 
                ...apt, 
                appointmentDate: newSchedule.date,
                time: newSchedule.time,
                notes: newSchedule.notes,
                status: "Rescheduled"
              }
            : apt
        )
      );
      
      setShowModal(false);
      setNewSchedule({ date: "", time: "", notes: "" });
      
      Swal.fire({
        title: "Success",
        icon: "success",
        text: "Appointment rescheduled successfully!",
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "Failed to reschedule appointment!",
      });
    }
  };

  const openModal = (appointment) => {
    setSelectedAppointment(appointment);
    setAppointmentNotes(appointment.notes || "");
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      case "Rescheduled":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // return (
  //   <section className="bg-slate-300 flex justify-center items-center">
  //     <div className="h-[80%] w-[80%] bg-white shadow-xl p-2 flex">
  //       <DoctorSidebar userName={currentUser.name} profiePic={profiePic} />
  //       <div className=" w-[70%] ms-24 p-4 flex flex-col justify-start gap-5 ">
  //         <p className="font-semibold text-3xl">Appointments</p>
  //         <div className="w-full">
  //           <div className="relative overflow-auto shadow-md sm:rounded-lg">
  //             <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
  //               <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
  //                 <tr>
  //                   <th scope="col" className="px-6 py-3">
  //                     #
  //                   </th>
  //                   <th scope="col" className="px-6 py-3">
  //                     Patient Name
  //                   </th>
  //                   <th scope="col" className="px-6 py-3">
  //                     Appointment Date
  //                   </th>
  //                   <th scope="col" className="px-6 py-3">
  //                     Appointment Time
  //                   </th>
  //                   <th scope="col" className="px-6 py-3">
  //                     Status
  //                   </th>
  //                 </tr>
  //               </thead>
  //               <tbody className=" overflow-y-scroll">
  //                 {appointments &&
  //                 Array.isArray(appointments) &&
  //                 appointments.length > 0 ? (
  //                   appointments.map((item, index) => (
  //                     <tr key={item._id} className="text-black">
  //                       <td scope="col" className="px-6 py-3">
  //                         {index + 1}
  //                       </td>
  //                       <td scope="col" className="px-6 py-3">
  //                         {item.patient}
  //                       </td>
  //                       <td scope="col" className="px-6 py-3">
  //                         {item.appointmentDate}
  //                       </td>
  //                       <td scope="col" className="px-6 py-3">
  //                         {item.time}
  //                       </td>
  //                       <td scope="col" className="px-6 py-3">
  //                         {item.status}
  //                       </td>
  //                     </tr>
  //                   ))
  //                 ) : (
  //                   <tr>
  //                     <td className="px-6 py-3" colSpan="5">
  //                       <p>Sorry, You have No appointments !!</p>
  //                     </td>
  //                   </tr>
  //                 )}
  //               </tbody>
  //             </table>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </section>
  // );
  return (
    <section className="bg-slate-300 flex justify-center items-center">
      <div className="h-[80%] w-[80%] bg-white shadow-xl p-2 flex">
        <DoctorSidebar userName={currentUser.name} profiePic={profiePic} />
        <div className="w-[70%] ms-24 p-4 flex flex-col justify-start gap-5">
          <p className="font-semibold text-3xl">Appointments</p>
          <div className="w-full">
            <div className="relative shadow-md sm:rounded-lg max-h-[450px] overflow-y-auto">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0 z-10">
                  <tr>
                    <th scope="col" className="px-6 py-3">#</th>
                    <th scope="col" className="px-6 py-3">Patient Name</th>
                    <th scope="col" className="px-6 py-3">Appointment Date</th>
                    <th scope="col" className="px-6 py-3">Appointment Time</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                    <th scope="col" className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {appointments && Array.isArray(appointments) && appointments.length > 0 ? (
                    appointments.map((item, index) => (
                      <tr key={item._id} className="text-black hover:bg-gray-50">
                        <td className="px-6 py-3">{index + 1}</td>
                        <td className="px-6 py-3 font-medium">{item.patient}</td>
                        <td className="px-6 py-3">{item.appointmentDate}</td>
                        <td className="px-6 py-3">{item.time}</td>
                        <td className="px-6 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => openModal(item)}
                              className="text-blue-600 hover:text-blue-800 p-1"
                              title="View Details"
                            >
                              <FaEye />
                            </button>
                            
                            {item.status === "Scheduled" && (
                              <>
                                <button
                                  onClick={() => updateAppointmentStatus(item._id, "Completed", appointmentNotes)}
                                  className="text-green-600 hover:text-green-800 p-1"
                                  title="Mark as Completed"
                                >
                                  <FaCheckCircle />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedAppointment(item);
                                    setNewSchedule({
                                      date: item.appointmentDate,
                                      time: item.time,
                                      notes: item.notes || ""
                                    });
                                    setShowModal(true);
                                  }}
                                  className="text-yellow-600 hover:text-yellow-800 p-1"
                                  title="Reschedule"
                                >
                                  <FaCalendarCheck />
                                </button>
                                <button
                                  onClick={() => updateAppointmentStatus(item._id, "Cancelled")}
                                  className="text-red-600 hover:text-red-800 p-1"
                                  title="Cancel"
                                >
                                  <FaTimesCircle />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-6 py-3 text-center" colSpan="6">
                        <p>Sorry, You have No appointments !!</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Details Modal */}
      {showModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold mb-4">Appointment Details</h3>
            
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Patient Name</label>
                <p className="text-gray-900">{selectedAppointment.patient}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Date & Time</label>
                <p className="text-gray-900">{selectedAppointment.appointmentDate} at {selectedAppointment.time}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedAppointment.status)}`}>
                  {selectedAppointment.status}
                </span>
              </div>
            </div>

            {/* Reschedule Form */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium">Reschedule Appointment</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Date</label>
                <input
                  type="date"
                  value={newSchedule.date}
                  onChange={(e) => setNewSchedule({...newSchedule, date: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Time</label>
                <input
                  type="time"
                  value={newSchedule.time}
                  onChange={(e) => setNewSchedule({...newSchedule, time: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={newSchedule.notes}
                  onChange={(e) => setNewSchedule({...newSchedule, notes: e.target.value})}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add notes about the appointment..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedAppointment(null);
                  setNewSchedule({ date: "", time: "", notes: "" });
                }}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => rescheduleAppointment(selectedAppointment._id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
  

}

export default DoctorAppointmen;
