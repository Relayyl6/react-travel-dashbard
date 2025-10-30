import type { Models } from "appwrite";
import { cn } from "assets/lib/utils"
import { Link, NavLink, useLoaderData, useNavigate } from "react-router"
import { getGooglePicture, logoutUser } from "~/appwrite/auth";
import { account } from "~/appwrite/client";
import { sidebarItems } from "~/constants"
// import type { Route } from "../app/+types/root";

export type LoaderData = {
    user: { name: string; email: string; imageUrl?: string } | null;
    url: string | undefined;
    users?: Models.Document[];
    total?: number;
}

// export const clientLoader = async () => {
//     try {
//         const [ user, session ] = await Promise.all([
//         account.get(),
//         account.getSession('current')
//     ])
//     console.log(user)
//     console.log(session)
//     // const session = await account.getSession('current')

//     if (!user || !user.$id) {
//         console.log('❌ No authenticated user found');
//         return {
//             user: null,
//             url: undefined
//         };
//     }

//     const accessToken = session?.providerAccessToken;
//     console.log('access token: ', accessToken);
//     let url;
//     if (accessToken) {
//         try {
//             url = await getGooglePicture(accessToken);
//             console.log('profile picture url: ', url);
//         } catch (urlError) {
//             console.error('Error getting Google picture:', urlError);
//             url = undefined;
//         }
//     } else {
//         console.log('⚠️ No access token available for Google picture');
//     }
//     // const url = await getGooglePicture(accessToken || '');

//     // const user = await account.get()
//     const result = { user, url };
//     console.log('✅ ClientLoader returning:', result);
    
//     return result;
//     } catch (error: any) {
//         console.error('Error in clientLoader: ', error);
//         if (error.code === 401 || error.message?.includes('unauthorized')) {
//             console.log('🔐 Authentication error - user needs to log in');
//         }
//         return {
//             user: undefined,
//             url: undefined
//         }
//     }
// }

const NavItems = ({ handleClick }: { handleClick?: () => void }) => {
    // hardocding temporary user data
    // console.log(loaderData);
    // const { user, url } = loaderData as unknown as { user: { name: string; email: string; imageUrl?: string }; url: string | undefined };
    const { user, url } = useLoaderData() as LoaderData;
    // console.log(user)
    console.log(url);
    const navigate = useNavigate();

    const handleLogout = async () => {
        const terminate = await logoutUser();
        if (terminate) navigate('/sign-in');
    }

  return (
    // nav-items: flex flex-col px-6 h-full // any .container within: flex flex-col justify-between h-full // any nav within: flex flex-col gap-3.5 pt-9
    <section className="flex flex-col px-6 h-full">
        {/* // link-logo: flex items-center gap-1.5 py-10 border-b border-light-100 // any h1 within: text-base md:text-2xl font-bold text-dark-100 */}
        <Link to='/' className="flex items-center gap-1.5 py-7 border-b border-light-100"> 
            <img
                src="/assets/icons/logo.svg"
                alt="logo"
                className="size-[30px]"
                />
            <h1 className="text-base md:text-2xl font-bold text-dark-100">Tour Leroy</h1>
        </Link>
        {/* // container: flex flex-col gap-9 mt-2.5 // any div within: flex items-center gap-5 */}
        <div className="flex flex-col justify-between h-full">
            <nav className="flex flex-col gap-3.5 pt-9">
                {
                    sidebarItems.map(
                        ({ id, icon, label, href }) => (
                            <NavLink to={href} key={id}>
                                {
                                    ({ isActive }: { isActive: boolean }) => (
                                        <div className={cn('group flex items-center text-xs md:text-lg font-normal cursor-pointer gap-2.5 py-[18px] px-3.5 rounded-lg text-dark-200 hover:bg-primary-100 hover:text-white', {'bg-primary-100 !text-white': isActive})} onClick={handleClick}> 
                                            <img
                                                src={icon}
                                                alt="label"
                                                className={`group-hover:brightness-0 size-5 group-hover:invert ${isActive ? 'brightness-0 invert' : 'text-dark-200' }`}/>
                                            {label}
                                        </div>
                                    )
                                }
                            </NavLink>
                        )
                    )
                }
            </nav>
            {/* // nav-item: flex items-cent```er text-xs md:text-lg font-normal cursor-pointer gap-2.5 py-[18px] px-3.5 rounded-lg text-dark-200 hover:bg-primary-100 hover:text-white */}
            {/* note // the NavLink component automatically provides an object to its child function  which contains information about the current navigation state. // this is where isAcive is being destructured from */}
            {/* // nav-footer: flex items-center gap-2.5 pb-8 // any img within: size-10 rounded-full aspect-square // any article within: flex flex-col gap-[2px] max-w-[115px] */}
            <footer className="nav-footer">
                <img
                    src={url || undefined}
                    alt={user?.name || 'David'}
                    referrerPolicy="no-referrer"
                />

                <article>
                    {/* // from nav-footer: text-sm md:text-base font-semibold text-dark-200 truncate */}
                    <h2>{user?.name}</h2>
                    {/* // from nav-footer: text-gray-100 text-xs md:text-sm font-normal truncate */}
                    <p>{user?.email}</p>
                </article>

                <button onClick={handleLogout} className="cursor-pointer">
                    <img
                        src="/assets/icons/logout.svg"
                        alt="logout"
                        className="size-6"
                        />
                </button>
            </footer>
        </div>
    </section>
  )
}

export default NavItems