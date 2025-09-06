import React from 'react'
import AdminDashboard from '../components/Admin/AdminDashboard'
import { useAdminAuth } from '../hooks/useAdminAuth'
import Loader from '../components/Shared/Loader'

function AdminDashPage() {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return null; // Will redirect to sign-in
  }

  return (
    <AdminDashboard/>
  )
}

export default AdminDashPage