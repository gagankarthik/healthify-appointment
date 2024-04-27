"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, getFirestore } from "firebase/firestore"; 
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from '@/config';
import { Button } from '@/components/ui/button';

function MyProfile() {
  const [userEmail, setUserEmail] = useState('');
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [address, setAddress] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [contact, setContact] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);
  const router = useRouter();
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserEmail(user.email);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setLastName(userData.lastName);
          setFirstName(userData.firstName);
          setAddress(userData.address);
          setZipcode(userData.zipcode);
          setContact(userData.contact);
          if (userData.profilePic) {
            setProfilePic(userData.profilePic);
          }
        } else {
          console.log("No such document!");
        }
      } else {
        setUserEmail('');
      }
    });
    return () => unsubscribe();
  }, [auth, db]);

  const handleSignOut = () => {
    signOut(auth).then(() => {
        console.log("Sign-out successful.");
        router.push('/'); 
    }).catch((error) => {
        console.error("Sign-out error:", error);
    });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!imageFile) return;
    const storageRef = ref(storage, `profilePics/${auth.currentUser.uid}`);
    await uploadBytes(storageRef, imageFile);
    const url = await getDownloadURL(storageRef);
    setProfilePic(url);
    const userRef = doc(db, 'users', auth.currentUser.uid);
    await setDoc(userRef, { profilePic: url }, { merge: true });
  };

  const handleUpdateProfile = async () => {
    const userRef = doc(db, 'users', auth.currentUser.uid);
    await setDoc(userRef, {
      lastName,
      firstName,
      address,
      zipcode,
      contact,
    }, { merge: true });
    alert('Profile updated successfully!');
  };


  return (
    <div>
      <div className="flow-root rounded-lg border border-gray-100 py-3 shadow-sm">
        <div className="p-3 justify-center">

          {profilePic ? (
            <img src={profilePic} alt="Profile" className="h-40 w-40 rounded-full object-scale-down " />
          ) : (
            <div className=" h-40 w-40 rounded-full bg-gray-200 flex items-center justify-center">No image</div>
          )}
    
          <input type="file" onChange={handleFileChange} />
          <Button onClick={handleUpload}>Upload Picture</Button>

        </div>
        <dl className="-my-3 divide-y divide-gray-100 text-sm">
          <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Last Name</dt>
            <dd className="text-gray-700 sm:col-span-2">{lastName}</dd>
          </div>

          <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">First Name</dt>
            <dd className="text-gray-700 sm:col-span-2">{firstName}</dd>
          </div>

          <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Email</dt>
            <dd className="text-gray-700 sm:col-span-2">{userEmail || "No user signed in"}</dd>
          </div>

          <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Address</dt>
            <dd className="text-gray-700 sm:col-span-2">{address}</dd>
          </div>

          <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Zipcode</dt>
            <dd className="text-gray-700 sm:col-span-2">{zipcode}</dd>
          </div>

          <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Contact</dt>
            <dd className="text-gray-700 sm:col-span-2">{contact}</dd>
          </div>
        </dl>
      </div>
      
      <div className='flex items-center justify-center mt-10'>
        <Button onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>
    </div>
  );
}

export default MyProfile;
