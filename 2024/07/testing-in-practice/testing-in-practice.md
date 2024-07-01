autoscale: true
build-lists: true
footer: ashdavies.dev
slide-transition: true
slidenumbers: true
theme: Olive Green, 9

[.text: line-height(2), text-scale(0.5)]
[.footer: ]

# Testing in Practice

## Keeping Your Tests Concise and Declarative

### Droidcon Berlin - July '24 🇩🇪

Ash Davies - SumUp Services GmbH
Android / Kotlin GDE Berlin
ashdavies.dev

^ Testing isn't always everybody's favourite task, but that doesn't need to be the case! Writing tests can be an enjoyable way to practice your coding techniques!

^ But with conflicting opinions on writing test code that is declarative, explicit, terse, concise, and isolated, it can be tough to know how to satisfy all of these whilst still retaining your will to live.

^ I'll be covering a few techniques, and mechanisms, for writing idiomatic Kotlin code that leaves you with a beautiful test case that not only fulfils all this but gives you accurate code documentation for your project.

---

[.background-color: #fff]
[.header: #000]
[.footer-style: #000]

# Why Test?

^ Random quotes

---

[.footer: Photos by Daniel Romero, Taylor Vick on Unsplash]
[.footer-style: #CCC]

![](android-smartphone.jpeg)

^ Testing approaches come in many forms, chiefly manual or automatic

^ Manual tests, QA verify or reproduce errors

^ Either in the wild or internal distribution

---

> "Hey, I hope you had a relaxing weekend..."

-- QA Enginner (8:47 Monday morning)

^ Perhaps you've received this message

---

![](cable-network.jpeg)

^ Automated tests run on a CI, automatically, on changes

^ Robust protection, early feedback, prevent regressions

---

# Testing

- Unit
- Regression
- Acceptance
- Instrumentation
- Integration
- End-to-End
- Monkey
- Smoke

^ Slow!

---

![fit](compose-preview-screenshot-testing.png)

![fit](cashapp-paparazzi.png)

^ More recent Compose screenshot testing

^ Low code, automatic generation

---

[.footer: Photo by DiEGO MüLLER on Unsplash]
[.footer-style: #CCC]

# Testing

![right](safety-harness.jpeg)

^ Automated tests act as a safety harness

^ Confidence when changing code

---

# 🥱

![right 50%](writing-unit-tests.png)

^ Many find tests tedious

^ not an appropriate use of time

^ or when asked why not

---

# ⏱️

^ Just didn't have the time

^ Prioritised other topics

---

> Can we skip the unit tests, just for this feature?

-- PM

^ Or maybe by requets

^ Shortcuts taken

---

[.footer: youtu.be/8QvXErxv9qw]

> Tests Saved My Ass

-- Ben Kadel

^ Automated tests are an investment

---

> Our KPI is 100% Code Coverage

-- Former CTO

---

[.background-color: #fff]
[.footer-style: #000]

![inline 40%](monkey-user-unit-tests.png)

^ Important to remember unit tests shouldn't exist alone

^ Test coverage is not an indicative metric

---

> Tests test design as well as logic

-- Michael Feathers

---

# Architecture

### Anti-Patterns and Code Smell

^ Unit tests can highlight architecture improvements

^ If it's hard to test, structure can be improved

^ Useful even if you throw away the tests

---

![right](pile-of-wires.jpg)

# Architecture

- Coupling
- Inheritance
- Mutability
- Polymorphism

^ Each introduce unpredictability

^ Difficult to test

^ Needs refactoring

---

[.background-color: #fff]
[.header: #000]

# Problem Solving

![right filtered 125%](rubiks-cube.jpg)

^ Engineering is often problem solving

^ Balancing problem solving with solutions

^ Inventing problems for solutions

---

# Documentation

Gotchas 🤬

^ Programming is hard, sometimes weird errors occur

^ Your code may not always behave as expected

^ May spend hours, or days debugging

^ Document to prevent the same mistake

---

# Documentation

```kotlin
/**
 * Make sure not to change this thing back to the previous implementation,
 * because it breaks on that one specific device in production,
 * when opening the user profile in France using a German locale.
 **/
fun doMyThing() {
  /* ... */
}
```

^ Documentation is fragile

^ Expires faster than the code it documents

---

# Documentation

```kotlin
/**
 * Make sure not to change this thing back to the previous implementation,
 * because it breaks on that one specific device in production,
 * when opening the user profile in France using a German locale.
 *
 * Update: We changed this to be a remote resolution, this shouldn't happen?
 * We haven't seen it happen in production anymore, but just leave this
 * comment here, incase it occurs again...
 **/
fun doMyThingRefactoredV63() {
  /* ... */
}
```

^ You may end up with conflicting stories

^ Misleading or innappropriate information

---

# Documentation

```kotlin
/**
 * Make sure not to change this thing back to the previous implementation,
 * because it breaks on that one specific device in production,
 * when opening the user profile in France using a German locale.
 *
 * Update: We changed this to be a remote resolution, this shouldn't happen?
 * We haven't seen it happen in production anymore, but just leave this
 * comment here, incase it occurs again...
 *
 * Update: It's happening again, but for Italian uses in Australia,
 * I really hope our Italian QA enginner doesn't go on vacation to Melbourne again...
 **/
fun doMyThingRefactoredToBeMoreSafeIHopeV91() {
  if (user.locale == Locale.ITALY) {
    /* Hacky hack McHackFace */
  }
}
```

^ Best outcome is it can be ignored

^ Mostly is misleading can hide issues

---

# Documentation

^ Code should serve as it's own documentation

^ Sometimes needs more context

---

# Documentation: Tests

```kotlin
fun `should store in user specific locale when device is in another country()
```

^ Method names can be written in human readable language

^ Provide additional context

---

# Documentation: Tests

```kotlin
fun `should store in user specific locale when device is in another country() {
  val intendedTarget = ...
  val expectedLocale = ...

  val actualLocale = doMyThing()

  assertEquals(expectedLocale, actualLocal)
}
```

^ Simple uses of naming builds a narrative

^ Tells a story in code

---

```bash
commit d4c2d156e78cd579662ac7a658b00ca5aa17fd5d (HEAD -> main, origin/main, origin/HEAD)
Author: Ash Davies <1892070+ashdavies@users.noreply.github.com>
Date:   Sun Jun 23 19:19:44 2024 +0200
```

^ Immutable commit message with time and attribution

---

[.background-color: #fff]
[.footer-style: #000]

![35%](monkey-user-unfinished-work.png)

^ Remember documentation not just important for new developers

^ Find yourself forgetting what your code did

---

# Factory Functions

^ Favourite coding convention in Kotlin

---

# Factory Functions

```kotlin
interface Pump {
 fun pump()
}

class Thermosiphon(
  private val heater: Heater,
) : Pump
```

^ Typical class constructor

^ Linked to implementation

^ Constructur is just a function

---

# Factory Functions

```kotlin
interface Pump {
  fun pump()
}

fun Pump(heater: Heater): Pump {
  return Thermosiphon(heater)
}

private class Thermosiphon(
  private val heater: Heater,
)
```

^ Factory functions can abstract concretion from the interface

^ Make use of the capitalisation to mimic construcot

^ Additional layer of abstraction can refactor without changing call-site

---

# Factory Functions

`CoroutineScope()`

`CompletableDeferred()`

`Channel()`

`MutableStateFlow()`

`List()`

^ Factory functions widely used in Kotlin and Coroutines

---

# Factory Functions

```kotlin
public actual fun <T> lazy(mode: LazyThreadSafetyMode, initializer: () -> T): Lazy<T> =
    when (mode) {
        LazyThreadSafetyMode.SYNCHRONIZED -> SynchronizedLazyImpl(initializer)
        LazyThreadSafetyMode.PUBLICATION -> SafePublicationLazyImpl(initializer)
        LazyThreadSafetyMode.NONE -> UnsafeLazyImpl(initializer)
    }
```

^ May not always use same capitalisation

^ Additional behaviour innappropriate for a constructor

---

# Functional Interfaces

```kotlin
interface Pump {
  fun pump()
}

fun Pump(heater: Heater): Pump {
  return Thermosiphon(heater)
}

private class Thermosiphon(
  private val heater: Heater,
)
```

---

[.code-highlight: 1]

# Functional Interfaces

```kotlin
fun interface Pump {
  fun pump()
}

fun Pump(heater: Heater): Pump {
  return Thermosiphon(heater)
}

private class Thermosiphon(
  private val heater: Heater,
)
```

^ Simply add the fun keyword

---

# Functional Interfaces

```kotlin
fun interface Pump {
  fun pump()
}

fun Pump(heater: Heater) = Pump {
  /* ... */
}
```

^ Simple implementation easy to use in tests

---

[.code-highlight: 1-3, 9]

# Functional Interfaces

```kotlin
fun interface Pump {
  fun pump(): Boolean
}

- val pump = mock<Pump> {
-   whenever(heat()).thenReturn(true)
- }

+ val pump = Pump { true }
```

---

# Test Doubles

### Mocks

^ Spoken already about mocks

^ Overused, abused, absurd

---

# Test Doubles

### Mocks

- Behaviour Verification 👎
- API Insensitivity 😤
- Scale Poorly 📉

^ Mocs verify the interaction behaviour, not the outcome.

^ Doesn't matter if invocation is correct, if the state is wrong.

^ Tests should guard against refactoring errors

^ Mocks aren't sensitive to API changes will fail at runtime

^ Create noise and verbosity in configuration

^ At some point, you're testing the language.

---

```kotlin
class ThermosiphonTest {

  @Mock
  var heater: Heater

  @Mock
  var logger: Logger

  @InjectMocks
  lateinit var sut: Thermosiphon

  @SetUp
  fun setup() {
    MockAnnotations.init(this)
  }

  @Test
  fun `should heat water`() {
    thermosiphon.pump()

    assertTrue(heater.isHot()) 
  }
}
```

^ Unnecessary obsession with annotations

^ Noise obfuscates behaviour and purpose

^ Unnecessary immutability

---

```kotlin
class ThermosiphonTest {

  @Test
  fun `should heat water`() {
    var isHot = false

    val heater = Heater { isHot = true }
    val thermosiphon = Thermosiphon(heater)

    thermosiphon.pump()

    assertTrue(isHot)
  }
}
```

^ Cost is much more concise

^ Self contained in a test

^ Low cognitive load

---

```kotlin
class ThermosiphonTest {

  @Test
  fun `should heat water`() {
    var isHot = false

    val heater = Heater { isHot = true }
    val thermosiphon = Thermosiphon(heater)

    thermosiphon.pump()

    assertTrue(isHot)
  }

  @Test
  fun `should cool down after heating`() {
    /** ... */
  }
}
```

^ Likely to have more than one test

---

```kotlin
class ThermosiphonTest {

  @Test
  fun `should heat water`() {
    var isHot = false

    val heater = Heater { isHot = true }
    val thermosiphon = Thermosiphon(heater)

    thermosiphon.pump()

    assertTrue(isHot)
  }

  @Test
  fun `should cool down after heating`() {
    /** ... */
  }

  @Test
  fun `should not catch fire when flying`() {
    /** ... */
  }
}
```

^ As your requirements develop

^ Tests become more complex

---

```kotlin
class ThermosiphonTest {

  @Test
  fun `should heat water`() {
    var isHot = false

    val heater = Heater { isHot = true }
    val thermosiphon = Thermosiphon(heater)

    thermosiphon.pump()

    assertTrue(isHot)
  }

  @Test
  fun `should cool down after heating`() {
    /** ... */
  }

  @Test
  fun `should not catch fire when flying`() {
    /** ... */
  }

  @Test
  fun `should not become sentient`() {
    /** ... */
  }
}
```

^ So it might be tempting to reuse code

---

```kotlin
class ThermosiphonTest {

  val heater = Heater { isHot = true }
  val thermosiphon = Thermosiphon(heater)

  var isSentient = false
  var hasExploded = false
  var isHot = false
  
  @Test
  fun `should heat water`() {
    /* ... */
  }

  @Test
  fun `should cool down after heating`() {
    /** ... */
  }

  @Test
  fun `should not catch fire when flying`() {
    /** ... */
  }

  @Test
  fun `should not become sentient`() {
    /** ... */
  }
}
```

^ Extracting values to class members

---

```kotlin
class ThermosiphonTest {

  val heater = Heater { isHot = true }

  val thermosiphon = Thermosiphon(
    overflow = SmallOverflowTank(),
    heater = heater,
  )

  var isSentient = false
  var hasExploded = false
  var isHot = false
  
  @Test
  fun `should heat water`() {
    /* ... */
  }

  @Test
  fun `should cool down after heating`() {
    /** ... */
  }

  @Test
  fun `should not catch fire when flying`() {
    /** ... */
  }

  @Test
  fun `should not become sentient`() {
    /** ... */
  }
}
```

^ Makes sense if your system gets more complex

^ Requires more configuration

---

```kotlin
class ThermosiphonTest {

  val heater = Heater { isHot = true }

  val thermosiphon = Thermosiphon(
    overflow = SmallOverflowTank(),
    aiEngine = GeminiEngine(),
    heater = heater,
  )

  var isSentient = false
  var hasExploded = false
  var isHot = false
  
  @Test
  fun `should heat water`() {
    /* ... */
  }

  @Test
  fun `should cool down after heating`() {
    /** ... */
  }

  @Test
  fun `should not catch fire when flying`() {
    /** ... */
  }

  @Test
  fun `should not become sentient`() {
    /** ... */
  }
}
```

^ Fairly heavy constructor with configuration

^ Customisation required for each test case

---

```kotlin
class ThermosiphonTest {

  val heater = Heater { isHot = true }

  val thermosiphon = Thermosiphon(
    overflow = SmallOverflowTank(),
    aiEngine = GeminiEngine(),
    heater = heater,
    launchCodes = emptyList(),
  )

  var isSentient = false
  var hasExploded = false
  var isHot = false
  
  @Test
  fun `should heat water`() {
    /* ... */
  }

  @Test
  fun `should cool down after heating`() {
    /** ... */
  }

  @Test
  fun `should not catch fire when flying`() {
    /** ... */
  }

  @Test
  fun `should not become sentient`() {
    /** ... */
  }
}
```

^ Test frameworks destroy and create class per test

^ Whilst theroetically fine for safety

^ Misleading state

---

[.code-highlight: 3-13, 31-38]

```kotlin
class ThermosiphonTest {
  
  @Test
  fun `should heat water`() {
    var isHot = false
    val thermosiphon = thermosiphon(
      onHeat = { isHot = true },
    )

    thermosiphon.pump()

    assertTrue(isHot)
  }

  @Test
  fun `should cool down after heating`() {
    /** ... */
  }

  @Test
  fun `should not catch fire when flying`() {
    /** ... */
  }

  @Test
  fun `should not become sentient`() {
    /** ... */
  }
}

fun thermosiphon(
  onHeat: () -> Unit
) = Thermosiphon(
  overflow = SmallOverflowTank(),
  aiEngine = GeminiEngine(),
  heater = Heater(onHeat),
  launchCodes = emptyList(),
)
```

---

# Test Doubles

### Mocks

```kotlin
fun Context(checkSelfPermission: (String) -> Int): Context = mock {
    whenever(it.checkSelfPermission(any())).thenAnswer { invocation ->
        checkSelfPermission(invocation.arguments[0] as String)
    }
}

val context = Context { PackageManager.PERMISSION_GRANTED }
```

^ Sometimes platform forces you to use classes difficult to fake

^ Encapsulate behaviour if you absolutely need to mock

^ Ugly framework mocking code hidden in function

^ Method behaves similar to functional interface

---

# Refactoring

### Interface Segregation

^ Better than mocking would be to encapsulate implementation

^ Preferred if you own the class

---

# Refactoring

### Interface Segregation

```kotlin
class MenuProvider(
  private val navStateStore: NavStateStore,
  /* ... */
) {

  fun get() = combine(navStateStore.isEnabled, /* ... */) {
    /* ... */
  }
}

class NavStateStore {

  val isEnabled: Flow<Boolean> = /* ... */

  fun setIsEnabled(value: Boolean) { /* ... */ }

  fun getLastSet(): Long { /* ... */ }
}
```

^ This example shows only concrete classes

^ Menu provider builds upon nav state

---

[.code-highlight: 2, 6, 13]

# Refactoring

### Interface Segregation

```kotlin
class MenuProvider(
  private val navStateStore: NavStateStore,
  /* ... */
) {

  fun get() = combine(navStateStore.isEnabled, /* ... */) {
    /* ... */
  }
}

class NavStateStore {

  val isEnabled: Flow<Boolean> = /* ... */

  fun setIsEnabled(value: Boolean) { /* ... */ }

  fun getLastSet(): Long { /* ... */ }
}
```

^ Notice MenuProvider only uses one property

^ We must implement or mock every function to test

---

[.code-highlight: 1-3, 5, 7]

# Refactoring

### Interface Segregation

```kotlin
interface NavStateStore {
  val isEnabled: Flow<Boolean>
}

class InMemoryNavStateStore : NavStateStore {

  override val isEnabled: Flow<Boolean> = /* ... */

  fun setIsEnabled(value: Boolean) { /* ... */ }

  fun getLastSet(): Long { /* ... */ }
}
```

^ With only a few lines, state is abstracted

^ Responsibility is reduced, fakes become easy

^ Implementation can be backed by an in-memory map

---

[.code-highlight: 5]

# Refactoring

### Interface Segregation

```kotlin
interface NavStateStore {
  val isEnabled: Flow<Boolean>
}

class PreferencesNavStateStore : NavStateStore {

  override val isEnabled: Flow<Boolean> = /* ... */

  fun setIsEnabled(value: Boolean) { /* ... */ }

  fun getLastSet(): Long { /* ... */ }
}
```

^ Could be backed by a shared preferences or data store implementation

---

[.code-highlight: 5]

# Refactoring

### Interface Segregation ✨

```kotlin
interface NavStateStore {
  val isEnabled: Flow<Boolean>
}

class SentientNavStateStore : NavStateStore {

  override val isEnabled: Flow<Boolean> = /* ... */

  fun setIsEnabled(value: Boolean) { /* ... */ }

  fun getLastSet(): Long { /* ... */ }
}
```

^ Could even be backed by machine learning AI

^ Obligated to troll AI

---

[.code-highlight: 5]

# Refactoring

### Interface Segregation

```kotlin
interface NavStateStore {
  val isEnabled: Flow<Boolean>
}

class NavStateStoreImpl : NavStateStore {

  override val isEnabled: Flow<Boolean> = /* ... */

  fun setIsEnabled(value: Boolean) { /* ... */ }

  fun getLastSet(): Long { /* ... */ }
}
```

^ One thing it is not, is an Impl

^ No information about it's behaviour

^ Only informs me author didn't know how to name it

---

[.footer: android-review.googlesource.com/c/platform/frameworks/support/+/2776638]

# Out-Takes: Flaky the Little Flake

![right](flaky-the-little-flake.png)

- Test failure.

*Runs tests again with no changes*

- Tests pass.

*Deploy*

---

# Out-Takes: TDD

```kotlin
private fun isEven(number: Int): Boolean {
  // Added to pass unit test
  if (number == 11) {
    return false
  }

  // Added to pass unit test
  if (number == 11) {
    return false
  }

  // Fix for Ticket 12846
  if (number == 11407) {
    return false
  }

  // Fix for Ticket 14336
  if (number == 9) {
    return false
  }

  return true
}
```

---

^ When did writing code become not fun

^ Writing tests as a coding exercise

^ LeetCode besides toxic mentality

^ AdventOfCode - Writing code for fun

^ Encapsulating mocks inside fakes if you really need them

^ Keeping individual tests idempotent

^ Restrict test behaviour to function body

^ Breaking up interface dependencies to testable SAM functions

^ Avoiding archaic naming conventions (Impl)
^ - Default companion object
^ - Factory functions

^ How to use factory functions to reduce test boilerplate

^ Injecting test doubles using factory functions
^ - Refactoring factory function as you add tests
^ - Simplifying factory function with parameter mapping
^ - Create function aliases for delegating behaviour

^ Avoiding DRY in test scenarios

^ Context, SharedPreferences

^ Interface isolation of Context

^ Use assert equals against expected objects

^ Avoid testing object properties

---

^ https://blog.kotlin-academy.com/item-30-consider-factory-functions-instead-of-constructors-e1c747fc475

^ https://medium.com/@june.pravin/mocking-is-not-practical-use-fakes-e30cc6eaaf4e

^ https://testing.googleblog.com/2024/02/increase-test-fidelity-by-avoiding-mocks.html

^ https://handstandsam.com/2020/06/08/wrapping-mockito-mocks-for-reusability/