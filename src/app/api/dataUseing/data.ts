import firebase_app from '../../../../lib/firebase/firebase';
import { getDatabase, ref, get, set } from 'firebase/database';

/**
 * Function to set user data with geolocation and timestamp in Firebase database.
 * @param {string} userID - The ID of the user.
 * @param {string} userImageUrl - The ID of the user.
 * 
 */
export async function setData(userID: string|null,userImageUrl:string|null) {
  try {
    // Fetch geolocation data
    const userData = await fetch('https://ipgeolocation.abstractapi.com/v1/?api_key=afc510081d1743259f780ff97bdd2b93')
      .then((res) => res.json())
      .then((data) => {
        data["user"] = userID;
        data["userImg"] = userImageUrl;
        data["dateSet"] = new Date().toISOString();;
        return data;
      });

    const database = getDatabase(firebase_app);
    const dbRef = ref(database, 'users');

    // Get old data from Firebase
    const oldData = await get(dbRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          return snapshot.val();
        } else {
          return [];
        }
      })
      .catch(() => {
        return [];
      });

    // Update Firebase with new data
    if (userData) {
      const updatedData = Array.isArray(oldData)
        ? [...oldData, userData]
        : [userData];
      await set(dbRef, updatedData);
    }
  } catch (error) {
    console.error("Error setting user data:", error);
  }
}
