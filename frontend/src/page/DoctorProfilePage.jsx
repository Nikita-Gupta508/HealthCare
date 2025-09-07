import React from 'react'
import DoctorProfile from '../components/Profile/doctor/DoctorProfile'
import Navbar from '../components/Shared/Navbar'
import Footer from '../components/Shared/Footer'

function DoctorProfilePage() {
  return (
    <>
      <Navbar />
      <DoctorProfile />
      <Footer />
    </>
  )
}

export default DoctorProfilePage