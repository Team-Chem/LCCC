import { Timestamp } from "firebase/firestore";

export class User {
  uid!: string;
  email!: string;
  firstName!: string;
  lastName!: string;
  displayName!: string;
  photoURL!: string;
  emailVerified!: boolean;
  accountCreated!: Timestamp;
}