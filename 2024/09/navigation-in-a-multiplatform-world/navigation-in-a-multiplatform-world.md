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

[.footer: m3.material.io/components/navigation-bar/overview]

![left](side-navigation-rail.png)

![right](bottom-navigation-bar.png)

^ Navigation concepts like the rail or bottom bar introduce parallel navigation

^ Horizontal in addition to vertical

---

[.footer: satukyrolainen.com/affordances/]

![](faucet-with-false-affrodance.jpg)

^ Affordance is how a user expects to interact with something

---

# 🤖 🍏 🖥️

^ Behaviour should be consistent with platform expectation

---

[.footer: android-developers.googleblog.com/2022/05/form-factors-google-io-22.html]

![](android-form-factors.png)

^ Different form factors on the same platform will change how the user expects to navigate

---

[.footer-style: #666]

[.footer: learn.microsoft.com/en-us/windows/apps/design/basics/navigation-history-and-backwards-navigation]

![](windows-back-enabled.png)

^ Even something as simple as back navigation differs significantly

^ Desktop apps might not even show a back button relying upon shortcuts

^ What is the expected behaviour?

---

# ↑ ←

^ Android has both up and back which are not the same

---

#  ⃕ 🔥

^ Maintaining a stack through configuration change

---

[.background-color: #fff]
[.footer-style: #999]

[.footer: medium.com/androiddevelopers/the-deep-links-crash-course-part2-deep-links-from-zero-to-hero-37f94cc8fb88]

![50%](deep-links-sample.webp)

^ Handling deep links requires specific navigation behaviour

---

![](developing-hard.png)

^ Navigation is hard. Often a topic of confusion, difficult for new developers

^ Navigating from screen to screen being fundamental to your app

---

![align(top)](droidcon-berlin-navigation-and-the-single-activity.jpeg)

---

# WiP

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

As of the time of writing, Jetpack Navigation is not yet multiplatform however it is offered as a JetBrains Compose Multiplatform artifact

---

Compose Multiplatform is usually quite delayed, JetBrains works hard on maintaining compatibility, but does not yet offer serialized destinations

---

Multiplatform documentation is difficult as it's out-of-date

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
- jetbrains.com/help/kotlin-multiplatform-dev/compose-navigation-routing.html

---

[.text: line-height(2), text-scale(0.5)]
[.footer: ]

# Thank You!

Ash Davies - SumUp
Android / Kotlin GDE Berlin
ashdavies.dev
