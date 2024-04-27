"use client"
import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import auth from '@/config'
import { MailCheckIcon } from 'lucide-react';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Check your email to reset your password');
            setIsVisible(true);
            setTimeout(() => {
                window.location.href = "/login";
            }, 3000);
        } catch (error) {
            setMessage('Error: ' + error.message);
            setIsVisible(true);
        }
    };

    return (
        <div className='flex flex-col justify-center items-center'>
        <div role="alert" className={`rounded-xl border border-gray-100 bg-white p-4 mt-4 shadow-md ${isVisible ? 'block' : 'hidden'}`}>
            <div className="flex items-start gap-4">
                <MailCheckIcon />
                <div className="flex-1">
                    <p className="mt-1 text-sm text-gray-700">{message}</p>
                </div>
            </div>
        </div>

        <div className='flex flex-col justify-center items-center mt-10'>
            <h1 className='font-bold text-xl'>Forgot Password</h1>
            <div className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
                <div className="max-w-xl lg:max-w-3xl">
                    <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-6 gap-6">
                        <div className="col-span-6">
                            <label htmlFor="Email" className="block text-sm font-medium text-gray-700">Email</label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email address"
                                required
                            />
                        </div>
                        <div className="col-span-6 flex justify-center">
                            <Button type="submit">Reset Password</Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    
    );

}

export default ForgotPassword