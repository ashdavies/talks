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

# 7.7% (2015)

^ Starting at 7.7% in 2015

---

# 19.5% (2016)
## 7.7% (2015)

^ Spiking to 19.5 after the release of a document from JW advocating its use at Square

---

# 46.8% (2017)
## 19.5% (2016)
### 7.7% (2015)

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

---

## Kotlin Coroutines

### Are Coroutines Stable?

- "with coroutines approaching stability"
- suspend has always been stable
- Coroutines consume suspend functions
- V1 general stability (launch/async)

---

## Coroutines

### Annotations (here be dragons)

- @Experimental
- @Obsolete 

Basically identical, don't base fundamental architecture or api's on them

---

## Coroutines

### Best thing since sliced bread

^ Does this phrase exist in German?

^ Why do people say this?

^ What makes Coroutines so great?

---

## Coroutines

- Native language support for asynchronous operations
- Suspend functions tell the compiler to wait
- Coroutine builders construct context to consume
- Logical handling of threaded operations

---

## Asynchronous Android

 - AsyncTask
 - Loader
 - Handler
 - Task
 - JobScheduler
 
---

## Java 6

---

## RxJava to the rescue

- Consistent operators
- Complex operations
- Reactive programming

---

## Quickly used everywhere

- Even in places it shouldnt be
- Observable.fromIterable()
- Libraries to consume native API's
- RxJava2 conversion: `flatMapCompletable` :wtf:

---

## Making Things Worse

- Operators hide complexity
- Large memory footprints
- Steep learning curve
- Hidden gotchas
- Requires guru level knowledge

---

## Tipping Point - RxMustDie

---

^ https://github.com/Kotlin/kotlinx.coroutines/issues/254

---

[.footer: ashdavies.io - @askashdavies]
![right inline 15%](immobilienscout24.png)

# Cheers! 🍻

![inline left](ash-davies.png)
