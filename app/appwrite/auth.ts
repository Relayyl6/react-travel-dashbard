import { ID, OAuthProvider, Query } from "appwrite";
import { account, appwriteConfig, database } from "./client";
import { redirect } from "react-router";

export const loginWithGoogle = async () => {
    try {
        // Add this before login
        // document.cookie = 'g_state=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        // document.cookie = 'github_oauth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

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
        // Remove the redundant session call since we already have the token
        if (!accessToken) {
            console.log("No access token provided");
            return null;
        }

        // console.log('Attempting to fetch Google profile picture...');

        const response = await fetch(
            'https://people.googleapis.com/v1/people/me?personFields=photos',
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        // console.log('Google API response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ Google API error (${response.status}):`, errorText);
            
            // Handle specific error cases
            if (response.status === 401) {
                console.error('🔐 Access token is invalid or expired');
            } else if (response.status === 403) {
                console.error('🚫 Insufficient permissions for Google People API');
            }
            return null;
        }

        const data = await response.json();
        // console.log('Google API response data:', data);

        // Check if photos exist in the response
        if (!data.photos || !Array.isArray(data.photos) || data.photos.length === 0) {
            console.log('No photos found in Google profile');
            return null;
        }

        const photoUrl = data.photos[0]?.url;
        // console.log('Profile picture URL:', photoUrl);

        return photoUrl || null;

    } catch (error) {
        console.error('Error fetching Google Picture:', error);
        
        // Log more details about the error
        if (error instanceof TypeError && error.message.includes('fetch')) {
            console.error('Network error - check internet connection');
        }
        
        return null;
    }
};

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

export const signUpWithGoogleEmail = async (
    email: string,
    password: string,
    name: string
) => {
    // const navigate = useNavigate();
    try {
        // Generate a single user ID
        const id = ID.unique();


        console.log({
            id, // Auto-generate user ID
            email,
            password,
            name
        });

        // create the user 
        const user = await account.create(
            id, // Auto-generate user ID
            email,
            password,
            name
        );
        console.log("Account initiated", user);

        if (!user.$id) throw new Error("User creation failed");

        // Store additional user data in the database

        // Automatically log them in after signup
        const session = await account.createEmailPasswordSession(
            email,
            password,
        )

        if (!session.$id) throw new Error("Session creation failed");

        console.log("User registered:", session);

        return { user, session };
    } catch (error: any) {
        console.error("Registration failed:", {
            message: error.message,
            code: error.code,
            response: error.response,
        });
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