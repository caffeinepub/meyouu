import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Listing, ListingId, ListingStatus } from '../backend';

export function useGetAllListings() {
  const { actor, isFetching } = useActor();

  return useQuery<Listing[]>({
    queryKey: ['listings', 'all'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllListings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetListing(listingId: ListingId) {
  const { actor, isFetching } = useActor();

  return useQuery<Listing>({
    queryKey: ['listing', listingId.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getListing(listingId);
    },
    enabled: !!actor && !isFetching && !!listingId,
  });
}

export function useGetMyListings() {
  const { actor, isFetching } = useActor();

  return useQuery<Listing[]>({
    queryKey: ['listings', 'my'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyListings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetListingsByStatus(status: ListingStatus) {
  const { actor, isFetching } = useActor();

  return useQuery<Listing[]>({
    queryKey: ['listings', 'status', status],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getListingsByStatus(status);
    },
    enabled: !!actor && !isFetching,
  });
}
