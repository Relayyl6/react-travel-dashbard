import { Header, StatsCard, TripCard } from "components";
import { getUser } from "~/appwrite/auth";
import { dashboardStats, allTrips } from "~/constants";
import type { Route } from './+types/Dashboard'

const { totalUsers, usersJoined, totalTrips, tripsCreated, userRole } = dashboardStats;

export const clientLoader = async () => await getUser();

const Dashboard = ({ loaderData }: Route.ComponentProps ) => {
  const user = loaderData as unknown as User | null;

  return (
    // dashboard: flex flex-col gap-10 w-full pb-20
    <main className="flex flex-col gap-10 pb-20 w-full max-w-7xl mx-auto px-4 lg:px-8">
        <Header
          title={`Welcome ${user?.name ?? 'Guest'} 👋`}
          description="Track activity trends and popular destinations in real time"
        />

        {/* Dashboard page content */}
        <section className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <StatsCard
              headerTitle="Total Users"
              total={totalUsers}
              currentMonthCount={usersJoined.currentMonth}
              lastMonthCount={usersJoined.lastMonth}
              />
            <StatsCard
              headerTitle="Total Trips"
              total={totalTrips}
              currentMonthCount={tripsCreated.currentMonth}
              lastMonthCount={tripsCreated.lastMonth}
              />
            <StatsCard
              headerTitle="Active Users Today"
              total={userRole.total}
              currentMonthCount={userRole.currentMonth}
              lastMonthCount={userRole.lastMonth}
              />
          </div>
        </section>

        {/* // container; flex flex-col gap-9 mt-2.5 */}
        <section className="container">
          <h1 className="text-xl font-semibold text-dark-100">
            Created Trips
          </h1>
          {/* // trip-grid: grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-7 */}
          <div className="trip-grid">
            {
              allTrips.slice(0, 4).map(
                ({ id, name, imageUrls, itinerary, tags, travelStyle, estimatedPrice }) => (
                  <TripCard
                    key={id}
                    id={id.toString()}
                    name={name}
                    imageUrl={imageUrls[0]}
                    location={itinerary?.[0]?.location ?? ''}
                    tags={tags}
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

export default Dashboard