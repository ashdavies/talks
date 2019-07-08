autoscale: true
build-lists: true
footer: @snnkzk | @askashdavies
footer-style: Google Sans
header: Google Sans
slide-transition: true
theme: Libre, 1
text: Google Sans

![right inline 15%](immobilienscout24.png)

## [fit] Working with Dagger and Kotlin
#### Sinan Kozak & Ash Davies

![left inline 50%](sinan-kozak.png)![left inline 33%](gde-badge-round.png)

![right](graph-background.jpg)

^ Speaker introduction

---

# Introduction 👋

- Dagger 2 is a fast dependency injector for Android and Java. (Not a service locator)
- One of goals is having compile time safety
- It is written for only Java in mind
- It is used extensively outside of Android ecosystem

---

# Dagger 2 and Kotlin ☕ 🗡

- Dagger 2 can work with Kotlin
- Generated code is plain Java source code
- Kotlin generated code won't like to happen

---

# Dagger Qualifiers 🗡

- Qualifiers used to identify dependencies with identical signatures
  - Factories use qualifiers to decide the instance use
  - Can create your own qualifier annotations, or just use @Named.
  - Apply qualifiers by annotating the field or parameter of interest. 
  - The type and qualifier annotation will both be used to identify the dependency.

---

# Retention Annotation

- Use Kotlin retention annotations instead of Java
  - At least BINARY retention but RUNTIME is ideal
  - Dagger 2 doesn’t operate on source files

---

# Constructor injection

```kotlin
class Game @Inject constructor(
    @Named("P1") private val player1: Player,
    @Named("P2") private val player2: Player
)
```

---

# Constructor injection

```kotlin
class Game @Inject constructor(
    @Named("P1") private val player1: Player,
    @Named("P2") private val player2: Player
)
```

```java
public final class Game {
   private final Player player1;
   private final Player player2;

   @Inject public Game(
     @Named("P1") Player player1,
     @Named("P2") Player player2) {
      super();
      this.player1 = player1;
      this.player2 = player2;
   }
}
```

---

# Constructor injection

```kotlin
class Game @Inject constructor(
    @Named("P1") private val player1: Player,
    @Named("P2") private val player2: Player
)
```

```java, [.highlight: 6-7]
public final class Game {
   private final Player player1;
   private final Player player2;

   @Inject public Game(
     @Named("P1") Player player1,
     @Named("P2") Player player2) {
      super();
      this.player1 = player1;
      this.player2 = player2;
   }
}
```

---

# lateinit var 🛑

```kotlin
class Game @Inject constructor() {

  @Named("P1") lateinit var player1: Player
  @Named("P2") lateinit var player2: Player
}
```

---

# Decompiled lateinit var 🛑

```java
public final class Game {
   @Inject @NotNull public Player player1;
   @Inject @NotNull public Player player2;

   @Named("P1") public static void player1$annotations() {}

   @NotNull public final Player getPlayer1() { ... }

   public final void setPlayer1(@NotNull Player var1) {...}

   @Named("P2") public static void player2$annotations() {}

   @NotNull public final Player getPlayer2() { ... }

   public final void setPlayer2(@NotNull Player var1) {...}
```

---

# Decompiled lateinit var 🛑

```java, [.highlight: 2-3, 5, 11]
public final class Game {
   @Inject @NotNull public Player player1;
   @Inject @NotNull public Player player2;

   @Named("P1") public static void player1$annotations() {}

   @NotNull public final Player getPlayer1() { ... }

   public final void setPlayer1(@NotNull Player var1) {...}

   @Named("P2") public static void player2$annotations() {}

   @NotNull public final Player getPlayer2() { ... }

   public final void setPlayer2(@NotNull Player var1) {...}
```

---

# Constructor vs Property injection

- constructor val
  - Easy to use
  - Safe at runtime if project compile successfully

- property lateinit var injection
  - Kotlin properties uses property access syntax via accessors
  - Unclear where the annotation is applied, accessor or property

---

- Qualified field injection requires @field annotation on property
    - Generated JVM code for both @field:Qualifier and @Qualifer
    - Generated JVM code for property getter and setter
    - Show where @Inject annotation is applied by default
    - Show JVM code for @set:Inject with @Qualifer
- Qualifier also required for constructor injection but clearer
- Java declarations explicit whereas Kotlin requires specification
    - Kotlin uses syntactic sugar to reduce boilerplate
    - Not clear to Kotlin compiler what we want to annotate

---

