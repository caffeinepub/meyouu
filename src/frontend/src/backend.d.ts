import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface PriceDetails {
    currencyType: Currency;
    amount: Price;
}
export type Time = bigint;
export interface Listing {
    status: ListingStatus;
    itemId: ItemId;
    listingId: ListingId;
    createdAt: Time;
    seller: User;
    buyer?: User;
    price: PriceDetails;
}
export type User = Principal;
export type Price = bigint;
export type TransactionId = bigint;
export type ListingId = bigint;
export type ItemId = bigint;
export enum Currency {
    icp = "icp"
}
export enum ListingStatus {
    sold = "sold",
    inactive = "inactive",
    available = "available"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    adminUnlist(id: ListingId): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createListing(title: string, desc: string, price: PriceDetails, imageUrls: Array<string>): Promise<ListingId>;
    deleteListing(id: ListingId): Promise<void>;
    getAllListings(): Promise<Array<Listing>>;
    getCallerUserRole(): Promise<UserRole>;
    getListing(id: ListingId): Promise<Listing>;
    getListingsByStatus(status: ListingStatus): Promise<Array<Listing>>;
    getMyListings(): Promise<Array<Listing>>;
    isCallerAdmin(): Promise<boolean>;
    purchaseListing(id: ListingId): Promise<TransactionId>;
    updateListing(id: ListingId, desc: string, imageUrls: Array<string>, price: PriceDetails): Promise<void>;
}
