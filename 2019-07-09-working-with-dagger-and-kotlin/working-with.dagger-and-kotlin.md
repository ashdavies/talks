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

- Dagger 2 is a fast dependency injector for Android and Java
- One of goals is having compile time safety
- It is written for only Java in mind
- It is used extensively outside of Android ecosystem

^ It is a powerful tool for big project
^ Compile time safety and no runtime involvement are main goal
^ No magic or hack behind it
^ It is used in Google as well

---

# Dagger 2 and Kotlin ☕ 🗡

- Dagger 2 can work with Kotlin
- But generated code is plain Java source code
- Kotlin generated code won't like to happen

---

# Dagger Qualifiers

Qualifiers used to identify dependencies with identical signatures

  - Factories use qualifiers to decide the instance use
  - Can create your own qualifier annotations, or just use @Named.
  - Apply qualifiers by annotating the field or parameter of interest.
  - The type and qualifier annotation will both be used to identify the dependency.

^ If there are multiple different instance of same class/interface in graph
^ Passing String, Int or similar type into Graph will work for first one 
^ But it will start failing when there are multiple provider for them

---

# Retention Annotation

Use Kotlin retention annotations instead of Java retention
  
  - Java retention support is depreceted in Kotlin
  - At least BINARY retention but RUNTIME is ideal
  - Dagger 2 doesn’t operate on source files
  - Annotations are necessary for kapt

^ Determines whether an annotation is stored in binary output and visible for reflection

---

# Constructor injection

```kotlin
class Game @Inject constructor(
    @Named("P1") private val player1: Player,
    @Named("P2") private val player2: Player
)
```

^ Simple Game class with Injected construtor
^ We have named player instance in dagger graph

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

^ Decomipled version of Kotlin class (Simplified)

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

^ named annotations are at the place dagger needs

---

# lateinit var 🛑

```kotlin
class Game @Inject constructor() {

  @Inject @Named("P1") lateinit var player1: Player
  @Inject @Named("P2") lateinit var player2: Player
}
```

^ This scenerio can happen with Activity and Fragment (Fragments will have constructor support in near future)
^ Normal looking properties
^ But kotlin properties arent same as Java properties

---

# Decompiled lateinit var

```java
public final class Game {
   @Inject public Player player1;
   @Inject public Player player2;

   @Named("P1") public static void player1$annotations() {}

   public final Player getPlayer1() { ... }

   public final void setPlayer1(Player var1) {...}

   @Named("P2") public static void player2$annotations() {}

   public final Player getPlayer2() { ... }

   public final void setPlayer2(Player var1) {...}
```

^ Simplified
^ @Named annotations are applied on additional static methods
^ property access syntax via accessors
^ Dagger processor will fail; it cannot know which player to inject

---

# Decompiled lateinit var

```java, [.highlight: 2-3, 5, 11]
public final class Game {
   @Inject public Player player1;
   @Inject public Player player2;

   @Named("P1") public static void player1$annotations() {}

   public final Player getPlayer1() { ... }

   public final void setPlayer1(Player var1) {...}

   @Named("P2") public static void player2$annotations() {}

   public final Player getPlayer2() { ... }

   public final void setPlayer2(Player var1) {...}
```

^ This happens because Inject is Target annotation but Named is Qualifier annotation

---

[.footer: ]

![](excuse_me.gif)

---

# Specify annotation

```kotlin
class Game @Inject constructor() {

  @Inject @field:Named("P1") lateinit var player1: Player
  @Inject @field:Named("P2") lateinit var player2: Player
}
```

 - We need to specify where annotation needs to apply in Java world
    - @field:...
    - @set:...
    - @get:...
    - @param:...
    - @property:...
    - @setparam:...
    - @receiver:...
    - @delegete:...

---

# Specify annotation

```kotlin
class Game @Inject constructor() {

  @Inject @field:Named("P1") lateinit var player1: Player
  @Inject @field:Named("P2") lateinit var player2: Player
}
```

```java
public final class Game {
    
   @Inject @Named("P1") public Player player1;
   @Inject @Named("P2") public Player player2;

   public final Player getPlayer1() {...}

   public final void setPlayer1(Player var1) {...}

   public final Player getPlayer2() {...}

   public final void setPlayer2(Player var1) {...}

}
```

