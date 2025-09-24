import React from 'react'
import type { LoaderFunctionArgs } from 'react-router'
import { getAllTrips, getTripById } from '~/appwrite/trips';
// import type { Route } from './+types/trip-details';
import { cn, getFirstWord, parseTripData } from 'assets/lib/utils';
// import type { Route } from './+types/trip-detail';
// // :id -> params.id -> 123
import type { Route } from './+types/trip-detail';
import { Header, InfoPhil, TripCard } from 'components';
import { ChipDirective, ChipListComponent, ChipsDirective } from '@syncfusion/ej2-react-buttons';
// import Trips from './trips';
// import { trace } from 'node:console';

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const { tripId } = params;

    if (!tripId) throw new Error("Trip Id is required");

    const [ trip, allTrips ] = await Promise.all([
      getTripById(tripId),
      getAllTrips(4, 0)
    ])

    // const trip = await getTripById(tripId);
    // const allTrips = await getAllTrips(4, 0)


    return {
              trip,
              allTrips: allTrips.allTrips.map(({ $id, tripDetail, imageUrl }) => ({
                  id: $id,
                  ...parseTripData(tripDetail),
                  imageUrl: imageUrl ?? []
                }
              ))
    };
}

const TripDetails = ({ loaderData }: Route.ComponentProps) => {
    // console.log("Loader Data:", loaderData?.tripDetail?.itinerary?.[0]?.day);

    const tripData = parseTripData(loaderData?.trip?.tripDetail);
    const tripImage = loaderData?.trip?.imageUrl || [];

    const allTrips = loaderData?.allTrips as Trip[] | []

    const {
      name,
      description,
      rating,
      estimatedPrice,
      duration,
      budget,
      travelStyle,
      country,
      interests,
      groupType,
      bestTimeToVisit,
      weatherInfo,
      location,
      practicalInfo,
      itinerary,
      alternatives
    } = tripData || {};

    const pillItems = [
      {
        text: travelStyle,
        background: '!bg-pink-50 !text-pink-500',
      },
      {
        text: groupType,
        background: '!bg-yellow-50 !text-yellow-500',
      },
      {
        text: budget,
        background: '!bg-green-70 !text-green-700',
      },
      {
        text: interests,
        background: '!bg-blue-50 !text-blue-500',
      }
    ]

    const visitTimeAndWeatherInfo = [
      {
        title: "Best time to visit",
        items: bestTimeToVisit
      },
      {
        title: "Weather Info",
        items: weatherInfo
      }
    ]

  return (
    <main className='flex flex-col gap-10 pb-20 w-full max-w-7xl mx-auto px-4 lg:px-8'>
      <Header
        title="Trip Details"
        description='View and edit AI generated Travel plans'
      />

      <section className='flex flex-col gap-9 mt-2.5 w-full max-w-3xl px-4 lg:px-8 mx-auto'>
        <header className='flex flex-col gap-6 overflow-hidden'>
          <h1 className='text-3xl md:text-[40px] md:leading-[44px] font-semibold text-dark-100'>
            {name}
          </h1>

          <div className='flex items-center gap-5'>
            <InfoPhil
              text={`${duration} day plan`}
              image="/assets/icons/calendar.svg"
            />

            <InfoPhil
              text={itinerary?.slice(0, 4).map(
                (item: DayPlan) => item.location).join(", ") || ''
              }
              image="/assets/icons/location-mark.svg"
            />
          </div>
        </header>

        {/* <Info */}
        <section className='grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-7 mt-1'>
          {
            tripImage.map(
              (url: string, index: number) => (
                <img
                  key={index}
                  src={url}
                  alt="Trip Images"
                  className={cn('w-full rounded-xl object-cover', index === 0 ? 'md:col-span-2 md:row-span-2 h-[330px]' : 'md:row-col-1 h-[150px]' )}
                />
              )
            )
          }
        </section>

        <section className='flex gap-3 md:gap-5 items-center flex-wrap'>
          <ChipListComponent id="travel-chip">
            <ChipsDirective>
              {
                pillItems.map(
                  ({ text, background }, index: number ) => (
                    <ChipDirective
                      key={index}
                      text={getFirstWord(text)}
                      cssClass={`${background} text-base font-medium px-4`}
                    />
                  )
                )
              }
            </ChipsDirective>
          </ChipListComponent>

          <ul className='flex gap-1 items-center'>
            {
              Array(5).fill('null').map(
                (_, index) => (
                  <li key={index}>
                    <img
                      src="/assets/icons/star.svg"
                      alt="rating"
                      className='size-[18px]'
                    />
                  </li>
                )
              )
            }

            <li className="ml-1">
              <ChipListComponent>
                <ChipsDirective>
                  <ChipDirective
                    text={`${rating}/5`}
                    cssClass="!bg-yellow-50 !text-yellow-700"
                  />
                </ChipsDirective>
              </ChipListComponent>
            </li>
          </ul>
        </section>


        <section className='flex justify-between gap-5'>
          <article className="flex flex-col gap-4">
            <h3 className="text-xl md:text-3xl text-dark-100 font-semibold">
              {duration}-Day {country} {travelStyle} Trip
            </h3>

            <p className='text-base md:text-2xl text-gray-100 font-normal'>
              {budget}, {groupType} and {interests}
            </p>
          </article>

          <h2>
            {estimatedPrice}
          </h2>

        </section>

        <p className="text-sm md:text-lg font-normal text-dark-400">
          {description}
        </p>

        <ul className='flex flex-col gap-9'>
          {
            itinerary?.map(
              (dayPlan: DayPlan, index: number) => (
                <li key={index} className='flex flex-col gap-4'>
                  <h3 className='text-base md:text-2xl font-semibold text-dark-400'>
                    Day {dayPlan.day}: {dayPlan.location}
                  </h3>

                  <ul className='flex flex-col sm:gap-3 gap-7'>
                    {
                      dayPlan.activities.map(
                        (activity: Activity, index: number) => (
                          <li key={index} className='flex max-sm:flex-col flex-row justify-between sm:gap-7 gap-3 text-sm md:text-lg font-normal text-dark-400 !list-disc'>
                            <span className='flex-shring-0 text-[14px] md:text-[18px] leading-[14px] md:leading-[16px] font-semibold'>
                              <span className="flex flex-col md:flex-row gap-7">
                                <p className='flex-grow md:text-xl'>{activity.time}</p>
                                <p className="md:text-base text-gray-100 font-normal">{activity.description}</p>
                              </span>
                              <p className="text-base">{activity.specificDetails} Your budget should be around {activity.estimatedCost}. It should last for {activity.duration}</p>
                            </span>
                          </li>
                        )
                      )
                    }
                  </ul>
                </li>
              )
            )
          }
        </ul>


        {
          visitTimeAndWeatherInfo.map(
            ({ title, items }, index: number) => (
              <section key={index} className='flex flex-col gap-5'>
                <div className='flex flex-col gap-4'>
                  <h3 className='text-base md:text-xl text-dark-400 font-semibold'>
                    {title}
                  </h3>
                  <ul className='flex flex-col gap-3'>
                    {
                      items?.map(
                        (item, index) => (
                          <li key={index} className='flex justify-between gap-7 text-sm md:text-lg font-normal text-dark-400 !list-disc'>
                            <p className='flex-grow'>{item}</p>
                          </li>
                        )
                      )
                    }
                  </ul>
                </div>
              </section>
            )
          )
        }

      </section>

      

      {/* <section className="flex justify-between gap-5">
        <article className='flex flex-col gap-3'>
          <h3 className='font-bold text-xl md:text-3xl text-dark-400'>
            Applicable information
          </h3>

          <div className='flex flex-col gap-2'>
            <h4 className='text-sm md:text-xl font-semibold text-dark-400'>
              Budget Breakdown
            </h4>
            <p className='text-base md:text-lg font-normal'>
              Accomodation: {practicalInfo?.budgetBreakdown.accommodation}
            </p>
            <p className='text-base md:text-lg font-normal'>
              food: {practicalInfo?.budgetBreakdown.food}
            </p>
            <p className='text-base md:text-lg font-normal'>
              activities:  {practicalInfo?.budgetBreakdown.activities}
            </p>
            <p className='text-base md:text-lg font-normal'>
              transport: {practicalInfo?.budgetBreakdown.transport}
            </p>
          </div>
        </article>
      </section> */}

      <section className='flex flex-col gap-6'>
        <h2 className='text-lg md:text-2xl font-semibold text-dark-100'>Popular Trips</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-7'>
          {
            allTrips.map(
              ({ id, name, imageUrl, itinerary, interests, travelStyle, estimatedPrice }, index) => (
                <TripCard
                  id={id}
                  key={index || id}
                  name={name}
                  imageUrl={imageUrl[0]}
                  location={itinerary?.[0].location ?? ""}
                  tags={[ interests, travelStyle ]}
                  price={estimatedPrice}
                />
              )
            )
          }
        </div>
      </section>
    </main>
  )
}

export default TripDetails