autoscale: true
build-lists: true
footer: @askashdavies
footer-style: Open Sans
header: Google Sans
slide-transition: true
theme: Simple, 3
text: Open Sans

![right inline 15%](immobilienscout24.png)

# [fit] Refactoring Legacy Code with Coroutines
## Kotlin Everywhere: Hamburg

![left inline 30%](gde-badge-round.png)

![right](abandoned-antique.jpg)

---

![right inline 15%](immobilienscout24.png)

# [fit] ~~Refactoring Legacy Code with Coroutines~~
## [fit] Refactoring Legacy Code with Kotlin

![left inline 30%](gde-badge-round.png)

![right](abandoned-antique.jpg)

---

![right inline 15%](immobilienscout24.png)

# [fit] How to prepare a talk in under 24 hours ⏰

![right](abandoned-antique.jpg)

---

# Java ![](green-robot.png)

^ Though Android is built upon Java

^ Java has never really been available to us

---

# { }

^ Lambdas representing only a small set of Java 8 features

^ Not available until recent AGP v3.0.0

---

# Streams ↝ 

^ Not available until Android Nougat

^ Not able to raise min sdk

---

![](so-what.gif)

^ But so what? Backend developers can use whatever version they like

---

# Kotlin ![](kotlin-logo.png)

^ Many arguments for Kotlin of Java

^ Code that looks familiar

^ Code that behaves idiomatically

^ Code that looks concise

^ Aggressive development

---

# Null 💵

^ The million dollar mistake

^ Null has plagued developers for years

^ Null checks present in nearly all Java code

^ Unexpected behaviour, unpredictable output

---

# Offensive Code <🖕>

^ Offensive code is similar to defensive in a way

^ Does not tolerate errors in the wrong places

^ If you've ever inspected an Rx stack trace...

^ Point of failure much easier to find and detect

---

# Urgency 🚨

^ Bugs treated as fatal demand immediate attention

^ Sounds bad but results in finding bugs much quicker

^ Codebase much less error prone

---

# Kotlin?

^ So should we all start using Kotlin?
 
--- 

# Kotlin 💪

^ Yes! What are you listening to me for?
 
^ Go, start coding!

---

[.background-color: #ffffff]

![inline](android-kotlin-hero.png)

^ What did that mean for our green robot friend?

---

# Google IO 2018 🥇

^ In Google IO 2018 Google announced first class support for Koltin

---

# 🎉 👼 😊

^ Heavens opened, angels sang, prayers were answers

^ Developers worldwide wept for joy

^ Their prayers had been answered

---

# Google IO 2019 🥇 🎖

^ Furthermore in Google IO 2019

^ Google announced that Kotlin was the preferred language

---

![right](over-the-top.gif)

# Kotlin ![](all-the-things.jpg)

^ This was a major turning point for architecture

^ We lost our shit, and it quickly got out of hand

---

# Libraries

^ We started seeing libraries for every different type 

---

[.background-color: #ffffff]

![inline](bundle-libraries.jpg)

^ We started producing Kotlin libraries

---

[.background-color: #ffffff]

![inline](bundle-labels-more.jpg)

^ And more

---

[.background-color: #ffffff]

![inline](bundle-libraries-more.jpg)

^ And more

---

[.background-color: #ffffff]

![inline](bundle-libraries-more-more.jpg)

^ And more

---

[.background-color: #ffffff]

![inline 100%](build-passing.png)

^ One the plus side we learned that people really like readme badges

---

![](im-ok-with-this.png)

^ Its ok, it was the same with Rx, people adopting Kotlin

---

# Kotlin 🤔
 
^ What makes Kotlin so elusive

---

# Idiomacy

---

![](idiocracy.jpg)

^ Not to be confused with the 2006 film Idiocracy

---

# Idiomatic Code

---

# Idiomatic Code

- Consistent, easier to read
- Less cognitive load
- Less ambiguity
- Function > Style

^ - Less ambiguity for new contributors

^ - Time better spent reviewing code for functionality rather than style.

---

# Code Style

- kotlinlang.org/docs/reference/coding-conventions.html

- android.github.io/kotlin-guides/style.html

^ Android and Jetbrains both define a common code style

---

# Refactoring Legacy Code

^ How does this relate to refactoring legacy code

---

# ⌃⌥⇧K

---

![](job-done.gif)

^ Job done lets go home

---

![](no.gif)

^ Please don't do this

^ Let me explain why

---

```java
public class CrappyJavaActivity extends DaggerAppCompatActivity {

  @Inject Chameleon chameleon;
}
```

^ Chameleon is an internal library we use for configuration

^ Auto formatting makes a lot of general assumptions

---

![](general-assumptions.jpg)

# General Assumptions 👮‍♂️

---

```kotlin
class CrappyKotlinActivity : DaggerAppCompatActivity() {

  @Inject internal var chameleon: Chameleon? = null
}
```

^ Parameters are assumed to be null if not directly instantiated

---

```kotlin
class SlightlyLessCrapKotlinActivity : DaggerAppCompatActivity() {

  @Inject internal lateinit var chameleon: Chameleon
}
```

^ Opting for a lateinit variable allows you to configure the property

^ Needs to be a var to make setting property visible

---

# [fit] UninitializedPropertyAccessException!

^ Throws a generic exception on property access

---

```kotlin
lateinit var file: File    

if (::file.isInitialized) { /* ... */ }
```

---

## Thanks!

![right](abandoned-antique.jpg)
