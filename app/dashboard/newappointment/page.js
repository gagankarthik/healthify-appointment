"use client"
import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { getFirestore } from "firebase/firestore";
import { app, auth } from "@/config";
import { onAuthStateChanged } from "firebase/auth";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
  } from "@/components/ui/dialog"
import { ArrowRight, DollarSign, MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Payment from '../_components/Payment';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from "@/components/ui/badge"


function Home() {
    const db = getFirestore(app);
    const [doctors, setDoctors] = useState([]);
    const [currentDoctor, setCurrentDoctor] = useState(null);
    const { toast } = useToast();
    const [userEmail, setUserEmail] = useState('');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [appointmentDetails, setAppointmentDetails] = useState({});

    const initialState = {
        selectedDate: new Date().toISOString().slice(0, 10),
        selectedTime: '',
        consultantType: '',
        notes: ''
    };

    const availableTimes = [
        '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
        '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
    ];
    const consultantTypes = [
        { label: 'Neurosurgeon', value: 'neurosurgeon' },
        { label: 'General Practitioner', value: 'general' },
        { label: 'Cardiologist', value: 'cardiologist' },
        { label: 'Dermatologist', value: 'dermatologist' }
    ];

    const [selectedDate, setSelectedDate] = useState(initialState.selectedDate);
    const [selectedTime, setSelectedTime] = useState(initialState.selectedTime);
    const [consultantType, setConsultantType] = useState(initialState.consultantType);
    const [notes, setNotes] = useState(initialState.notes);
    const handleTimeSelect = (time) => {
        setSelectedTime(time);
    };
    
    const sendAppointmentConfirmationEmail = async (appointmentDetails) => {
        try {
            await addDoc(collection(db, "mail"), {
                to: appointmentDetails.userEmail,
                message: {
                    subject: "Appointment Confirmation",
                    text: `Your appointment on ${appointmentDetails.date} at ${appointmentDetails.time} has been confirmed.`,
                    html: `<p>Hi,<br><br>Your appointment on <strong>${appointmentDetails.date}</strong> at <strong>${appointmentDetails.time}</strong> has been confirmed.</p><br><br>
                    <p>Thank you,<br>
                    The Healthify Team</p>
                    `
                },
            });
        } catch (error) {
            console.error("Error sending email: ", error);
        }
    };
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'doctors'), (snapshot) => {
            const docs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setDoctors(docs);
        });
        return () => unsubscribe();
    }, [db]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            if (user) {
                setUserEmail(user.email);
            } else {
                setUserEmail('');
            }
        });
        return () => unsubscribe();
    }, []);

    const handlePaymentSuccess = async (appointmentDetails) => {
        try {
            await addDoc(collection(db, "appointments"), {
                ...appointmentDetails,
                createdAt: serverTimestamp(),
            });
            toast({
                title: "Appointment confirmed!",
                status: "success",
                duration: 1000,
                isClosable: true,
            });
            setSelectedDate(initialState.selectedDate);
            setSelectedTime(initialState.selectedTime);
            setConsultantType(initialState.consultantType);
            setNotes(initialState.notes);
            setCurrentDoctor(null);
            setShowPaymentModal(false);
            sendAppointmentConfirmationEmail(appointmentDetails);
        } catch (error) {
            console.error("Error adding appointment: ", error);
            alert("Failed to confirm the appointment.");
        }
    };

    const confirmAppointment = () => {
        if (!selectedTime || !consultantType) {
            alert('Please select a time and a consultant type for your appointment.');
            return;
        }
        setAppointmentDetails({
            date: selectedDate,
            time: selectedTime,
            consultantType,
            doctorId: currentDoctor.id,
            doctorName: currentDoctor.lastName,
            doctorSpecialization: currentDoctor.specialization,
            doctorExperience: currentDoctor.experience,
            doctorEmail: currentDoctor.email,
            notes,
            fee: currentDoctor.fee,
            userEmail,
        });
        
        setShowPaymentModal(true);
        setCurrentDoctor(null);
    };

    return (
        <div className="p-3">
            <h2 className='p-5 text-3xl font-bold'>Appointment</h2>
            <div className="grid grid-cols-3 gap-4">
                {doctors.map((doctor) => (
                    <div key={doctor.id} className="p-4 border rounded shadow">
                        {doctor.profileImageUrl ? (
                            <img src={doctor.profileImageUrl} alt="Doctor Profile" className="h-60 w-full object-scale-down"
                                onError={(e) => { e.target.onerror = null; e.target.src = 'path_to_default_image.jpg'; }}
                            />
                        ) : (
                            <div className="w-full h-60 bg-gray-300 flex items-center justify-center">
                                <span>No Image</span>
                            </div>
                        )}
                        <h2 className="text-lg font-bold mt-3">Dr. {doctor.lastName}</h2>
                        <p className='flex mt-3 text-slate-800 text-sm'><MapPin className='w-4 h-5' /> {doctor.Address}, {doctor.zipCode}</p>
                        <div className="flex mt-4 justify-end gap-2">
                            <Badge variant="destructive" className="shadow-md">
                                <p>{doctor.specialization}</p>
                            </Badge>
                            <Badge variant="outline" className="shadow-md">
                                <p>{doctor.experience} years</p>
                            </Badge>
                        </div>
                        <div className="flex mt-4 flex-row items-center justify-between text-center ">
                            <div className='flex flex-col'>
                                <p className='flex-row flex font-bold items-center'> {doctor.fee}<DollarSign className='w-3 h-4 ml-1'/></p>
                                <p className='text-sm'>/consult</p>
                            </div>
                            <div className="flex mt-4 justify-end">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button onClick={() => setCurrentDoctor(doctor)}>View Availability <ArrowRight className="w-5 h-5 ml-2" /></Button>
                                    </DialogTrigger>
                                    {currentDoctor && currentDoctor.id === doctor.id && (
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Book Appointment</DialogTitle>
                                                <DialogDescription>Set the appointment details below.</DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="name" className="text-right">
                                                        Date
                                                    </Label>
                                                    <input
                                                        type="date"
                                                        id="appointmentDate"
                                                        name="appointmentDate"
                                                        value={selectedDate}
                                                        onChange={e => setSelectedDate(e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="username" className="text-right">
                                                        Specialization
                                                    </Label>
                                                    <select
                                                        id="consultantType"
                                                        value={consultantType}
                                                        onChange={e => setConsultantType(e.target.value)}
                                                        className="w-100 mt-2 border py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                    >
                                                        <option value="">Consultant Type</option>
                                                        {consultantTypes.map((type) => (
                                                            <option key={type.value} value={type.value}>{type.label}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="name" className="text-right">
                                                        Notes
                                                    </Label>
                                                    <textarea
                                                        id="notes"
                                                        name="notes"
                                                        value={notes}
                                                        onChange={e => setNotes(e.target.value)}
                                                        cols="4"
                                                        rows="4"
                                                        className=" p-2 mt-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md "
                                                        placeholder="Add any specific details or requirements here..."
                                                    />
                                                </div>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="name" className="text-right">
                                                        Time
                                                    </Label>
                                                    {availableTimes.map((time, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => handleTimeSelect(time)}
                                                            className={`px-4 py-2 border rounded-md text-sm font-medium ${selectedTime === time ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
                                                        >
                                                            {time}
                                                        </button>
                                                    ))}

                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <button
                                                    onClick={confirmAppointment}
                                                    disabled={!selectedTime || !consultantType}
                                                    className={`mt-4 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${!selectedTime || !consultantType ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    Confirm Appointment
                                                </button>

                                            </DialogFooter>

                                        </DialogContent>
                                    )}
                                </Dialog>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {showPaymentModal && (
                <Payment
                    details={appointmentDetails}
                    onPaymentSuccess={handlePaymentSuccess}
                    onClose={() => setShowPaymentModal(false)}
                />
            )}
        </div>
    );
}

export default Home;
