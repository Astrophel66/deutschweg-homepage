import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import { Toaster } from 'react-hot-toast'

export default function DashboardLayout({ children }) {
  // Remember collapse state in localStorage
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem('sidebar-collapsed') === 'true'
  })
  const [mobileOpen, setMobileOpen] = useState(false)

  // Save collapse state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', collapsed)
  }, [collapsed])

  return (
    <div className="flex h-screen bg-[var(--cream)] overflow-hidden">

      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <TopBar setMobileOpen={setMobileOpen} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>

      </div>

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1C1C1E',
            color: '#fff',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: '500',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  )
}