import React from 'react'
import SideNav from './_components/SideNav'

function DashboardLayout({children}) {
  return (
    <div>
        <div className='fixed'>
            <SideNav />
            </div>
            <div className='p-4 ml-64'> 
           <main> {children}</main>
          
            </div>
        </div>
  )
}

export default DashboardLayout