autoscale: true
build-lists: true
footer: ashdavies.dev
footer-style: Product Sans
header: Product Sans
slide-transition: true
text-strong: Google Sans 18pt
text: Google Sans 18pt

[.footer: ]

![](experts-template-intro.jpeg)

---

[.footer: Photo by Nubelson Fernandes on Unsplash]
[.footer-style: #CCC]

![](black-and-white-ceramic.jpeg)

^ You've just landed a new job, new computer, swag, fancy coffee maker

^ Sit down with your new team, ready to start working

^ Thats when you see your new project...

---

[.background-color: #fff]

![35%](monkeyuser-production-ready.png)

^ The reality is, we don't always have luxury of working in green fields

^ Production projects are complicated, often with a backlog of tech debt

---

# Legacy (adj.)

Denoting or relating to software or hardware that has been superseded but is difficult to replace because of its wide use.

^ Can be tough to know where to start with legacy projects.

^ Legacy code, topic most common to developers.

---

# Testing

^ Covering your code with tests can give confidence your changes don't break anything.

^ Michael Feathers describes this as "Cover and Modify" instead of "Edit and Pray".

---

# Testing: Awareness 👀

^ Writing test code at the same time as production code gives you a better perspective of edge cases.

---

# Testing: Architecture 🏗

^ Poor code is often synonymous with poor architecture, and poor testability.

---

# Testing: Confidence 💪

^ Confidence in your tests, means confidence in your code, and confidence in refactoring.

---

# Testing: Documentation 📖

^ Tests documentation often provides better insight into the purpose of domain behaviour.

---

# Testing: Stability 💯

^ Well written unit tests provide robust protection, and early feedback, against regressions.

---

# Testing

^ Not my goal to convince you to write tests, but to to write better tests.

^ If you're not interested in writing tests, this talk may not be for you.

---

[.build-lists: true]

# Testing

![right 100%](test-pyramid.png)

- Unit
- Instrumentation
- Integration
- End-to-End
- Monkey
- Smoke

^ Focus on unit testing, important to understand types of tests.

^ Diverse suite of tests, provides more robust regression protection.

---

[.background-color: #fff]

![original 35%](monkeyuser-fixing-unit-tests.png)

^ Fixing unit tests, feels like navigating a minefield, in the dark, with a blindfold.

^ History, difficult to follow; code, difficult to understand.

^ Tests, difficult to run; results, difficult to interpret.

---

# Anti-Patterns and Code Smell

^ It's not until we start writing tests that we realise how difficult it is to test our code.

^ This is often a sign that our code is not structured well.

---

# Seams 🧵

^ A seam is the place where two pieces of fabric meet

^ This translates similarly in programming

^ Logical separation point between two units of code

^ The separation allows you to adjust the behaviour without changing the code

---

# Coupling 🔌

![right fit](coupling-cohesion.png)

^ Coupling describes how inter-connected modules are, often compared with cohesion

^ Highly coupled code is difficult to separate, makes it hard to find a seam

^ Loosely coupled code is easier to structure

---

# Extreme Programming 🤘
## Test-Driven Development

^ Tested code is more structured, with lower cognitive load, and easier to understand.

^ Led to "extreme" programming practices like test driven development.

^ Writing tests before writing code.

---

# Extreme Programming 🤘
## Offensive Code <🖕>

^ Another example of extreme programming is offensive code (or programming)

^ Offensive (or fail first) code, removes fallback behaviour, fully utilise exceptions

---

# Anti-Patterns and Code Smell
> My God, what is that smell? Oh.
-- Veronica Corningstone

---

> Debugging is like being the detective in a crime movie where you are also the murderer.
-- Filipe Fortes

^ Git blame will always reveal you the suspect.

---

# Kotlin (noun)

### Awesome.

^ Guiding principle of Kotlin is to make it easy to write good code.

^ Primary tenet of that is the concept of mutability.

---

# Kotlin: Mutability
## Risks of Mutation

^ What is mutability, and what are the risks of mutation?

---

# Kotlin: Mutability
## Risks of Mutation

```kotlin
fun sumAbsolute(list: MutableList<Int>): Int {
  for (i in list.indices) list[i] = abs(list[i])
  return list.sum()
}
```

^ Impure, in-place mutations, non-deterministic state, hard to predict.

---

# Kotlin: Mutability
## Risks of Mutation

```kotlin
private val GROUNDHOG_DAY = TODO("java.util.Date()")
fun startOfSpring(): java.util.Date = GROUNDHOG_DAY

val partyDate = startOfSpring()
partyDate.month = partyDate.month + 1

// Date is mutable 🤦‍♂️
```

^ Date class returned by function is mutable, consumers can modify upstream value.

---

# Kotlin: Mutability
## Shared Mutable State ⚠️

^ Shared mutable state, causes race conditions, non-deterministic behaviour.

^ Thread-safe confinement, mutex, semaphores, help mitigate this risk.

---

# Kotlin: Immutability
## Unidirectional Data Flow 🏆

^ Ensures predictable state, easier to find bugs, replay events, predict application state.

---

# Kotlin: Immutability
## Collections

```kotlin
fun List<T>.toMutableList(): MutableList<T>

fun Map<K, V>.toMutableMap(): MutableMap<K, V>

fun Set<T>.toMutableSet(): MutableSet<T>
```

^ Kotlin provides immutable collections types, converting to mutable, creates new instance.

^ Kotlin collection interfaces may still be backed by a mutable Java implementation

---

# org.jetbrains.kotlinx:kotlinx-collections-immutable

```kotlin
fun Iterable<T>.toPersistentList(): PersistentList<T>

fun Iterable<T>.toPersistentSet(): PersistentSet<T>
```

^ Jetbrains provide an immutable collection library, highly advised

^ Helpful with Compose, no longer need to annotate stable

---

# Kotlin: Immutability
## IntelliJ IDEA

![right](intellij-mutable-variables.png)

^ IntelliJ formats code to highlight mutable variables as underlined.

^ Subconscious "encouragement" makes the variable look out-of-place.

---

# Kotlin: Immutability
## Final Concretions 🧱

By default, Kotlin classes are final – they can't be inherited

^ Finally, classes final by default; encourages composition over inheritance.

---

# Kotlin: Immutability
## Final Concretions 🧱

```kotlin
open class Base // Class is open for inheritance
```

^ Kotlin classes can be made open, but this is a conscious decision.

---

# Kotlin: Immutability
## All-Open Compiler Plugin

`org.jetbrains.kotlin.plugin.allopen`

^ All-Open plugin for open classes as required for frameworks such as Spring AOP.

---

# Anti-Patterns and Code Smell
## Refactoring: Seams 🧵

^ Large clusters hard to break into testable units.

^ Seams used to separate behaviour, without editing.

---

# Refactoring: Seams 🧵
## Preprocessing

- Kotlin Symbol Processing
- Kotlin Compiler Plugins

^ Supported in Kotlin with KSP and Compiler Plugins, it is rarely used for this purpose.

^ Poor code clarity, but allows for sensing without modifying code.

---

# Refactoring: Seams 🧵
## Linking: Classpath

```kotlin
import fit.Parser

internal class FitFilter {
  private val parser: Parser =
  Parser.newInstance()
}
```

^ JVM takes classpath as an argument to load classes.

^ Can override with custom implementations.

---

# Refactoring: Seams 🧵
## Linking: Classpath

```kotlin
buildscript {
  dependencies {
    val googleServicesVersion = libs.versions.google.services.get()
    classpath("com.google.gms:google-services:$googleServicesVersion")
  }
}
```

^ You will have already configured the classpath in your project using plugins

---

# Refactoring: Seams 🧵
## Objects

```kotlin
internal class FitFilter {
  private val parser: Parser =
  Parser.newInstance()
}
```

^ Objects most useful, allow for replacement of behaviour without modifying implementation.

^ Most common type of refactoring, utilises existing compiler configuration.

---

# Refactoring: Seams 🧵
## Objects: Refactoring

[.code-highlight: 9-15]

```diff
===================================================================
diff --git a/FitFilter.kt b/FitFilter.kt

- internal class FitFilter {
-   private val parser: Parser =
-     Parser.newInstance()
- }
-
+ internal fun interface FitFilter {
+   fun filter(input: String): String
+ }
+
+ internal fun FitFilter(parser: Parser) = FitFilter { input ->
  +   parser.parse(input)
+ }
```

^ Requires modern refactoring techniques, good understanding of idiomatic code.

---

# Refactoring: Seams 🧵
## Objects: Refactoring

![right](intellij-refactor-overlay.png)

^ IntelliJ assists with these techniques in a few clicks.

---

# Refactoring
## Dependency Injection

^ Not to be confused with dependency frameworks such as Dagger

^ Dependency injection is a coding paradigm

---

# Refactoring
## Dependency Injection

[.code-highlight: 8-12]

```diff
===================================================================
diff --git a/CoffeeMaker.kt b/CoffeeMaker.kt

- internal class CoffeeMaker {
-   private val heater: Heater = ElectricHeater()
-   private val pump: Pump = Thermosiphon(heater)
- }

+ internal class CoffeeMaker(
+   private val heater: Heater,
+   private val pump: Pump,
+ )
```

^ Common refactor to invert control, requires caller to provide dependencies. 

^ Enjoyable using "thermosiphon", universally hated sample.

---

# Refactoring
## Dependency Injection

[.code-highlight: 4-5, 7-13, 15]

```diff
===================================================================
diff --git a/CoffeeMaker.kt b/CoffeeMaker.kt

+ internal class CoffeeMaker(
+   private val heater: Heater,
-   private val thermosiphon: Thermosiphon,
+   private val pump: Pump,
+ )
+
+ internal interface Pump {
+   fun pump()
+ }
+
- internal class Thermosiphon {
+ internal class Thermosiphon : Pump {
```

^ Reducing the behaviour of Thermosiphon by better defining its requirements

^ Thereby reduce dependency scope by narrowing type

---

# Testing: Dependencies
## Dependency Injection

```kotlin
internal class CoffeeMaker(
  private val heater: Heater,
  private val pump: Pump,
)
```

^ Dependencies injected into class constructor.

^ With a seam we can start testing.

^ Why do we replace depenendices?

---

# Testing: Dependencies
## Dependency Injection

[.code-highlight: 1]

```kotlin
val heater = NuclearFusionHeater() // Expensive!

val maker = CoffeeMaker(
  pump = Thermosiphon(heater),
  heater = heater,
)

assertTrue(maker.brew())
```

^ Unit tests should be fast, should run in milliseconds.

^ Expensive dependencies should be replaced.

^ Achieving nuclear fusion is probably overkill for a unit test

---

# Testing: Dependencies
## Dependency Injection

[.code-highlight: 1]

```kotlin
val heater = DiskCachedHeater() // Stateful!

val maker = CoffeeMaker(
  pump = Thermosiphon(heater),
  heater = heater,
)

assertTrue(maker.brew())
```

^ Not just performance, tests should be stateless (or idempotent [eye-dem-potent]).

^ Disk operations are stateful, can change.

---

# Testing: Dependencies
## Dependency Injection

[.code-highlight: 1]

```kotlin
val heater = UnbalancedHeater() // Error prone!

val maker = CoffeeMaker(
  pump = Thermosiphon(heater),
  heater = heater,
)

assertTrue(maker.brew())
```

^ Further, may want to isolate error prone dependencies.

^ Test single unit in isolation.

---

# Testing: Dependencies
## Test Doubles

^ Test doubles are a common technique to replace dependencies.

^ Offer isolation, simplicity, isolation, and control.

---

# Testing: Dependencies
## Mocks

^ Mocks are a type of test double that allow you to specify expectations.

^ Often used to verify interactions with dependencies.

---

# Testing: Dependencies
## Mockito

### "Tasty mocking framework for unit tests in Java".

^ Mockito is a popular mocking framework for Java.

---

# Testing: Mocks

```kotlin
val heater = mock<Heater>()
val pump = mock<Pump>()

val maker = CoffeeMaker(
  heater = heater,
  pump = pump,
)

assertTrue(maker.brew())
```

^ Provide class under test with mocks.

^ Cross fingers, run test.

---

# Testing: Mocks

```kotlin
val heater = mock<Heater>()
val pump = mock<Pump>()

val maker = CoffeeMaker(
  heater = heater,
  pump = pump,
)

assertTrue(maker.brew()) // ⚠ Fails!
```

^ Of course this fails, mocks don't do anything.

---

# Testing: Mocks

[.code-highlight: 1-7]

```kotlin
val heater = mock<Heater> {
  on { isHeating } doAnswer { true }
}

val pump = mock<Pump> {
  on { pump() } doAnswer { true }
}

val maker = CoffeeMaker(
  heater = heater,
  pump = pump,
)

assertTrue(maker.brew())
```

^ Configuring the mocks with an implementation.

^ Mockito provides an extensive DSL for building mocks.

---

# Testing: Mocks

javadoc.io/doc/
  org.mockito/mockito-core/latest/
  org/mockito/Mockito.html

^ Mockito DSL is extensive, and can be used to build complex mocks.

---

# Testing: Mocks
## Footguns 🦶🔫

^ Mockito is a powerful tool, easy to shoot yourself in the foot.

^ Declaring a mock implementation at runtime is complicated.

---

# Testing: Mocks
## Accidental Invocation

```kotlin
val heater = mock<Heater> {
  on { isHeating } doAnswer { true } // Actual invocation!
}
```

^ When constructing mocks, and spying objects, Mockito will actually invoke the method.

^ Goes unnoticed if method has no implementation, returns null.

---

# Testing: Mocks
## Accidental Invocation

```kotlin
spy(emptyList<String>()) {
  on { get(0) } doAnswer { "foo" } // throws IndexOutOfBoundsException
}
```

^ Actually documented as an important gotcha

---

# Testing: Mocks
## API Sensitivity

```kotlin
internal interface Heater {
  val isHeating: Boolean
}

val heater = mock<Heater> {
  on { isHeating } doAnswer { true }
}
```

^ Creating a runtime implementation is rarely type safe.

^ If the API changes, the mock may still compile.

---

# Testing: Mocks
## API Sensitivity

[.code-highlight: 2]

```diff
  internal interface Heater {
+   fun <T : Any> heat(body: () -> T): T
    val isHeating: Boolean
  }
  
  val heater = mock<Heater> {
    on { isHeating } doAnswer { true }
  }
```

^ Mock already compiled without stubbing.

^ Further changes are ignored.

---

# Testing: Mocks
## API Sensitivity

```kotlin
internal interface CoffeeDistributor {
  fun announce(vararg name: String): Boolean
}

val mockDistributor = mock<CoffeeDistributor> {
  on { announce(any(), any()) } doReturn true
}

val announced = mockDistributor.announce(
  "Steve", "Roger", "Stan",
)

assertTrue(announced) // False: We only stubbed two names!
```

^ Mocks will only match exact method signatures configured.

^ No fault of the library, but can be a source of bugs.

---

# Testing: Mocks
## Data Classes

^ Some might be tempted to mock data classes

---

# Testing: Mocks
## ~~Data Classes~~
### Just Don't.

^ Data classes should never be mocked

---

# Testing: Mocks
## Default Answers

```kotlin
val heater: Heater = mock() // No default answer
val isHeating: Boolean = heater.isHeating // Null
```

^ By default Mockito returns null for all methods without stubbing.

^ Unexpected nulls throw deep in the execution stack.

---

# Testing: Mocks
## Default Answers

```kotlin
val heater: Heater = mock(defaultAnswer = RETURNS_SMART_NULLS)
val isHeating: Boolean = heater.isHeating // false
```

^ By default Mockito returns null for all methods without stubbing.

^ Unexpected nulls throw deep in the execution stack.

---

# Testing: Mocks
## Default Answers

- CALLS\_REAL\_METHODS
- RETURNS\_DEEP\_STUBS
- RETURNS\_DEFAULTS
- RETURNS\_MOCKS
- RETURNS\_SELF
- RETURNS\_SMART\_NULLS

^ Mockito provides a number of default answers.

^ Seek help.

---

# Testing: Mocks
## Type Safety

```java
public interface OngoingStubbing<T> {
  OngoingStubbing<T> thenAnswer(Answer<?> answer);
}
```

^ Mockito Kotlin provides reified type safety.

^ Underlying API much more dangerous.

---

# Testing: Mocks
## Performance

Expensive real implementations replaced by expensive mocks.

- Runtime code generation
- Bytecode manipulation
- Reflection 😱

^ Ironically, mocks are expensive to create, and expensive to execute.

^ Mockito stores every interaction with mocks, small aggregations accumulate quickly.

^ Authors have optimized well, but expensive due to nature of operation.

---

# Testing: Mocks
## Performance

```kotlin
internal class CoffeeMakerTest {
  
  private lateinit var heater: Heater
  
  @Before
  fun setUp() {
    heater = mock {
      on { isHeating } doAnswer { true }
    }
  }
}
```

^ Oft seen practice of creating mocks in `@Before` methods.

^ Anecdotal, reports of improved performance.

^ Mutable state between tests

---

# Testing: Mocks
## Dynamic Mutability

[.code-highlight: 12-15]

```kotlin
internal class CoffeeMakerTest {
  
  private lateinit var heater: Heater
  
  @Before
  fun setUp() {
    heater = mock {
      on { isHeating } doAnswer { true }
    }
  }
  
  @Test
  fun `should brew coffee`() {
    // heater already has state!
  }
}
```

^ Minimal impact here, but on a larger scale is a nightmare.

^ Unpredictable state, hard to people to understand.

---

# Testing: Mocks
## Dynamic Mutability

![right](cat-kotti-judgemental.jpeg)

Framework generated mocks introduce a shared, mutable, dynamic, runtime declaration. 

^ Shared mutable state should feel uncomfortably bad.

^ Dynamic runtime declarations should feel equally uncomfortable.

^ Test code is production code that don't ship.

^ Kotti knows it's wrong, and so should you.

---

# Unpredictability
## Costs

^ Predictability is a underrated metric.

^ Although hard to quantify.

---

# Unpredictability: Costs
## Learning Curve

^ Most evident when onboarding new colleagues

---

# [fit] Unpredictability: Costs
## Peer Review

![right 90%](waiting-code-review.jpeg)

^ Hard to review code that is unpredictable.

^ PRs remain open longer, sad, alone.

---

[.background-color: #fff]

# [fit] Unpredictability: Costs
## Risk of Bugs

![50% right](monkeyuser-feature.png)

^ Unpredictability means you cannot predict the edge cases.

---

# Unpredictability: Costs
## Slowed Feature Delivery ~~💰💰💰~~

^ Technical debt must be repaid.

^ Slows feature delivery.

---

[.background-color: #fff]

# Unpredictability
## Victims

![35% right](monkeyuser-unfinished-work.png)

- Junior developers
- New team members
- Future you

^ Unpredictable state is a nightmare for people to understand.

^ Not just junior developers, but new team members, and future you.

---

# Testing: Mocks

## Don't Mock Classes You Don't Own

### [fit] testing.googleblog.com/2020/07/testing-on-toilet-dont-mock-types-you.html

^ Google Testing Blog: Don't Mock Types You Don't Own

^ Mocked classes may change in ways you don't expect.

^ Not exclusive to classes you don't own.

---

# You Don't Own Your Code!

## Your code belongs to your team.

### Be considerate.

^ Naive developers may assume because they understand it, others will too.

^ If your code introduces cognitive complexity, it's not good code.

^ Keep It Simple Stupid.

---

# Testing: Mocks
## Considerations

^ Not shitting on Mockito, it's a great tool.

^ Extensive features, powerful DSL.

^ Overused.

---

# Testing: Mocks
## Interaction Verification 👎

^ Biggest problem with mocks, they verify the interaction, not the outcome.

^ Doesn't matter if invocation is correct, if the outcome is wrong.

^ At some point, you're testing the language.

^ This point deserves its own talk.

---

# Testing: Mocks
## What Now?

![right](pedro-monkey-puppet.gif)

^ Mockito has an extensive DSL for building runtime declarations.

^ What also has an extensive DSL for building classes? Kotlin.

---

# Testing: Stubs

^ You may have already encountered stubs.

^ Simple implementation only meant to compile.

---

# Testing: Stubs
## Simple

```kotlin
internal interface Pump {
  fun pump(): Boolean
}

internal object StubPump : Pump {
  override fun pump(): Boolean = true
}
```

^ Stub can be the most simplest implementation.

^ No verification logic.

---

# Testing: Stubs
## Idiomatic

```kotlin
internal fun interface Pump {
  fun pump(): Boolean
}

val stub = Pump { true }
```

^ Stubs implementations can be a bit more idiomatic.

^ Kotlin functional interfaces make mocks redundant.

---

# Testing: Stubs
## API Sensitive

[.code-highlight: 1-2, 4, 6-7]

```diff
+ private const val DEFAULT_AMOUNT = 250 // ml
+ 
- internal fun interface Pump {
+ internal interface Pump {
-   fun pump(): Boolean
+   fun pump(amount: Int = DEFAULT_AMOUNT): Boolean
+ }
```

^ Classes declared in Kotlin are sensitive to interface changes.

---

# Testing: Stubs
## API Sensitive

[.code-highlight: 7]

```kotlin
private const val DEFAULT_AMOUNT = 250 // ml

internal interface Pump {
  fun pump(amount: Int = DEFAULT_AMOUNT): Boolean
}

val stub = Pump { true } // Compilation failure...
```

^ This change will not compile because the functional interfaces are no longer supported.

^ We know this, because we wrote it, not reliant on a framework.

---

# Testing: Fakes 🏆

^ But what if you need more than a stub?

^ Still need to verify outcome.

---

# Testing: Fakes

```kotlin
public class FakePump(private val onPump: (Boolean) -> Boolean) : Pump {

  public val pumped = mutableListOf<Pair<Boolean, Boolean>>()

  override fun pump(full: Boolean): Boolean = onPump(full).also {
    pumped += full to it
  }
}
```

^ Pass lambda to control outcome, similar to functional interface.

^ Additionally keeps list of inputs, and outcomes.

---

# Testing: Fakes
## Additional Behaviour

```kotlin
private class DelegatingHeater(
  private val delegate: Heater,
) : Heater by delegate {

  private val _drinks = mutableListOf<Any>()
  val drinks: List<Any> by ::_drinks

  override fun <T : Any> heat(body: () -> T): T {
    return delegate.heat(body).also { _drinks += it }
  }
}
```

^ Full control over behaviour.

^ Delegates to provided instance.

---

# Testing: Fakes
## Authoring

^ Fakes ideal because you define the behaviour.

^ Who is responsible for writing fakes?

---

[.background-color: #fff]

# Testing: Fakes
## Responsibility

![fit right](uncle-sam-wants-you.jpeg)

^ Yep, you.

---

[.background-color: #fff]

# Testing: Fakes
## Qualifications

![fit right](uncle-sam-wants-you.jpeg)

Those who wrote the code are the most uniquely qualified to write the tests.

^ Because you are the person most uniquely qualified.

^ At the time of authoring, you had the most context.

---

# Testing: Libraries

- `androidx.compose.ui:ui-test-junit4`
- `com.slack.circuit:circuit-test`
- `io.ktor:ktor-server-test-host`
- `io.ktor:ktor-client-mock`
- `kotlinx-coroutines-test`

^ Fortunately many SDK developers provide test artifacts.

^ If you're an author, please consider doing so.

---

# Testing: In Memory

```kotlin
internal fun interface CoffeeStore {
  fun has(type: CoffeeType): Boolean
}

internal enum class CoffeeType {
  CAPPUCCINO,
  ESPRESSO,
  LATTE,
}
```

^ Many circumstances an in-memory implementation is sufficient.

^ Given a simple store interface, we can implement in-memory.

---

# Testing: In Memory

```kotlin
internal class InMemoryCoffeeStore : CoffeeStore {

  private val _stock = mutableMapOf<CoffeeType, Int>()
  val stock: Map<CoffeeType, Int> by ::_stock

  override fun has(type: CoffeeType): Boolean {
    return (_stock[type] ?: 0) > 0
  }

  fun add(type: CoffeeType, amount: Int = 1) {
    _stock[type] = (_stock[type] ?: 0) + amount
  }
}
```

^ Basic in-memory implementation also useful for debugging

---

# Testing: In Memory
## Bonus!

In-memory implementations for local or network overrides.

^ Because we designed the code well, safe for production.

---

[.background-color: #fff]

# Reality

![35% right](monkeyuser-production-ready.png)

^ Don't always have luxury of working with good code.

---

[.background-color: #64b6a8]
[.footer: Image: dribbble.com/shots/3251806-Interface-Segregation-Principle]

# Interface Segregation Principle

![80% right](interface-segration-principle.webp)

No code should be forced to depend on methods it does not use.

---

# Everything is an API
## [fit]ashdavies.dev/talks/everything-is-an-api-berlin-droidcon/

Build versatile and scalable applications with careful API decisions.

![right](everything-is-an-api.jpeg)

^ Everything is an API, and APIs are everywhere.

^ Talk at Berlin, London, and Chicago.

---

# Testing: Android
## Legacy Inheritance

![right 15%](green-robot.png)

^ Like many frameworks and platforms, Android has a long history of legacy code.

^ Advances in Jetpack, AndroidX, and Project Mainline have improved this.

^ Still framework code to deal with.

---

# [fit] android.content.Context

![right](android-context-structure.png)

^ The Android context is considered by many to be a "god object"

---

# God Objects 🪽

^ God objects often reference a large number of distinct types, and/or unrelated methods.

^ Since they command so much, it's difficult to provide alternative implementations.

---

# Ravioli Code 🥟 🤌

^ The antithesis of the god principle is apparently referred to as Ravioli code.

^ Either the Italians have a high opinion of themselves, or they've got it figured out.

^ Ravioli code is not considers a good thing, but it's better than the alternative.

---

# Recap
## Extreme Programming

^ It's important to consider this as another extreme coding approach

^ Like code katas, tdd or offensive code, good to practice

^ Choose when is most appropriate, but consider all options!

---

# Recap

- Mocks
- Stubs
- Fakes

^ Mocks are designed with APIs to verify interactions, black magic voodoo, Java reflection

^ Stubs perform bare minimum to allow your tests to pass

^ Fakes are hand coded implementations use for testing

---

# Conclusion

- Don’t mock classes you don’t own.
- Don’t mock classes you do own.
- Don’t mock classes.
- **Except `Context`.**

---

> Every existing thing is born without reason, prolongs itself out of weakness, and dies by chance.
-- Jean-Paul Sartre

^ Popularised in programming with the mis-attribution of the paraphrased quote.

^ Every line of code is written without reason, maintained out of weakness, and deleted by chance

---

# Thanks!

^ Slides available on my website ashdavies.dev

^ This Year in Android tomorrow same room at 11:40

---

# Further Reading

- **Martin Flower: Mocks Aren't Stubs**
martinfowler.com/articles/mocksArentStubs.html
- **Martin Fowler: Practical Test Pyramid**
martinfowler.com/articles/practical-test-pyramid.html
- **Images: Monkey User**
monkeyuser.com
- **Michael Feathers: Working Effectively with Legacy Code**
ISBN: 978-0-13117-705-5
- **Sam Edwards: Wrapping Mockito Mocks for Reusability**
handstandsam.com/2020/06/08/wrapping-mockito-mocks-for-reusability
- **Steve Freeman, Nat Pryce: Growing Object-Oriented Software, Guided by Tests**
ISBN: 978-0-32150-362-6
- **Testing on the Toilet: Don't mock Types You Don't Own**
testing.googleblog.com/2020/07/testing-on-toilet-dont-mock-types-you.html
- **Testing on the Toilet: Know Your Test Doubles**
testing.googleblog.com/2013/07/testing-on-toilet-know-your-test-doubles.html
- **Marcello Galhardo: No Mocks Allowed**
marcellogalhardo.dev/posts/no-mocks-allowed

