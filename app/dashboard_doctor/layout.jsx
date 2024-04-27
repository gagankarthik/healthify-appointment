import React from 'react'
import Navbar from './_components/Navbar'

function DashboardLayout({children}) {
  return (
    <div>
        <div className='w-64 bg-slate-100 h-screen fixed'>
            <Navbar />
            </div>
            <div className='ml-64'> 
           <main> {children}</main>
          
            </div>
        </div>
  )
}

export default DashboardLayout