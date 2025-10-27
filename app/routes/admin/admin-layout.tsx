import React from 'react'
import { Outlet } from 'react-router'
import { SidebarComponent } from '@syncfusion/ej2-react-navigations';
import { NavItems, MobileSidebar } from 'components';
import { redirect } from 'react-router';
import { account } from '~/appwrite/client';
import { getExistingUser, getGooglePicture, storeUserData } from '~/appwrite/auth';


export async function clientLoader() {
  try {
      const [ user, session ] = await Promise.all([
          account.get(),
          account.getSession('current')
      ])
      if (!session) {
        console.log('No active sessions found')
        return redirect('/sign-in');
      }

      if (!user || !user.$id) return redirect('/sign-in');

      const accessToken = session?.providerAccessToken;
      // console.log('access token: ', accessToken);
      let url;
      if (accessToken) {
          try {
              url = await getGooglePicture(accessToken);
              console.log('profile picture url: ', url);
          } catch (urlError) {
              console.error('Error getting Google picture:', urlError);
              url = undefined;
          }
      } else {
          console.log('⚠️ No access token available for Google picture');
      }

      const existingUser = await getExistingUser(user.$id)

      // if (existingUser?.status === 'user') {
      //   return redirect('/'); // this route is for normal users, not admins
      // }

      if (existingUser?.$id) {
            return {
                user: existingUser, // Use 'user' key, not 'existingUser'
                url
            };
        } else {
            const newUser = await storeUserData();
            return {
                user: newUser, // Ensure storeUserData() returns user data
                url
            };
        }
  } catch (error) {
      console.log('Error in ClientLoader', error);
      return redirect('/sign-in');
  }
}

const AdminLayout = () => {
  return (
    <div className='flex flex-col lg:flex-row h-screen w-full'>
        <MobileSidebar />
        <aside className='w-full max-w-[270px] hidden lg:block'>
            <SidebarComponent width={270} enableGestures={false} id="desktop-sidebar">
              <NavItems />
            </SidebarComponent>
        </aside>
        <aside className='w-full h-full bg-light-200 pt-12 lg:pt-10'>
            <Outlet/>
        </aside>
    </div>
  )
}

export default AdminLayout