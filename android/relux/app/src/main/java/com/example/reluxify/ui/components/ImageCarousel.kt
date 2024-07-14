package com.example.home.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.Crossfade
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.delay

@Composable
fun ImageCarousel(
    drawables: List<Int>,
    durationMillis: Int = 3000,
    crossfadeDurationMillis: Int = 1500
) {
    var currentDrawableIndex by remember { mutableStateOf(0) }

    LaunchedEffect(Unit) {
        while (true) {
            delay(durationMillis.toLong())
            currentDrawableIndex = (currentDrawableIndex + 1) % drawables.size
        }
    }

    val currentDrawable = drawables[currentDrawableIndex]

    AnimatedVisibility(
        modifier = Modifier.height(100.dp),
        visible = true,
        enter = fadeIn(),
        exit = fadeOut()
    ) {
        Crossfade(
            targetState = currentDrawable, animationSpec = tween(crossfadeDurationMillis),
            label = ""
        ) { targetDrawable ->
            Image(
                painter = painterResource(id = targetDrawable),
                contentDescription = null,
                modifier = Modifier.fillMaxSize()
            )
        }
    }
}