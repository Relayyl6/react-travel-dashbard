import React from 'react'
import { Link, useLocation } from 'react-router'

const TripCard = ({ id, name, imageUrl, location, tags, price }: TripCardProps) => {

  const path = useLocation();
  // trip-card: shadow-300 bg-white rounded-[20px] flex-col w-full relative
  // img within trip-card: w-full h-[160px] rounded-t-xl object-cover aspect-video
  // article within trip-card: flex flex-col gap-3 mt-4 pl-[18px] pr-3.5
  // figure within article 
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
            src="/public/assets/icons/location-mark.svg"
            alt="location"
            className='size-4'
            />
          <figcaption>
            {location}
          </figcaption>
        </figure>
      </article>
    </Link>
  );
}

export default TripCard