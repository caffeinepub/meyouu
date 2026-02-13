import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ListingId, PriceDetails } from '../backend';

export function useCreateListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      description,
      price,
      imageUrls,
    }: {
      title: string;
      description: string;
      price: PriceDetails;
      imageUrls: string[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createListing(title, description, price, imageUrls);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
}

export function useUpdateListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      listingId,
      description,
      imageUrls,
      price,
    }: {
      listingId: ListingId;
      description: string;
      imageUrls: string[];
      price: PriceDetails;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateListing(listingId, description, imageUrls, price);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['listing', variables.listingId.toString()] });
    },
  });
}

export function useDeleteListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listingId: ListingId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteListing(listingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
}

export function usePurchaseListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listingId: ListingId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.purchaseListing(listingId);
    },
    onSuccess: (_, listingId) => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['listing', listingId.toString()] });
    },
  });
}
