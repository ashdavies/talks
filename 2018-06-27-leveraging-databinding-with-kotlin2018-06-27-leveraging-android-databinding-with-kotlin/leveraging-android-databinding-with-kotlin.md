footer: ashdavies.io
slidenumbers: true
autoscale: true

<br />
<br />
<br />

# Leveraging Android Databinding with Kotlin

![right inline 15%](immobilienscout24.png)

^
Android databinding is considered as both a powerful toolchain, empowering your views with access to view data without the necessity to build cumbersome presenters, and conversely as an overly complex, convoluted mess of binding statements opening the door to unnecessary, irresponsible domain logic in your view layouts.

^
Whilst the latter of these statements can be true, databinding offers a very powerful code generation syntax, allowing you to utilise the power of the compiler to ensure that your binding statements are runtime safe. Combining this with the concise syntax afforded by Kotlin allows us to dramatically cut down on boilerplate and build complex user interfaces with relative ease.

^
In this talk, you can learn how to utilise extension bindings and property delegates with your layouts, and manage your screen state transformations with true, and safe two-way binding, allowing you to build a fully reactive observable view layout.

---

![left](ash-davies-glasshole.jpg)

^
When my talk was accepted and I saw my profile on the website next to my talk proposal, the first thing that came to my mind was, my god why did I choose that picture?! How could I be pictured with this archaic technology glued to my face?!

## Me

---

![left](ash-davies-glasshole.jpg)

## <- Glasshole

^
But in my defence, that is an awesome hat.

---

## 2015

^
Whilst we're being nostalgic, lets go back to 2015, Ireland had just voted to legalise same-sex marriage, NASA's new horizon space craft performs a close fly-by of Pluto, and Google announces the beta release of data binding.

---

## Data Binding
### [bit.ly/2JSKnJK](bit.ly/2JSKnJK)

^
The data binding library promised to allow us to write declarative layouts, and minimise the glue code necessary to bind your application logic and layouts. In addition to being a support library allowing it's use with the Android platform back to Android 2.1 (API 7).

---

build.gradle

```groovy, [.highlight: 2,7]
apply plugin: 'com.android.application'
apply plugin: 'com.android.databinding'

buildscript {
  dependencies {
    classpath 'com.android.tools.build:gradle:1.2.3'
    classpath 'com.android.databinding.dataBinder:1.0-rc0'
  }
}
```

^
To make use of the data binding library, you would need to use the classpath dependency, and the plugin to generate the necessary code.

---


![inline 50%](data-binding-sample.png)

^
Wanting to try out this new library, I created a sample project on GitHub to demonstrate how to use data binding, which would fetch a list of repositories from a given user, and published the resulting application on the Google Play store, it was well received with monumental success.

---

![inline 50%](google-play-rating.png)

^
Here's an example of a quality review, one of the two one star ratings the app received.

---

## Data Binding Sample v2
### [bit.ly/2JLyMc8](bit.ly/2JLyMc8)

^
I figured that it would be a good idea to update this project, to demonstrate some various ways you can use the modern data binding libraries, so I give you, data binding sample version two.

---

## Data Binding Sample v2

- Kotlin Coroutines

^
Updated with Kotlin, and Kotlin coroutines, which I've found to be really enjoyable to use, and would recommend giving it a try.

---

## Data Binding Sample v2

- Kotlin Coroutines
- Constraint Layout

^
ConstraintLayout to simplify layouts

---

## Data Binding Sample v2

- Kotlin Coroutines
- Constraint Layout
- Architecture Components

^
Architecture components to demonstrate how you can use these with data binding.

---

## Data Binding Sample v2

- Kotlin Coroutines
- Constraint Layout
- Architecture Components
- Moshi Codegen

^
Moshi codegen, which can now recognise Kotlin class meta data.

---

## Data Binding Sample v2

- Kotlin Coroutines
- Constraint Layout
- Architecture Components
- Moshi Codegen
- Blockchain

---

## Data Binding Sample v2

- Kotlin Coroutines
- Constraint Layout
- Architecture Components
- Moshi Codegen
- Blockchain
- AR / VR

---

