import { cn } from "assets/lib/utils";
import { useLocation } from "react-router";

interface HeaderProps {
  title: string;
  description: string;
}
// header: flex flex-col gap-5 md:flex-row justify-between w-full
// any article within header: flex flex-col gap-3.5 w-full
const Header = ({ title, description }: HeaderProps ) => {

  const location = useLocation();

  return (
    <header className="header">
      <article>
        <h1 className={cn("text-dark-100", location.pathname === '/' ? 'text-2xl md:text-4xl font-bold' : 'text-xl md:text-2xl font-semibold')}>
          {title}
        </h1>
        <p className={cn("text-grey-100 font-normal", location.pathname === '/' ? 'text-base md:text-lg' : 'text-sm md:text-lg')}>
          {description}
        </p>
      </article>
    </header>
  )
}

export default Header