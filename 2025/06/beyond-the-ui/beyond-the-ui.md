autoscale: true
build-lists: true
footer: ashdavies.dev
slide-transition: fade(0.5)
theme: Work, 8

[.text: line-height(2), text-scale(0.5)]
[.footer: ]

# [fit] Beyond the UI

## [fit]Compose as a Foundation for Multiplatform Apps

#### mDevCamp - June '25 🇨🇿

Ash Davies
Android GDE Berlin
ashdavies.dev

^ Much in the same way that Coroutines revolutionized reactive architecture, Compose challenges us to rethink how we design applications. 

^ While traditionally seen as a UI toolkit, Compose — and specifically Compose Multiplatform — can play a much larger role in our applications.

^ By leveraging its declarative and state-driven nature, we can build, model, and manage application state in a way that is consistent, scalable, and platform-agnostic.

---

# What is Jetpack Compose UI

---

# When was Compose UI introduced?

---

- History of XML layouts in Android
- Android developers unhappy with XML

^ What problem was it trying to solve?

---

# What projects suggested a problem with the status quo?

- DataBinding & ViewBinding
- Community libraries (Anko, Splitties)

---

# What prompted a rethink of Android UI tooling?

- Widespread adoption of Kotlin on Android
- Kotlin language features

^ Kotlin language features, lambdas, immutability, extension functions

---

# What are the principles of Compose?

- Declarative
- Open Source
- Idiomatic

---

# How does it work?

- Kotlin compiler plugin
- Cooperation with Jetbrains
- Manipulates method signatures

---

# What does it look like?

```kotlin
@Composable
fun Counter() {
    var count by remember { mutableStateOf(0) }

    Button(onClick = { count += 1 }) {
        Text("Count: $count")
    }
}
```

---

[.code-highlight: 1]

# What does this code remind us of?

```kotlin
fun Counter($composer: Composer) { 
    $composer.startRestartGroup(-1913267612)
    
    /* ... */
    
    $composer.endRestartGroup()
}
```

---

# How is the KotlinX Coroutine code manipulation similar?

```kotlin
fun counter($completion: Continuation) {
    /* ... */
}
```

---

