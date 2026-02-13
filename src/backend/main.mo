import Map "mo:core/Map";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Order "mo:core/Order";

actor {
  type Price = Nat64;
  type Currency = {
    #icp;
  };

  type PriceDetails = {
    currencyType : Currency;
    amount : Price;
  };

  type User = Principal;
  type ItemId = Nat;
  type ItemTitle = Text;

  ///--- ITEMS -----
  type Item = {
    title : ItemTitle;
    description : Text;
    imageUrls : [Text];
    price : PriceDetails;
    seller : User;
    createdAt : Time.Time;
    isSold : Bool;
  };

  ///--- LISTINGS -----
  type ListingId = Nat;
  type ListingStatus = {
    #available;
    #sold;
    #inactive;
  };

  type Listing = {
    listingId : ListingId;
    itemId : ItemId;
    seller : User;
    price : PriceDetails;
    status : ListingStatus;
    createdAt : Time.Time;
    buyer : ?User;
  };

  module Listing {
    public func compare(l1 : Listing, l2 : Listing) : Order.Order {
      Nat.compare(l1.listingId, l2.listingId);
    };
  };

  ///--- TRANSACTIONS -----
  type TransactionId = Nat;

  type Transaction = {
    transactionId : TransactionId;
    listingId : ListingId;
    buyer : User;
    price : PriceDetails;
    timestamp : Time.Time;
  };

  module Transaction {
    public func compare(t1 : Transaction, t2 : Transaction) : Order.Order {
      Nat.compare(t1.transactionId, t2.transactionId);
    };
  };

  ///--- EXTERNAL BLOBS -----
  type ExternalBlobInfo = {
    blob : Storage.ExternalBlob;
    uploadTime : Time.Time;
    uploadedBy : User;
  };

  ///--- ACTOR STATE -----
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let items = Map.empty<ItemId, Item>();
  let listings = Map.empty<ListingId, Listing>();
  let transactions = Map.empty<TransactionId, Transaction>();
  let images = Map.empty<Text, ExternalBlobInfo>();
  var nextId = 1;

  ///--- LISTING MANAGEMENT -----
  public shared ({ caller }) func createListing(title : Text, desc : Text, price : PriceDetails, imageUrls : [Text]) : async ListingId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create listings");
    };

    let listingId = nextId;
    nextId += 1;

    let item : Item = {
      title;
      description = desc;
      imageUrls;
      price;
      seller = caller;
      createdAt = Time.now();
      isSold = false;
    };

    let listing : Listing = {
      listingId;
      itemId = listingId;
      seller = caller;
      price;
      status = #available;
      createdAt = Time.now();
      buyer = null;
    };

    items.add(listingId, item);
    listings.add(listingId, listing);
    listingId;
  };

  public query ({ caller }) func getListing(id : ListingId) : async Listing {
    switch (listings.get(id)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?listing) { listing };
    };
  };

  public query func getListingsByStatus(status : ListingStatus) : async [Listing] {
    listings.values().toArray().filter(func(l) { l.status == status }).sort();
  };

  public shared ({ caller }) func updateListing(id : ListingId, desc : Text, imageUrls : [Text], price : PriceDetails) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update listings");
    };

    let listing = switch (listings.get(id)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?listing) { listing };
    };

    // Only the seller can update their own listings
    if (listing.seller != caller) {
      Runtime.trap("Unauthorized: Only the seller can update this listing");
    };

    let item = switch (items.get(id)) {
      case (null) { Runtime.trap("Item not found") };
      case (?item) { item };
    };

    let updatedItem = {
      item with
      description = desc;
      imageUrls;
      price;
    };

    items.add(id, updatedItem);

    let updatedListing = {
      listing with
      price;
      createdAt = Time.now();
    };

    listings.add(id, updatedListing);
  };

  public shared ({ caller }) func deleteListing(id : ListingId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete listings");
    };

    let listing = switch (listings.get(id)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?listing) { listing };
    };

    if (listing.seller != caller) {
      Runtime.trap("Unauthorized: Only the seller can delete this listing");
    };

    items.remove(id);
    listings.remove(id);
  };

  public shared ({ caller }) func purchaseListing(id : ListingId) : async TransactionId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can purchase listings");
    };

    let listing = switch (listings.get(id)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?listing) { listing };
    };

    // Verify listing is available for purchase
    if (listing.status != #available) {
      Runtime.trap("Listing is not available for purchase");
    };

    if (listing.seller == caller) {
      Runtime.trap("Cannot purchase your own listing");
    };

    let transactionId = nextId;
    nextId += 1;

    let transaction : Transaction = {
      transactionId;
      listingId = id;
      buyer = caller;
      price = listing.price;
      timestamp = Time.now();
    };

    let updatedListing = {
      listing with
      status = #sold;
      buyer = ?caller;
    };

    transactions.add(transactionId, transaction);
    listings.add(id, updatedListing);
    transactionId;
  };

  public query ({ caller }) func getMyListings() : async [Listing] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their listings");
    };
    listings.values().toArray().filter(func(l) { l.seller == caller }).sort();
  };

  ///--- ADMIN/UTILITIES -----
  public query ({ caller }) func getAllListings() : async [Listing] {
    let listingArray = listings.values().toArray().sort();
    listingArray;
  };

  public shared ({ caller }) func adminUnlist(id : ListingId) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can unlist items");
    };

    let listing = switch (listings.get(id)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?listing) { listing };
    };

    listings.add(id, { listing with status = #inactive });
  };
};