# Scope Annotations 🎯

^ Ash

---

# @Scope 🎯

```java
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.ANNOTATION_TYPE)
public @interface Scope {
}
```

^ Scope is a meta annotation applied to other annotations

^ Scope indicates a lifecycle for the dependency

^ Dagger will ensure the same instance provided

---

# @Singleton

^ Most commonly used annotation is Singleton

^ Also serves as documentation to developers

---

# @Singleton != Singleton Pattern

^ Important to remember the singleton is not the same as the singleton pattern

---

# @Singleton != Singleton Pattern

```java
public final class Singleton {
    
    private static final Singleton INSTANCE = new Singleton();
    
    private Singleton() {
    }
    
    public static Singleton getInstance() {
        return INSTANCE;
    }
}
```

^ Singleton classes created statically when the class is loaded

^ Same instance for the entire application

^ Lifecycle impossible to manage

---

# @Singleton != Singleton Pattern

```kotlin
object Singleton
```

^ Same behaviour demonstrated by Kotlin objects

^ Much less code

---

# @Scope

```kotlin
@Scope
@MustBeDocumented
@Retention(AnnotationRetention.RUNTIME)
annotation class ActivityScope
```

^ Create a Kotlin scope annotation using the @Scope annotation

^ Use @MustBeDocumented instead of @Documented

^ Like @Qualifier should use Binary or Runtime retention

^ Runtime retention visible during reflection

---

# @Scope

```kotlin
@Module
internal object ApplicationModule {

    @Provides
    @JvmStatic
    @ActivityScope
    fun context(application: Application): Context = application
}
```

^ Apply scope annotations to your module provisions

^ Instance of dependency will live as long as your component

---

# @ActivityScope 🤷‍♂️😏

^ Dagger does not care about the semantic meaning of your scope

---

# @Scope 🙅‍♂️

```kotlin
@ActivityScope
class ActivityRepository @Inject constructor() {
}
```

^ Dont apply scope annotations to your implementation

^ Results in implementation dictating it's own lifecycle

^ Confuses the why and the how of implementation details

---

# @Reusable

^ Unlike singleton instructs Dagger that the instance can be reused

^ Should be used for expensive instantiations

^ Uses a single check algorithm

---

# Double Check

```java
public final class DoubleCheck<T> implements Provider<T>, Lazy<T> {
  private static final Object UNINITIALIZED = new Object();

  private volatile Provider<T> provider;
  private volatile Object instance = UNINITIALIZED;

  private DoubleCheck(Provider<T> provider) { /* ... */ }

  @Override
  public T get() {
    Object result = instance;
    if (result == UNINITIALIZED) {
      synchronized (this) {
        result = instance;
        if (result == UNINITIALIZED) {
          result = provider.get();
          instance = reentrantCheck(instance, result);
          provider = null;
        }
      }
    }
    return (T) result;
  }

  public static Object reentrantCheck(Object currentInstance, Object newInstance) { /* ... */ }
}
```

---

# Double Check

```java, [.highlight: 13-19, 24]
public final class DoubleCheck<T> implements Provider<T>, Lazy<T> {
  private static final Object UNINITIALIZED = new Object();

  private volatile Provider<T> provider;
  private volatile Object instance = UNINITIALIZED;

  private DoubleCheck(Provider<T> provider) { /* ... */ }

  @Override
  public T get() {
    Object result = instance;
    if (result == UNINITIALIZED) {
      synchronized (this) {
        result = instance;
        if (result == UNINITIALIZED) {
          result = provider.get();
          instance = reentrantCheck(instance, result);
          provider = null;
        }
      }
    }
    return (T) result;
  }

  public static Object reentrantCheck(Object currentInstance, Object newInstance) { /* ... */ }
}
```

^ Performs a double check outside and inside a synchronised block

^ Expensive operation should really be avoided

---

# Single Check

```java, [.highlight: 11-12, 17, 22]
public final class SingleCheck<T> implements Provider<T> {
  private static final Object UNINITIALIZED = new Object();

  private volatile Provider<T> provider;
  private volatile Object instance = UNINITIALIZED;

  private SingleCheck(Provider<T> provider) { /* ... */ }

  @Override
  public T get() {
    Object local = instance;
    if (local == UNINITIALIZED) {
      Provider<T> providerReference = provider;
      if (providerReference == null) {
        local = instance;
      } else {
        local = providerReference.get();
        instance = local;
        provider = null;
      }
    }
    return (T) local;
  }
}
```

