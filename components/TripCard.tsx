import { cn, getFirstWord } from 'assets/lib/utils';
import React from 'react'
import { Link, useLocation } from 'react-router'
import { ChipListComponent, ChipsDirective, ChipDirective } from "@syncfusion/ej2-react-buttons"

const TripCard = ({ id, name, imageUrl, location, tags, price }: TripCardProps) => {

  const path = useLocation();
  // trip-card: shadow-300 bg-white rounded-[20px] flex flex-col w-full relative
  // img within trip-card: w-full h-[160px] rounded-t-xl object-cover aspect-video
  // article within trip-card: flex flex-col gap-3 mt-4 pl-[18px] pr-3.5
  // h2 within article: text-sm md:text-lg font-semibold text-dark-100 line-clamp-2
  // figure within article: flex items-center gap-2
  // figcaption within figure: text-xs md:text-sm font-normal text-gray-100
  return (
    <Link
      to={path.pathname === "/" || path.pathname.startsWith('/travel') ? `/travel/${id}` : `/trips/${id}`}
      className="trip-card">
      <img
        src={imageUrl}
        alt={name}
        />

      <article>
        <h2>{name}</h2>
        <figure>
          <img
            src="/assets/icons/location-mark.svg"
            alt="location"
            className='size-4'
          />
          <figcaption>
            {location}
          </figcaption>
        </figure>
      </article>

      <div className='mt-2 pl-[18px] pr-3.5 pb-5'>
        <ChipListComponent id="travel-chip">
          <ChipsDirective>
            {
              tags.map(
                (tag, index) => (
                  <ChipDirective
                    key={index}
                    text={getFirstWord(tag)}
                    cssClass={cn(index === 1 ? "!bg-pink-50 !text-pink-500" : "!bg-success-50 !text-success-700")}
                    />
                )
              )
            } 
          </ChipsDirective>
        </ChipListComponent>
      </div>
      
      {/* console.log("🔍 ~  ~ components/TripCard.tsx:55 ~ variable:", variable); */}
      {/* // tripCard-pill: bg-white py-1 px-2.5 w-fit rounded-[20px] absolute top-2.5 right-4 text-dark-100 text-sm font-semibold */}
      <article className='bg-white py-1 px-2.5 w-fit rounded-[20px] absolute top-2.5 right-4 text-dark-100 text-sm font-semibold'>
        {price}
      </article>
    </Link>
  );
}

export default TripCard