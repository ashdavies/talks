autoscale: true
build-lists: true
footer: @askashdavies
footer-style: Google Sans
header: Google Sans
slide-transition: true
theme: Merriweather, 3
text: Google Sans

![right inline 25%](immoscout24.png)

# Refactoring Legacy Code with Kotlin
## TCM Extended: Berlin 🇩🇪

---

# Legacy

**adj.**

Denoting or relating to software or hardware that has been superseded but is difficult to replace because of its wide use.

^ How do we define legacy code?

^ Superseded but difficult to replace.

---

# Working Effectively with Legacy Code
### **Michael Feathers**

![right 100%](working-effectively.jpg)

- Untested code

- Regression tests

- Lack of confidence

^ Michael Feathers defines legacy code as code without tests

^ Which due to lack of automated regression testing makes it difficult to work with.

^ I'm considering this to include anything that's Java

---

# ![](green-robot.png)!

^ The content of this talk comes mainly from the perspective on Android

^ Generic content can be applied to other platforms

---

# Java ![](green-robot.png)

^ Though Android is built upon Java

^ Java has been out of our reach

---

# JVM != ART

^ Because the Java virtual machine uses APIs slightly different from Android Runtime

---

[.background-color: #ffffff]
[.footer: twitter.com/QuinnyPig/status/1174434046853599232]

![inline](oracle-legal-company.png)

^ Which has led to a large company disputing if an API can be copyrighted

---

# Java 8

- Lambda expressions
- Method references
- Default interfaces
- try-with-resources

^ Many Java 8 features only available with AGP 3.0

^ Many parts of the API only available with minSdk 24 or higher

---

# Streams ↝ 

^ Not available until Android Nougat

^ Not able to raise min sdk

---

![](so-what.gif)

^ But so what? Backend developers can use whatever version they like

---

# Kotlin ![](kotlin-logo.png)

^ Many arguments for Kotlin over Java

^ Code that looks consistently familiar

^ Code that behaves idiomatically

^ Code that looks terse and concise

^ Aggressive development including new features

---

# Null 💵 🔥

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

^ Seen littered everywhere

---

# Defensive Code <🛡>

^ This is considered defensive code

^ Code that is hardened to potential failure

^ Results in polymorphic behaviour with many execution paths

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

# Kotlin

**noun**

Freakin' awesome

^ So should we all start using Kotlin?
 
^ Yes! Go! Start!
 
---

[.background-color: #ffffff]

![inline 100%](android-kotlin-hero.png)

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

# Idiomatic

**adj.**

Using, containing, or denoting expressions that are natural to a native speaker

^ Definition of idiomatic

---

[.footer: kotlinlang.org/docs/reference/coding-conventions.html#idiomatic-use-of-language-features]

## Idiomatic use of Language Features

^ When it comes to programming this means usage of idioms specific to that language

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

^ How can I start converting my Java to Kotlin

---

# ⌃⌥⇧K

---

[.footer: ]

![](job-done.gif)

^ Job done lets go home

---

[.footer: ]

![](please-dont.gif)

^ Please don't do this

---

[.footer: ]

![](but-why.gif)

^ But why shouldn't we use this in-built tool from Jetbrains?

^ Surely they should know what's best right?

---

```java
public class BadJavaActivity extends Activity {

  @Inject Dependency dependency;
}
```

^ Take an example, public property common dependency injection library

^ Auto formatting makes a lot of general assumptions

---

[.text: #ffffff]
[.footer: How I Met Your Mother, CBS]

![original](general-assumptions.jpg)

<br />
<br />
<br />
<br />
<br />
<br />
<br />

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

# Nullability 💵 🔥

^ Back to our million dollar mistake

---

# !!

^ Any nullable types will use the double bang operator to force non-null

^ Ensures same behaviour but can be improved

---

```java
// Throws NullPointerException 🔥
myNullVal.myMethod() 
```

^ Accessing a method on a nullable property will throw an NPE

---

```kotlin
// Still throws NullPointerException 🔥
myNullVal!!.myMethod()
```

^ After converting uses the double bang to compile

---

```kotlin
// Does nothing 🤷‍♂️
myNullVal?.myMethod()
```

^ We could just use the null operator

---

```kotlin
// Still does nothing 🤷‍♂️
myNullVal?.also {
  it.myMethod()
}
```

^ Or even better use Kotlin scope functions

---

```kotlin
// Defensive Code <🛡>
myNullVal?.also {
  it.myMethod()
}
```

^ This is defensive code

^ and language abuse

^ fails to handle error

---

```kotlin
// Offensive Code <🖕>
myNullVal!!.myMethod()
```

^ So we actually want to prefer our offensive code

^ But how to avoid the double bang?

---

```kotlin
// throws IllegalArgumentException("Required value was null.")
requireNotNull(myNullVal).myMethod()
```

^ We can require the value as not null with this Kotlin method

---

```kotlin
// throws IllegalArgumentException("myNullVaL was null because ...")
requireNotNull(myNullVal) { "myNullVaL was null because ..." }.myMethod()
```

^ But even better we can provide a specific message

^ Gives more informative information about the failure

---

```kotlin
class ImpossibleException : IllegalArgumentException()

// throws ImpossibleException()
val myNotNullVal = myNullVall ?: throw ImpossibleException()

myNotNullVal.myMethod()
```

^ But even more better we can provide a specific exception

---

[.background-color: #ffffff]
[.footer: xkcd.com/2200/]

![right 50%](unreachable-state.png)

<br />
<br />

```kotlin
class ImpossibleException : IllegalArgumentException("""
    If you're seeing this, the code is in what I thought was an unreachable state.
    I could give you advice for what to do, but honestly, why should you trust me?
    I clearly screwed this up. I'm writing a message that should never appear,
    yet I know it will probably appear someday.
    
    On a deep level, I know I'm not up to this task.
    I'm so sorry.
""")

// throws ImpossibleException()
val myNotNullVal = myNullVall ?: throw ImpossibleException()

myNotNullVal.myMethod()
```

^ Then you can use the exception to provide more information

^ Implement custom behaviour and any fallback mechanisms

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
data class User(
  val firstName: String,
  val lastName: String
)
```

^ Not only more concise and easier to read

^ Introduces immutability and non null members

---

```kotlin
data class User(
  val firstName: String, 
  val lastName: String? = null
)
```

^ This also works for default parameters and nullable properties

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

[.footer: kotlinlang.org/docs/reference/idioms.html]

# Kotlin: Idioms

- Singleton objects
- String interpolation
- Elvis operator 🕺
- Destructuring
- Extension functions
- Scoping functions

^ Kotlin offers a variety of other niceties

---

# Maintaining History

^ One of the main frustration about migrating to Kotlin is retaining VCS history

^ A few tricks can achieve this

---

# Maintaining History

- Change extension `.java` -> `.kt` 
- First commit
- Apply Kotlin conversion
- Second commit

^ Whilst this will technically work

^ Some reasoning and change history will still be lost

^ Commit purpose doesn't hold business value

---

# Maintaining History
## Refactoring

^ Better to migrate to Kotlin through abstraction and refactoring

^ Apply single responsibility principle to complex classes

---

# Refactoring

^ Better to migrate to Kotlin through abstraction and refactoring

^ Apply single responsibility principle to complex classes

---

# Refactoring
## SOLID

- Single-responsibility
- Open-closed
- Liskov substitution
- Interface segregation
- Dependency inversion

^ We should all be familiar with solid design

---

![](uncle-bob-watching.jpg)

^ We should be practicing these practices these any way

---

# Refactoring
## Single Responsibility

^ Identifying when a class has too much responsibility allows abstraction

^ Creating new classes also reveals intent can be better tracked

---

# Perspective 🔭

^ Solving the same problem in a different way results in a better understanding of the requirements

^ Same reason we perform Kata exercises to hone our skills

---

# Static 🙅‍♂️

^ The nice thing about Kotlin is that is helps us away from static

^ Static operations are not much better than procedural code

^ Difficult to test, static call can't be mocked

---

# Asynchronicity

^ Which brings us to asynchronicity, many tasks don't immediately return a value

^ Need to perform background operations or computation

^ Especially important in UI environments

---

# Concurrency is Hard 🚄

^ When managing multiple threads we can run into issues

^ Race conditions a problem with a shared mutable state

---

# Thread

```java
new Thread(() -> {
  foo();
}).start();
```

^ The simplest of these operations is a new thread

^ Not very efficient, resource intensive

^ Result not encapsulated, not easily cancellable

---

# CompletableFuture

```java
CompletableFuture.supplyAsync(this::findSomeData)
  .thenApply(this:: intReturningMethod)
  .thenAccept(this::notify);
```

^ Bit more useful, only available in Java 8

---

# RxJava

```java
Observable
  .fromIterable(resourceDraft.getResources())
  .flatMap(resourceServiceApiClient::createUploadContainer)
  .zipWith(Observable.fromIterable(resourceDraft.getResources()), Pair::create)
  .flatMap(uploadResources())
  .toList()
  .toObservable()
  .flatMapMaybe(resourceCache.getResourceCachedItem())
  .defaultIfEmpty(Resource.getDefaultItem())
  .flatMap(postResource(resourceId, resourceDraft.getText(), currentUser, resourceDraft.getIntent()))
  .observeOn(AndroidSchedulers.mainThread())
  .subscribeOn(Schedulers.io())
  .subscribe(
      resource -> repository.setResource(resourceId, resource, provisionalResourceId),
      resourceUploadError(resourceId, resourceDraft, provisionalResourceId)
  );
```

---

![](escalated-quickly.jpg)

^ That escalated quickly

---

# What If? 🤔

^ But what if we could write asynchronous code in a synchronous imperitive fashion

^ Whilst retaining reactive state and managing a hierarchy of concurrency?

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

# Stability

^ If you're familiar with the androidx release process

^ Alpha, beta, release candidate, stable

^ Coroutines achieves this with annotations

---

# Annotations
## `@Experimental`

^ All of these are annotated with experimental

^ Sometimes causing an error, and sometimes a warning

^ Can be extended with your own annotations 

---

[.footer: speakerdeck.com/jossiwolf/building-sdks-the-kotlin-way-ccb4a237-b45c-42e7-8391-640dd058f50c]

# [fit] Building SDKs - The Kotlin Way
## [fit] Kotlin Everywhere: Hamburg - Jossi Wolf

---

# 💪 Coroutines 💪

^ What makes everybody want to jump on the Coroutine bandwagon?

---

# 🥇 Native library

^ First class support and documentation from JetBrains

^ Continued evolution and development of performance and features

^ Not relying on a third party implementation

^ Everything already awesome about Kotlin

---

# Efficient 🌮

^ Coroutines are fast and memory efficient

^ Leaning on the compiler to perform thread optimisations

^ Launch hundreds of thousands of threads without any performance issues

---

# 😊 Easy-to-use

^ Learning curve for getting started is really simple

---

# 👌 `suspend fun`

^ Create suspended methods with the suspend operations

^ Methods need not care about scheduling

^ Suspended functions are easy to refactor

---

# 👌 Suspend

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

^ Lets take our suspend example from earlier

---

# 👌 Suspend

```kotlin, [.highlight: 3, 8-11]
fun main() {
  GlobalScope.launch {
    doWorld()
    println("Hello,")
  }
  Thread.sleep(2000L)
}

suspend fun doWorld() {
  delay(1000L)
  println("World!")
}

// Hello,
// World!
```

^ The extracted function is simply marked as suspend

^ Allows called to manage execution context

^ But what if I need a different context?

---

# 👌 Suspend

```kotlin, [.highlight: 10-13]
fun main() {
  GlobalScope.launch {
    launch { doWorld() }
    println("Hello,")
  }
  Thread.sleep(2000L)
}

suspend fun doWorld() {
  withContext(Dispatchers.IO) {
    delay(1000L)
    println("World!")
  }
}

// Hello,
// World!
```

^ Call `withContext` providing a dispatcher or context

---

# Testing

```kotlin
@Test
fun testFoo() = runBlockingTest {
  val actual = foo() 
  // ...
}

suspend fun foo() {
  delay(1_000)
  // ...
}
```

^ Simply use the Coroutine builder `runBlockingTest` to build a testable context

^ Suspended operations in `runBlockingTest` will be auto-advanced virtual time

---

# Further Reading 📖

- **Google Codelab: Refactoring to Kotlin**
    codelabs.developers.google.com/codelabs/java-to-kotlin/
- **KotlinX Coroutine Test**
    github.com/Kotlin/kotlinx.coroutines/tree/master/kotlinx-coroutines-test
- **Sean McQuillan: Coroutines + Testing = ❤️**
    droidcon.com/media-detail?video=352671106
- **Ash Davies: RxJava & Coroutines: A Practical Analysis v3**
    speakerdeck.com/ashdavies/rxjava-and-coroutines-a-practical-analysis-v3

---

![right inline 25%](immoscout24.png)

# Thanks!
## bit.ly/refactoring-legacy-code
