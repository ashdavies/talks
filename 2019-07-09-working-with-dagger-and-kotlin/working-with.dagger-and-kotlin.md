autoscale: true
build-lists: true
footer: @snnkzk | @askashdavies
footer-style: Google Sans
header: Google Sans
slide-transition: true
text: Google Sans

![right inline 15%](immobilienscout24.png)

## [fit] Working with Dagger and Kotlin
#### Sinan Kozak & Ash Davies

![left inline 50%](sinan-kozak.png)![left inline 33%](gde-badge-round.png)

![right](graph-background.jpg)

^ Speaker introduction

---

## Introduction

^ Sinan

- Dagger processor written in Java for Java code
- Used extensively in many ecosystems outside of Android
- Kotlin compatibility unlikely to happen in the near future
- Considerations about JVM compatibility and usage
- Concerns about compile safety, runtime avoided
- Dagger Android assumes injector available at runtime

---

## Qualifiers in Dagger

^ Sinan

- Qualifiers used to identify dependencies with identical signatures
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

## Favouring @Reusable over @Scope

^ Ash

- Any defined scope is treated like Singleton
    - Lifecycle lives as long as the defined component
    - @Singleton not the same as the singleton pattern
- Use BINARY/RUNTIME retention just like @Qualifier
- Double check synchronised algorithm
- Single check synchronised algorithm
- Kotlin lazy synchronisation options
- Edge cases with Reusable and Singleton
    - Same instance not guaranteed, but most likely
    - Do not store state in reusable dependencies
- Ideally Dagger graph should be entirely stateless
    - Store state in injection site target
- Single thread environments (Android)
    - Single check algorithm sufficient as no thread check needed

---

## Use Kotlin objects for @Provide modules

^ Ash

- Existing status quo for Java modules
    - Possible to use both @Binds and @Provides in same module
- Kotlin abstract module class with companion object
    - Show JVM code for abstract module with companion
    - Show JVM code for object module with JvmStatic
    - Dagger cannot find mangled Companion objects method names
- Ensure Dagger doesn’t need to create module instance
- Stateless modules will be horizontal merged
- Object methods will be inlined by R8/Proguard

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

## Experimental Kotlin Inline Classes and Typealiases

^ Ash

- Inline classes use backing field to reduce runtime overhead
- Inline classes sometimes retained and inlined as necessary
- Working interoperably with Java, represented as backing type
- Dagger processors recognises only compiled types after compiler
- Same applies with Typealiases will be displayed as backed type

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
