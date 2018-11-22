footer: ![10%](immobilienscout24.png)
autoscale: true
build-lists: true
header: Open Sans
text: Open Sans
slidenumbers: true
theme: Simple

[.footer: ashdavies.io - @askashdavies]

![right inline 15%](immobilienscout24.png)

## RxJava & Coroutines: A Practical Analysis

![left inline](k-night-logo.png)

![right](k-night-pattern.png)

^ Talk a culmination of discussions with developers in conferences these few months

^ Most people excited about coroutines, but have questions about its usage

^ What position does it sit in the Android ecosystem

---

![inline 25%](kotlin-logo.png)

^ Unveiled as project Kotlin in 2011

^ Open sourced under Apache license 2012

^ Version one stable release 2014

---

![inline 40%](android-kotlin-hero.png)

^ Already garnered support from development community

^ Android team announced first class support in 2017

---

# 🎉

^ Developers worldwide rejoiced, dreams had been realised

---

## Adoption

^ This year Pusher surveyed 2744 people from January to March

^ They found that Kotlin usage doubled year on year

---

## 7.7% (2015)

^ Starting at 7.7% in 2015

---

## 19.5% (2016)
### 7.7% (2015)

^ Spiking to 19.5 after the release of a document from JW advocating its use at Square

---

## 46.8% (2017)
### 19.5% (2016)
#### 7.7% (2015)

^ Exploding to 46.8 after Google's announcement at Google IO in 2017

---

[.footer: blog.jetbrains.com/kotlin/2016/02/kotlin-1-0-released-pragmatic-language-for-jvm-and-android/]

![inline](kotlin-adoption.png)

^ Stack Overflow speculated one of the fasted growing and least disliked

---

# Multi Platform

![right](kotlin-multiplatform.png)

^ Popularity and success contributed to by continued evolution of Kotlin

^ Kotlin 1.2 announced in November 2017 with multi-platform support

---

## ![](kotlin-logo.png) Coroutines 

