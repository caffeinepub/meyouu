import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Edit } from 'lucide-react';
import ListingForm from './ListingForm';
import { useUpdateListing } from '../../hooks/useListingMutations';
import type { Listing } from '../../backend';
import { toast } from 'sonner';

interface EditListingDialogProps {
  listing: Listing;
}

export default function EditListingDialog({ listing }: EditListingDialogProps) {
  const [open, setOpen] = useState(false);
  const updateMutation = useUpdateListing();

  const priceInIcp = Number(listing.price.amount) / 100000000;

  const handleSubmit = async (data: {
    title: string;
    description: string;
    price: any;
    imageUrls: string[];
  }) => {
    try {
      await updateMutation.mutateAsync({
        listingId: listing.listingId,
        description: data.description,
        imageUrls: data.imageUrls,
        price: data.price,
      });
      toast.success('Listing updated successfully');
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update listing');
      throw error;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Edit className="h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Listing</DialogTitle>
          <DialogDescription>Update your listing details below.</DialogDescription>
        </DialogHeader>
        <ListingForm
          initialData={{
            title: listing.itemId.toString(),
            description: '',
            price: priceInIcp.toString(),
            imageUrls: '',
          }}
          onSubmit={handleSubmit}
          submitLabel="Update Listing"
          isSubmitting={updateMutation.isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
