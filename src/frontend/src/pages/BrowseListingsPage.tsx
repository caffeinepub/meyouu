import { useState } from 'react';
import { useGetAllListings } from '../hooks/useQueries';
import ListingCard from '../components/listings/ListingCard';
import QueryState from '../components/states/QueryState';
import { Input } from '../components/ui/input';
import { Search } from 'lucide-react';

export default function BrowseListingsPage() {
  const { data: listings, isLoading, isError, error } = useGetAllListings();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredListings = listings?.filter((listing) => {
    const searchLower = searchQuery.toLowerCase();
    return listing.itemId.toString().toLowerCase().includes(searchLower);
  });

  return (
    <div className="container py-8">
      <div className="mb-8 overflow-hidden rounded-xl">
        <img
          src="/assets/generated/marketplace-hero.dim_1600x600.png"
          alt="Meyouu"
          className="w-full h-auto object-cover max-h-[300px]"
        />
      </div>

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Browse Meyouu</h1>
        <p className="text-muted-foreground">Discover amazing items from our community</p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search listings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <QueryState
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={!filteredListings || filteredListings.length === 0}
        emptyMessage={
          searchQuery ? 'No listings match your search' : 'No listings available yet'
        }
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredListings?.map((listing) => (
            <ListingCard key={listing.listingId.toString()} listing={listing} />
          ))}
        </div>
      </QueryState>
    </div>
  );
}