---

# Specify annotation

```java, [.highlight: 2-3]
public final class Game1 {
   @Inject @Named("P1") public Player player1;
   @Inject @Named("P2") public Player player2;

   public final Player getPlayer1() {...}

   public final void setPlayer1(Player var1) {...}

   public final Player getPlayer2() {...}

   public final void setPlayer2(Player var1) {...}
}
```

---

# Constructor vs Property injection

- Constructor val
  - Easy to use
  - Safe at runtime if project compile successfully

- Property lateinit var injection
  - Kotlin properties uses property access syntax via accessors
  - Unclear where the annotation is applied, accessor or property
  - Dont forget to use with `@field:`

  ^ lateinit var is error prone and hacky to test

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

# Dagger: Modules

```kotlin
@file:JvmName("ApplicationModule")
@file:Module

@Provides
fun context(application: Application): Context = application

@Provides
fun repository(name: String): SampleRepository = SampleRepository(name)
```

^ Interestingly you can use top-level Kotlin methods with Jvm annotations

---

# Dagger: Modules

```java
public final class ApplicationModule {

   @Provides
   @NotNull
   public static final Context context(@NotNull Application application) {
      return (Context)application;
   }

   @Provides
   @NotNull
   public static final SampleRepository repository(@NotNull String name) {
      return new SampleRepository(name);
   }
}
```

^ This will generate a simple Java classes with static methods

^ But as it's not a defined class, cannot be referenced from Kotlin

---

[.footer: ]

![](sad.gif)

---

# Kotlin: Generics<? : T>

^ Ash

^ Lets cheer ourselves up with some generics

---

[.footer: ]

![](uhm.gif)

---

# Kotlin: Generics<? : T>

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

# Jetpack
## ViewModel

^ Ash

---

# Jetpack
## ViewModel

- Introduced at Google IO 2018

- Bootstrap Android development

- Opinionated implementations

- Break up support libraries

- Migrate to androidx namespace

^ Last year Google introduced us to Android JetPack which included a variety of tools
  
^ Dedicated to helping us bootstrap Android development
  
^ Opinionated and clean implementations for common problems
  
^ With the additional of compartmentalising the support libraries
  
^ Renaming support dependencies to androidx and starting with independent versioning

![right 100%](jetpack-hero.png)
  
---

