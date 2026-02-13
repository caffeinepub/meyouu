import AuthGate from '../components/auth/AuthGate';
import { useGetMyListings } from '../hooks/useQueries';
import QueryState from '../components/states/QueryState';
import { Card, CardContent, CardFooter, CardHeader } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import EditListingDialog from '../components/listings/EditListingDialog';
import DeleteListingDialog from '../components/listings/DeleteListingDialog';
import { ListingStatus } from '../backend';
import { Package } from 'lucide-react';

export default function MyListingsPage() {
  const { data: listings, isLoading, isError, error } = useGetMyListings();

  return (
    <AuthGate message="You need to sign in to view your listings.">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Listings</h1>
          <p className="text-muted-foreground">Manage your marketplace listings</p>
        </div>

        <QueryState
          isLoading={isLoading}
          isError={isError}
          error={error}
          isEmpty={!listings || listings.length === 0}
          emptyMessage="You haven't created any listings yet"
          emptyIcon={<Package className="h-8 w-8 text-muted-foreground" />}
        >
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings?.map((listing) => {
              const statusVariant =
                listing.status === ListingStatus.available ? 'default' : 'secondary';
              const statusLabel =
                listing.status === ListingStatus.available
                  ? 'Available'
                  : listing.status === ListingStatus.sold
                    ? 'Sold'
                    : 'Inactive';
              const priceAmount = Number(listing.price.amount) / 100000000;

              return (
                <Card key={listing.listingId.toString()} className="flex flex-col">
                  <CardHeader className="p-0">
                    <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-950 dark:to-orange-950 flex items-center justify-center rounded-t-lg">
                      <Package className="h-16 w-16 text-amber-300 dark:text-amber-700" />
                      <Badge className="absolute right-2 top-2" variant={statusVariant}>
                        {statusLabel}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 p-4">
                    <h3 className="text-lg font-semibold mb-2">
                      Listing #{listing.itemId.toString()}
                    </h3>
                    <p className="text-xl font-bold text-amber-600 dark:text-amber-500">
                      {priceAmount.toFixed(2)} ICP
                    </p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex gap-2">
                    <EditListingDialog listing={listing} />
                    <DeleteListingDialog listingId={listing.listingId} />
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </QueryState>
      </div>
    </AuthGate>
  );
}
