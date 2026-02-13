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
import { Trash2 } from 'lucide-react';
import { useDeleteListing } from '../../hooks/useListingMutations';
import type { ListingId } from '../../backend';
import { toast } from 'sonner';

interface DeleteListingDialogProps {
  listingId: ListingId;
}

export default function DeleteListingDialog({ listingId }: DeleteListingDialogProps) {
  const [open, setOpen] = useState(false);
  const deleteMutation = useDeleteListing();

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(listingId);
      toast.success('Listing deleted successfully');
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete listing');
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" className="gap-2">
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your listing.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
