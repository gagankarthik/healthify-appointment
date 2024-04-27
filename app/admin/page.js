"use client"
import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from "@/config";

function AddDoctor() {
    const db = getFirestore(app);
    const storage = getStorage(app);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        Address: '',
        experience: '',
        zipCode: '',
        specialization: '',
        fee:'',
        databaseType: 'doctors', 
        profilePic: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFormData(prevState => ({
                ...prevState,
                profilePic: e.target.files[0]
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const collectionName = formData.databaseType; // 'users' or 'doctors'
        let imageUrl = '';

        if (formData.profilePic) {
            const imageRef = ref(storage, `profilePictures/${formData.profilePic.name}`);
            const snapshot = await uploadBytes(imageRef, formData.profilePic);
            imageUrl = await getDownloadURL(snapshot.ref);
        }

        try {
            await addDoc(collection(db, collectionName), {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                Address: formData.Address,
                experience: formData.experience,
                zipCode: formData.zipCode,
                fee: formData.fee,
                specialization: formData.specialization,
                profileImageUrl: imageUrl
            });
            alert('Doctor added successfully!');
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                Address: '',
                experience: '',
                zipCode: '',
                specialization: '',
                fee:'',
                databaseType: 'doctors',
                profilePic: null
            }); // Reset form
        } catch (error) {
            console.error('Error adding document: ', error);
            alert('Failed to add doctor.');
        }
    };

    return (
        <div className='flex justify-center'>
        <form onSubmit={handleSubmit} className="p-4 bg-slate-200">
            <h2 className="text-lg font-bold mb-4">Add New Doctor</h2>
            <div className="mb-3">
                <label className="block mb-2">First Name:</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full p-2 border rounded"/>
            </div>
            <div className="mb-3">
                <label className="block mb-2">Last Name:</label>
                <input type="text" name="lastName" value={formData.lastName} placeholder='Display Name' onChange={handleChange} required className="w-full p-2 border rounded"/>
            </div>
            <div className="mb-3">
                <label className="block mb-2">Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full p-2 border rounded"/>
            </div>
            <div className="mb-3">
                <label className="block mb-2">Address:</label>
                <input type="text" name="Address" value={formData.Address} onChange={handleChange} required className="w-full p-2 border rounded"/>
            </div>
            <div className="mb-3">
                <label className="block mb-2">Experience (years):</label>
                <input type="number" name="experience" value={formData.experience} onChange={handleChange} required className="w-full p-2 border rounded"/>
            </div>
            <div className="mb-3">
                <label className="block mb-2">ZIP Code:</label>
                <input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} required className="w-full p-2 border rounded"/>
            </div>
            <div className="mb-3">
                <label className="block mb-2">Specialization:</label>
                <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} required className="w-full p-2 border rounded"/>
            </div>
            <div className="mb-3">
                <label className="block mb-2">Consult Fee:</label>
                <input type="number" name="fee" value={formData.fee} onChange={handleChange} required className="w-full p-2 border rounded"/>
            </div>
            <div className="mb-3">
                <label className="block mb-2">Profile Picture:</label>
                <input type="file" onChange={handleFileChange} className="w-full p-2 border rounded"/>
            </div>
            <div className="mb-3">
                <label className="block mb-2">Add to:</label>
                <select name="databaseType" value={formData.databaseType} onChange={handleChange} className="w-full p-2 border rounded">
                    <option value="doctors">Doctors Database</option>
                    <option value="users">Users Database</option>
                </select>
            </div>
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Add Doctor
            </button>
        </form>
        </div>
    );
}

export default AddDoctor;
