import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function Header()  {
    const Menu=[
        {
            id:1,
            name:"Home",
            path:'/'
        },
        {
            id:2,
            name:"Explore",
            path:'/about'
        },
        {
            id:3,
            name:"Contact",
            path:'/contact'
        }

    ]
  return (
    <div className='flex items-center justify-between p-4 shadow-sm'>
        <div className='flex items-center gap-10'>
        <Image src='/logo.svg' alt='Logo' 
            width={50} height={50} 
         />

         <ul className='md:flex gap-8 hidden'>
            {Menu.map((item,index) =>(
                <Link href={item.path}>
                <li className='hover:text-primary cursor-pointer
                 hover:scale-105 transition-all ease-in-out' key={index}>{item.name}</li>
                 </Link>
            ))}

         </ul>
         </div>
        <Link href='/login'>
         <Button>Login</Button>
         </Link>

    </div>
  )
}

export default Header