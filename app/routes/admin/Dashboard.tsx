import { Header, StatsCard, TripCard } from "components";
import { getAllUsers, getUser } from "~/appwrite/auth";
// import { dashboardStats, allTrips } from "~/constants";
// import { allTrips } from "~/constants";
import type { Route } from './+types/Dashboard'
import { getUsersandTripStats, getUserGrowthPerDay, getTripsByTravelStyle } from "~/appwrite/dashboard";
import { getAllTrips } from "~/appwrite/trips";
import { parseTripData } from "assets/lib/utils";
import { ChartComponent, ColumnSeries, Inject, SplineAreaSeries, Category, DataLabel, Tooltip, SeriesCollectionDirective, SeriesDirective } from "@syncfusion/ej2-react-charts";
import { tripXAxis, tripYAxis, userXAxis, userYAxis } from "~/constants";
import { ColumnsDirective, ColumnDirective, GridComponent } from '@syncfusion/ej2-react-grids';
// import AllUsers from "./all-users";

export const clientLoader = async () => {
  const [ user, dashboardStats, allTrips, userGrowth, tripsByTravelStyle, allUsers ] = await Promise.all([
    getUser(),
    getUsersandTripStats(),
    getAllTrips(4, 0),
    getUserGrowthPerDay(),
    getTripsByTravelStyle(),
    getAllUsers(4, 0)
  ])

  console.log(tripsByTravelStyle);

  const trips = allTrips.allTrips.map(({ $id, tripDetail, imageUrl }) => ({
        id: $id,
        ...parseTripData(tripDetail),
        imageUrl: imageUrl ?? []
      }
    ));

    const mappedUsers: UsersItineraryCount[] = allUsers.users.map((user) => ({
      imageUrl: user.imageUrl,
      name: user.name,
      count: user.itineraryCount ?? Math.floor(Math.random() * 10),
    }))

  return {
    user,
    dashboardStats,
    userGrowth,
    tripsByTravelStyle,
    allTrips: trips,
    users: mappedUsers
  }
};

const Dashboard = ({ loaderData }: Route.ComponentProps ) => {
  const user = loaderData.user as unknown as User | null;
  const { totalUsers, usersJoined, userRole, totalTrips, tripsCreated } = loaderData.dashboardStats as DashboardStats;
  const { allTrips, userGrowth, tripsByTravelStyle, users } = loaderData;

  const trips = allTrips.map((trip) => (
    {
      imageUrl: trip.imageUrl[0],
      name: trip.name,
      interests: trip.interests
    }
  ))

  const usersAndTrips = [
    {
      title: "Latest User signups",
      dataSource: users,
      field: "count",
      headerText: "Trips created"
    },
    {
      title: "Trips based on Interests",
      dataSource: trips,
      field: "interests",
      headerText: "Interests"
    }
  ]

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
                    name={name!}
                    imageUrl={imageUrl[0]}
                    location={itinerary?.[0]?.location ?? ''}
                    tags={[interests!, travelStyle!]}
                    price={estimatedPrice!}
                    />
                )
              )
            }
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <ChartComponent
            id="chart-1"
            primaryXAxis={userXAxis}
            primaryYAxis={userYAxis}
            tooltip={{ enable: true }}
            title="User Growth Over Time"
            >
            <Inject
              services={
                [
                  ColumnSeries,
                  SplineAreaSeries,
                  Category,
                  DataLabel,
                  Tooltip,
                ]
              }
            />

            <SeriesCollectionDirective>
              <SeriesDirective
                dataSource={userGrowth}
                xName="day"
                yName="count"
                type="Column"
                name="Column"
                columnWidth={0.3}
                cornerRadius={{ topLeft: 10, topRight: 10 }}
              />

              <SeriesDirective
                dataSource={userGrowth}
                xName="day"
                yName="count"
                type="SplineArea"
                name="wave"
                fill="rgba(71, 132, 238, 0.3)"
                border={{ width: 2, color: '#4784EE' }}
              />
            </SeriesCollectionDirective>
          </ChartComponent>

          <ChartComponent
            id="chart-2"
            primaryXAxis={tripXAxis}
            primaryYAxis={tripYAxis}
            tooltip={{ enable: true }}
            title="Trip trend Over Time"
            >
            <Inject
              services={
                [
                  ColumnSeries,
                  SplineAreaSeries,
                  Category,
                  DataLabel,
                  Tooltip,
                ]
              }
            />

            <SeriesCollectionDirective>
              <SeriesDirective
                dataSource={tripsByTravelStyle}
                xName="travelStyle"
                yName="count"
                type="Column"
                name="day"
                columnWidth={0.3}
                cornerRadius={{ topLeft: 10, topRight: 10 }}
              />
            </SeriesCollectionDirective>
          </ChartComponent>

        </section>

        <section className='pb-20 flex flex-col lg:flex-row gap-5 justify-between wrapper'>
          {
            usersAndTrips.map(({ title, dataSource, field, headerText }, index) => (
              <div key={index} className="flex flex-col gap-5">
                <h3 className="text-base md:text-[20xp] md:leading-7 font-semibold text-dark-100">{title}</h3>

                <GridComponent dataSource={dataSource} gridLines="None">
                  <ColumnsDirective>
                    <ColumnDirective
                        field="name"
                        headerText="Name"
                        width="200"
                        textAlign="Left"
                        template={(props: UserData) => (
                          <div className="flex items-center gap-1.5 px-1.4">
                            <img
                              src={props.imageUrl || "/assets/images/david.webp"}
                              alt="user"
                              className="rounded-full size-8 aspect-square"
                              referrerPolicy="no-referrer"
                            />
                            <span>{props.name}</span>
                          </div>
                      )
                    }/>
                    <ColumnDirective
                        field={field}
                        headerText={headerText}
                        width="200"
                        textAlign="Left"/>
                  </ColumnsDirective>
                </GridComponent>
              </div>
            ))
          }
        </section>

    </main>
  )
}

export default Dashboard