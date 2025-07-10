import { cn } from "assets/lib/utils"
import { Link, NavLink } from "react-router"
import { sidebarItems } from "~/constants"

const NavItems = ({ handleClick }: { handleClick?: () => void }) => {
    // hardocding temporary user data
    const user = {
        name: 'Leonard Oseghale',
        email: 'oseghaleleonard39@gmail.com',
        imageUrl: '/public/assets/images/david.webp'
    }


  return (
    // nav-items: flex flex-col px-6 h-full // any .container within: flex flex-col justify-between h-full // any nav within: flex flex-col gap-3.5 pt-9
    <section className="nav-items"> 
        {/* // link-logo: flex items-center gap-1.5 py-10 border-b border-light-100 // any h1 within: text-base md:text-2xl font-bold text-dark-100 */}
        <Link to='/' className="link-logo"> 
            <img 
                src="/public/assets/icons/logo.svg"
                alt="logo"
                className="size-[30px]"
                />
            <h1>Tour Leroy</h1>
        </Link>
        {/* // container: flex flex-col gap-9 mt-2.5 // any div within: flex items-center gap-5 */}
        <div className="container"> 
            <nav>
                {
                    sidebarItems.map(
                        ({ id, icon, label, href }) => (
                            <NavLink to={href} key={id}>
                                {({ isActive }: { isActive: boolean }) => (
                                    <div className={cn('group nav-item', {'bg-primary-100 !text-white': isActive})} onClick={handleClick}> 
                                        <img
                                            src={icon}
                                            alt="label"
                                            className={`group-hover:brightness-0 size-5 group-hover:invert ${isActive ? 'brightness-0 invert' : 'text-dark-200' }`}/>
                                        {label}
                                    </div>
                                )}
                            </NavLink>
                        )
                    )
                }
            </nav>
            {/* // nav-item: flex items-center text-xs md:text-lg font-normal cursor-pointer gap-2.5 py-[18px] px-3.5 rounded-lg text-dark-200 hover:bg-primary-100 hover:text-white */}
            {/* note // the NavLink component automatically provides an object to its child function  which contains information about the current navigation state. // this is where isAcive is being destructured from */}
            {/* // nav-footer: flex items-center gap-2.5 pb-8 // any img within: size-10 rounded-full aspect-square // any article within: flex flex-col gap-[2px] max-w-[115px] */}
            <footer className="nav-footer">  
                <img 
                    src={user?.imageUrl || '/public/assets/images/david.webp'}
                    alt={user?.name || 'David'}/>

                <article>
                    {/* // from nav-footer: text-sm md:text-base font-semibold text-dark-200 truncate */}
                    <h2>{user?.name}</h2> 
                    {/* // from nav-footer: text-gray-100 text-xs md:text-sm font-normal truncate */}
                    <p>{user?.email}</p> 
                </article>

                <button onClick={() => {console.log('logout')}} className="cursor-pointer">
                    <img 
                        src="/public/assets/icons/logout.svg"
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