^ Single check algorithm has much better performance

---

# Kotlin: Lazy

```kotlin
private val viewModel by lazy(NONE) { SampleViewModel() }

fun <T> lazy(mode: LazyThreadSafetyMode, initializer: () -> T): Lazy<T> =
    when (mode) {
        LazyThreadSafetyMode.SYNCHRONIZED -> SynchronizedLazyImpl(initializer)
        LazyThreadSafetyMode.PUBLICATION -> SafePublicationLazyImpl(initializer)
        LazyThreadSafetyMode.NONE -> UnsafeLazyImpl(initializer)
    }
```

^ Much the same as how Kotlin handles lazy property delegates

^ Recommended to use lazy(NONE) wherever possible

^ Especially in single thread environments like Android

---

# [fit] Favour @Reusable over @Scope 👍

- Great for expensive dependencies

- Work great in single thread environments

- Not guaranteed same instance in multiple threads

- Prefer to keep your Dagger graph stateless

- Use @Scope if you absolutely need to store state

^ Ideally your Dagger graph shouldn't contain state

^ Allow your injection sites to store the instance

^ Lifecycle managed by injection site

---

# Dagger: Modules

---

# Status Quo 🎸

```java
@Module
public abstract class ApplicationModule {
    
    @Binds
    abstract Context context(Application application);
    
    @Provides
    static SampleRepository repository(String name) {
        return new SampleRepository(name);
    }
}

```

^ The current status quo for Java modules

^ allows us to define both @Binds and @Provides

^ Dagger need not instantiate this module to create dependencies

^ @Binds informs the Dagger compiler to create a synthetic binding

^ @Provides results in a static function

---

# Dagger: Modules

```kotlin
@Module
abstract class ApplicationModule {

    @Binds
    abstract fun context(application: Application): Context
    
    @Module
    companion object {
    
        @Provides
        @JvmStatic
        fun repository(name: String): SampleRepository = SampleRepository(name)
    }
}
```

^ Converting this code to Kotlin results in a companion object for the static functions

---

# Dagger: Modules

```java
public abstract class ApplicationModule {
   public static final ApplicationModule.Companion Companion = new ApplicationModule.Companion();

   @Binds
   @NotNull
   public abstract Context context(@NotNull Application var1);

   @Provides
   @JvmStatic
   @NotNull
   public static final SampleRepository repository(@NotNull String name) {
      return Companion.repository(name);
   }

   @Module
   public static final class Companion {
      @Provides
      @JvmStatic
      @NotNull
      public final SampleRepository repository(@NotNull String name) {
         return new SampleRepository(name);
      }

      private Companion() {
      }
   }
}
```

^ Generates twice the methods as are necessary

^ Companion object instantiated statically anyway

^ Can mangle names when using multi-bindings

---

# Dagger: Modules

```kotlin
object ApplicationModule {

    @Provides
    @JvmStatic
    fun context(application: Application): Context = application
    
    @Provides
    @JvmStatic
    fun repository(name: String): SampleRepository = SampleRepository(name)
}
```

^ Use top-level Kotlin objects to reduce the generated code

---

# Dagger: Modules

```java
public final class ApplicationModule {
   public static final ApplicationModule INSTANCE = new ApplicationModule();

   @Provides
   @JvmStatic
   @NotNull
   public static final Context context(@NotNull Application application) {
      return (Context)application;
   }

   @Provides
   @JvmStatic
   @NotNull
   public static final SampleRepository repository(@NotNull String name) {
      return new SampleRepository(name);
   }

   private ApplicationModule() {
   }
}
```

^ Still creates instance of object module

^ But no duplicate method signatures

^ Module is stateless

---

## Use Kotlin interfaces for @Binds modules

^ Sinan

- Separate objects from interfaces, reduce complexity
- Should I use an abstract class or interface? Doesn’t matter
- Interface more consistent with the documentation for Factory
    - Citation needed
- Interface with default implementation? No.

---

## Inlined method bodies in Kotlin

^ Sinan

- Kotlin return types can be inferred from method body
- Android Studio even suggests inlining return types
- Return types to hide implementation detail easily missed
- Best practice to explicitly specify return type
- Easier to review, easier to understand, avoids compiler errors
- Framework types (Fragment.context) can be assumed nullable

---

# Kotlin: Generics<? : T>

^ Ash

---

# Kotlin: Generics<? : T>

## Java Interoperability

^ Complicated part of Java interoperability is wildcards

