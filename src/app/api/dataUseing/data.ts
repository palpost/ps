import firebase_app from '../../../../lib/firebase/firebase';
import { getDatabase, ref, get, set, remove } from 'firebase/database';

/**
 * Function to set user data with geolocation and timestamp in Firebase database.
 * @param {string} userID - The ID of the user.
 * @param {string} userImageUrl - The ID of the user.
 *
 */
export async function setData(
  userID: string | null,
  userImageUrl: string | null,
  removed: boolean | false,
  id: number | null
) {
  const result: {
    data?: object;
    type?: string;
    deleted?: boolean;
    msg?: string;
    done?: boolean;
  } = {};

  const database = getDatabase(firebase_app);

  try {
    if (removed && id) {
      result['type'] = 'remove';
      const itemIdToDelete = id;
      const dbRef = ref(database, 'users');
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const itemKey = Object.keys(data).find(
          (key) => data[key].id === itemIdToDelete
        );
        if (itemKey) {
          const itemRef = ref(database, `users/${itemKey}`);
          await remove(itemRef);
          result['deleted'] = true;
          const newData: { [key: number]: object } = {};
          let index = 0;
          Object.keys(data).forEach((key) => {
            if (key !== itemKey) {
              newData[index++] = data[key];
            }
          });
          await set(dbRef, newData);
        } else {
          result['msg'] = 'لم يتم العثور على العنصر بالمعرف المحدد';
        }
      } else {
        result['msg'] = 'لا توجد بيانات في المسار المحدد';
      }
    } else {
      result['type'] = 'add';
      const userData = await fetch('/api/userInfo').then((res) => res.json());

      userData['id'] = Math.floor(Math.random() * 9999999999999);
      userData['user'] = userID;
      userData['userImg'] = userImageUrl;
      userData['dateSet'] = new Date().toISOString();

      const dbRef = ref(database, 'users');
      const snapshot = await get(dbRef);
      const oldData = snapshot.exists() ? snapshot.val() : [];
      const updatedData = Array.isArray(oldData)
        ? [...oldData, userData]
        : [userData];
      await set(dbRef, updatedData);
      result['msg'] = 'تم اضافة البيانات بنجاح';
    }
  } catch (error) {
    result['msg'] = 'Error setting user data:' + error;
  }

  return result;
}
