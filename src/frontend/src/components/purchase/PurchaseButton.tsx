import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { ShoppingCart } from 'lucide-react';
import { usePurchaseListing } from '../../hooks/useListingMutations';
import { useAuth } from '../../hooks/useAuth';
import type { Listing } from '../../backend';
import { ListingStatus } from '../../backend';
import { toast } from 'sonner';

interface PurchaseButtonProps {
  listing: Listing;
}

export default function PurchaseButton({ listing }: PurchaseButtonProps) {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, principalString } = useAuth();
  const purchaseMutation = usePurchaseListing();

  const isAvailable = listing.status === ListingStatus.available;
  const isOwnListing = principalString === listing.seller.toString();
  const canPurchase = isAuthenticated && isAvailable && !isOwnListing;

  const handlePurchase = async () => {
    try {
      await purchaseMutation.mutateAsync(listing.listingId);
      toast.success('Purchase successful!');
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to purchase listing');
    }
  };

  if (!isAvailable) {
    return (
      <Button disabled className="w-full gap-2">
        <ShoppingCart className="h-4 w-4" />
        Sold Out
      </Button>
    );
  }

  if (isOwnListing) {
    return (
      <Button disabled variant="outline" className="w-full gap-2">
        <ShoppingCart className="h-4 w-4" />
        Your Listing
      </Button>
    );
  }

  if (!isAuthenticated) {
    return (
      <Button disabled className="w-full gap-2">
        <ShoppingCart className="h-4 w-4" />
        Sign In to Purchase
      </Button>
    );
  }

  const priceAmount = Number(listing.price.amount) / 100000000;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button disabled={!canPurchase} className="w-full gap-2">
          <ShoppingCart className="h-4 w-4" />
          Purchase for {priceAmount.toFixed(2)} ICP
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Purchase</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to purchase this item for {priceAmount.toFixed(2)} ICP? This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handlePurchase} disabled={purchaseMutation.isPending}>
            {purchaseMutation.isPending ? 'Processing...' : 'Confirm Purchase'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
