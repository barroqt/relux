package com.example.reluxify.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.wrapContentHeight
import androidx.compose.foundation.layout.wrapContentSize
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyHorizontalGrid
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.example.home.ui.components.ProductItem

@Composable
fun HorizontalProductCarousel(title: String, products: List<ProductForSale>) {
    Column(
        modifier = Modifier
            .background(color = Color.Gray)
            .padding(horizontal = 16.dp)
            .height(300.dp),
        verticalArrangement = Arrangement.spacedBy(24.dp)
    ) {
        Text(text = title)
        LazyHorizontalGrid(rows = GridCells.Fixed(1)) {
            items(products.size) {
                ProductItem(product = products[it])
            }
        }
    }
}