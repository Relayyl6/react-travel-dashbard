import { ID, OAuthProvider, Query } from "appwrite";
import { account, appwriteConfig, database } from "./client";
import { redirect } from "react-router";

export const loginWithGoogle = async () => {
    try {
        // Add this before login
        document.cookie = 'g_state=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'github_oauth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

        account.createOAuth2Session(
            OAuthProvider.Google,
            'http://localhost:5173/dashboard',
            'http://localhost:5173/sign-in',
            // ['prompt=consent', 'access_type=offline'],
            // '${`window.location.origin`}/404'
        )
    } catch (error) {
        console.error('Error durisng OAuth2 creation', error);
        return null;
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
                Query.select(['name', 'email', 'imageUrl', 'joinedAt', 'accountId'])
            ]
        )

        return documents.length > 0 ? documents[0] : redirect('/sign-in');
    } catch (error) {
        console.error("Errr fetching user: ", error);
    }
}

export const logoutUser = async () => {
    try {
        await account.deleteSession('current');
        document.cookie.split(';').forEach(cookie => {
            document.cookie = cookie.replace(/^ +/, '').split('=')[0] + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
        });
        console.log('logout successful - all session deleted');
        return true;
    } catch (error) {
        console.log('Error during logout', error);
        return false;
    }
}

export const getGooglePicture = async (accessToken: string) => {
    try {
        const session = await account.getSession('current')

        // const oAuthToken = session.providerAccessToken;

        if (!accessToken) {
            console.log("No oAuth token available");
            return null;
        }

        const response = await fetch(
            'https://people.googleapis.com/v1/people/me?personFields=photo',
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );

        if (!response.ok) throw new Error("Failed to fetch profile photo from Google People API");

        const { photos } = await response.json();

        // extracting the photo URL form the response
        return photos?.[0].url || null;
    } catch (error) {
        console.log('Error fetching Google Picture', error);
        return null;
    }
}

export const storeUserData = async () => {
    try {
        const user = await account.get();

        if (!user) throw new Error("User not found");

        const { providerAccessToken } = (
            await account.getSession('current')
        ) || {};

        const profilePicture = providerAccessToken ? await getGooglePicture(providerAccessToken) : null;

        // const { documents } = await database.listDocuments(
        //     appwriteConfig.databaseId,
        //     appwriteConfig.userCollectionId,
        //     [
        //         Query.equal('accountId', user.$id)
        //     ]
        // );

        // if (documents.length > 0) return documents[0];

        // // if we dont have an active user to store
        // const imageUrl = await getGooglePicture();

        const newUser = await database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountId: user.$id,
                email: user.email,
                name: user.name,
                imageUrl: profilePicture || '',
                joinedAt: new Date().toISOString(),
            }
        )

        if (!newUser.$id) redirect("/sign-in");
    } catch (error) {
        console.log('Error storing user data', error);
    }
}
export const getExistingUser = async (id: string) => {
    try {
        const user = await account.get();

        if (!user) return null;

        const { documents, total } = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [
                Query.equal('accountId', id)
            ]
        );

        return total > 0 ? documents[0] : null;
    } catch (error) {
        console.log('Error fetching user', error);
        return null;
    }
}

export const getAllUsers = async (limit: number, offset: number) => {
    try {
        const { documents: users, total } = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [
                Query.limit(limit),
                Query.offset(offset)
            ]
        )

        if (total === 0) return { users: [], total };

        return { users, total };
    } catch (error) {
        console.error("Error fetching users", error);
        return { users: [], total: 0 }
    }
}

export const signUpWithGoogleEmail = async (email: string, password: string, name: string = "") => {
    try {
        const user = await account.create(
            ID.unique(), // Auto-generate user ID
            email,
            password,
            name
        );
        console.log("User registered:", user);
        return user;
    } catch (error) {
        console.error("Registration failed:", error);
        throw error;
    }
};

export const logInWithGoogleEmail = async (email: string, password: string, name: string) => {
    try {
        if (!email) {
            const session = await account.createSession(name, password);
            console.log("Logged in:", session);
            return session;
        } else if (!name) {
            const session = await account.createEmailPasswordSession(email, password);
            console.log("Logged in:", session);
            return session;
        }
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
};