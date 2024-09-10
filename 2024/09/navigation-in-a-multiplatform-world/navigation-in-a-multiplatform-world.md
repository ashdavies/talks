autoscale: true
build-lists: true
footer: ashdavies.dev
slide-transition: true
slidenumbers: true
theme: Next, 8

[.text: line-height(2), text-scale(0.5)]
[.footer: ]

# [fit] Navigation in a Multiplatform World

## [fit] Choosing the Right Framework for your App

### Droidcon NYC - September '24 🇺🇸

Ash Davies - SumUp
Android & Kotlin GDE Berlin
ashdavies.dev

---

[.background-color: #fff]
[.footer-style: #000]

[.footer: blog.google/products/chrome/help-me-out-how-to-organize-chrome-tabs/]

![](chrome-browser-tips-series-hero.gif)

^ We use it every day for a number of different purposes

---

# 📲

^ Navigation in simple terms, process of going from one screen to the next

---

```kotlin
val history = ArrayDeque<Screen>()

history.addLast(ForwardScreen)

history.removeLast()
```

^ If navigation were so simple, surely we could just use a deque

^ We could... in theory

---

# 🤦

^ Complications come in many forms, mostly human

---

# ↔

^ More than just forward/backward navigation

^ More than just a history

---

# WiP

---

Necessary to handle backwards navigation

---

Differences between horizontal and vertical navigation

---

Maintaining a stack through configuration change

---

Deep links adding to the complexity

---

Navigation talk from 2019 highlights lack of historical support for Android navigation, implementation left agnostic, up to developer implementation.

---

Various libraries developed on the landscape, square/mortar, concepts like single activity design were rarely employed.

---

Android team introduces navigation component, bringing back fragments to be used with a single activity, much scepticism, but having the support seemed to be popular.

---

Introduces static “lock and key” parameter mechanism with XML and “safe-args” code generation.

---

Development continued with custom navigation destination support, allowing for more options, possible to go back to activity based navigation in navigation graph, some animation support couldn’t be backported however due to Framework Activity vs Support Fragment.

---

The great abstraction of framework components continues…

---

Compose UI enters the scene (a wild UI framework appears)

---

Jetpack Navigation includes support for Compose destinations.

---

Jetpack Navigation includes support for type safe parameters in Kotlin 🎉

---

Moving priorities towards Kotlin Multiplatform, rise and trends, increased demand.

---

Introduction of third party libraries with Compose or Multiplatform first ideology, inherit idiomatic style.

---

Decompose - Excellent option, based upon Essenty, Multiplatform first, Compose second, builds facade against Android elements, managed lifecycle and view model aspects.

---

Circuit - Zacs brainchild, Compose first, builds idiomatic structure, app entirely in Compose. Big fan. Check out projects ChrisBanes/Tivi, ZacSweers/CatchUp/FieldSpottr, AshDavies/Playground

---

Voyager - Investigate

---

Multiplatform issues with Android state management, parcelization/bundling of state parameters needs to be handled. Modern approaches should use Kotlin serialization.

---

Google recently made multiplatform a priority with moving a lot of dependencies to common, navigation included.

---

For better or for worse, ViewModel is now multiplatform.

---

Early adopters employed third party solutions, late adopters can migrate android navigation to multiplatform. The early bird got the worm, but the second mouse got the cheese.

---

# Resources

- jetbrains.com/help/kotlin-multiplatform-dev/compose-navigation-routing.html
- johnbuhanan.dev/android-at-scale-with-circuit
- zacsweers.dev/writing-a-kotlin-multiplatform-app-from-start-to-store
- speakerdeck.com/ashdavies/droidcon-berlin-navigation-and-the-single-activity-learnings-from-a-skeptic
- jetbrains.com/help/kotlin-multiplatform-dev/whats-new-compose-170.html
- x.com/AndroidDev/status/1833539541673586968

---

[.text: line-height(2), text-scale(0.5)]
[.footer: ]

# Thank You!

Ash Davies - SumUp
Android / Kotlin GDE Berlin
ashdavies.dev
