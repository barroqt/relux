package com.example.reluxify.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme.colorScheme
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

@Composable
fun TabSelector(
    modifier: Modifier, tabs: List<String>, selectedTab: () -> Int, onTabClicked: (Int) -> Unit
) {
    LazyRow(modifier = modifier.fillMaxWidth()) {
        items(tabs) { tab ->
            val index = tabs.indexOf(tab)
            Button(
                modifier = Modifier.padding(
                    start = if (index == 0) 16.dp else 4.dp,
                    end = if (index == tabs.size - 1) 16.dp else 0.dp
                ),
                onClick = { onTabClicked(index) },
                border = BorderStroke(1.dp, Color.Gray),
                shape = RoundedCornerShape(20),
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (selectedTab() == index) colorScheme.onBackground else colorScheme.background
                ),
            ) {
                Text(
                    style = MaterialTheme.typography.labelLarge,
                    text = tab,
                    color = if (selectedTab() == index) colorScheme.background else colorScheme.onBackground
                )
            }
        }
    }
}