import { Header, TripCard } from 'components'
import { getAllTrips } from '~/appwrite/trips'
import type { Route } from './+types/trips'
import { useSearchParams, type LoaderFunctionArgs } from "react-router"
import { parseTripData } from 'assets/lib/utils'
import { useState } from 'react'
import { PagerComponent } from '@syncfusion/ej2-react-grids'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const limit = 8;
  const url = new URL(request.url)
  const page = parseInt(url.searchParams.get('page') || "1", 10)

  const offset = (page - 1) * limit
  const { allTrips, total } = await getAllTrips(limit, offset)


  return {
    allTrips: allTrips.map(({ $id, tripDetail, imageUrl }) => ({
      id: $id,
      ...parseTripData(tripDetail),
      imageUrl: imageUrl ?? []
    })),
    total
  }
}

const Trips = ({ loaderData }: Route.ComponentProps) => {
  const allTrips = loaderData.allTrips as Trip[] | [];
  const [ searchParams ] = useSearchParams();
  const initialPage = Number(searchParams.get('page') || '1')

  const [ currentPage, setCurrentPage ] = useState(initialPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.location.search = `?page=${page}`
  }

  return (
    <main className="w-full min-h-screen flex flex-col gap-10 wrapper">
      <Header
        title="Trips"
        description='View and edit AI-generated Travel Plans'
        ctaText="Create a Trip"
        ctaUrl="/trips/create"
      />

      <section>
        <h1 className='text-lg md:text-2xl font-semibold text-dark-100 mb-4'>
          Manage Created Trips
        </h1>

        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-7 mb-4'>
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

        <PagerComponent
          totalRecordsCount={loaderData.total}
          pageSize={8}
          currentPage={currentPage}
          click={
            (args) => {
              handlePageChange(args.currentPage)
            }
          }
          cssClass='!mb-8'
        />
      </section>
    </main>
  )
}

export default Trips