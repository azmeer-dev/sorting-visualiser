//import necessary modules
import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'

export default function Layout() {
  return (
    // outer container exactly 100vh; navbar is fixed so add top padding to reserve its space
    <div className="flex flex-col relative h-screen bg-[snow]">
      <Navbar />
      <div className="flex-1 pt-24 pb-3 pr-3 pl-3 h-full">

        <Outlet />

      </div>
    </div>
  )
}
