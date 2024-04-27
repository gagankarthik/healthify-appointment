"use client"
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button'; 
import { useRouter } from 'next/navigation';
import { getAuth } from 'firebase/auth';
import { app } from '@/config'; 

function Navbar() {
    const auth = getAuth(app);
   

    const menu = [
        { id: 1, name: 'My Appointments', path: '/dashboard_doctor/drappointment' },
        { id: 2, name: 'My Profile', path: '/dashboard_doctor/myprofile' },
    ];

    return (
        <div className='mt-10 flex flex-col gap-5'>
            <div className='flex text-bold text-3xl gap-3 justify-center'>
                <img src='/logo.svg' className='w-10 h-10' alt='Healthify Logo'/>
                <h2>Healthify</h2>
            </div>
            <div className='flex flex-col gap-5 mt-10 p-3'>
                {menu.map((item,index) => (
                    <Link href={item.path} key={index}>
                        <Button className="w-full flex gap-2 justify-start hover:bg-blue-100 p-2" variant="ghost">
                            {item.name}
                        </Button>
                    </Link>
                ))}
            </div>
            
        </div>
    );
}

export default Navbar;
