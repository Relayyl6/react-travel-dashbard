import React from 'react'
import type { LoaderFunctionArgs } from 'react-router'
import { getTripById } from '~/appwrite/trips';
// import type { Route } from './+types/trip-details';
import { parseTripData } from 'assets/lib/utils';
// import type { Route } from './+types/trip-detail';
// :id -> params.id -> 123

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const { tripId } = params;

    if (!tripId) throw new Error("Trip Id is required");

    const trip = await getTripById(tripId);

    return trip;
}

const TripDetails = ({ loaderData }: Route) => {
    const tripData = parseTripData(loaderData?.trip);
  return (
    <div>TripDetails</div>
  )
}

export default TripDetails