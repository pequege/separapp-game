import { db } from "./firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

async function addUser(email, score) {
  try {
    await addDoc(collection(db, "users"), {
      createdAt: serverTimestamp(),
      email: email,
      score: score
    });
  } catch (e) {
    console.error("Error adding user: ", e);
  }
}

export { addUser };