![](all-the-things.png)

---

## Data Binding Sample v2

- Kotlin Coroutines
- Constraint Layout
- Architecture Components
- Moshi Codegen
- ~~Blockchain~~
- ~~AR / VR~~  

^
Ok maybe not those last two.

---

## Setup

^
How do we setup the current version of data binding?

---

build.gradle

```groovy, [.highlight: 2-4]
android {
  dataBinding {
    enabled = true
  }
}
```

^
This is all that is required to enable data binding, and whilst the documentation advises you use the latest version of the Android gradle plugin, this is supported back to version 1.5.0.

^
It is not necessary to include the annotation processor in addition to enabling data binding, as the Android gradle plugin will inject the right version.

---

## Data Binding v2

^
From version 3.1.0-alpha06 of the Android Gradle plugin includes a new data binding compiler to generate binding classes.

---

## Data Binding v2

### - Incremental class generation

^
This new version includes incremental class generation to help speed up your build.

---

## Data Binding v2

### - Incremental class generation

### - Generated before compilation

^
Additionally the new version generates classes prior to the managed compiler building your application to ensure that your binding classes are still found if your managed code fails to compile.

---

gradle.properties

```groovy
android.databinding.enableV2=true
```

^
As of the Android plugin version 3.2, this is enabled by default, but if you're using an older version you can include this in your gradle properties file, or pass the parameter as a gradle command.

^
In many cases, generated classes are not backwards compatible so you'll need to do a clean build.

^
Lets consider the problem we are trying to solve, and what patterns we currently use to do so.

---

## MVP

^
Lets consider the well known pattern of model view presenter, derived from the popular model view controller pattern, allows us to separate business logic away from the presentation.

---

![inline](model-view-presenter.png)

^
Abstracting our behaviour allows us to create a layered application, making our business logic testable without the need for Android dependencies. This would usually be done by creating an interface contract, that could be fulfilled by a concrete implementation

---

## Presenter

![](painting-presentation.jpg)

^
The presenter is responsible for communication between the view and model, it will retrieve the data from the model and direct the view on how to display it, making the view as passive as possible.

^
I'm focusing mainly on the presenter here, because I feel it's a good analogy for how data binding classes behave, as they will often perform the necessary work required to update the view state from a provided data object.

^
Which involves fetching the required data, applying it to the view properties, and listening to view events in order to invoke the necessary callback.

---

RepoView.kt

```kotlin
interface RepoView {
  var inProgress: Boolean
  var items: List<Repo>
}
```

RepoPresenter.kt

```kotlin
interface RepoPresenter {
  fun onResume()
  fun onDestroy()
}
```

^
Consider a simple view presenter interface contract like so.

---

RepoPresenterImpl.kt

```kotlin
class RepoPresenterImpl(
  private var view: RepoView?,
  private val service: RepoService
) : RepoPresenter {

  override fun onResume() {
    view?.inProgress = true
    service.fetch {
      view?.apply {
        items = it
        inProgress = false
      }
    }
  }

  override fun onDestroy() {
    view = null
  }
}
```

^
With no dependencies on Android framework types, an effective abstraction of interface contracts, this is pretty straight forward to unit test, though the nullability is fairly ugly in this example.

---

## Data Binding

^
Lets consider how we might implement this, utilising Android data binding with Kotlin.

---

![](he-said-it-he-said-it.jpg)

---

RepoActivity.kt

```kotlin
class RepoActivity : AppCompatActivity() {

  private lateinit var binding: ActivityRepoBinding
  private lateinit var service: RepoService

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    binding = DataBindingUtil.setContentView(this, R.layout.activity_repo)
    interactor = RepoServiceFactory().get()
  }

  override fun onResume() {
    super.onResume()
    service.fetch {
      binding.items = it
    }
  }
}
```

^
This is what the most basic implementation for data binding might look like, lets take a closer look at whats going on.

---

RepoActivity.kt

```kotlin, [.highlight: 3, 9]
class RepoActivity : AppCompatActivity() {

  private lateinit var binding: ActivityRepoBinding
  private lateinit var service: RepoService

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    binding = DataBindingUtil.setContentView(this, R.layout.activity_repo)
    interactor = RepoServiceFactory().get()
  }

  override fun onResume() {
    super.onResume()
    service.fetch {
      binding.items = it
    }
  }
}
```

