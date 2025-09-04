// @ts-nocheck
import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import { Link, redirect, useNavigate } from 'react-router'
import { signUpWithGoogleEmail } from '~/appwrite/auth'
import { account } from '~/appwrite/client';
import { useForm } from 'react-hook-form';


const SignUpWithEmail = () => {

    const { register, handleSubmit, formState : { errors } } = useForm();

    const navigate = useNavigate();

    // const buttonAction = () => {
    //     signUpWithGoogleEmail(register('email').value, register('password').value, register('username').value)
    // }
    // console.log

    // <form onSubmit={(e) => {
    //   e.preventDefault();
    //   const formData = new FormData(e.currentTarget);
    //   onSubmit({
    //     email: formData.get("email") as string,
    //     password: formData.get("password") as string,
    //     username: formData.get("username") as string,
    //   });
    // }}>

    const onSubmit = async (data: { email: string, name: string, password: string }) => {
        try {
            console.log("Form data submitted:", data);

            const { user, session } = await signUpWithGoogleEmail(
                data.email,
                data.password,
                data.username
        );

            console.log("Sign up successful:", user, session);
            navigate("/dashboard");
        } catch (error) {
            console.error("Error during sign up:", error);
        }
    }

  return (
    <div className='flex py-5 px-6 w-full'>
        <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
                <div className="flex flex-col gap-4 items-center w-full max-w-4xl justify-between">
                    <div className='flex flex-row w-full items-center gap-2'>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username: </label>
                        <input
                            type="username"
                            id="username"
                            {...register('username', { required: 'Username is required' })}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            placeholder="Enter your username"
                        />
                        {errors?.username && (
                            <p className="text-red-600 text-xs mt-1">
                                {errors.username.message}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-row items-center gap-2 w-full">
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
                    <div className="flex flex-row items-center gap-2 w-full">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password: {' '}</label>
                        <input
                            type="password"
                            id="password"
                            {...register('password', { required: 'Password is required', minLength: {
                                value: 8,
                                message: 'Password must be at least 8 characters long'
                            } })}
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
                        type='submit'
                        iconCss="e-search-icon"
                        className='!bg-primary-100 !px-4 !rounded-lg !flex !items-center !justify-center !gap-1.5 !shadow-none !h-11 !w-fit'
                        >
                        <h2 className='p-18-semibold text-white'>Sign Up with Email</h2>
                    </ButtonComponent>
                </div>
            </form>
    </div>
  )
}

export default SignUpWithEmail