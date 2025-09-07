import React from 'react'
import NurseProfile from '../components/Profile/nurse/NurseProfile'
import Navbar from '../components/Shared/Navbar'
import Footer from '../components/Shared/Footer'

function NurseProfilePage() {
  return (
    <>
      <Navbar />
      <NurseProfile />
      <Footer />
    </>
  )
}

export default NurseProfilePage