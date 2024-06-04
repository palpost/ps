import { NextResponse } from 'next/server';
import { getDatabase, ref, child, get, set } from 'firebase/database';


import { initializeApp} from 'firebase/app';
const firebaseConfig = {
    apiKey: 'AIzaSyCw3JVh02EDc7oUkmXv8BXGRF2y05SmmJg',
    authDomain: 'palestine-2f5c9.firebaseapp.com',
    projectId: 'palestine-2f5c9',
    storageBucket: 'palestine-2f5c9.appspot.com',
    messagingSenderId: '424929570831',
    appId: '1:424929570831:web:b3c63f40f9063af955b37a',
    measurementId: 'G-RBT1BWRF6F'
};
let firebase_app = initializeApp(firebaseConfig);


export const runtime = 'edge';





export async function GET() {
  const database = getDatabase(firebase_app);


  const res = await fetch(
    'https://data.techforpalestine.org/api/v2/summary.json',
    { next: { revalidate: 3600 } },
  );
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  const newData = await res.json();

  const dbRef = ref(database);
  const oldData = await get(child(dbRef, `status`)).then((snapshot) => {
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return null;
    }
  }).catch((error) => {
    return null;
  });
  

if(oldData&&newData&&newData.lastDailyUpdate){
if(newData.lastDailyUpdate != oldData.lastDailyUpdate){
  const db = database;
  set(ref(db, 'status'), newData);
  return NextResponse.json({status:'update data',lastUpdate:oldData.newData});
}
}
return NextResponse.json({status:'no change',lastUpdate:oldData.lastDailyUpdate});

}