^ Since Kotlin does not actually have wildcards

^ Uses declaration-site variance and type projections

---

# Kotlin: Generics<? : T>

## Java Interoperability

```java
interface Collection<E> extends Iterable<E> {
    
    boolean addAll(Collection<? extends E> collection);
}
```

^ Consider the collection interface in Java

^ Why does Java need to use a wildcard here?

---

# Kotlin: Generics<? : T>

## Java Interoperability

```java
interface Collection<E> extends Iterable<E> {
    
    boolean addAll(Collection<E> collection);
}
```

^ Could we just use addAll without a wildcard?

^ No because generic types in Java are invariant

^ What does this mean?

---

# Kotlin: Generics<? : T>

## Java Interoperability

`List<String> : List<Object>`

---

# Kotlin: Generics<? : T>

## Java Interoperability

~~`List<String> : List<Object>`~~

^ List of Strings is not a subtype of a List of Objects

^ If it were you could do the following

---

# Kotlin: Generics<? : T>

## Java Interoperability

```java
List<String> strings = new ArrayList<String>();
List<Object> objs = strings; 
objs.add(1);
String string = strings.get(0); 
```

^ Java prohibits casting a List<String> to a List<Object>

---

# Kotlin: Generics<? : T>

## Java Interoperability

```java
List<String> strings = new ArrayList<String>();
List<Object> objs = strings; 
objs.add(1);
String string = strings.get(0); // 🔥🔥🔥
```

^ Would throw a ClassCastException casting an Integer to String at runtime

---

# Kotlin: Generics<? : T>

## Java Interoperability

```java
interface Collection<E> extends Iterable<E> {
    
    boolean addAll(Collection<? extends E> collection);
}
```

^ We have wildcards so that this method can accept a list of something that extends the base type

^ Wildcard with an upper bound makes the type covariant

---

# Kotlin: Generics<? : T>

## Java Interoperability

```kotlin
List<String> box(String value) { /* ... */ }

String unbox(List<? extends String> boxed) { /* ... */ }
```

^ In order to maintain compatibility with Java

^ Kotlin emulates declaration-site variance through use-site variance

^ Meaning types are generated with a wildcard only for parameters

^ Return values are kept without wildcards

---

# Kotlin: Generics<? : T>

## Java Interoperability

```kotlin
class ListAdapter @Inject constructor(strings: List<String>)
```

^ Thus when injecting generic types from Dagger

^ A list of strings becomes...

---

# Kotlin: Generics<? : T>

## Java Interoperability

```kotlin
class ListAdapter @Inject constructor(strings: List<String>)
```

---

# Kotlin: Generics<? : T>

## Java Interoperability

```java
public final class ListAdapter {
   @Inject
   public ListAdapter(@NotNull List<? extends String> strings) {
      Intrinsics.checkParameterIsNotNull(strings, "strings");
      super();
   }
}
```

^ Remember that the generated Dagger injection factory is written in Java

---

# Kotlin: Generics<? : T>

## Java Interoperability

```kotlin
@Module
object ListModule {

    @IntoSet
    @Provides
    @JvmStatic
    fun hello(): String = "Hello"

    @IntoSet
    @Provides
    @JvmStatic
    fun world(): String = "World"
}
```

^ Even though your module was defined in Kotlin without wildcards

^ Expects ListAdapter parameter to appear without wildcard

---

# Build Failed...

## 🔴 😢

^ Fails to build, and now we're sad!

^ How can we remedy this?

^ Quite simply

---

# Kotlin: Generics<? : T>

## Java Interoperability

```kotlin
class ListAdapter @Inject constructor(strings: @JvmSuppressWildcards List<String>)
```

^ Most convenient to use this as many times this will be an issue with Dagger multi-bindings

---

# Kotlin: Generics<? : T>

## Dagger Multi-Bindings

```kotlin
@Module
object ListModule {

    @IntoSet
    @Provides
    @JvmStatic
    fun hello(): String = "Hello"

    @IntoSet
    @Provides
    @JvmStatic
    fun world(): String = "World"
}
```

^ Here were specifying in each method the set type

^ No generics being used

---

# Jetpack: ViewModel

^ Ash´

-  Jetpack introduced us to ViewModel that persists through config change
    -  Most Dagger components scoped to life of instance
    -  ViewModel persistence is a form of scoping
    -  Scope greater than activity or component instance scope
    -  ViewModel can leak dependencies injected from Dagger
    -  Dagger and ViewModel should be used with caution
