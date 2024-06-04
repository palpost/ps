import dayjs from 'dayjs';
import { NextResponse } from 'next/server';
import abbreviate from 'number-abbreviate';
import firebase_app  from '../../../../lib/firebase/firebase';
import { getDatabase, ref, child, get } from 'firebase/database';



export const runtime = 'edge';
/*
export async function GET() {
  const res = await fetch(
    'https://data.techforpalestine.org/api/v2/summary.json',
    { next: { revalidate: 3600 } },
  );
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  const { killed, lastDailyUpdate } = await res.json();
  const daysOfWarCrimes = dayjs(lastDailyUpdate).diff('2023-10-07', 'day');

  return NextResponse.json(
    {
      summary: `${abbreviate(killed.total)} killed in ${daysOfWarCrimes} days`,
    },
    { status: 200 },
  );
}
*/


export async function GET() {
  const database = getDatabase(firebase_app);

  const dbRef = ref(database);
  const dbRefs = await get(child(dbRef, `status`)).then((snapshot) => {
    if (snapshot.exists()) {
      const { killed, lastDailyUpdate } = snapshot.val();
      const daysOfWarCrimes = dayjs(lastDailyUpdate).diff('2023-10-07', 'day');
      
      return NextResponse.json(
        {
          summary: `${abbreviate(killed.total)} killed in ${daysOfWarCrimes} days`,
        },
        { status: 200 },
      );
    } else {
      throw new Error('Failed to fetch data');

    }
  }).catch((error) => {
    throw new Error('Failed to fetch data');

  });
  return dbRefs

}
