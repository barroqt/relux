package com.example.reluxify.di

import android.content.Context
import android.net.Uri
import com.web3auth.core.Web3Auth
import com.web3auth.core.types.Network
import com.web3auth.core.types.Web3AuthOptions
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.components.ActivityComponent
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.android.scopes.ActivityScoped
import javax.inject.Singleton

@Module
@InstallIn(ActivityComponent::class)
class AppModule {

    @Provides
    @ActivityScoped
    fun provideApplicationContext(@ApplicationContext context: Context): Context {
        return context
    }

    @Provides
    @ActivityScoped
    fun provideHelloWorld(): String {
        return "Hello, World!"
    }

    @Provides
    @ActivityScoped
    fun provideWeb3Login(context: Context): Web3Auth {
        return Web3Auth(
            Web3AuthOptions(
                context = context,
                clientId = "BPbayAdNzonYDYwSTIvSkMcXFHHIMuoOuDdDYCrwIHwrqViN8qULQ9jXbuovpA1MOUOEIZCXTkJg7wYBLYB4u6k", // Replace with actual client ID
                network = Network.SAPPHIRE_DEVNET,
                redirectUrl = Uri.parse("com.example.reluxify://auth")
            )
        )
    }
}