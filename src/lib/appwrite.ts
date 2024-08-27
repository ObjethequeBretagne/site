import { Client, Databases } from 'appwrite';

export const client = new Client();
export const databases = new Databases(client);

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('66cd9f37000126b2721f');