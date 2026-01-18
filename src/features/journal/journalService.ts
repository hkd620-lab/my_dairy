import {
  journalCollection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from "../../services/firebase";
import { JournalEntry } from "./types";

export async function createEntry(uid: string, data: JournalEntry) {
  return addDoc(journalCollection(uid), {
    ...data,
    timestamp: serverTimestamp()
  });
}

export async function updateEntry(
  uid: string,
  entryId: string,
  data: Partial<JournalEntry>
) {
  return updateDoc(
    doc(journalCollection(uid), entryId),
    data
  );
}

export async function deleteEntry(uid: string, entryId: string) {
  return deleteDoc(
    doc(journalCollection(uid), entryId)
  );
}
