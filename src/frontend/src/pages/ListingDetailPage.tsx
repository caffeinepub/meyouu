import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetListing } from '../hooks/useQueries';
import QueryState from '../components/states/QueryState';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import PurchaseButton from '../components/purchase/PurchaseButton';
import { ArrowLeft, User, Calendar } from 'lucide-react';
import { ListingStatus } from '../backend';

export default function ListingDetailPage() {
  const { listingId } = useParams({ from: '/listing/$listingId' });
  const navigate = useNavigate();
  const { data: listing, isLoading, isError, error } = useGetListing(BigInt(listingId));

  const statusVariant = listing?.status === ListingStatus.available ? 'default' : 'secondary';
  const statusLabel =
    listing?.status === ListingStatus.available
      ? 'Available'
      : listing?.status === ListingStatus.sold
        ? 'Sold'
        : 'Inactive';

  const priceAmount = listing ? Number(listing.price.amount) / 100000000 : 0;

  return (
    <div className="container py-8">
      <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="mb-6 gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Browse
      </Button>

      <QueryState isLoading={isLoading} isError={isError} error={error} isEmpty={!listing}>
        {listing && (
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <Card className="overflow-hidden">
                <CardHeader className="p-0">
                  <div className="relative aspect-square bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-950 dark:to-orange-950 flex items-center justify-center">
                    <Package className="h-32 w-32 text-amber-300 dark:text-amber-700" />
                    <Badge className="absolute right-4 top-4" variant={statusVariant}>
                      {statusLabel}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Listing #{listing.itemId.toString()}</h1>
                <p className="text-4xl font-bold text-amber-600 dark:text-amber-500">
                  {priceAmount.toFixed(2)} ICP
                </p>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>Seller: {listing.seller.toString().slice(0, 10)}...</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Listed: {new Date(Number(listing.createdAt) / 1000000).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {listing.buyer && (
                <>
                  <Separator />
                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-sm font-medium mb-1">Purchased by</p>
                    <p className="text-sm text-muted-foreground">
                      {listing.buyer.toString().slice(0, 10)}...
                    </p>
                  </div>
                </>
              )}

              <Separator />

              <PurchaseButton listing={listing} />
            </div>
          </div>
        )}
      </QueryState>
    </div>
  );
}

function Package({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16.5 9.4 7.55 4.24" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.29 7 12 12 20.71 7" />
      <line x1="12" x2="12" y1="22" y2="12" />
    </svg>
  );
}
