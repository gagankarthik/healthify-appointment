"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, collection, getFirestore } from "firebase/firestore"; 
import { app } from '@/config';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input} from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
  

function UserInfo() {
    const auth = getAuth(app);
    const db = getFirestore(app);
    const router = useRouter();
    const [userEmail, setUserEmail] = useState('');
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [address, setAddress] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [contact, setContact] = useState('');
    const [planType, setPlanType] = useState('basic'); // 'basic' or 'pro'
    const [planDuration, setPlanDuration] = useState('monthly'); // 'monthly' or 'yearly'
    const [planStartDate, setPlanStartDate] = useState(new Date().toISOString().slice(0, 10)); // Today's date in YYYY-MM-DD format

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserEmail(user.email);
            } else {
                router.push('./newaccount');
            }
        });
        return () => unsubscribe();
    }, [auth, router]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const planEndDate = new Date(planStartDate);
        const planPrice = planDuration === 'monthly' ? 6 : 80;
        planEndDate.setFullYear(planEndDate.getFullYear() + (planDuration === 'yearly' ? 1 : 0));
        planEndDate.setMonth(planEndDate.getMonth() + (planDuration === 'monthly' ? 1 : 0));

        try {
            const userRef = doc(collection(db, 'users'), auth.currentUser.uid);
            await setDoc(userRef, {
                email: userEmail,
                lastName,
                firstName,
                address,
                zipcode,
                contact,
                planType,
                planDuration,
                planPrice,
                planStartDate,
                planEndDate: planEndDate.toISOString().slice(0, 10), // YYYY-MM-DD format
            }, { merge: true });
            alert('Profile updated successfully!');
            router.push('../dashboard/newappointment');
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    };

    return (
        <>
            <Card className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] gap-2 border bg-background p-4 shadow-lg duration-200">
                <CardHeader>
                    <CardTitle>Create Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid w-full items-center gap-4">
                            <div className='flex justify-between'>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="lastname">Last Name</Label>
                                    <Input id="lastname" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="firstname">First Name</Label>
                                    <Input id="firstname" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                                </div>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="address">Home Address</Label>
                                <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="zipcode">Zipcode</Label>
                                <Input id="zipcode" value={zipcode} onChange={(e) => setZipcode(e.target.value)} required />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="contact">Contact</Label>
                                <Input id="contact" value={contact} onChange={(e) => setContact(e.target.value)} required />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="planType">Plan Type</Label>
                                <select id="planType" value={planType} onChange={(e) => setPlanType(e.target.value)}>
                                    <option value="basic">Basic - $6/month or $80/year</option>
                                    <option value="pro">Pro - $6/month or $80/year</option>
                                </select>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="planDuration">Plan Duration</Label>
                                <select id="planDuration" value={planDuration} onChange={(e) => setPlanDuration(e.target.value)}>
                                    <option value="monthly">Monthly</option>
                                    <option value="yearly">Yearly</option>
                                </select>
                            </div>
                        </div>
                        <Button type="submit" className="mt-5 flex justify-center items-center">Create</Button>
                    </form>
                </CardContent>
            </Card>
        </>
    )
}

export default UserInfo;