^
Here we have our generated binding class which represents our interaction with the data bound view, and we use the method setContentView from the data binding utility instead of the framework method by the same name.

---

RepoActivity.kt

```kotlin, [.highlight: 4, 10, 15]
class Repoactivity : AppCompatActivity() {

  private lateinit var binding: ActivityRepoBinding
  private lateinit var service: RepoService

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    binding = DataBindingUtil.setContentView(this, R.layout.activity_repo)
    service = RepoServiceFactory().get()
  }

  override fun onResume() {
    super.onResume()
    service.fetch {
      binding.items = it
    }
  }
}
```

^
Here is our behaviour, where we invoke a method on the interactor and pass the resulting value to the view binding.

^
This is not yet an improvement, we've lost all of our testability, since the presentation behaviour is entirely contained in the activity.

^
But lets look at how we can use Kotlin to improve this.

---

RepoActivity.kt

```kotlin
class RepoActivity : AppCompatActivity() {

  private lateinit var binding: ActivityRepoBinding
  private lateinit var service: RepoService

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    binding = DataBindingUtil.setContentView(this, R.layout.activity_home)
    service = RepoServiceFactory().get()
  }

  override fun onResume() {
    super.onResume()
    service.fetch {
      binding.items = it
    }
  }
}
```

^
Kotlin allows us to create property delegates, that is basically a template for the getter and setter methods, dependent on whether the property is mutable, and we can then reuse this template for all properties like this.

^
We can use a property delegate to lazily instantiate our data binding

---

## TODO("Data Binding Layout")

---

ActivityBindingProperty.kt

```kotlin
class ActivityBindingProperty<out T : ViewDataBinding>(
  @LayoutRes private val resId: Int
) : ReadOnlyProperty<Activity, T> {

  private var binding: T? = null

  override operator fun getValue(thisRef: Activity, property: KProperty<*>): T {
    return binding ?: createBinding(thisRef).also { binding = it }
  }

  private fun createBinding(activity: Activity): T {
    return DataBindingUtil.setContentView(activity, resId)
  }
}
```

^
This behaviour is very similar to the standard lazy delegate provided to us in Kotlin, note that we're extending the read only property interface, denoting that this is an immutable value property.

^
Notice that we take the layout resource identifier as a parameter in order to correctly inflate the view, and the class is inferred by the generic type.

^
The activity reference is specified as this binding property may only exist on an activity instance, it's very important that the binding is instantiated lazily as view will not yet be inflated when the delegate is first instantiated, we have to be careful to only access this property after onCreate.

---

FragmentActivity.kt

```kotlin
fun <T : ViewDataBinding> FragmentActivity.activityBinding(@LayoutRes resId: Int): ActivityBindingProperty<T> {
  return ActivityBindingProperty(resId)
}
```

^
Naturally we should create an extension function to create our binding delegate

---

RepoActivity.kt

```kotlin
class RepoActivity : AppCompatActivity() {

  private lateinit var binding: ActivityRepoBinding
  private lateinit var service: RepoService

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    binding = DataBindingUtil.setContentView(this, R.layout.activity_home)
    service = RepoServiceFactory().get()
  }

  override fun onResume() {
    super.onResume()
    service.fetch {
      binding.items = it
    }
  }
}
```

^
Coming back to our activity, we can see how we can make it a little cleaner.

---

RepoActivity.kt

```kotlin, [.highlight: 3, 10]
class RepoActivity : AppCompatActivity() {

  private val binding: ActivityRepoBinding by activityBinding(R.layout.activity_repo)

  private lateinit var service: RepoService

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    service = RepoServiceFactory().get()
    binding.items = emptyList()
  }

  override fun onResume() {
    super.onResume()
    service.fetch {
      binding.items = it
    }
  }
}
```

^
This is much simpler, but remember if you don't reference the binding property during onCreate, the delegate will not create the binding and therefore will not inflate the layout.

---

