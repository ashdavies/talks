autoscale: true
build-lists: true
footer: @askashdavies
footer-style: Open Sans
header: Google Sans
slide-transition: true
theme: Simple, 3
text: Open Sans

![right inline 15%](immobilienscout24.png)

# [fit] Refactoring Legacy Code with Kotlin & Coroutines
## Kotlin Everywhere: Hamburg

![left inline 30%](gde-badge-round.png)

![right](abandoned-antique.jpg)

---

![inline 10%](green-robot.png)

^ The content of this talk comes mainly from the perspective on Android

^ Generic content can be applied to other platforms

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

^ Aggressive development including new features

---

# Null 💵

^ The million dollar mistake

^ Null has plagued developers for years

^ Null checks present in nearly all Java code

^ Unexpected behaviour, unpredictable output

---

```java
if (foo == null) {
  bar();
}
```

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

^ We lost our shit, and we quickly started seeing changes

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
public class BadJavaActivity extends Activity {

  @Inject Dependency dependency;
}
```

^ Public for common dependency injection library

^ Auto formatting makes a lot of general assumptions

---

![](general-assumptions.jpg)

# General Assumptions 👮‍♂️

---

```kotlin
class BadKotlinActivity : Activity() {

  @Inject var dependency: Dependency? = null
}
```

^ Availability of `internal` keyword ignored

^ Parameters are assumed to be null if not directly instantiated

^ Double bang used to reference variables

---

```kotlin
class SlightlyLessBadKotlinActivity : Activity() {

  @Inject internal lateinit var dependency: Dependency
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

# Data Classes

---

```java
public class User {

  private String firstName;
  private String lastName;

  public User(String firstName, String lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    User user = (User) o;
    return Objects.equals(firstName, user.firstName) &&
        Objects.equals(lastName, user.lastName);
  }

  @Override
  public int hashCode() {
    return Objects.hash(firstName, lastName);
  }
}
```

^ Pojos contribute to a lot of the boilerplate in Java code

^ Dont properly represent nullable values

---

```kotlin
class User(var firstName: String?, var lastName: String?) {

  override fun equals(o: Any?): Boolean {
    if (this === o) {
      return true
    }
    if (o == null || javaClass != o.javaClass) {
      return false
    }
    val user = o as User?
    return firstName == user!!.firstName && lastName == user.lastName
  }

  override fun hashCode(): Int {
    return Objects.hash(firstName, lastName)
  }
}
```

^ Direct conversion with the IntelliJ won't use a data class automatically

^ Results in left over equals and hashcode methods

---

```kotlin
data class User(val firstName: String, val lastName: String)
```

^ Not only more concise and easier to read

^ Introduces immutability and non null members

---

```java
@NotNull
public final User copy(@Nullable String firstName, @Nullable String lastName) {
  return new User(firstName, lastName);
}
```

^ Also includes copy function for modification

^ Removing the necessity for builder and factories

---

# Kotlin

- Implementing singletons
- Handling strings
- Elvis operator 🕺
- Destructuring
- Properties and backing properties
- Default arguments and named parameters
- Working with collections
- Extension functions
- Top-level functions and parameters
- let, apply, with, and run keywords

^ Kotlin offers a variety of other niceties

---

# ![](kotlin-logo.png) Coroutines 

^ Coroutines available as experimental in Kotlin 1.1 stable in 1.3 (Oct '18)

^ Available in other languages, subroutines for non-preemptive (cooperative) multitasking

^ Allow us to write asynchronous code as if it were synchronous

---

```kotlin
fun main() {
    GlobalScope.launch {
        delay(1000L)
        println("World!")
    }
    println("Hello,")
    Thread.sleep(2000L)
}

// Hello,
// World!
```

^ Consider the following asynchronous code

^ Sequential by default, seemingly imperative

---

```kotlin, [.highlight: 3]
fun main() {
    GlobalScope.launch {
        delay(1000L)
        println("World!")
    }
    println("Hello,")
    Thread.sleep(2000L)
}

// Hello,
// World!
```

^ Delay is a suspended function, must be called from a Coroutine

---

```kotlin, [.highlight: 2, 5]
fun main() {
    GlobalScope.launch {
        delay(1000L)
        println("World!")
    }
    println("Hello,")
    Thread.sleep(2000L)
}

// Hello,
// World!
```

^ Calling launch on a Coroutine scope will build a coroutine context

^ Global scope applied unconfined context

^ Scope can be created with dispatchers based on use case

---

# ⚖️ Stability

^ In the abstract I had mentioned "with coroutines approaching stability"

^ As of Kotlin 1.3 (Oct '18) coroutines API graduated to "fully" stable

---

[.footer-style: #ffffff]

![](lie-detected.gif)

^ That wasn't completely true, but lets cover the basics

---

# @Annotations

## (🐉 Here be dragons)

^ Though coroutines are stable some API elements are still under development

^ Kotlin introduced annotations to manage these aspects

---

# Annotations

```kotlin
@ExperimentalCoroutinesApi // ⚠️
```

^ Experimental API's design declarations may still change

^ Applies to Rx conversion, and channel production

---

# Annotations

```kotlin
@ExperimentalCoroutinesApi // ⚠️

@ObsoleteCoroutinesApi // ⚠️
```

^ Obsolete API's will be deprecated in the future but not yet known what will replace them

^ Difference between obsolete and experimental is intent, @Experimental may graduate, @Obsolete unknown

^ Applies to channel consumptions, actors, Rx conversion functions

---

# Annotations

```kotlin
@ExperimentalCoroutinesApi // ⚠️

@ObsoleteCoroutinesApi // ⚠️

@InternalCoroutinesApi // ☠️
```

^ Should only be used internally by Kotlin coroutines

^ Can change without warning or migration aids

---

# 💪 Coroutines 💪

^ What makes everybody want to jump on the Coroutine bandwagon?

^ Two left arms because RTL emojis aren't a thing yet

---

# 🥇 Native first-party library

^ First class support and documentation from JetBrains

^ Continued evolution and development of performance and features

^ Not relying on a third party implementation

^ Everything already awesome about Kotlin

---

# 😊 Easy-to-use

^ Learning curve for getting started is really simple

---

# 👌 `suspend fun`

^ Create suspended methods with the suspend operations

^ Methods need not care about scheduling

---

# `Dispatchers`

^ Dispatchers provided by the framework for common use cases

---

# `Dispatchers`

- Default
- IO
- Main
 - Android (Main Thread Dispatcher)
 - JavaFx (Application Thread Dispatcher)
 - Swing (Event Dispatcher Thread)
- Unconfined

^ - Default: Default for builders like launch, async, etc if neither a dispatcher or interceptor is specified

^ - IO: Designed for offloading blocking IO tasks to a shared pool of threads.

^ - Main: Confined to the Main thread operating with UI objects. Usually single-threaded.

^ - Unconfined: A coroutine dispatcher that is not confined to any specific thread

---

# Thanks!

![right](abandoned-antique.jpg)
