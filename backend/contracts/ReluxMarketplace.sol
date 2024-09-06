// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ReluxMarketplace is ERC721, Ownable, ReentrancyGuard {
    IERC20 public usdcToken;
    uint256 public productCount;
    uint256 public listingCount;

    enum ListingStatus {
        Active,
        Sold,
        Disputed
    }

    struct Product {
        address owner;
        address certifyingPartner;
        uint256 certificationTime;
    }

    struct Listing {
        uint256 productId;
        address payable seller;
        uint256 price;
        uint256 listingTime;
        ListingStatus status;
    }

    mapping(uint256 => Product) public products;
    mapping(uint256 => Listing) public listings;
    mapping(address => bool) public authorizedPartners;

    uint256 public constant DISPUTE_PERIOD = 3 days;
    uint256 public constant PLATFORM_FEE_PERCENT = 2; // 2% platform fee

    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/
    event ProductCertified(uint256 indexed productId, address owner, address partner);
    event ProductListed(uint256 indexed listingId, uint256 indexed productId, address seller, uint256 price);
    event ProductSold(uint256 indexed listingId, uint256 indexed productId, address buyer, uint256 price);
    event ListingDisputed(uint256 indexed listingId, address disputer);
    event ListingCancelled(uint256 indexed listingId);
    event PartnerAuthorized(address partner);
    event PartnerDeauthorized(address partner);

    /*//////////////////////////////////////////////////////////////
                             CUSTOM ERRORS
    //////////////////////////////////////////////////////////////*/
    error ProductAlreadySold();
    error ListingInDisputedState();
    error DisputePeriodNotOver();
    error PriceMustBeGreaterThanZero();
    error ListingDoesNotExist();
    error ProductDoesNotExist();
    error PaymentFailed();
    error TransferToSellerFailed();
    error PlatformFeeTransferFailed();
    error OnlyOwnerCanCancel();
    error UnauthorizedPartner();
    error UnauthorizedCaller();
    error NotProductOwner();

    /*//////////////////////////////////////////////////////////////
                               MODIFIERS
    //////////////////////////////////////////////////////////////*/
    modifier onlyAuthorizedPartner() {
        if (!authorizedPartners[msg.sender]) revert UnauthorizedPartner();
        _;
    }

    modifier onlyProductOwner(uint256 productId) {
        if (products[productId].owner != msg.sender) revert NotProductOwner();
        _;
    }

    /*//////////////////////////////////////////////////////////////
                               CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/
    constructor(address _usdcToken) ERC721("ReluxProduct", "RLP") {
        usdcToken = IERC20(_usdcToken);
    }

    /*//////////////////////////////////////////////////////////////
                           EXTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    function certifyPurchase(address _buyer) external onlyAuthorizedPartner {
        productCount++;
        uint256 newProductId = productCount;

        products[newProductId] =
            Product({owner: _buyer, certifyingPartner: msg.sender, certificationTime: block.timestamp});

        _safeMint(_buyer, newProductId);

        emit ProductCertified(newProductId, _buyer, msg.sender);
    }

    function createListing(uint256 _productId, uint256 _price) external onlyProductOwner(_productId) {
        if (_price <= 0) revert PriceMustBeGreaterThanZero();

        listingCount++;
        uint256 newListingId = listingCount;

        listings[newListingId] = Listing({
            productId: _productId,
            seller: payable(msg.sender),
            price: _price,
            listingTime: block.timestamp,
            status: ListingStatus.Active
        });

        emit ProductListed(newListingId, _productId, msg.sender, _price);
    }

    function buyProduct(uint256 _listingId) external nonReentrant {
        Listing storage listing = listings[_listingId];
        if (listing.status != ListingStatus.Active) revert ProductAlreadySold();

        uint256 platformFee = (listing.price * PLATFORM_FEE_PERCENT) / 100;
        uint256 sellerAmount = listing.price - platformFee;

        if (!usdcToken.transferFrom(msg.sender, address(this), listing.price)) revert PaymentFailed();
        if (!usdcToken.transfer(listing.seller, sellerAmount)) revert TransferToSellerFailed();
        if (!usdcToken.transfer(owner(), platformFee)) revert PlatformFeeTransferFailed();

        listing.status = ListingStatus.Sold;
        uint256 productId = listing.productId;
        _transfer(listing.seller, msg.sender, productId);
        products[productId].owner = msg.sender;

        emit ProductSold(_listingId, productId, msg.sender, listing.price);
    }

    function disputeListing(uint256 _listingId) external {
        Listing storage listing = listings[_listingId];
        if (listing.status != ListingStatus.Active) revert ListingInDisputedState();
        if (block.timestamp > listing.listingTime + DISPUTE_PERIOD) revert DisputePeriodNotOver();

        listing.status = ListingStatus.Disputed;

        emit ListingDisputed(_listingId, msg.sender);
    }

    function cancelListing(uint256 _listingId) external {
        Listing storage listing = listings[_listingId];
        if (listing.status != ListingStatus.Active) revert ProductAlreadySold();
        if (listing.seller != msg.sender) revert OnlyOwnerCanCancel();

        delete listings[_listingId];

        emit ListingCancelled(_listingId);
    }

    function authorizePartner(address _partner) external onlyOwner {
        authorizedPartners[_partner] = true;
        emit PartnerAuthorized(_partner);
    }

    function deauthorizePartner(address _partner) external onlyOwner {
        authorizedPartners[_partner] = false;
        emit PartnerDeauthorized(_partner);
    }

    /*//////////////////////////////////////////////////////////////
                           INTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    function _beforeTokenTransfer(address _from, address _to, uint256 _tokenId, uint256 _batchSize) internal override {
        super._beforeTokenTransfer(_from, _to, _tokenId, _batchSize);

        uint256 listingId = productToListingId[_tokenId];
        if (listingId != 0) {
            ListingStatus status = listings[listingId].status;
            if (status == ListingStatus.Active) revert CannotTransferListedProduct();
            if (status == ListingStatus.Disputed) revert CannotTransferDisputedProduct();
        }
    }
    /*//////////////////////////////////////////////////////////////
                                GETTERS
    //////////////////////////////////////////////////////////////*/

    function getProduct(uint256 _productId) external view returns (Product memory) {
        if (_productId == 0 || _productId > productCount) revert ProductDoesNotExist();
        return products[_productId];
    }

    function getListing(uint256 _listingId) external view returns (Listing memory) {
        if (_listingId == 0 || _listingId > listingCount) revert ListingDoesNotExist();
        return listings[_listingId];
    }
}