^ Coroutines available as experimental in Kotlin 1.1

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
```

^ Calling launch on a Coroutine scope will build a coroutine context

^ Existing Coroutine scopes can be accessed or created 

---

## ⚖️ Stability

^ In the abstract I had mentioned "with coroutines approaching stability"

^ As of Kotlin 1.3 coroutines API graduated to stable

^ Much like stdlib require additional libraries

^ Required only to consume suspended functions

---

## `async` / `launch`

^ Coroutines library provides two coroutine builder functions on a scope

---

### `val deferred: Deferred<String> = async { "Hello" }`

^ Async returns a deferred result and must be awaited to return a result

---

### `val result: String = deferred.await()`

^ Much like Future, Deferred represents a promise that must be awaited

---

### `val job: Job = launch { "Hello" }`

^ Launch will return a job which will run in parallel until awaits

---

### `job.join()`

^ Join will suspend the coroutine until the job is finished

^ Much like disposable or subscription, a job can be cancelled

---

## Annotations

### bit.ly/2BpDQkB

^ Though coroutines are stable some API elements are still under development

^ Kotlin introduced annotations to manage these aspects

---

## 🐉 Here be dragons

^ Roughly speaking good chance these declarations will be deprecated

---

## `@ExperimentalCoroutinesApi`

^ Experimental API's design declarations may still change

^ Applies to some Rx conversion methods

^ Production of channels

---

## `@ObsoleteCoroutinesApi`

^ Obsolete API's will be deprecated in the future

^ Not yet known what will replace them

^ Consumption of channels

---

## `@InternalCoroutinesApi`

^ Should only be used internally by Kotlin coroutines

^ Can change without warning or migration aids

---

![inline](elizarov-obsolete-difference.png)

^ Roman explains difference between obsolete and experimental

^ Difference only in intent, `@Experimental` may graduate

^ Not yet known what will replace `@Obsolete`


---

## Coroutines

### 🍞 Best thing since sliced bread

^ Does this phrase exist in German?

^ Why do people say this?

---

## 💪 Coroutines

^ What makes Coroutines so great?

---

## 🥇 Native first-party library

^ First class support and documentation from JetBrains

^ Continued evolution and development of performance and features

^ Not relying on a third party implementation

^ Everything already awesome about Kotlin

---

## 😊 Easy-to-use

^ Learning curve for getting started is really simple

---

## 👌 `suspend fun`

^ Create async methods with suspend keyword

^ Consume existing suspend functions

---

## `Dispatchers.Main`

^ Logical handling of threads 

^ Support for Android and Swing

---

## 🕰️ History of Android

^ Handling asynchronous operations on Android has been really hard

^ Java 6 and lack of lambda support made code quite ugly

---

## Background Processes

^ Too many options for background tasks make it hard for beginners

---

## 🏛️️ `Runnable` / `Handler`

^ The de facto standard for Android and Java background tasks

---

## 🤢 `AsyncTask`

^ Beloved AsyncTask risks memory leaks and confuses UI/background logic

---

## 😕 `IntentService`

^ Intent service "work queue processor" pattern to offload tasks

---

## 🍯 `Loader<T>`

^ Lifecycle aware loaders introduced in Honeycomb and compatibility library

---

## ![](jetpack-icon.png) `WorkManager`

^ WorkManager released with JetPack, defers to JobScheduler, JobDispatcher or AlarmManager

---

## Background Processes

### `AlarmManager`, `AsyncTask`, `CountDownTimer`, `FutureTask<T>`, `GcmNetworkManager`, `Handler`, `HandlerThread`, `IntentService`, `JobDispatcher`, `JobScheduler`, `Loader<T>`, `ScheduledThreadPoolExecutor`, `Timer`, `Task<T>`, `WorkManager`

^ Not even a comprehensive list of background process options

^ Decision paralysis, which is best for my project

---

![inline](competing-standards.png)

[.footer: https://xkcd.com/927/]

^ No single option seems to match most requirements

^ Leading to new standards for individual use cases

---

## RxJava to the rescue

![right](rabbid-superhero.gif)

---

## ⛓️ Chained operations

^ Allows us to compose chained operator sequences

---

## ↔️ Abstracted threading

^ Abstract away threading, synchronisation, concerns

---

## 😮 Reactive programming

^ Introduced the concept of reactive programming

^ This was a major turning point for architecture

---

![right](over-the-top.gif)

^ But this quickly got out of hand

^ RxJava became the tool of choice

---

![65%](rx-libraries-one.jpg)

^ Started seeing libraries wrapping native API's

---

![65%](rx-libraries-two.jpg)

^ and more

---

![65%](rx-libraries-three.jpg)

^ and more

---

![65%](rx-libraries-four.jpg)

^ and more

---

![inline 100%](rx-tasks.png)

^ Oops

---

![inline 100%](build-passing.png)

^ One the plus side we learned that people really like readme badges

---

## 👍 Asynchronous API's

^ Many of these libraries do a good job of providing asynchronous API's

^ When everything uses the same framework it's easy to fit together

---

## 👎 Synchronous API's

---

## `Observable.fromIterable()`

![](my-brain-is-full-of-fuck.png)

^ This may have made sense before Kotlin streams

^ But it sure as shit does not make sense now

---

## `Flowable` / `Observable` / `Single` / `Completable` / `Maybe`

^ Additionally RxJava2 introduced four new types

^ Contract limits traditional Observable result

^ Sharing no common ancestor require conversion functions

---

[.background-color: #222222]

![inline](rx-java-mapping.png)

^ Conversion functions often hard to remember

---

## 🤦‍♀️

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

^ Operator chains can quickly escalate out of control

---

![](escalated-quickly.jpg)

^ Well that escalated quickly

---

## ⚙️ Hidden complexity

^ Go back to previous slide

---

## 😭 Hidden gotchas

^ Behaviour can often be unpredictable when converting

^ Maybe can be turned to completable without completing

^ Combining operators behave differently if not all complete

---

## 💾 Memory footprint

^ RxJava objects take a lot of memory

^ Each operation increases object allocation

---

## ⤴️ Steep learning curve

^ Steep learning curve for learning operator functions

^ Even after years of use still miss some behaviours

---

![inline](cyanide-hero.png)

[.footer: http://explosm.net/comics/3185/]

^ Not quite the hero we thought it would be

---

![](table-flip.gif)

---

## #RxMustDie
#### #DCBERLIN18

![right](rx-must-die.jpg)

---

^ https://github.com/Kotlin/kotlinx.coroutines/issues/254

---

[.footer: ashdavies.io - @askashdavies]

![right inline 15%](immobilienscout24.png)

# Cheers! 🍻

![right](k-night-pattern.png)
