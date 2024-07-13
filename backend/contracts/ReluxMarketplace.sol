// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ReluxMarketplace is Ownable, ReentrancyGuard {
    struct Listing {
        uint256 watchId;
        address payable seller;
        uint256 price;
        bool isSold;
    }

    mapping(uint256 => Listing) public listings;
    uint256 public listingCount;
    uint256 public constant PLATFORM_FEE_PERCENT = 2; // 2% platform fee

    event WatchListed(uint256 indexed listingId, uint256 indexed watchId, address seller, uint256 price);
    event WatchSold(uint256 indexed listingId, uint256 indexed watchId, address buyer, uint256 price);
    event ListingCancelled(uint256 indexed listingId);

    uint256 public deploymentChainId;

    constructor() Ownable() {
        deploymentChainId = block.chainid;
    }

    function createListing(uint256 watchId, uint256 price) external {
        require(price > 0, "Price must be greater than zero");

        listingCount++;
        listings[listingCount] = Listing({watchId: watchId, seller: payable(msg.sender), price: price, isSold: false});

        emit WatchListed(listingCount, watchId, msg.sender, price);
    }

    function buyWatch(uint256 listingId) external payable nonReentrant {
        Listing storage listing = listings[listingId];
        require(!listing.isSold, "Watch already sold");
        require(msg.value == listing.price, "Incorrect payment amount");

        uint256 platformFee = (listing.price * PLATFORM_FEE_PERCENT) / 100;
        uint256 sellerAmount = listing.price - platformFee;

        listing.isSold = true;

        (bool successSeller,) = listing.seller.call{value: sellerAmount}("");
        require(successSeller, "Transfer to seller failed");

        (bool successOwner,) = owner().call{value: platformFee}("");
        require(successOwner, "Platform fee transfer failed");

        emit WatchSold(listingId, listing.watchId, msg.sender, listing.price);
    }

    function cancelListing(uint256 listingId) external {
        Listing storage listing = listings[listingId];
        require(msg.sender == listing.seller, "Only seller can cancel");
        require(!listing.isSold, "Watch already sold");

        delete listings[listingId];

        emit ListingCancelled(listingId);
    }

    function getListing(uint256 listingId) external view returns (Listing memory) {
        return listings[listingId];
    }
}