### Introducing
## Android Architecture Components

![inline right](jetpack-hero.png)

^
Google announced the Android architecture components last year at Google IO, giving developers a basic framework of components to build projects with. Their introduction wasn't an instruction to migrate your existing application structure, but it did provide a clear endorsement.

^
Furthermore, with the announcement of Jetpack this year, Google have continued to solidify the framework with which we can start building an application quickly and effectively.

---

## MVVM

^
Data binding works beautifully with the suggested MVVM structure, since the pattern is designed to expose the view state to the view as an observable property, without having to instruct the view, it's nullability is irrelevant.

^
Thus allowing us to take advantage of lifecycle aware components, that can react accordingly to the presence or absence of a lifecycle owner such as an activity or fragment, and what state that activity or fragment might be in.

---

![inline](model-view-viewmodel.png)

^
MVVM works by allowing the view to observe the view model and utilise data binding to bind the view state onto itself, it can also notify it of UI events as a result of user interaction.

^
The view model would then be responsible for the business logic behaviour of fetching, manipulating, and formatting the domain model ready for consumption by the view.

^
In many cases it makes sense to build upon this pattern with the inclusion of new types, such as formatters, or binding adapters to isolate responsibility and reduce the complexity of your view model.

^
Most importantly, your view model should not contain any Android dependencies, this allows for easier testing that we lost from moving away from the abstracted interfaces.

^
Lets extract the behaviour from the activity with a view model.

---

RepoActivity.kt

```kotlin, [.highlight: 8-10]
class RepoActivity : AppCompatActivity() {

  private val binding: ActivityRepoBinding by activityBinding(R.layout.activity_repo)

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    binding.model = ViewModelProviders
        .of(this, RepoViewModelFactory())
        .get(RepoViewModel::class.java)
  }
}
```

^
Here we have the same activity, but fetching the view model from the view model providers implementation of the application compatibility activity.

^
We're assigning the resulting view model directly on the binding, but you might choose to keep it as a value on the activity so that you can directly observe a property should you need to.

---

RepoViewModel.kt

```kotlin
class RepoViewModel(private val service: RepoService) {

  private val jobs: Job = Job()

  val items: MutableLiveData<List<String>> = MutableLiveData()

  init {
    launch(UI, parent = jobs) {
      items.value = service.fetch("ashdavies")
    }
  }

  override fun onCleared() {
    jobs.cancel()
  }
}
```

---

RepoViewModel.kt

```kotlin, [.highlight: 5, 9]
class RepoViewModel(private val service: RepoService) {

  private val jobs: Job = Job()

  val items: MutableLiveData<List<String>> = MutableLiveData()

  init {
    launch(UI, parent = jobs) {
      items.value = service.fetch("ashdavies")
    }
  }

  override fun onCleared() {
    jobs.cancel()
  }
}
```

^


---

## TODO("ObservableField")

---

## TODO("Observable interfaces")

---

## TODO("LiveData LifeCycle DataBinding")

---

## TODO("ViewModel bound property binding")

---

## TODO("Stateful loading layout binding example")

---

## TODO("Stupidly complex stateful loading layout binding example")

---

## TODO("Databinding generated code")

---

## TODO("Databinding executePendingBindings (recyclerview usage)")

---

## TODO("SingleLayoutAdapter")

---

## TODO("Two-way databinding")

---

## TODO("Bindable annotation with notifyDataChanged")

---

## TODO("Binding extension properties")

---

## TODO("Generated code nullability")

---

## TODO("Generated code class transformers")

---

## TODO("Static binding adapters / companion objects")

---

## TODO("InverseBindingAdapters listeners")

---

## TODO("InverseBindingAdapters high order function")

---

## TODO("Generated databinding identifiers")

---

## TODO("Generated databinding after changing order of view classes")

---

## TODO("Creating generic view binding properties (view:visible)")

^
Also consider creating a visibility enum for LiveData

---

## TODO("Scoping specific view binding properties on custom views")

---

## TODO("BindingMethod / InverseBindingMethod")

---

## TODO("Recognition of class getter/setter")

---

## TODO("LiveData side-effects")
