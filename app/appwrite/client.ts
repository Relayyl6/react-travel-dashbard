import { Client, Account, Databases, Storage } from 'appwrite';

export const appwriteConfig = {
    endpointUrl: import.meta.env.VITE_APPWRITE_API_ENDPOINT,
    projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    apiKey: import.meta.env.VITE_APPWRITE_API_KEY,
    databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
    userCollectionId: import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
    tripCollectionId: import.meta.env.VITE_APPWRITE_TRIPS_COLLECTION_ID,
}

// console.log('Environment check:', {
//     endpoint: import.meta.env.VITE_APPWRITE_API_ENDPOINT,
//     projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
//     hasEndpoint: !!import.meta.env.VITE_APPWRITE_API_ENDPOINT,
//     hasProjectId: !!import.meta.env.VITE_APPWRITE_PROJECT_ID,
// });

if (!appwriteConfig.endpointUrl) {
    throw new Error('Missing required environment variable: VITE_APPWRITE_API_ENDPOINT');
}

if (!appwriteConfig.projectId) {
    throw new Error('Missing required environment variable: VITE_APPWRITE_PROJECT_ID');
}

const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId);

const account = new Account(client);
const database = new Databases(client);
const storage = new Storage(client);

export { client, account, database, storage };