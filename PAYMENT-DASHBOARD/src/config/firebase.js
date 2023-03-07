import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";


    const firebaseConfig = {
        apiKey: "AIzaSyBw1nOGYJdPzJj7ts63ZHHBsWYpNrPi1sg",
        authDomain: "satishfinalyearproject.firebaseapp.com",
        projectId: "satishfinalyearproject",
        storageBucket: "satishfinalyearproject.appspot.com",
        messagingSenderId: "703717130667",
        appId: "1:703717130667:web:2ab96c5a862777d349d2ee",
        measurementId: "G-VVFWB424NJ"
    };
   


// Initialize Firebase
export function setupFirebase() {
    if (getApps().length === 0) initializeApp(firebaseConfig);
}

export async function logoutUser() {
    const auth = getAuth();
    if (auth.currentUser) await auth.signOut();
    localStorage.clear();
}
