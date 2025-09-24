import { Header, StatsCard, TripCard } from "components";
import { getUser } from "~/appwrite/auth";
// import { dashboardStats, allTrips } from "~/constants";
// import { allTrips } from "~/constants";
import type { Route } from './+types/Dashboard'
import { getUsersandTripStats } from "~/appwrite/dashboard";
import { getAllTrips } from "~/appwrite/trips";
import { parseTripData } from "assets/lib/utils";

// interface Prop {
//   id: number;
//   name: string;

// }

// const { totalUsers, usersJoined, totalTrips, tripsCreated, userRole } = dashboardStats;

export const clientLoader = async () => {
  const [ user, dashboardStats, allTrips ] = await Promise.all([
    getUser(),
    getUsersandTripStats(),
    getAllTrips(4, 0)
  ])

  return {
    user,
    dashboardStats,
    allTrips: allTrips.allTrips.map(({ $id, tripDetail, imageUrl }) => ({
        id: $id,
        ...parseTripData(tripDetail),
        imageUrl: imageUrl ?? []
      }
    ))
  }
};

const Dashboard = ({ loaderData }: Route.ComponentProps ) => {
  const user = loaderData.user as unknown as User | null;
  const { totalUsers, usersJoined, userRole, totalTrips, tripsCreated } = loaderData.dashboardStats as DashboardStats;
  const allTrips = loaderData.allTrips;

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
        <section className="flex flex-col gap-9 mt-2.5">
          <h1 className="text-xl font-semibold text-dark-100">
            Created Trips
          </h1>
          {/* // trip-grid: grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-7 */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-7">
            {
              allTrips.map(
                ({ id, name, imageUrl, itinerary, interests, travelStyle, estimatedPrice }) => (
                  <TripCard
                    key={id}
                    id={id.toString()}
                    name={name as string}
                    imageUrl={imageUrl[0]}
                    location={itinerary?.[0]?.location ?? ''}
                    tags={[interests, travelStyle] as string[]}
                    price={estimatedPrice as string}
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