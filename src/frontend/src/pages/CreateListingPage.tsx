import { useNavigate } from '@tanstack/react-router';
import AuthGate from '../components/auth/AuthGate';
import ListingForm from '../components/listings/ListingForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useCreateListing } from '../hooks/useListingMutations';
import { toast } from 'sonner';

export default function CreateListingPage() {
  const navigate = useNavigate();
  const createMutation = useCreateListing();

  const handleSubmit = async (data: {
    title: string;
    description: string;
    price: any;
    imageUrls: string[];
  }) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success('Listing created successfully!');
      navigate({ to: '/my-listings' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to create listing');
      throw error;
    }
  };

  return (
    <AuthGate message="You need to sign in to create a listing.">
      <div className="container py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Create New Listing</CardTitle>
            <CardDescription>
              Fill in the details below to list your item on the marketplace.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ListingForm
              onSubmit={handleSubmit}
              submitLabel="Create Listing"
              isSubmitting={createMutation.isPending}
            />
          </CardContent>
        </Card>
      </div>
    </AuthGate>
  );
}
