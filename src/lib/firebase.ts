import { cert, getApps, initializeApp, type ServiceAccount } from "firebase-admin/app";
import { getMessaging as getAdminMessaging } from "firebase-admin/messaging";

function getMessaging() {
  if (!getApps().length) {
    const serviceAccount: ServiceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    };

    initializeApp({
      credential: cert(serviceAccount),
    });
  }

  return getAdminMessaging();
}

export { getMessaging };
