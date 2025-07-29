// @ts-nocheck
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import { Link, redirect } from 'react-router'
import { signUpWithGoogleEmail } from '~/appwrite/auth'
import { account } from '~/appwrite/client';
import { useForm } from 'react-hook-form';


const SignUpWithEmail = () => {

    const { register, handleSubmit, formState : { errors } } = useForm()

    const buttonAction = () => {
        signUpWithGoogleEmail(register('email').value, register('password').value, register('username').value)
    }

  return (
    <div className='flex border border-light-100 py-10 px-6 w-full'>
        <form onSubmit={handleSubmit(buttonAction)}>
                <div className="flex flex-col gap-4 items-center">
                    <div className='flex flex-col items-center gap-2'>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="username"
                            id="username"
                            {...register('username', { required: 'Username is required' })}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="flex flex-col items-center gap-2 w-full">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email: {' '}</label>
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
                    <div className="flex flex-col items-center gap-2 w-full">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password: {' '}</label>
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
                        className='!bg-primary-100 !px-4 !rounded-lg !flex !items-center !justify-center !mx-auto !gap-1.5 !shadow-none !h-11 !w-fit'
                        >
                        <h2 className='font-bold text-dark-200'>SignIn</h2>
                    </ButtonComponent>
                </div>
            </form>
    </div>
  )
}

export default signUpWithEmail