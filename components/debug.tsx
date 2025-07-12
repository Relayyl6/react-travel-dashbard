// Debug test file - add this to your sign-in component temporarily
import { Client, Account } from 'appwrite';

// Create a fresh client for testing
const debugClient = new Client();

export const debugAppwriteConnection = async () => {
    console.log('=== DEBUG APPWRITE CONNECTION ===');

    // 1. Check environment variables
    console.log('Environment Variables:');
    console.log('- ENDPOINT:', import.meta.env.VITE_APPWRITE_API_ENDPOINT);
    console.log('- PROJECT_ID:', import.meta.env.VITE_APPWRITE_PROJECT_ID);
    console.log('- Has endpoint?', !!import.meta.env.VITE_APPWRITE_API_ENDPOINT);
    console.log('- Has project ID?', !!import.meta.env.VITE_APPWRITE_PROJECT_ID);
    
    // 2. Test different endpoint formats
    const endpointsToTest = [
        'https://nyc.cloud.appwrite.io/v1',,
        import.meta.env.VITE_APPWRITE_API_ENDPOINT
    ];
    
    for (const endpoint of endpointsToTest) {
        if (!endpoint) continue;
        
        console.log(`\n--- Testing endpoint: ${endpoint} ---`);
        
        try {
            // Test basic health check first
            const healthResponse = await fetch(`${endpoint}/health`);
            console.log('Health check:', healthResponse.status, healthResponse.ok);
            
            // Test with proper client setup
            const testClient = new Client()
                .setEndpoint(endpoint)
                .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);
            
            const testAccount = new Account(testClient);
            
            // Try to get account (this will fail but should give us better error info)
            const result = await testAccount.get();
            console.log('Account get success:', result);
            
        } catch (error: any) {
            console.log('Error details:', {
                message: error.message,
                code: error.code,
                type: error.type,
                response: error.response
            });
            
            // Check if it's a CORS error or auth error
            if (error.message.includes('CORS')) {
                console.log('❌ CORS ERROR - Platform not configured correctly');
            } else if (error.code === 401) {
                console.log('✅ 401 Error - This is GOOD! Means CORS is working, just not authenticated');
            } else {
                console.log('❓ Other error:', error.message);
            }
        }
    }
    
    console.log('=== END DEBUG ===');
};