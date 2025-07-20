import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import { debugAppwriteConnection } from 'components/debug';
import { useEffect } from 'react';
import { Link, redirect } from 'react-router'
import { loginWithGoogle } from '~/appwrite/auth'
import { account } from '~/appwrite/client';

// useEffect(() => {
//     const testConnection = async () => {
//         try {
//             const response = await fetch(`${import.meta.env.VITE_APPWRITE_API_ENDPOINT}`);
//             console.log('Appwrite health check:', response.status);
//         } catch (error) {
//             console.error('Connection test failed:', error)
//         }
//     }

//     testConnection();
// }, []);

export async function clientLoader() {
    try {
        console.log('ClientLoader: Attempting to get user...');
        const user = await account.get();
        console.log('ClientLoader: User found:', user);

        if (user.$id) return redirect('/dashboard'); // Change to your dashboard route
    } catch (error: any) {
        if (error.code === 401) {
            console.log('User not authenticated, staying on sign-in page');
        }

        console.log('Error fetching user', error);
        return null;
    }
}

const SignIn = () => {
    // sign-in-card: flex bg-white flex-col border border-light-100 md:max-w-[510px] rounded-[20px] py-10 px-6 w-full
    // header within sign-in-card: flex items-center gap-1.5 justify-center
    // header: flex items-center gap-1.5 justify-center
    // artcile within sign-in-card: mt-9 mb-[30px] flex flex-col gap-3
    // button-class: !bg-primary-100 !px-4 !rounded-lg !flex !items-center !justify-center !gap-1.5 !shadow-none

    // useEffect(() => {
    //     debugAppwriteConnection()
    // }, []);

  return (
    <main className='auth'>
        <section className='size-full glassmorphism flex-center px-6'>
            <div className='sign-in-card'>
                <header className='header'>
                    <Link to='/'>
                        <img
                            src='/public/assets/icons/logo.svg'
                            alt='logo'
                            className='size-[30px]'
                        />
                    </Link>
                    <h1 className='p-28-bold text-dark-100'>Tour Leroy</h1>
                </header>

                <article>
                    <h2 className='p-28-semibold text-dark-100 text-center'>Start your Travel Journey</h2>
                    <p className='p-18-regular text-center text-gray-100 !leading-7'>Sign in with google to manage destinatiosn itineraries, and user activity with ease</p>
                    <ButtonComponent
                        type='button'
                        iconCss="e-search-icon"
                        className='button-class !h-11 !w-fit'
                        onClick={loginWithGoogle}
                        >
                        <img
                            src='/public/assets/icons/google.svg'
                            className='size-5 mr-0'
                            alt='google'
                        />
                        <span className='p-18-semibold text-white'>Sign in with Google</span>
                    </ButtonComponent>
                </article>
            </div>
        </section>
    </main>
  )
}

export default SignIn