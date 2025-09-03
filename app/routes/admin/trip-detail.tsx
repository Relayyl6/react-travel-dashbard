import React from 'react'
import type { LoaderFunctionArgs } from 'react-router'
import { getTripById } from '~/appwrite/trips';
// import type { Route } from './+types/trip-details';
import { parseTripData } from 'assets/lib/utils';
// import type { Route } from './+types/trip-detail';
// // :id -> params.id -> 123
import type { Route } from './+types/trip-detail';
import { Header } from 'components';

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const { tripId } = params;

    if (!tripId) throw new Error("Trip Id is required");

    const trip = await getTripById(tripId);

    return trip;
}

const TripDetails = ({ loaderData }: Route.ComponentProps) => {
    const tripData = parseTripData(loaderData?.trip);

    const { name } = tripData || {};

  return (
    <main className='flex flex-col gap-10 pb-20 wrapper'>
      <Header
        title="Trip Details"
        description='View and edit AI generated Travel plans'
      />

      <section className='flex flex-col gap-9 mt-2.5 wrapper-md'>
        <header>
          <h1 className='text-3xl md:text-[40px] md:leading-[44px] font-semibold text-dark-100'>
            {name}
          </h1>
        </header>
      </section>
    </main>
  )
}

export default TripDetails