[.background-color: #ffffff]
[.text: #666666]

# Jetpack
## ViewModel

![right](view-model-scope.png)

^ Most importantly ViewModel allows us to persist the scope of a configuration change

^ ViewModel persisted with `NonConfigurationInstances` in headless fragment

---

# Jetpack
## ViewModel

- Android `Application` created
- Android `Activity` created
- Dagger `@Component` created
- Androidx `ViewModel` created
- Androidx `Fragment` created

^ Consider ViewModel Fragment persistence to be a method of scoping

^ What would this look like with a typical Dagger application

---

[.build-lists: false]

# Jetpack
## ViewModel

- **Android `Application` created ←**
- ~~Android `Activity` created~~ 💀
- ~~Dagger `@Component` created~~ 💀
- **AndroidX `ViewModel` created ←**
- **AndroidX `Fragment` created ←**

^ On configuration change the activity and its component will be destroyed

^ But the application, `ViewModel` and `Fragment will be persisted

---

[.background-color: #feefe3]
[.text: #bf360c]

> ## ⚠️ Caution: A `ViewModel` must never reference a view, `Lifecycle`, <br />or any class that may hold a reference to the activity context.

^ Its because of this your `ViewModel` should not contain `Context`

---

[.footer: © 2019 Viacom International Inc.]

![](spongebob-thinking.gif)

^ So if the Dagger `@Component` is created in your `Activity`

^ How can we utilise Dagger to help build our `ViewModel`?

---

[.footer: © 2019 20th Century Fox]

![](simpsons-steady.gif)

^ Carefully, carefully is how we do it

---

# JetPack
## ViewModel

```kotlin
class SampleViewModel @Inject constructor() : ViewModel {
}

class Activity : DaggerAppCompatActivity {

    @Inject lateinit var model: SampleViewModel
}
```    

^ Whilst this will work it will result in a new ViewModel every time

^ We need to delegate through ViewModelStore

---

# JetPack
## ViewModel

```kotlin, [.highlight: 6]
class SampleViewModel @Inject constructor() : ViewModel {
}

class Activity : DaggerAppCompatActivity {

    @Inject lateinit var model: SampleViewModel
}
```    

^ Which means we simply just cant directly inject the ViewModel

^ Dagger will always try to use its own Provider types

---

[.background-color: #000000]

![fit](one-does-not.jpg)

---

# Jetpack: ViewModel
## Dagger Multi-Binding

^ Most popular way so far is to use Dagger multi-binding

---

# Jetpack: ViewModel
## Dagger Multi-Binding

```kotlin
class ActivityViewModel @Inject constructor() : ViewModel() {
}
```

^ First take our @Inject annotated ViewModel

^ Allows Dagger to generate Factory

^ We still control it's usage

---

# Jetpack: ViewModel
## Dagger Multi-Binding

```kotlin
@MapKey
@Retention(RUNTIME)
annotation class ViewModelKey(val value: KClass<out ViewModel>)

@Module
interface ActivityViewModelModule {

  @Binds
  @IntoMap
  @ViewModelKey(ViewModel::class)
  fun model(model: ActivityViewModel): ViewModel
}
```

^ Next we create the qualifier annotation to map by ViewModel class

^ Dagger module to bind the implementation of the ViewModel to the map

^ This creates a map of creators for all our ViewModels in our application graph

---

# Jetpack: ViewModel
## Dagger Multi-Binding

```kotlin
class ViewModelFactory @Inject constructor(
    private val creators: Map<Class<out ViewModel>, 
    @JvmSuppressWildcards Provider<ViewModel>>
) : ViewModelProvider.Factory {

    @Suppress("UNCHECKED_CAST")
        override fun <T : ViewModel> create(kls: Class<T>): T {
        var creator: Provider<out ViewModel>? = creators[kls]
        
        creator ?: creators.keys.firstOrNull(kls::isAssignableFrom)?.apply { creator = creators[this] }
        creator ?: throw IllegalArgumentException("Unrecognised class $kls")
        
        return creator.get() as T
    }
}
```

^ Next creating a factory that can be used for all of your apps ViewModels

^ Injects a map of ViewModel providers that the Factory checks for at runtime

^ Note the usage of @JvmSuppressWildcards to ensure that we can inject our Dagger map

---

# Jetpack: ViewModel
## Dagger Multi-Binding

```kotlin
class ViewModelActivity : DaggerAppCompatActivity {

    private lateinit var model: ActivityViewModel
    
    @Inject internal lateinit var factory: ViewModelFactory
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        ...
        
        model = ViewModelProviders
            .of(this, factory)
            .get(ActivityViewModel::class.java)
    }
}
```

^ Finally creating an activity to inject the factory and use the ViewModel

^ Inject application ViewModel factory and create the ViewModel via providers

---

# Jetpack: ViewModel
## androidx.activity:activity-ktx:1.0.0-rc01

```kotlin
class ViewModelActivity : DaggerAppCompatActivity {

    private val model: ActivityViewModel by viewModels { factory }
  
    @Inject internal lateinit var factory: ViewModelFactory
  
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        ...
    }
}
```

^ Compatible with the viewModels extension available in activity-ktx

---

# Jetpack: ViewModel
### bit.ly/view-model-factory

- Uses Dagger Multi-Binding to build map of `Provider`'s

- Global `Factory` to create all ViewModel's

- `Factory` injected into `Activity` to create `ViewModel`

- Complicated initial set-up configuration

- Needs map binding `@Module` for every `ViewModel`

- Application graph polluted with all `Factory`'s

^ This can be a great approach to solving the problem

^ But it has some drawbacks in implementation

^ Each new ViewModel requires several considerations

^ Alternatives?

---

[.footer: github.com/android/plaid/blob/master/app/src/main/java/io/plaidapp/ui/HomeViewModelFactory.kt]

# Plaid: HomeViewModelFactory

```kotlin
class HomeViewModelFactory @Inject constructor(
    private val dataManager: DataManager,
    private val designerNewsLoginRepository: LoginRepository,
    private val sourcesRepository: SourcesRepository,
    private val dispatcherProvider: CoroutinesDispatcherProvider
) : ViewModelProvider.Factory {

    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel?> create(modelClass: Class<T>): T {
        if (modelClass != HomeViewModel::class.java) {
            throw IllegalArgumentException("Unknown ViewModel class")
        }
        return HomeViewModel(
            dataManager,
            designerNewsLoginRepository,
            sourcesRepository,
            dispatcherProvider
        ) as T
    }
}
```

^ Another popular way to achieve this is through a delegate factory

^ Factory is manually created, but exists as a single class

^ Respects SRP, ViewModel manually created without @Inject constructor

---

[.footer: https://github.com/android/plaid/blob/master/about/src/main/java/io/plaidapp/about/ui/model/AboutViewModelFactory.kt]

# Plaid: AboutViewModelFactory

```kotlin
internal class AboutViewModelFactory @Inject constructor() : ViewModelProvider.Factory {

