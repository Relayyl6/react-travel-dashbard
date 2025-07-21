// @ts-nocheck
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import { Link, redirect } from 'react-router'
import { signUpWithGoogleEmail } from '~/appwrite/auth'
import { account } from '~/appwrite/client';
import { useForm } from 'react-hook-form';


const signUpWithEmail = () => {

    const { register, handleSubmit, formState : { errors } } = useForm()

  return (
    <div className='flex bg-white flex-col border border-light-100 md:max-w-[510px] rounded-[20px] py-10 px-6 w-full'>
        <header className='flex items-center gap-1.5 justify-center'>
            <Link to="/" className='flex flex-row border-b border-dark-100'>
                <img
                    src='/public/assets/icons/logo.svg'
                    alt="logo"
                    className='size-[80px]'
                />
                <h1 className='p-28-bold text-dark-100'>Tour Leroy</h1>
            </Link>
        </header>

        <form onSubmit={handleSubmit(signUpWithGoogleEmail)}>
                <div className="flex flex-col gap-4">
                    <div className='flex flex-row items-center gap-2'>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            {...register('email', { required: 'Email is required' })}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            placeholder="Enter your email"
                        />
                        {
                            errors?.email && <p className="text-red-600 text-xs mt-1">
                                {errors.email.message}
                            </p>
                        }
                    </div>
                    <div className="flex flex-row items-center gap-2">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            {...register('password', { required: 'Password is required', minLength: 8 })}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            placeholder="Enter your password"
                        />
                        {
                            errors?.password && errors?.password === "required" && <p className="text-red-600 text-xs mt-1">
                                {errors.password.message}
                            </p>
                        }
                        {
                            errors?.password && errors?.password === "minLength" && <p className="text-red-600 text-xs mt-1">
                                Password must be at least 8 characters long
                            </p>
                        }
                    </div>

                    <ButtonComponent
                        type='button'
                        iconCss="e-search-icon"
                        className='button-class !h-11 !w-fit'
                        onClick={signUpWithGoogleEmail}
                        >
                        <h2 className='font-bold text-dark-200'>Sign Up</h2>
                        <span className='p-18-semibold text-white'>Sign Up</span>
                    </ButtonComponent>
                </div>
            </form>
    </div>
  )
}

export default signUpWithEmail