-  ViewModel annotated with Inject can be built with graph dependencies
    -  Jetpack expects us to build ViewModel with Provider Factory
    -  Using both in conjunction requires compatibility glue code
-  One simply does not Inject a ViewModel
    -  Injected ViewModel will be lost on activity death
    -  Persistence achieved through ViewModelStore
    -  ViewModel should not exist in Dagger graph
    -  How can you still utilise Dagger?
-  Implementing a Dagger ViewModelProvider.Factory
    -  Plaid: HomeViewModelFactory (Delegation)
        -  ViewModel constructor kept without annotation
        -  Duplicate class to delegate parameters
    -  Plaid: AboutViewModelFactory (Bad Example)
        -  ViewModel instantiated every time
        -  Duplicate ViewModel not used
    -  Scout: ApplicationViewModelFactory (Multibinding)
        -  Application scoped view model knows everything
        -  Requires binding expression to include ViewModel in set
    -  Scout: ViewModelFactory (ViewModel Scope)
        -  Ideal, ProviderFactory once per ViewModel
        -  Useful for dynamic features, independent of application
        -  Constructor Provider generated by Dagger
        -  Single responsibility preserved
-  Fragment and Activity Factories can be defined in a similar fashion

---

# Kotlin: Experimental 🧪

^ Ash

---

# Kotlin: Experimental 🧪

## Inline Classes

- Wrapping types can introduce runtime overhead

- Performance worse for primitive types

- Initialised with single backing property

- Inline classes represented by backing field at runtime

- Sometimes represented as boxed type...

^ Wrapping types for business logic requires additional heap allocations

^ Primitive types heavily optimised by the runtime

^ Compiler will inline where possible, but sometimes it's necessary to use wrapper

^ How does this behave with Dagger?

---

# Kotlin: Experimental 🧪

## Inline Classes

- Dagger recognises inline class as it's backing type

- Module @Provide not complex enough to require wrapper

- @Inject sites not complex enough to require wrapper

- Can cause problems if backing type not qualified

- Operates the same for typealias

^ Works out of the box, interoperable with Dagger as backing type

^ Since backing fields are often primitive can lead to issues

---

## Dagger Factory's

^ Sinan

---

## Dagger Factory's

- Inject annotated classes generate factory at usage sites
- Prefer inject annotation as the module compiler isn’t necessary
- Modules can be used to generate internal classes by abstract type
- Internal constructor for public classes with internal dependencies
- Dependency required in root module for submodule dependencies
    - Ie submodule using Coroutines requires app to include dependency
    - Even if it’s internal, if in Dagger graph, is required in app module
- Internal implementations can be hidden behind interfaces
- Submodule requires Dagger compiler to function correctly

---

## Default Parameters in Dagger

^ Sinan

- Dagger doesn’t recognise default parameters even with @JvmOverloads
- @JvmOverloads will generate all constructors with @Inject
- Types may only contain one @Inject constructor
- Best practice to define an alternative annotated constructor

---

# Further Reading 📖

- **Dave Leeds: Inline Classes and Autoboxing**
    - https://typealias.com/guides/inline-classes-and-autoboxing/
- **Kotlin: Declaration Site Variance**
    - https://kotlinlang.org/docs/reference/generics.html#declaration-site-variance
- **Kotlin: Variant Generics**
    - https://kotlinlang.org/docs/reference/java-to-kotlin-interop.html#variant-generics
- **Jake Wharton: Helping Dagger Help You**
    - https://jakewharton.com/helping-dagger-help-you/
- **Dagger: Kotlin Dagger Best Practices**
    - https://github.com/google/dagger/issues/900
- **Fred Porciúncula: Dagger 2 Official Guidelines**
    - https://proandroiddev.com/dagger-2-on-android-the-official-guidelines-you-should-be-following-2607fd6c002e
- **Warren Smith: Dagger & Kotlin**
    - https://medium.com/@naturalwarren/dagger-kotlin-3b03c8dd6e9b
- **Nazmul Idris: Advanced Dagger 2 w/ Android and Kotlin**
    - https://developerlife.com/2018/10/21/dagger2-and-kotlin/

^ https://github.com/JakeWharton/dagger-reflect

^ https://github.com/square/AssistedInject
      
---

![right inline 15%](immobilienscout24.png)

## Thanks!

#### Sinan Kozak & Ash Davies


![left inline 50%](sinan-kozak.png)![left inline 33%](gde-badge-round.png)

![right](graph-background.jpg)
