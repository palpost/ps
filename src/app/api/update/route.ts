import dayjs from 'dayjs';
import { NextResponse } from 'next/server';
import abbreviate from 'number-abbreviate';
import firebase_app  from "../firebase/firebase";

import { getDatabase, ref, child, get, set } from "firebase/database";





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


