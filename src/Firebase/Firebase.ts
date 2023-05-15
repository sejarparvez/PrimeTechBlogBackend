import * as admin from "firebase-admin";
import * as serviceAccount from "./ServiceAccountKey.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  storageBucket: "primetech-e8527.appspot.com",
});

const bucket = admin.storage().bucket();

export { bucket };
