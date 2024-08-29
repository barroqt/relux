// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ReluxMarketplace is ERC721, Ownable, ReentrancyGuard {
    IERC20 public usdcToken;
    uint256 public listingCount;

    // TODO: Implement this enum instead of booleans for status
    // enum ListingStatus {
    //     Active,
    //     Sold,
    //     Disputed
    // }

    struct Listing {
        uint256 productId;
        address payable seller;
        uint256 price;
        uint256 listingTime;
        bool isDisputed;
        bool isSold;
        bool isCertified;
        address partner;
    }

    mapping(uint256 => Listing) public listings;
    mapping(address => bool) public authorizedPartners;
    mapping(uint256 => address) public certifiedProductsByPartners;
    mapping(uint256 => uint256) public productIdToTokenId;

    uint256 public constant DISPUTE_PERIOD = 3 days;
    uint256 public constant PLATFORM_FEE_PERCENT = 2; // 2% platform fee

    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/
    event ProductListed(uint256 indexed tokenId, uint256 indexed productId, address seller, uint256 price);
    event ProductSold(uint256 indexed tokenId, uint256 indexed productId, address buyer, uint256 price);
    event ListingDisputed(uint256 indexed tokenId, address disputer);
    event ListingCancelled(uint256 indexed tokenId);
    event PartnerAuthorized(address partner);
    event PartnerDeauthorized(address partner);
    event ProductCertified(uint256 productId, address partner);
    event ProductCertificationRevoked(uint256 productId, address partner);
    event ListingRemoved(uint256 indexed tokenId, uint256 indexed productId);

    /*//////////////////////////////////////////////////////////////
                             CUSTOM ERRORS
    //////////////////////////////////////////////////////////////*/
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
    error UnauthorizedPartner();
    error ProductAlreadyCertified();
    error ProductNotCertified();
    error UnauthorizedCaller();

    /*//////////////////////////////////////////////////////////////
                               MODIFIERS
    //////////////////////////////////////////////////////////////*/
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

    modifier onlyAuthorizedPartner() {
        if (!authorizedPartners[msg.sender]) revert UnauthorizedPartner();
        _;
    }

    modifier onlyOwnerOrAuthorizedPartner() {
        if (msg.sender != owner() && !authorizedPartners[msg.sender]) revert UnauthorizedCaller();
        _;
    }

    /*//////////////////////////////////////////////////////////////
                               CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/
    constructor(address _usdcToken) ERC721("ReluxWatchListing", "RWL") {
        usdcToken = IERC20(_usdcToken);
    }

    /*//////////////////////////////////////////////////////////////
                           EXTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    function createListing(uint256 _productId, uint256 _price) external {
        if (_price <= 0) revert PriceMustBeGreaterThanZero();
        if (certifiedProductsByPartners[_productId] == address(0)) revert ProductNotCertified(); // TODO: test this

        listingCount++;
        uint256 newTokenId = listingCount;

        _safeMint(msg.sender, newTokenId);

        listings[newTokenId] = Listing({
            productId: _productId,
            seller: payable(msg.sender),
            price: _price,
            listingTime: block.timestamp,
            isDisputed: false,
            isSold: false,
            isCertified: true,
            partner: certifiedProductsByPartners[_productId]
        });

        productIdToTokenId[_productId] = newTokenId;

        emit ProductListed(newTokenId, _productId, msg.sender, _price);
    }

    function buyProduct(uint256 _tokenId)
        external
        nonReentrant
        notSold(_tokenId)
        notDisputed(_tokenId)
        disputePeriodOver(_tokenId)
    {
        if (!_exists(_tokenId)) revert ListingDoesNotExist();

        Listing storage listing = listings[_tokenId];

        if (listing.isSold) revert ProductAlreadySold();
        if (listing.isDisputed) revert ListingInDisputedState();

        uint256 platformFee = (listing.price * PLATFORM_FEE_PERCENT) / 100;
        uint256 sellerAmount = listing.price - platformFee;

        if (!usdcToken.transferFrom(msg.sender, address(this), listing.price)) revert PaymentFailed();
        if (!usdcToken.transfer(listing.seller, sellerAmount)) revert TransferToSellerFailed();
        if (!usdcToken.transfer(owner(), platformFee)) revert PlatformFeeTransferFailed();

        listing.isSold = true;
        _transfer(listing.seller, msg.sender, _tokenId);

        emit ProductSold(_tokenId, listing.productId, msg.sender, listing.price);
    }

    function disputeListing(uint256 _tokenId)
        external
        notSold(_tokenId)
        notDisputed(_tokenId)
        disputePeriodOver(_tokenId)
    {
        if (!_exists(_tokenId)) revert ListingDoesNotExist();
        Listing storage listing = listings[_tokenId];

        listing.isDisputed = true;

        emit ListingDisputed(_tokenId, msg.sender);
    }

    function cancelListing(uint256 _tokenId) external notSold(_tokenId) notDisputed(_tokenId) {
        if (!_exists(_tokenId)) revert ListingDoesNotExist();
        if (ownerOf(_tokenId) != msg.sender) revert OnlyOwnerCanCancel();

        delete listings[_tokenId];
        _burn(_tokenId);

        emit ListingCancelled(_tokenId);
    }

    function updateUSDCToken(address _newUSDCToken) external onlyOwner {
        usdcToken = IERC20(_newUSDCToken);
    }

    function authorizePartner(address _partner) external onlyOwner {
        authorizedPartners[_partner] = true;
        emit PartnerAuthorized(_partner);
    }

    function deauthorizePartner(address _partner) external onlyOwner {
        authorizedPartners[_partner] = false;
        emit PartnerDeauthorized(_partner);
    }

    function certifyProduct(uint256 _productId) external onlyAuthorizedPartner {
        if (certifiedProductsByPartners[_productId] != address(0)) revert ProductAlreadyCertified();
        certifiedProductsByPartners[_productId] = msg.sender;
        emit ProductCertified(_productId, msg.sender);
    }

    // TODO: test this
    function revokeCertification(uint256 _productId) external onlyOwnerOrAuthorizedPartner {
        address partner = certifiedProductsByPartners[_productId];
        if (partner == address(0)) revert ProductNotCertified();

        delete certifiedProductsByPartners[_productId];

        uint256 tokenId = productIdToTokenId[_productId];
        if (tokenId != 0 && _exists(tokenId)) {
            delete listings[tokenId];
            _burn(tokenId);
            delete productIdToTokenId[_productId];
            emit ListingRemoved(tokenId, _productId);
        }

        emit ProductCertificationRevoked(_productId, partner);
    }

    /*//////////////////////////////////////////////////////////////
                           INTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    function _beforeTokenTransfer(address _from, address _to, uint256 _tokenId, uint256 _batchSize) internal override {
        super._beforeTokenTransfer(_from, _to, _tokenId, _batchSize);
        if (listings[_tokenId].isSold) revert CannotTransferSoldListing();
        if (listings[_tokenId].isDisputed) revert CannotTransferDisputedListing();
    }

    /*//////////////////////////////////////////////////////////////
                                GETTERS
    //////////////////////////////////////////////////////////////*/
    function getListing(uint256 _tokenId) external view returns (Listing memory) {
        if (!_exists(_tokenId)) revert ListingDoesNotExist();
        return listings[_tokenId];
    }
}
