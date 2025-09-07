import React from 'react'
import UserProfile from '../components/Profile/UserProfile'
import Navbar from '../components/Shared/Navbar'
import Footer from '../components/Shared/Footer'

function UserProfilePage() {
  return (
    <>
      <Navbar />
      <UserProfile />
      <Footer />
    </>
  )
}

export default UserProfilePage