package com.example.reluxify

import android.annotation.SuppressLint
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.example.reluxify.ui.screens.MainScreen
import com.example.reluxify.ui.theme.ReluxifyTheme
import com.web3auth.core.Web3Auth
import com.web3auth.core.types.LoginParams
import com.web3auth.core.types.Network
import com.web3auth.core.types.Provider
import com.web3auth.core.types.Web3AuthOptions
import com.web3auth.core.types.Web3AuthResponse
import dagger.hilt.android.AndroidEntryPoint
import java.util.concurrent.CompletableFuture
import kotlinx.coroutines.flow.MutableStateFlow

@AndroidEntryPoint
class MainActivity : ComponentActivity() {

    private lateinit var web3Auth: Web3Auth
    private val loginStatusFlow = MutableStateFlow<Web3AuthResponse?>(null)

    @SuppressLint("UnusedMaterial3ScaffoldPaddingParameter")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            setupWeb3Auth()

            ReluxifyTheme {
                Scaffold(modifier = Modifier.fillMaxSize(), content = {
                    val loginStatus by loginStatusFlow.collectAsState()
                    loginStatus?.let {
                        MainScreen()
                    } ?: Column(
                        modifier = Modifier.fillMaxSize(),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        SignInButton(onClick = { signIn() })
                    }
                })
            }
        }
    }

    private fun setupWeb3Auth() {
        web3Auth = Web3Auth(
            Web3AuthOptions(
                context = this@MainActivity,
                clientId = "BPbayAdNzonYDYwSTIvSkMcXFHHIMuoOuDdDYCrwIHwrqViN8qULQ9jXbuovpA1MOUOEIZCXTkJg7wYBLYB4u6k", // Replace with actual client ID
                network = Network.SAPPHIRE_DEVNET,
                redirectUrl = Uri.parse("com.example.reluxify://auth")
            )
        )
        web3Auth.setResultUrl(intent?.data)

        // Calls sessionResponse() to check for any existing session.
        val sessionResponse: CompletableFuture<Void> = web3Auth.initialize()
        sessionResponse.whenComplete { _, _ ->
            // render logged in UI
            Log.d("MainActivity_Web3Auth", "Session response: $sessionResponse")
        }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        web3Auth.setResultUrl(intent.data)
    }

    private fun signIn() {
        val selectedLoginProvider = Provider.GOOGLE
        val loginCompletableFuture: CompletableFuture<Web3AuthResponse> =
            web3Auth.login(LoginParams(selectedLoginProvider))

        loginCompletableFuture.whenComplete { loginResponse, error ->
            if (error == null) {
                // emit logged in status
                loginStatusFlow.value = loginResponse
                Log.d("MainActivity_Web3Auth", "Login successful: $loginResponse")
            } else {
                // emit error status
                loginStatusFlow.value = null
                Log.e("MainActivity_Web3Auth", "Error logging in", error)
            }
        }
    }

    @Composable
    fun Greeting(name: String) {
        Text(
            text = "Hello $name!",
            style = MaterialTheme.typography.bodyLarge,
            modifier = Modifier.padding(16.dp)
        )
    }

    @Composable
    fun SignInButton(onClick: () -> Unit) {
        Button(onClick = onClick) {
            Text(text = "Sign In")
        }
    }

    @SuppressLint("UnusedMaterial3ScaffoldPaddingParameter")
    @Preview(showBackground = true)
    @Composable
    fun DefaultPreview() {
        ReluxifyTheme {
            Scaffold {
                Greeting("Android")
                SignInButton(onClick = {})
            }
        }
    }
}