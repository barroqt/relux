package com.example.reluxify.ui.screens

import androidx.compose.foundation.gestures.Orientation
import androidx.compose.foundation.gestures.rememberScrollableState
import androidx.compose.foundation.gestures.scrollable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.wrapContentSize
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.rememberLazyGridState
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.reluxify.ui.components.HorizontalProductCarousel
import com.example.home.ui.components.ProductItem
import com.example.reluxify.ui.components.products
import com.example.reluxify.ui.components.SearchBar
import com.example.reluxify.ui.components.TabSelector

@Composable
fun MainScreen() {
    Column(
        modifier = Modifier
            .padding(top = 48.dp)
            .fillMaxSize(),
    ) {
        val selectedTab = remember { mutableStateOf(0) }
        val searchQuery = remember { mutableStateOf("") }
        SearchBar(modifier = Modifier.padding(horizontal = 16.dp),
            searchQuery = { searchQuery.value },
            onSearchQueryChange = { searchQuery.value = it })
        TabSelector(
            tabs = listOf("Watches", "Bags", "Shoes", "Cars", "Paintings", "Houses"),
            selectedTab = { selectedTab.value },
            modifier = Modifier.padding(top = 16.dp)
        ) {
            selectedTab.value = it
        }

        Column(Modifier.scrollable(rememberScrollState(), Orientation.Vertical)) {
            Text(
                text = "Featured Products",
                modifier = Modifier.padding(16.dp),
                style = MaterialTheme.typography.headlineMedium
            )
            LazyVerticalGrid(
                modifier = Modifier
                    .padding(horizontal = 16.dp),
                columns = GridCells.Fixed(count = 2),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalArrangement = Arrangement.spacedBy(24.dp),
            ) {

                items(products.size) {
                    Box(
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        ProductItem(
                            product = products[it]
                        )
                    }
                }
            }
        }

    }
}