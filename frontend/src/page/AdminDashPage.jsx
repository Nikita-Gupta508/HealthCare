import React from 'react'
import AdminDashboard from '../components/Admin/AdminDashboard'
import { useAdminAuth } from '../hooks/useAdminAuth'
import Loader from '../components/Shared/Loader'
import Navbar from '../components/Shared/Navbar'
import Footer from '../components/Shared/Footer'

function AdminDashPage() {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <>
        <Navbar />
        <Loader />
        <Footer />
      </>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to sign-in
  }

  return (
    <>
  
      <AdminDashboard />

    </>
  )
}

export default AdminDashPage
