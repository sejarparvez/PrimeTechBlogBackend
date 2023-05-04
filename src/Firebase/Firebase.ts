import * as admin from "firebase-admin";
import serviceAccount from "./ServiceAccountKey.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  storageBucket: "primetech-e8527.appspot.com",
});

// Define the type of the object returned by admin.storage()
type FirebaseStorage = ReturnType<typeof admin.storage>;

// Create a variable with the correct type
const storage: FirebaseStorage = admin.storage();

// Use the storage object to get a reference to the file
const bucket = storage.bucket("my-bucket");
const newName = "new-file-name";
const file = bucket.file(newName);
export default bucket;

// Do something with the file object