    @Inject lateinit var aboutViewModel: AboutViewModel

    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel?> create(modelClass: Class<T>): T {
        return if (modelClass.isAssignableFrom(AboutViewModel::class.java)) {
            aboutViewModel as T
        } else {
            throw IllegalArgumentException(
                "Class ${modelClass.name} is not supported in this factory."
            )
        }
    }
}
```

^ Similar way of doing so is to inject the ViewModel into the factory

^ ViewModel is created and injected every time the factory is registered

^ Activity uses correct ViewModel, but new unused instance created

---

[.footer: © 2019 Warner Bros.]

![](hangover-thinking.gif)

^ Surely there must be a way to combine these approaches

^ Without polluting application scope

^ Without complex multi-bindings

^ Without duplicated constructors

---

# Jetpack: ViewModel
## bit.ly/view-model-provider

```kotlin
internal class ViewModelFactory(
    private val provider: Provider<out ViewModel>
) : ViewModelProvider.Factory {

    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        return try {
            provider.get() as T
        } catch (exception: ClassCastException) {
            throw IllegalArgumentException(
                "Class ${modelClass.name} is not supported by this factory", 
                exception
            )
        }
    }
}
```

^ Simplify the `ViewModelProvider.Factory` to take a `Provider<ViewModel>`

^ Perform a quick class type check and return the result of the provider

^ Instance only created when `ViewModelProvider` requires

---

# Jetpack: ViewModel
## bit.ly/view-model-provider

```kotlin
class ActivityViewModel @Inject constructor() : ViewModel() {

    class Factory @Inject constructor(
        provider: Provider<ActivityViewModel>
    ) : ViewModelFactory(provider)
}

class ViewModelActivity : DaggerAppCompatActivity {

    private val model: ActivityViewModel by viewModels { factory }
  
