import React from 'react'
import { Outlet } from 'react-router'
import { SidebarComponent } from '@syncfusion/ej2-react-navigations';
import { NavItems, MobileSidebar } from 'components';
import { redirect } from 'react-router';
import { account } from '~/appwrite/client';
import { getExistingUser, storeUserData } from '~/appwrite/auth';


export async function clientLoader() {
  try {
      const session = await account.getSession('current');
      if (!session) { 
        console.log('No active sessions found')
        return redirect('/sign-in');
      }

      const user = await account.get();

      if (!user || !user.$id) return redirect('/sign-in');

      const existingUser = await getExistingUser(user.$id)

      if (existingUser?.status === 'user') {
        return redirect('/'); // this route is for normal users, not admins
      }

      return existingUser?.$id ? existingUser : await storeUserData();
  } catch (error) {
      console.log('Error in ClientLoader', error);
      return redirect('/sign-in');
  }
}

const AdminLayout = () => {
  return (
    <div className='admin-layout'>
        <MobileSidebar />
        <aside className='w-full max-w-[270px] hidden lg:block'>
            <SidebarComponent width={270} enableGestures={false} id="desktop-sidebar">
              <NavItems />
            </SidebarComponent>
        </aside>
        <aside className='children'>
            <Outlet/>
        </aside>
    </div>
  )
}

export default AdminLayout