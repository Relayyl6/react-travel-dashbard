import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { cn } from "assets/lib/utils";
import { Link, useLocation } from "react-router";

interface HeaderProps {
  title: string;
  description: string;
  ctaText?: string;
  ctaUrl?: string;
}
// header: flex flex-col gap-5 md:flex-row justify-between w-full
// any article within header: flex flex-col gap-3.5 w-full
const Header = ({ title, description, ctaText, ctaUrl }: HeaderProps ) => {

  const location = useLocation();

  return (
    <header className="flex flex-col md:flex-row gap-5 justify-between w-full">
      <article className="flex flex-col gap-3.5 w-full">
        <h1 className={cn("text-dark-100", location.pathname === '/' ? 'text-2xl md:text-4xl font-bold' : 'text-xl md:text-2xl font-semibold')}>
          {title}
        </h1>
        <p className={cn("text-grey-100 font-normal", location.pathname === '/' ? 'text-base md:text-lg' : 'text-sm md:text-lg')}>
          {description}
        </p>
      </article>
      {
        ctaText && ctaUrl && (
          <Link to={ctaUrl}>
            <ButtonComponent
              type="button"
              className="!bg-primary-100 !flex !px-4 !rounded-lg !items-center !justify-center !mx-auto !gap-1.5 !shadow-none !h-11 !w-full md:w-[240px]"
            >
              <img
                src="./assets/icons/plus.svg"
                alt="add trip"
                className="size-5"
              />
              <span className="p-16-semibold text-white">{ctaText}</span>
            </ButtonComponent>
          </Link>
        )
      }
    </header>
  )
}

export default Header