    @Inject internal lateinit var factory: ActivityViewModel.Factory
}
```

^ Then create the `ViewModel` and `Activity` appropriately

^ Create a Factory on the ViewModel extending the ViewModelFactory

^ Uses the Dagger generated `Provider` with the AndroidX `Factory`

^ Provider and Factory generated in the same module

---

![](south-park-more.gif)

---

# Android: *Factory

- `AppComponentFactory`
    <sup>Android Pie 🥧</sup>

-  `FragmentFactory`
    <sup>fragmentx:1.1.0-rc01</sup>

- `AbstractSavedStateVMFactory`
    <sup>lifecycle-viewmodel-savedstate:1.0.0-alpha02</sup>

- `LayoutInflater.Factory2`
    <sup>Android Cupcake 🧁</sup>

^ `ViewModel`s aren't the only Android element to accept a Factory

^ We can use the same mechanism as we have with ViewModel factory

^ Android Pie brings `AppComponentFactory` to control instantiation of manifest elements

^ FragmentX 1.1.0 brings FragmentFactory to control creation of Fragments

^ We can also use saved state factory with the ViewModel Factory

^ Finally we can also use the LayoutInflater factory to create views

---

# Android: LayoutInflater.Factory2
## github.com/square/AssistedInject

```kotlin
class ImageLoaderView @AssistedInject constructor(
    @Assisted context: Context,
    @Assisted attrs: AttributeSet,
    private val loader: ImageLoader
) : ImageView(context, attrs) {

    @AssistedInject.Factory
    interface Factory {
    
        fun create(
            context: Context,
            attrs: AttributeSet
        ): ImageLoaderView
    }
}
```
^ Combined with the Dagger assist library from Square

^ Create a layout inflater from the nearest component

^ Provide your view elements with graph dependencies

---

# Android: LayoutInflater.Factory2
## github.com/square/AssistedInject

```kotlin
class ApplicationLayoutInflaterFactory @Inject constructor(
    private val imageLoaderFactory: ImageLoaderView.Factory
) : LayoutInflater.Factory {

    override fun onCreateView(
        name: String,
        context: Context,
        attrs: AttributeSet
    ): View? {
        if (name == ImageLoaderView::class.java.name) {
            return imageLoaderFactory.create(context, attrs)
        }
        return null
    }
}
```

^ Create and register your layout inflater with your assisted factory

^ Dependencies can be provided from Activity or Fragment graph

^ Resolves canonical issue as to where to retrieve the graph

^ https://github.com/google/dagger/issues/720

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

[.footer: ]

![fit](drax_listening.gif)

---

## Use Kotlin interfaces for @Binds modules

^ Sinan

- Delegating one type to another
    - Use `@Binds` instead of a `@Provides` method 
    - No code generation involved
- Should I use an `abstract class` or `interface`?
    - Doesn’t matter
    - `interface` is more cleaner
    - `abstract` can have internal method
- `interface` with default implementation?
    - No

^ Dagger use @Bind annotation to simply satify graph
^ abstract method or interface doesnt matter but interface is more lean

---

## Inlined method bodies in Kotlin

^ Sinan

- Kotlin return types can be inferred from method body
- Android Studio shows inlining return types
- Return types to hide implementation detail easily missed
    - Interface vs Implemetation
- Best practice to explicitly specify return type
- Easier to review, easier to understand, avoids compiler errors
- Framework types (Fragment.context) can be assumed nullable

^ When we need to bind interface, if dont specify type. It bind implementation
^ Providing anything from Java or Android SDK can be assumed null

---

## Dagger Factory's

^ Sinan

- Inject annotated classes generate factory at usage site
- If `@Module` is not necessary in the gradle module
    - Prefer `@Inject` annotation
    - Don't use dagger compiler where possible

^ For better compiler performance in pure kotlin module try to avoid having dagger compiler

---

## Dagger Factory's

^ Sinan

- For keeping implementation internal prefer `abstract` module and use internal methods
- Injected constructor can be internal
- Root module needs dependencies for submodule
    - if in Dagger graph, is required in app module

^ Dont expose internal implementation detail if not necessary

---

# Keeping internal implementation internal 

This doesn't compile;

```kotlin
internal class Player

class Game @Inject constructor(
    @Named("P1") private val player1: Player,
    @Named("P2") private val player2: Player
)
``` 

But this will;

```kotlin
internal class Player

class Game @Inject internal constructor(
    @Named("P1") private val player1: Player,
    @Named("P2") private val player2: Player
)
``` 

---

## Default Parameters in Dagger

^ Sinan

- Dagger doesn’t recognise default parameters even with `@JvmOverloads`
- `@JvmOverloads` will generate all constructors with `@Inject`
- Class can only have one `@Inject` constructor
- Best practice to define an alternative annotated constructor

^ For testing purpuse, if a new constructor needed dont use default param

---

# JvmOverloads

- Create multiple constructor with @Inject annotation
    - Dagger requires only one @Inject annotated constructor
    - That is why it doesn't know which one to use
    - Doesn't even compile

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

---

![right inline 15%](immobilienscout24.png)

## Thanks!

#### Sinan Kozak & Ash Davies


![left inline 50%](sinan-kozak.png)![left inline 33%](gde-badge-round.png)

![right](graph-background.jpg)
