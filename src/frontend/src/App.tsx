import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import AppLayout from './components/layout/AppLayout';
import BrowseListingsPage from './pages/BrowseListingsPage';
import ListingDetailPage from './pages/ListingDetailPage';
import CreateListingPage from './pages/CreateListingPage';
import MyListingsPage from './pages/MyListingsPage';

const rootRoute = createRootRoute({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: BrowseListingsPage,
});

const listingDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/listing/$listingId',
  component: ListingDetailPage,
});

const createListingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/create',
  component: CreateListingPage,
});

const myListingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-listings',
  component: MyListingsPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  listingDetailRoute,
  createListingRoute,
  myListingsRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
