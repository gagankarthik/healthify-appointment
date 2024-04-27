"use client"
import React, { useState } from 'react';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { app } from '@/config';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { Input } from "@/components/ui/input"
  import { Button } from "@/components/ui/button"
  
function Payment({ details, onPaymentSuccess, onClose }) {
    const db = getFirestore(app);
    const [cardNumber, setCardNumber] = useState('');
    const [expMonth, setExpMonth] = useState('');
    const [expYear, setExpYear] = useState('');
    const [cvv, setCvv] = useState('');

    const handlePaymentSubmission = async () => {
        const paymentData = {
            cardNumber,
            expMonth,
            expYear,
            cvv,
            // Add any other relevant appointment details
        };

        try {
            await addDoc(collection(db, "payments"), paymentData);
            onPaymentSuccess(details); 
        } catch (error) {
            console.error("Error processing payment: ", error);
            alert("Failed to process payment.");
        }

        onClose();  // Close the modal
    };

    return (
        <Card className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] gap-2 border bg-background p-6 shadow-lg duration-200">
            <CardHeader>
                <CardTitle>Payment</CardTitle>
                <CardDescription>Add card details</CardDescription>
            </CardHeader>
            <CardContent>
                <div>
                    <p>Card Number</p>
                    <Input value={cardNumber} onChange={e => setCardNumber(e.target.value)} />
                </div>
                <div className='flex flex-row justify-between gap-4 mt-4'>
                    <div className='flex flex-col'>
                        <p>Expires</p>
                        <Input placeholder="Month" value={expMonth} onChange={e => setExpMonth(e.target.value)} />
                    </div>
                    <div className='flex flex-col'>
                        <p>Year</p>
                        <Input placeholder="Year" value={expYear} onChange={e => setExpYear(e.target.value)} />
                    </div>
                </div>
                <div className='mt-4'>
                    <p>CVV</p>
                    <Input placeholder="CVV" value={cvv} onChange={e => setCvv(e.target.value)} />
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handlePaymentSubmission}>Continue</Button>
            </CardFooter>
        </Card>
    );
}

export default Payment;
