import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    route('sign-in', 'routes/root/sign-in.tsx'),
    route('api/create-trip', 'routes/api/create-trip.ts'),
    layout('routes/admin/admin-layout.tsx', [
        route('dashboard', 'routes/admin/Dashboard.tsx'), // path: '/dashboard', file: 'routes/admin/Dashboard.tsx'
        route('history', 'routes/admin/History.tsx'),
        route('catalogue', 'routes/admin/Catalogue.tsx'),
        route('recommmendation', 'routes/admin/Recommmendation.tsx'),
        route('all-users', 'routes/admin/all-users.tsx'), // path: '/all-users', file: 'routes/admin/all-users.tsx'
        route('trips', 'routes/admin/trips.tsx'), // path: '/trips', file: 'routes/admin/trips.tsx'
        route('trips/create', 'routes/admin/create-trip.tsx'), // path: 'trips/create', file: 'routes/admin/createTrip.tsx'
        route('trips/:tripId', 'routes/admin/trip-detail.tsx')
    ]), // file: '/routes/admin/admin-layout.tsx', children: []
    layout('routes/root/page-layout.tsx', [
        index("routes/root/travel-page.tsx")
    ]) // file: '/routes/admin/admin-layout.tsx', children: []
] satisfies RouteConfig;