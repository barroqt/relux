package com.example.reluxify.ui.components

data class ProductForSale(
    val brand: String,
    val model: String,
    val condition: String,
    val imageUrl: String,
    val price: String,
)

val products = listOf(
    ProductForSale("Rolex", "Day-Date 40 Platinum", "New", "https://watchesoff5th.com/cdn/shop/products/rolex-day-date-40-platinum-day-date-40-watch-fluted-bezel-ice-blue-baguette-dial-228236-631211_800x.jpg?v=1692890564", price = "23.99 ETH"),
    ProductForSale("Tudor", "Black Bay", "Minor defects", "https://images.montro.com/RZtXNc_s0Netu6BCp4Gj8EZjDuI=/1200x0/https%3A%2F%2Fwww.goat-luxury.de%2Fcdn%2Fshop%2Ffiles%2Fpapers_520274b6-f262-424b-ac10-47c6311c7abe.jpg", price = "23.99 ETH"),
    ProductForSale("Patek Philippe", "Nautilus", "Prestine", "https://cdn.passion-horlogere.com/wp-content/uploads/2023/01/patek-philippe-nautilus-2022-passion-horlogere-1-1152x1536.jpg?strip=all&lossy=1&sharp=1&ssl=1", price = "23.99 ETH"),
    ProductForSale("Hublot", "Big Bang", "Used", "https://i.ebayimg.com/images/g/LUUAAOSwpklmfam4/s-l1600.jpg", price = "23.99 ETH"),
    ProductForSale("Omega", "Seamaster", "Refurbished", "https://www.analogshift.com/cdn/shop/products/Omega_Seamaster_Chronograph_Calibre_321_Solid_Gold_Pulsations_Culture2.jpg?v=1433300960", price = "23.99 ETH"),
)