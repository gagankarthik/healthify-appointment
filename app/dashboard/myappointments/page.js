"use client"
import React from 'react'
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, deleteDoc, doc, getFirestore } from "firebase/firestore";
import { app, auth } from "@/config";
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Trash2 } from 'lucide-react';

function Appointments() {
  const db = getFirestore(app);
  const [userEmail, setUserEmail] = useState(null);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (!userEmail) return;
    const appointmentsRef = collection(db, 'appointments');
    const q = query(appointmentsRef, where("userEmail", "==", userEmail));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedAppointments = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      setAppointments(fetchedAppointments);
    });

    return () => unsubscribe();
  }, [userEmail]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserEmail(user ? user.email : null);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (appointmentId) => {
    const docRef = doc(db, 'appointments', appointmentId);
    await deleteDoc(docRef);
  };

  const handleEdit = (appointmentId) => {
    // Implementation depends on your UI design
    console.log('Edit:', appointmentId);
  };

  const getStatus = (appointmentDate, appointmentTime) => {
    let [time, modifier] = appointmentTime.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
    const appointmentDateTime = new Date(`${appointmentDate}T${hours}:${minutes}:00Z`);
    return appointmentDateTime > new Date(new Date().toISOString()) ? 'Upcoming' : 'Completed';
  };


  return (
    <Card>
      <CardHeader className="px-7">
        <CardTitle>My Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Doctor Name</TableHead>
              <TableHead className="hidden sm:table-cell">Consult Type</TableHead>
              <TableHead className="hidden sm:table-cell">Time</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id} className="bg-accent">
                <TableCell>{appointment.doctorName}</TableCell>
                <TableCell className="hidden sm:table-cell">{appointment.doctorSpecialization}</TableCell>
                <TableCell className="hidden sm:table-cell">{appointment.date}</TableCell>
                <TableCell className="hidden sm:table-cell">{appointment.time}</TableCell>
                <TableCell>
                  <Badge>
                    {getStatus(appointment.date, appointment.time)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(appointment.id)} className="hidden">Edit</Button>
                  <AlertDialog>
                    <AlertDialogTrigger> <Trash2 className='w-4 h-5' /></AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your appointment
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(appointment.id)} variant="ghost">Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>

  );
}

export default Appointments;
