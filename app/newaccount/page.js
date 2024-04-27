"use client"
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Input } from '@/components/ui/input';
import { auth } from '@/config';
import { useRouter } from 'next/navigation';


function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); 
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log(userCredential.user);
      router.push("./newaccount/userinfo");
     
    } catch (error) {
      console.log("Error code:", error.code);
      console.log("Error message:", error.message);
    }
  };
  
  return (
    <main className='flex flex-col justify-center items-center min-h-screen overflow-hidden mx-auto'>
      <h2 className='font-bold text-xl mt-5'>Create new account</h2>
      <div className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
        <div className="max-w-xl lg:max-w-3xl">
          <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-6 gap-6">
            <div className="col-span-6">
              <label htmlFor="Email" className="block text-sm font-medium text-gray-700">Email</label>
              <Input
                type="email"
                id="Email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
              />
            </div>
            <div className="col-span-6">
              <label htmlFor="Password" className="block text-sm font-medium text-gray-700">Password</label>
              <Input
                type="password"
                id="Password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
              />
            </div>
            <div className="col-span-6">
              <p className="text-sm text-gray-500">
                By creating an account, you agree to our <br />
                <a href="#" className="text-gray-700 underline">terms and conditions</a>
                and
                <a href="#" className="text-gray-700 underline">privacy policy</a>.
              </p>
            </div>
            <div className="col-span-6 sm:flex sm:items-center sm:gap-4 justify-center items-center">
              <button
                type="submit"
                className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
              >
                Create an account
              </button>
            </div>
            <div className='col-span-6 sm:flex sm:items-center sm:gap-4 justify-center'>
              <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                Already have an account?
                <a href="/login" className="text-gray-700 underline"> Log in</a>.
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Signup;
