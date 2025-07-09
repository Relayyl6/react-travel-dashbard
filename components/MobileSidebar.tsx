// @ts-nocheck
import { Link } from "react-router"
import { SidebarComponent } from '@syncfusion/ej2-react-navigations';
import NavItems from "./NavItems";

const MobileSidebar = () => {
    let sidebar: SidebarComponent;
    const toggleSidebar = () => {
        sidebar.toggle()
    }

  return (
    // mobile-sidebar: lg:hidden flex flex-col gap-5 // any header within: flex justify-between items-center border-b border-light-100 // any h1 within: text-base md:text-2xl font-bold text-dark-100
    <div className="mobile-sidebar wrapper">
        <header>
            <Link to='/'>
                <img 
                    src="/public/assets/icons/logo.svg"
                    alt="logo"
                    className="size-[30px]"
                />
                <h1>Tour Leroy</h1>
            </Link>

            <button onClick={toggleSidebar}>
                <img 
                    src="/public/assets/icons/menu.svg"
                    className="size-7 mr-2"
                    />
            </button>
        </header>

        <SidebarComponent 
            width={270}
            ref={(Sidebar) => sidebar = Sidebar}
            created={() => sidebar.hide()}
            closeOnDocumentClick={true}
            showBackdrop={true}
            type="over">
            <NavItems handleClick={toggleSidebar}/>
        </SidebarComponent>
    </div>
  )
}

export default MobileSidebar