[.background-color: #fff]
[.footer-style: #000]

# What tree structure does the Compose runtime output?

![100% original](compose-ui-tree.png)

---

[.text: text-scale(0.75)]
[.footer: jakewharton.com/a-jetpack-compose-by-any-other-name]

> Compose is, at its core, a general-purpose tool for managing a tree of nodes of any type ... a “tree of nodes” describes just about anything, and as a result Compose can target just about anything.
-- Jake Wharton

^ What is Compose, at its core?

---

# [fit] ⚠️ Compose != Compose UI

---

[.code-highlight: 1]

```kotlin
fun Counter($composer: Composer) { 
    $composer.startRestartGroup(-1913267612)
    
    /* ... */
    
    $composer.endRestartGroup()
}
```

^ How does this look similar to Coroutines?

---

```kotlin
fun counter($completion: Continuation) {
    /* ... */
}
```

^ How does coroutines also manipulate a method signature?

---

# Remember the problems coroutines were meant to solve?

- Reactive pipelines
- Explicit thread handling
- Inline error-handling
- Lifecycle awareness

---

- Native library
- Imperative syntax
- `suspend fun`

^ What did Coroutines bring to the table?

---

# Reactive Architecture

- Push (not pull)
- Unidirectional Data Flow
- Declarative
- Idempotent

^ Consider our architecture goals and how we can use tooling to achieve them

---

```kotlin
downloadManager.downloadFile("https://.../") { result ->
  fileManager.saveFile("storage/file", result) { success ->
    if (success) println("Downloaded file successfully")
  }
}
```

^ Back in the day, we had callbacks, to execute code "after"

^ We still have this in a lot of places, which can be ok

^ Can quickly end up in callback hell

---

```kotlin
downloadManager.downloadFile("https://.../")
  .flatMap { result -> fileManager.saveFile("storage/file", result) }
  .observe { success -> if (success) println("Downloaded file successfully") }
```

^ Which then evolved into an observable chain

^ Everything is a stream, and it's observable

^ Can quickly become unmanagable with Rx operators

---

```kotlin
val file = downloadFile("https://.../")
val success = fileManager.saveFile("storage/file", file)
if (success) println("Downloaded file successfully")
```

^ Coroutines turned this into an imperative style

^ Get to enjoy Kotlin and structured concurrency

---

```kotlin
downloadManager.downloadFile("https://.../")
  .flatMapLatest { state ->
    when (state) {
      is State.Loaded -> stateFileManager.saveFile("storage/file", state.value)
      else -> state
    }
  }
  .collect { state ->
    when (state) {
      is State.Loading -> /* ... */
      is State.Saved -> println("Downloaded file successfully")
    }
  }
```

^ TODO Expand on these code segments link each better

^ Consider though that we wish to model our state through a reactive flow

^ Which through Coroutines looks similar to observables

---

```mermaid
%%{ init: { 'flowchart': { 'curve': 'stepBefore' } } }%%
flowchart TD
    RN1[RootNode] --> CN1[ChildNode]
    RN1[RootNode] --> CN2[ChildNode]
    RN1[RootNode] --> CN3[ChildNode]
    RN1[RootNode] --> CN4[ChildNode]
    RN1[RootNode] --> CN5[ChildNode]
    CN1[ChildNode] --> CN6[ChildNode]
    CN1[ChildNode] --> CN7[ChildNode]
    CN5[ChildNode] --> CN8[ChildNode]
    CN5[ChildNode] --> CN10[ChildNode]
    CN10[ChildNode] --> CN11[ChildNode]
    CN10[ChildNode] --> CN12[ChildNode]
```

^ Remembering that Compose is a tree of nodes means we can restructure our architecture

---

```kotlin
val downloadState = downloadManager
    .downloadFile("https://.../")
    .collectAsState(State.Loading)

val fileState = when(downloadState) {
  is State.Loaded -> stateFileManager.saveFile("storage/file", state.value)
  else -> state
}

when (fileState) {
  is State.Loading -> /* ... */
  is State.Saved -> LaunchedEffect(fileState) {
    println("Downloaded file successfully")
  }
}
```

^ Means we've moved changed the react operators into a more readable sequence of declarations

---

# Molecule
### github.com/cashapp/molecule

^ Molecule built by the folks at Square explores this further

^ Being able to use Compose runtime to build a state

---

## Molecule

```kotlin
fun CoroutineScope.launchCounter(): StateFlow<Int> {
  return launchMolecule(mode = ContextClock) {
    var count by remember { mutableStateOf(0) }

    LaunchedEffect(Unit) {
      while (true) {
        delay(1_000)
        count++
      }
    }

    count
  }
}
```

^ Utilising Compose Runtime to build state flow

---

## Testing

^ TODO Testing Molecule

---

## Role of Architecture

^ Knowing that Compose runtime is capable of managing a tree of nodes

^ Means we can exploit this as an architecture

^ TODO: Importance of navigation and architecture

---

## Pre-Compose Era

^ Taking frameworks and applying them to compose works fine

^ But if it seems a little un-idiomatic

^ Consider Compose first architectures

---

# Tooling in Compose MPP

- 🔧 Decompose (Navigation, Lifecycle)
- 🧬 Molecule (State modeling)
- 🪞Voyager / Appyx (Navigation alternatives)
- 🔄 Reaktive / Flow / StateFlow (State Streams)
- 🌈 Kamel (Image loading)
- 🧪 Paparazzi / Snapshot testing (UI validation)

---

# Navigation with Decompose

- Declarative component hierarchy
- State hoisting via ViewModels (multiplatform-friendly)
- Back stack management without fragments
- Integration with Compose UI and Compose for Web/Desktop

^ Example Diagram or snippet optional

---

# Circuit
### github.com/slackhq/circuit

^ Circuit is a community contributed library for multiplatform

^ Takes inspiration from existing approaches, cashapp broadway, workflow etc

^ Driven by Zac, Kieran and the rest of the folks at Slack

---

## Circuit

- Supports most supported KMP platforms
- Compose first architecture
- Presenter & UI separation
- Unidirectional Data Flow

^ Designed with Compose in mind, powered with the compose runtime

^ Same principal tenet, separation of presenter and ui

^ UDF all the way through, no mutability

---

# History of Multiplatform

^ TODO Include failed multiplatform libs

---

# Why Compose Multiplatform?

- Shared UI logic across Android, Desktop, iOS, Web
- Unified state handling with shared ViewModels or Presenters
- Faster prototyping across form factors
- Composable tooling beyond visual UI (state, business logic)

---

# Compose MPP Enables

- Consistent state handling across platforms
- Shared design system (e.g., Material)
- Deep JetBrains IDE integration
- Integration with Kotlin Multiplatform (KMP) libraries:
    - `Ktor`, `Kotlinx.serialization`, `Decompose`, `Essenty`

---

# Compose Runtime beyond UI

- Composables as reactive functions
- Ideal for:
  - Finite State Machines
  - Orchestration Logic
  - Testing state changes deterministically
  
---

# Wrap-Up: Why This Matters

✅ Compose is more than a UI toolkit  
✅ Enables scalable, shared architecture  
✅ Designed for Kotlin-first developers  
✅ Multiplatform is no longer just business logic

→ Start rethinking how you architect apps, not just how you render them.

---

[.text: line-height(2), text-scale(0.5)]
[.footer: ]

# Thank You!

Ash Davies
Android GDE Berlin
