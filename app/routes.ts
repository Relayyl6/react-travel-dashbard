import { type RouteConfig, layout, route } from "@react-router/dev/routes";

export default [
    layout('routes/admin/admin-layout.tsx', [
        route('dashboard', 'routes/admin/Dashboard.tsx'), // path: 'dashboard', file: 'routes/admin/Dashboard.tsx'
        route('all-users', 'routes/admin/all-users.tsx') // path: 'dashboard', file: 'routes/admin/Dashboard.tsx'
    ]) // file: '/routes/admin/admin-layout.tsx', children: []
] satisfies RouteConfig;