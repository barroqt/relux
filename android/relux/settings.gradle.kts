import org.gradle.internal.impldep.org.bouncycastle.asn1.x500.style.RFC4519Style.l

pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\.android.*")
                includeGroupByRegex("com\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        maven(url = uri("https://jitpack.io"))
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        maven(url = uri("https://jitpack.io"))
        mavenCentral()
    }
}

rootProject.name = "Reluxify"
include(":app")
 