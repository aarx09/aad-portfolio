import { Client, Databases, Account, ID, Query } from 'appwrite';
import { APPWRITE_CONFIG } from './constants';

// ─── Appwrite Client ───────────────────────
const client = new Client()
  .setEndpoint(APPWRITE_CONFIG.endpoint)
  .setProject(APPWRITE_CONFIG.projectId);

export const databases = new Databases(client);
export const account    = new Account(client);
export { ID, Query };

// ─── DB Helpers ────────────────────────────
const { databaseId, collections } = APPWRITE_CONFIG;

export const db = {
  list: (col, queries = []) =>
    databases.listDocuments(databaseId, collections[col], queries),

  get: (col, id) =>
    databases.getDocument(databaseId, collections[col], id),

  create: (col, data) =>
    databases.createDocument(databaseId, collections[col], ID.unique(), data),

  update: (col, id, data) =>
    databases.updateDocument(databaseId, collections[col], id, data),

  remove: (col, id) =>
    databases.deleteDocument(databaseId, collections[col], id),
};

// ─── Auth Helpers ───────────────────────────
export const auth = {
  login:   (email, password) => account.createEmailPasswordSession(email, password),
  logout:  ()               => account.deleteSession('current'),
  getUser: ()               => account.get(),
};
