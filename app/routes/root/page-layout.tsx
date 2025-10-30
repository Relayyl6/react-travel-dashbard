import React from 'react'
import { useNavigate } from 'react-router';
import { logoutUser } from "~/appwrite/auth";

const PageLayout = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const terminate = await logoutUser();
        if (terminate) navigate('/sign-in');
    }

  return (
    <button 
        onClick={handleLogout}
        className="cursor-pointer">
        <img 
            src="/assets/icons/logout.svg"
            alt="logout"
            className="size-6"
            />
    </button>
  )
}

export default PageLayout