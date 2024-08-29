// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ReluxMarketplace is ERC721, Ownable, ReentrancyGuard {
    IERC20 public usdcToken;
    uint256 public listingCount;

    struct Listing {
        uint256 watchId;
        address payable seller;
        uint256 price;
        uint256 listingTime;
        bool isDisputed;
        bool isSold;
    }

    mapping(uint256 => Listing) public listings;
    uint256 public constant DISPUTE_PERIOD = 3 days;
    uint256 public constant PLATFORM_FEE_PERCENT = 2; // 2% platform fee

    event WatchListed(uint256 indexed tokenId, uint256 indexed watchId, address seller, uint256 price);
    event WatchSold(uint256 indexed tokenId, uint256 indexed watchId, address buyer, uint256 price);
    event ListingDisputed(uint256 indexed tokenId, address disputer);
    event ListingCancelled(uint256 indexed tokenId);

    // Custom errors
    error ProductAlreadySold();
    error ListingInDisputedState();
    error DisputePeriodNotOver();
    error PriceMustBeGreaterThanZero();
    error ListingDoesNotExist();
    error PaymentFailed();
    error TransferToSellerFailed();
    error PlatformFeeTransferFailed();
    error OnlyOwnerCanCancel();
    error CannotTransferSoldListing();
    error CannotTransferDisputedListing();

    modifier notSold(uint256 tokenId) {
        if (listings[tokenId].isSold) revert ProductAlreadySold();
        _;
    }

    modifier notDisputed(uint256 tokenId) {
        if (listings[tokenId].isDisputed) revert ListingInDisputedState();
        _;
    }

    modifier disputePeriodOver(uint256 tokenId) {
        if (listings[tokenId].isDisputed) {
            if (block.timestamp <= listings[tokenId].listingTime + DISPUTE_PERIOD) revert DisputePeriodNotOver();
        }
        _;
    }

    constructor(address _usdcToken) ERC721("ReluxWatchListing", "RWL") {
        usdcToken = IERC20(_usdcToken);
    }

    function createListing(uint256 watchId, uint256 price) external {
        if (price <= 0) revert PriceMustBeGreaterThanZero();

        listingCount++;
        uint256 newTokenId = listingCount;

        _safeMint(msg.sender, newTokenId);

        listings[newTokenId] = Listing({
            watchId: watchId,
            seller: payable(msg.sender),
            price: price,
            listingTime: block.timestamp,
            isDisputed: false,
            isSold: false
        });

        emit WatchListed(newTokenId, watchId, msg.sender, price);
    }

    function buyWatch(uint256 tokenId)
        external
        nonReentrant
        notSold(tokenId)
        notDisputed(tokenId)
        disputePeriodOver(tokenId)
    {
        if (!_exists(tokenId)) revert ListingDoesNotExist();
        Listing storage listing = listings[tokenId];

        uint256 platformFee = (listing.price * PLATFORM_FEE_PERCENT) / 100;
        uint256 sellerAmount = listing.price - platformFee;

        if (!usdcToken.transferFrom(msg.sender, address(this), listing.price)) revert PaymentFailed();
        if (!usdcToken.transfer(listing.seller, sellerAmount)) revert TransferToSellerFailed();
        if (!usdcToken.transfer(owner(), platformFee)) revert PlatformFeeTransferFailed();

        listing.isSold = true;
        _transfer(listing.seller, msg.sender, tokenId);

        emit WatchSold(tokenId, listing.watchId, msg.sender, listing.price);
    }

    function disputeListing(uint256 tokenId)
        external
        notSold(tokenId)
        notDisputed(tokenId)
        disputePeriodOver(tokenId)
    {
        if (!_exists(tokenId)) revert ListingDoesNotExist();
        Listing storage listing = listings[tokenId];

        listing.isDisputed = true;

        emit ListingDisputed(tokenId, msg.sender);
    }

    function cancelListing(uint256 tokenId) external notSold(tokenId) notDisputed(tokenId) {
        if (!_exists(tokenId)) revert ListingDoesNotExist();
        if (ownerOf(tokenId) != msg.sender) revert OnlyOwnerCanCancel();

        delete listings[tokenId];
        _burn(tokenId);

        emit ListingCancelled(tokenId);
    }

    function getListing(uint256 tokenId) external view returns (Listing memory) {
        if (!_exists(tokenId)) revert ListingDoesNotExist();
        return listings[tokenId];
    }

    function updateUSDCToken(address newUSDCToken) external onlyOwner {
        usdcToken = IERC20(newUSDCToken);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize) internal override {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
        if (listings[tokenId].isSold) revert CannotTransferSoldListing();
        if (listings[tokenId].isDisputed) revert CannotTransferDisputedListing();
    }
}
