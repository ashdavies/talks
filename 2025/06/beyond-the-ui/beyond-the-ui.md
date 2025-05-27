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

^ What is Jetpack Compose UI

---

^ When was Compose UI introduced?

---

- History of XML layouts in Android
- Android developers unhappy with XML

^ What problem was it trying to solve?

---

- DataBinding & ViewBinding
- Community libraries (Anko, Splitties)

^ What projects suggested a problem with the status quo?

---

Widespread adoption of Kotlin on Android

^ What prompted a rethink of Android UI tooling?

---

- Declarative
- Open Source
- Idiomatic

^ What are the principles of Compose?

---

- Kotlin compiler plugin
- Cooperation with Jetbrains
- Manipulates method signatures

^ How does it work?

---

```kotlin
@Composable
fun Counter() {
    var count by remember { mutableStateOf(0) }

    Button(onClick = { count += 1 }) {
        Text("Count: $count")
    }
}
```

^ What does it look like?

---

[.code-highlight: 1]

```kotlin
fun Counter($composer: Composer) { 
    $composer.startRestartGroup(-1913267612)
    
    /* ... */
    
    $composer.endRestartGroup()
}
```

^ What does this code remind us of?

---

```kotlin
fun counter($completion: Continuation) {
    /* ... */
}
```

^ How is the KotlinX Coroutine code manipulation similar?

---

[.background-color: #fff]
[.footer-style: #000]

![100%](compose-ui-tree.png)

^ What tree structure does the Compose runtime output?

---

[.text: text-scale(0.75)]
[.footer: jakewharton.com/a-jetpack-compose-by-any-other-name]

> Compose is, at its core, a general-purpose tool for managing a tree of nodes of any type ... a “tree of nodes” describes just about anything, and as a result Compose can target just about anything.
-- Jake Wharton

^ What is Compose, at its core?

---

# [fit] ⚠️ Compose != Compose UI

^ What is Compose, not?

---

[.code-highlight: 1]

```kotlin
fun Counter($composer: Composer) { 
    $composer.startRestartGroup(-1913267612)
    
    /* ... */
    
    $composer.endRestartGroup()
}
```

---

[.text: line-height(2), text-scale(0.5)]
[.footer: ]

# Thank You!

Ash Davies
Android GDE Berlin
