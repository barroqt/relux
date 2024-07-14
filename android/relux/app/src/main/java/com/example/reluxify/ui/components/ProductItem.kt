package com.example.home.ui.components

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.wrapContentHeight
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawWithCache
import androidx.compose.ui.graphics.BlendMode
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import com.example.reluxify.ui.components.ProductForSale

@Composable
fun ProductItem(product: ProductForSale) {
    Column(
        modifier = Modifier
    ) {
        Card(
            shape = RoundedCornerShape(8.dp),
            modifier = Modifier
                .height(height = 250.dp)
                .fillMaxWidth()
        ) {
            AsyncImage(
                contentScale = ContentScale.Crop, modifier = Modifier
                    .fillMaxSize()
                    .drawWithCache {
                        val gradient = Brush.verticalGradient(
                            colors = listOf(Color.Transparent, Color.Gray),
                            startY = size.height / 3,
                            endY = size.height
                        )
                        onDrawWithContent {
                            drawContent()
                            drawRect(gradient, blendMode = BlendMode.Multiply)
                        }
                    }, model = product.imageUrl, contentDescription = null
            )
        }
        Text(text = product.brand, Modifier.padding(top = 8.dp))
        Text(text = product.model, Modifier.padding(top = 0.dp))
        Text(
            text = product.price,
            fontWeight = FontWeight.Black,
            modifier = Modifier.padding(top = 4.dp)
        )
    }
}