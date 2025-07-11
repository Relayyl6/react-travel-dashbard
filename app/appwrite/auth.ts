import { OAuthProvider, Query } from "appwrite";
import { account, appwriteConfig, database } from "./client";
import { redirect } from "react-router";

export const loginWithGoogle = async () => {
    try {
        account.createOAuth2Session(
            OAuthProvider.Google,
        )
    } catch (error) {
        console.log('loginWithGoogle', error);
    }
}
export const getUser = async () => {
    try {
        const user = await account.get();

        if (!user) return redirect('/sign-in');
        
        const { documents } = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [
                Query.equal('accountId', user.$id),
                Query.select(['name', 'email', 'imageUrl', 'joinedAt', 'status'])
            ]
        )
    } catch (error) {
        console.log(error);
    }
}
export const logoutUser = async () => {
    try {
        
    } catch (error) {
        console.log(error);
    }
}

export const getGooglePicture = async () => {
    try {
        
    } catch (error) {
        console.log(error);
    }
}
export const storeUserData = async () => {
    try {
        
    } catch (error) {
        console.log(error);
    }
}
export const getExistingUser = async () => {
    try {
        
    } catch (error) {
        console.log(error);
    }
}