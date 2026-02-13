import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import type { Listing } from '../../backend';
import { ListingStatus } from '../../backend';

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const statusVariant = listing.status === ListingStatus.available ? 'default' : 'secondary';
  const statusLabel =
    listing.status === ListingStatus.available
      ? 'Available'
      : listing.status === ListingStatus.sold
        ? 'Sold'
        : 'Inactive';

  const priceAmount = Number(listing.price.amount) / 100000000; // Convert e8s to ICP

  return (
    <Link to="/listing/$listingId" params={{ listingId: listing.listingId.toString() }}>
      <Card className="group h-full overflow-hidden transition-all hover:shadow-lg">
        <CardHeader className="p-0">
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-950 dark:to-orange-950">
              <Package className="h-16 w-16 text-amber-300 dark:text-amber-700" />
            </div>
            <Badge className="absolute right-2 top-2" variant={statusVariant}>
              {statusLabel}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <h3 className="line-clamp-2 text-lg font-semibold group-hover:text-amber-600 dark:group-hover:text-amber-500">
            {listing.itemId.toString()}
          </h3>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <p className="text-xl font-bold text-amber-600 dark:text-amber-500">
            {priceAmount.toFixed(2)} ICP
          </p>
        </CardFooter>
      </Card>
    </Link>
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
