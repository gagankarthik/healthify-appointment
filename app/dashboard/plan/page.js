"use client"
import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { collection, addDoc, serverTimestamp, onSnapshot, getFirestore, doc, getDoc } from 'firebase/firestore'; // Added doc and getDoc
import { app } from '@/config';
import { Skeleton } from "@/components/ui/skeleton";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

function PlanDetails() {
    const [plan, setPlan] = useState(null);
    const db = getFirestore(app);
    const auth = getAuth(app);

    useEffect(() => {
        const fetchPlan = async () => {
            if (auth.currentUser) {
                const userRef = doc(db, "users", auth.currentUser.uid); // Correct usage of doc
                const userSnap = await getDoc(userRef); // Correct usage of getDoc
                if (userSnap.exists()) {
                    setPlan(userSnap.data());
                    checkPlanExpiration(userSnap.data());
                } else {
                    console.log("No such user!");
                }
            }
        };

        fetchPlan();
    }, [auth.currentUser]);

    const checkPlanExpiration = (plan) => {
        const today = new Date();
        const endOfDayToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        endOfDayToday.setHours(23, 59, 59, 999);
        
        const expirationDate = new Date(plan.planEndDate);
        expirationDate.setHours(23, 59, 59, 999);
        
        const timeDiff = expirationDate - endOfDayToday;
        const daysTillExpire = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        console.log("Days till expiration: ", daysTillExpire);
        
        if (daysTillExpire <= 7) {
            triggerEmailReminder(plan, daysTillExpire);
        }
    };

    const triggerEmailReminder = async (plan, daysTillExpire) => {
        try {
            await addDoc(collection(db, "mail"), {
                to: auth.currentUser.email,
                message: {
                    subject: "Urgent: Plan about to expire",
                    text: `Your plan ${plan.planType} is expiring in ${daysTillExpire} days.`,
                    html: `<p>Hi,<br><br>Your plan <strong>${plan.planType}</strong> is expiring in <strong>${daysTillExpire} days</strong>.</p>
                           <p>Please renew your plan before it expires.</p>
                           <br><br>
                           <p>Thank you,<br>The Healthify Team</p>`
                },
            });
            console.log("Email triggered to remind about plan expiration.");
        } catch (error) {
            console.error("Error sending email: ", error);
        }
    };

    return (
        <div>
            {plan ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Your Plan</CardTitle>
                        <CardDescription>Details of your plan</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Plan Type: {plan.planType}</p>
                        <p>Price: ${plan.planPrice}</p>
                        <p>Expires On: {plan.planEndDate}</p>
                    </CardContent>
                    <CardFooter>
                        <p>Plan details</p>
                    </CardFooter>
                </Card>
            ) : (
                <div className="flex flex-col space-y-3">
                    <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                    </div>
                </div>
            )}
        </div>
    );
}

export default PlanDetails;
