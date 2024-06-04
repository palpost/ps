import { NextResponse } from "next/server";
import firebase_app from "../../../../lib/firebase/firebase";
import { getDatabase, ref, get, set } from "firebase/database";

export const runtime = "edge";

export async function GET() {
  const database = getDatabase(firebase_app);
  const dbRef = ref(database, "users");

  const userData = await getDataUser();

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

  if (userData) {
    const updatedData = Array.isArray(oldData) ? [...oldData, userData] : [userData];
    await set(dbRef, updatedData);
    return NextResponse.json({
      status: true,
    });
  } else {
    return NextResponse.json({
      status: false,
    });
  }
}

async function getDataUser() {
  const res = await fetch(
    "https://ipgeolocation.abstractapi.com/v1/?api_key=afc510081d1743259f780ff97bdd2b93",
    { next: { revalidate: 10 } }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return await res.json();
}
