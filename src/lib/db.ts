import { getFirestore, collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { app } from "@/lib/firebase";

export const db = getFirestore(app);

export function userMessagesRef(uid: string) {
  return collection(db, "chats", uid, "messages");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function listenMessages(uid: string, cb: (msgs: any[]) => void) {
  return onSnapshot(
    query(userMessagesRef(uid), orderBy("createdAt")),
    (snap) => {
      cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
    }
  );
}

export async function pushMessage(uid: string, msg: { role: string; content: string }) {
  await addDoc(userMessagesRef(uid), {
    ...msg,
    createdAt: Date.now(),
  });
}
