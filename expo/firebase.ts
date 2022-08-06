
import { getAnalytics } from "firebase/analytics";
import { logEvent } from "firebase/analytics"; 
import { getFirestore } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore"; 

import app from "./firebase.config"

const analytics = getAnalytics(app);

const db = getFirestore(app);

export const getTicketInfos=async()=>{
  // return await getDocs(collection(db, "tezket-encode")); // V2
  logTag('load_ticket_list');
  return await getDocs(collection(db, "encode/tezket/events"));
}


export const logTag=async(tag)=>{
  logEvent(analytics, tag);
}
