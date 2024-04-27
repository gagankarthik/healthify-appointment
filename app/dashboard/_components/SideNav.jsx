"use client"
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button'; 
import { BotMessageSquare, CreditCard, NotebookPen, NotepadText, UserCog } from 'lucide-react';

function SideNav() {
    const menu = [
        { id: 1, name: 'New Appointment', path: '/dashboard/newappointment',icon:<NotebookPen/> },
        { id: 2, name: 'My Appointments', path: '/dashboard/myappointments',icon:<NotepadText/> },
        { id: 3, name: 'My Plan', path: '/dashboard/plan',icon:<CreditCard/> },
        { id: 4, name: 'Contact', path: '/dashboard/contact',icon:<BotMessageSquare/> },
        { id: 5, name: 'My Profile', path: '/dashboard/myprofile',icon:<UserCog/> },
    ];

    return (
        <div className='grid min-h-screen w-full md:grid-cols-[200px_1fr] lg:grid-cols-[250px_1fr]'>
            <div className='hidden border-r bg-muted/40 md:block'>
            <div className="flex h-full max-h-screen flex-col">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 gap-3">
                <img src='/logo.svg' className='w-10 h-10' alt='Healthify Logo'/>
                <span className="font-bold">Healthify</span>
             </div>
                {menu.map((item,index) => (
                    <Link href={item.path} key={index} className='flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary'>
                        <Button className="w-full flex gap-2 justify-start hover:bg-blue-100 p-2" variant="ghost">
                          {item.icon}  {item.name}
                        </Button>
                    </Link>
                ))}
        </div>
    </div>
 
            </div>
       
    );
}

export default SideNav;
