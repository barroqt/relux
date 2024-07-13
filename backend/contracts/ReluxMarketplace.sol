// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ReluxMarketplace is Ownable, ReentrancyGuard {
    IERC20 public usdcToken;

    struct Listing {
        uint256 watchId;
        address payable seller;
        uint256 price;
        uint256 listingTime;
        bool isDisputed;
        bool isSold;
    }

    mapping(uint256 => Listing) public listings;
    uint256 public listingCount;
    uint256 public constant DISPUTE_PERIOD = 3 days;
    uint256 public constant PLATFORM_FEE_PERCENT = 2; // 2% platform fee

    event WatchListed(uint256 indexed listingId, uint256 indexed watchId, address seller, uint256 price);
    event WatchSold(uint256 indexed listingId, uint256 indexed watchId, address buyer, uint256 price);
    event ListingDisputed(uint256 indexed listingId, address disputer);
    event ListingCancelled(uint256 indexed listingId);

    modifier notSold(uint256 listingId) {
        require(!listings[listingId].isSold, "Product already sold");
        _;
    }

    modifier notDisputed(uint256 listingId) {
        require(!listings[listingId].isDisputed, "Listing is disputed");
        _;
    }

    modifier disputePeriodOver(uint256 listingId) {
        if (listings[listingId].isDisputed) {
            require(block.timestamp > listings[listingId].listingTime + DISPUTE_PERIOD, "Dispute period not over");
        }
        _;
    }

    constructor(address _usdcToken) {
        usdcToken = IERC20(_usdcToken);
    }

    function createListing(uint256 watchId, uint256 price) external {
        require(price > 0, "Price must be greater than zero");

        listingCount++;
        listings[listingCount] = Listing({
            watchId: watchId,
            seller: payable(msg.sender),
            price: price,
            listingTime: block.timestamp,
            isDisputed: false,
            isSold: false
        });

        emit WatchListed(listingCount, watchId, msg.sender, price);
    }

    function buyWatch(uint256 listingId)
        external
        nonReentrant
        notSold(listingId)
        notDisputed(listingId)
        disputePeriodOver(listingId)
    {
        Listing storage listing = listings[listingId];

        uint256 platformFee = (listing.price * PLATFORM_FEE_PERCENT) / 100;
        uint256 sellerAmount = listing.price - platformFee;

        require(usdcToken.transferFrom(msg.sender, address(this), listing.price), "Payment failed");
        require(usdcToken.transfer(listing.seller, sellerAmount), "Transfer to seller failed");
        require(usdcToken.transfer(owner(), platformFee), "Platform fee transfer failed");

        listing.isSold = true;

        emit WatchSold(listingId, listing.watchId, msg.sender, listing.price);
    }

    // TODO: dispute system not ready
    function disputeListing(uint256 listingId) external notSold(listingId) notDisputed(listingId) {
        Listing storage listing = listings[listingId];
        require(block.timestamp <= listing.listingTime + DISPUTE_PERIOD, "Dispute period over");

        listing.isDisputed = true;

        emit ListingDisputed(listingId, msg.sender);
    }

    function cancelListing(uint256 listingId) external notSold(listingId) notDisputed(listingId) {
        Listing storage listing = listings[listingId];
        require(msg.sender == listing.seller, "Only seller can cancel");

        delete listings[listingId];

        emit ListingCancelled(listingId);
    }

    function getListing(uint256 listingId) external view returns (Listing memory) {
        return listings[listingId];
    }

    function updateUSDCToken(address newUSDCToken) external onlyOwner {
        usdcToken = IERC20(newUSDCToken);
    }
}
