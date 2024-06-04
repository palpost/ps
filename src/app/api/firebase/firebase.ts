// import Firebase
import { initializeApp,getApps} from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyCw3JVh02EDc7oUkmXv8BXGRF2y05SmmJg",
    authDomain: "palestine-2f5c9.firebaseapp.com",
    projectId: "palestine-2f5c9",
    storageBucket: "palestine-2f5c9.appspot.com",
    messagingSenderId: "424929570831",
    appId: "1:424929570831:web:b3c63f40f9063af955b37a",
    measurementId: "G-RBT1BWRF6F"
};

let firebase_app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export default firebase_app;