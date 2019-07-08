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

^ Sinan

---

# Introduction 👋

- Dagger processor written in Java for Java code
- Used extensively in many ecosystems outside of Android
- Kotlin compatibility unlikely to happen in the near future
- Considerations about JVM compatibility and usage
- Concerns about compile safety, runtime avoided
- Dagger Android assumes injector available at runtime

---

# Dagger Qualifiers 📛

^ Sinan

---

# Dagger Qualifiers 📛

- Qualifiers used to identify dependencies with identical signatures
    - JSR330 provides @Named qualifier for default use
    - Can define your own
- Define annotation with @Qualifier annotation
    - Show official definition from Dagger documentation
- Use Kotlin BINARY retention for usage in multi module projects
    - Dagger 2 doesn’t operate on source files (Dagger 1 used reflection)
    - Use RUNTIME retention for Dagger Reflect
- Difference between constructor val and property lateinit var
    - Constructor injection should be preferred for runtime safety
    - Kotlin properties uses property access syntax via accessors
    - Unclear where the annotation is applied, accessor or property
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

# [fit] @Singleton != Singleton Pattern

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

^ Use @MustBeDocumented insted of @Documented

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

## Kotlin Generics: in, out, where 

^ Ash

- Java generic types are invariant, List<String> not a subtype of List<Object>
- Java prohibits this to ensure run-time safety but has implications
    - Example of happy path, and compilation failure
    - Prevents adding list of strings to list of objects
- Java uses wildcard type arguments to solve this (Collection, ? extends T)
- Kotlin applies declaration-site variance to generic parameters
    - Show difference in usage/generated code between in/out variance
    - Compiled JVM code erases generic types for Kotlin
- Kotlin uses declaration-site variance without covariance for Java
- Dagger multibindings generated Java code does not use wildcards
- Injecting classes with generics in Kotlin definition expects wildcards
    - Check use cases without multibindings for comparison
- @JvmSuppressWildcards will suppress wildcards on member vars
    - Possible to use @JvmWildcards in module declarations
- Behaviour of annotation on constructor injection params
- Also applies to injection of Kotlin lambda functions

---

# Jetpack: ViewModel

^ Ash

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

## Dagger Factory generation

^ Sinan

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

^ Dagger Reflect
^ Dagger Assisted Inject

---

## Further Reading

https://typealias.com/guides/inline-classes-and-autoboxing/
https://kotlinlang.org/docs/reference/generics.html#declaration-site-variance
https://kotlinlang.org/docs/reference/java-to-kotlin-interop.html#variant-generics
https://jakewharton.com/helping-dagger-help-you/
https://github.com/google/dagger/issues/900
https://proandroiddev.com/dagger-2-on-android-the-official-guidelines-you-should-be-following-2607fd6c002e
https://medium.com/@WindRider/correct-usage-of-dagger-2-named-annotation-in-kotlin-8ab17ced6928
https://medium.com/@naturalwarren/dagger-kotlin-3b03c8dd6e9b
https://github.com/JakeWharton/dagger-reflect
https://github.com/square/AssistedInject
https://medium.com/@elye.project/dagger-2-for-dummies-in-kotlin-scope-d51a6b6e077f
https://developerlife.com/2018/10/21/dagger2-and-kotlin/

---

![right inline 15%](immobilienscout24.png)

## Thanks!

#### Sinan Kozak & Ash Davies


![left inline 50%](sinan-kozak.png)![left inline 33%](gde-badge-round.png)

![right](graph-background.jpg)
