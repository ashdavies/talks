footer: ashdavies.io
slidenumbers: true
autoscale: true

![right inline 15%](immobilienscout24.png)

# Leveraging Android Databinding<br /> with Kotlin

^ - Speaker introduction.

---

## What is Data Binding?

![right](confused-cat.jpg)

^ - Support lib binds UI components to data sources declaratively not programmatically.

^ - Potentially powerful and complex, used effectively reduces presentation boilerplate.

---

## Data Binding Beta
### 2015

^ - Google announced beta release as support library can be used with Android 2.1 (API 7).

^ - Write declarative layouts, minimise glue code to bind application logic and layouts.

---

## Data Binding v2

^ AGP 3.1.0 includes the new Data binding compiler to generate bindings

---

## Data Binding v2

### Incremental class generation ⚡

^ Incremental class generation to speed up your build times

---

## Data Binding v2

### Incremental class generation ⚡

### Pre-compilation class generation 💪

^ Generates abstract bindings prior to managed compiler build.

^ Classes available even if you bugger up your build.

---

## Data Binding

```kotlin
class RepoActivity : AppCompatActivity() {

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_repo)
  }
}
```

^ - Starting with basic usage of data binding

---

## Data Binding

```kotlin, [.highlight: 3, 8]
class RepoActivity : AppCompatActivity() {

  private lateinit var binding: ActivityRepoBinding

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    binding = DataBindingUtil.setContentView(this, R.layout.activity_repo)
  }
}
```

^ - Store replaced framework setContentView with data binding util

---

## Data Binding

```kotlin, [.highlight: 9]
internal class RepoActivity : AppCompatActivity() {

  private lateinit var binding: ActivityRepoBinding

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    binding = DataBindingUtil.setContentView(this, R.layout.activity_repo)
    binding.setLifecycleOwner(this)
  }
}
```

^ - From AGP 3.1 data binding is lifecycle aware, allowing lifecycle components.

^ - Inform binding of lifecycle owner to manage lifecycle subscription.

---

## Data Binding

```kotlin
class RepoActivity : AppCompatActivity() {

  private lateinit var binding: ActivityRepoBinding

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    binding = DataBindingUtil.setContentView(this, R.layout.activity_home)
    binding.setLifecycleOwner(this)
  }
}
```

^ - How can we use Kotlin to improve it this.

^ - Lets start with the binding.

---

## Delegated Properties

![right](business-cat.png)

^ - Kotlin allows us to use delegated properties.
 
^ - Create template for getter and setter to reuse.

^ - Reduce boilerplate property accessors.

---

## Delegated Properties

```kotlin
val value: String by lazy {
  println("computed!")
  "Hello"
}
```

^ - Kotlin Lazy delegate would compute the value once.

^ - Delegate indicated with use of "by" keyword.

---

## Delegated Properties

```kotlin
interface ReadOnlyProperty<in R, out T> {
  operator fun getValue(thisRef: R, property: KProperty<*>): T
}

interface ReadWriteProperty<in R, T> {
  operator fun getValue(thisRef: R, property: KProperty<*>): T
  operator fun setValue(thisRef: R, property: KProperty<*>, value: T)
}
```

^ - Two interfaces for delegated properties for val and var.

^ - Binding property is immutable.

---

## Delegated Properties

```kotlin
class ActivityBindingProperty<out T : ViewDataBinding>(
) : ReadOnlyProperty<Activity, T> {

  override operator fun getValue(thisRef: Activity, property: KProperty<*>): T {
    TODO("not implemented")
  }
}
```

^ - Our binding property is an immutable value so we need ReadOnlyProperty.

^ - Create binding property with activity as receiver.

^ - Like extension functions must be created with receiver.

---

## Delegated Properties

```kotlin, [.highlight: 2, 5, 8, 11-13]
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

^ - Take layout resource identifier as constructor.

^ - Lazily instantiate the data binding when retrieving value.

^ - Use data binding util from activity.

---

## ProTip: Extension Function! 👍

```kotlin, [.highlight: 3, 11-13]
class RepoActivity : AppCompatActivity() {

  private val binding by activityBinding<ActivityRepoBinding>(R.layout.activity_repo)

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    binding.setLifecycleOwner(this)
  }
}

fun <T : ViewDataBinding> FragmentActivity.activityBinding(
  @LayoutRes resId: Int
) = ActivityBindingProperty(resId)
```

^ - Kotlin property delegates are provided via extension function.

^ - Reads nicely when written from receiving class.

^ - Binding must be referenced in onCreate otherwise layout will not be inflated.

^ - Introduce architecture.

---

### Introducing
## Android Architecture Components

![inline right](jetpack-hero.png)

^ - Google announced architecture components last year at Google IO.

^ - Announced JetPack this year to quickly build framework applications.

^ - Including LiveData and ViewModel working well with MVVM design pattern.

---

## Model-View-ViewModel

^ - Not an instruction to migrate application architecture.

^ - Suggestion design pattern for fresh projects.

^ - Data binding works well with MVVM, view state designed to be observed.

^ - Multiple or no observers, view nullability (if destroyed) irrelevant.

^ - Lifecycle aware components react accordingly to presence of owner.

---

![inline](model-view-viewmodel.png)

^ - VM state bound to view by observation.

^ - View notifies VM of UI events from user interaction.

^ - VM responsible for business logic behaviour.

^ - No Android dependencies.

---

## Model-View-ViewModel

```kotlin
class RepoActivity : AppCompatActivity() {

  private val binding by activityBinding<ActivityRepoBinding>(R.layout.activity_repo)

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    binding.setLifecycleOwner(this)
  }
}
```

^ - Need to apply model to binding.

---

## Model-View-ViewModel

```kotlin, [.highlight: 9-11]
class RepoActivity : AppCompatActivity() {

  private val binding by activityBinding<ActivityRepoBinding>(R.layout.activity_repo)

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
 
    binding.setLifecycleOwner(this)
    binding.model = ViewModelProviders
        .of(this, RepoViewModelFactory())
        .get(RepoViewModel::class.java)
  }
}
```

^ - View model retrieved from AppCompatActivity VM providers.

^ - Factory to instantiate if VM not already created.

^ - Activity VM store retrieved from non configuration instance in onCreate.

---

## ProTip: Extension Function! 👍

```kotlin, [.highlight: 9, 13-15]
class RepoActivity : AppCompatActivity() {

  private val binding by activityBinding<ActivityRepoBinding>(R.layout.activity_repo)

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
 
    binding.setLifecycleOwner(this)
    binding.model = getViewModel(RepoViewModelFactory())
  }
}

inline fun <reified T : ViewModel> FragmentActivity.getViewModel(
  factory: ViewModelProvider.Factory = ViewModelProvider.NewInstanceFactory()
) = ViewModelProviders.of(this, factory).get(T::class.java)
```

^ - Create an extension function to create VM from activity.

^ - NewInstanceFactory attempts to invoke no-arg constructor.

^ - Binding and VM created in onCreate function.

---

## Model-View-ViewModel

```kotlin, [.highlight: 4, 10, 12]
class RepoActivity : AppCompatActivity() {

  private val binding by activityBinding<ActivityRepoBinding>(R.layout.activity_repo)
  private val model by lazy { getViewModel<RepoViewModel>(RepoViewModelFactory()) }

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    binding.setLifecycleOwner(this)
    binding.model = model
  
    // val items = model.items.get()
  }
}
```

^ Combine with lazy instantiation to observe binding.

^ Binding and VM created in onCreate function.

---

## ViewModel

```kotlin
class RepoViewModel(service: RepoService) : ViewModel {

  val items: ObservableField<List<String>> = ObservableField()

  fun query(value: String) {
    service.fetch(value, items::set)
  }
}
```

^ - Data Binding provides observable class wrappers to notify of data changes

^ - Primitive types: Boolean, Byte, Char, Short, Int, Long, Float, Double, Parcelable.

---

## Observable

```kotlin, [.highlight: 3]
class RepoViewModel(service: RepoService) : ViewModel {

  val items: ObservableField<List<String>> = ObservableField()

  fun query(value: String) { /* ... */ }
}
```

^ - Implement observable interface to add and remove property change listeners.

^ - Extending from BaseObservable to implement using property change registry.

^ - Extend from this for complex objects, usefulness apparent later.

---

## LiveData Data Binding

![left](rainbow-tears.gif)

^ - From AGP 3.1 Live Data can be used with Data Binding with lifecycle owner

---

## LiveData Data Binding

```kotlin, [.highlight: 3]
class RepoViewModel(service: RepoService) : ViewModel {

  val items = MutableLiveData<List<String>>()

  fun query(value: String) { /* ... */ }
}
```

^ - ObservableField listeners notified regardless of lifecycle state.

^ - Unlike observables LiveData lifecycle aware, more granular control.

^ - Provides additional benefits, transformations, lifecycle owner observation.

---

## ProTip: Extension Functions! 👍

```kotlin, [.highlight: 3, 8]
class RepoViewModel(service: RepoService) : ViewModel {

  val items = mutableLiveData<List<String>>()

  fun query(value: String) { /* ... */ }
}

fun <T> ViewModel.mutableLiveDataOf() = MutableLiveData<T>()
```

^ - If familiar with Kotlin mutableListOf create for LiveData

^ - Minor changes like this help make your code more consistent, and readable.

---

## ViewModel

```kotlin
class RepoViewModel(private val service: RepoService) : ViewModel {

  val items = mutableLiveDataOf<List<String>>()

  fun query(value: String) {
    service.fetch(value) {
      items.value = it
    }
  }
}
```

^ - Basic asynchronous operation to fetch repos from service given user as query.

^ - Assume appropriate threading implementation.

---

## ViewModel

```kotlin, [.highlight: 4, 7, 10]
class RepoViewModel(private val service: RepoService) : ViewModel {

  val items = mutableLiveDataOf<List<String>>()
  val loading = mutableLiveDataOf<Boolean>()

  fun query(value: String) {
    loading.value = true
    
    service.fetch(value) {
      loading.value = false
      items.value = it
    }
  }
}
```

^ - Show a progress bar to indicate loading state.

---

## Layout Expressions

```xml, [.highlight: 6, 14-15]
<layout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto">

  <data>

    <import type="android.view.View"/>

    <variable
        name="model"
        type="io.ashdavies.databinding.RepoViewModel"/>

  </data>

  <ProgressBar...
      android:visibility="@{model.loading ? View.VISIBLE : View.GONE}"/>

</layout>
```

^ - Data Binding subscribes to the view model state.

^ - Progress bar visibility updated from loading boolean.

^ - Boolean two state transformed to three state visibility.

^ - Must import View for variable usage in binding expressions.

---

## Layout Expressions

```xml, [.highlight: 14-15]
<layout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto">

  <data>

    <import type="android.view.View"/>

    <variable
        name="model"
        type="io.ashdavies.databinding.RepoViewModel"/>

  </data>

  <TextView...
      android:text="@string/activity_repo_empty"/>

  <ProgressBar...
      android:visibility="@{model.loading ? View.VISIBLE : View.GONE}"/>

</layout>
```

^ - What if we want to display an empty state?

---

## Layout Expressions

```xml, [.highlight: 14-16]
<layout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto">

  <data>

    <import type="android.view.View"/>

    <variable
        name="model"
        type="io.ashdavies.databinding.RepoViewModel"/>

  </data>

  <TextView...
      android:text="@string/activity_repo_empty"
      android:visibility="@{model.items.count == 0 ? View.VISIBLE : View.GONE}"/>

  <ProgressBar...
      android:visibility="@{model.loading ? View.VISIBLE : View.GONE}"/>

</layout>
```

^ - Data Binding allows evaluation statements in binding expressions.

^ - Would also show when state is loading.

---

## Layout Expressions

```xml, [.highlight: 14-16]
<layout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto">

  <data>

    <import type="android.view.View"/>

    <variable
        name="model"
        type="io.ashdavies.databinding.RepoViewModel"/>

  </data>

  <TextView...
      android:text="@string/activity_repo_empty"
      android:visibility="@{model.items.count == 0 &amp;&amp; !model.loading ? View.VISIBLE : View.GONE}"/>

  <ProgressBar...
      android:visibility="@{model.loading ? View.VISIBLE : View.GONE}"/>

</layout>
```

^ - Include check for loading state.

^ - Binding expressions must escape html entities.

^ - Obvious problem.

---

## Too Complicated!

^ - Easy to end up with complicated binding expressions.

^ - Pollutes layouts with business logic.

^ - Misuse of toolset discourages developers.

![](complicated.gif)

---

```kotlin
class RepoViewModel(private val service: RepoService) : ViewModel {

  val items = mutableLiveDataOf<List<String>>()
  val loading = mutableLiveDataOf<Boolean>()
  val empty = mutableLiveDataOf<Boolean>()
  
  fun query(value: String) {
    loading.value = true
    empty.value = true
    
    service.fetch(value) {
      items.value = it
      empty.value = it.isEmpty()
      loading.value = false  
    }
  }
}
```

^ - Whilst duplicitous, becomes easily testable.

---

```xml, [.highlight: 14-16]
<layout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto">

  <data>

    <import type="android.view.View"/>

    <variable
        name="model"
        type="io.ashdavies.databinding.RepoViewModel"/>

  </data>

  <TextView...
      android:text="@string/activity_repo_empty"
      android:visibility="@{model.empty ? View.VISIBLE : View.GONE}"/>

  <ProgressBar...
      android:visibility="@{model.loading ? View.VISIBLE : View.GONE}"/>

</layout>
```

^ - Already an improvement, but we can do better.

---

## `@BindingAdapter`

^ - Data Binding allows specification of binding adapters

^ - Additional logic for bindings

---

## `@BindingAdapter`

```kotlin
@BindingAdapter("goneUnless")
fun goneUnless(view: View, visible: Boolean) {
  view.visibility = if (visible) View.VISIBLE else View.GONE
}
```

^ - Binding allows removal of layout conditional statement

^ - Testable function

---

## ProTip: Extension Property! 👍

```kotlin
@set:BindingAdapter("isVisible")
inline var View.isVisible: Boolean
  get() = visibility == View.VISIBLE
  set(value) {
    visibility = if (value) View.VISIBLE else View.GONE
  }
```

^ - Extension property from KTX library.

^ - Also available programmatically.

---

## `@BindingAdapter`

```xml, [.highlight: 14-16, 18-19]
<layout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto">

  <data>

    <import type="android.view.View"/>

    <variable
        name="model"
        type="io.ashdavies.databinding.RepoViewModel"/>

  </data>

  <TextView...
      android:text="@string/activity_repo_empty"
      app:isVisible="@{model.empty}"/>

  <ProgressBar...
      app:isVisible="@{model.loading}"/>

</layout>
```

^ - XML good, VM could be improved.

^ - We can do better!

---

## `@Bindable`

![](bindable.gif)

^ - Remember ObservableField extends BaseObservable?

^ - BaseObservable uses PropertyChangeRegistry.

^ - Applied to generated binding properties from layout.

^ - Can be applied to any accessor or property.

^ - Result generates Bindable resources identifier like Android R.

---

## `@Bindable`

### ObservableViewModel

^ - Create bindable VM properties by extending from Observable interface.

---

## `@Bindable`

### PropertyChangeRegistry

^ - BaseObservable uses property change registry to add and remove notification listeners.

---

## `@Bindable`

```kotlin
abstract class ObservableViewModel : ViewModel(), Observable {

  private val callbacks: PropertyChangeRegistry = PropertyChangeRegistry()

  override fun addOnPropertyChangedCallback(callback: Observable.OnPropertyChangedCallback) {
    callbacks.add(callback)
  }

  override fun removeOnPropertyChangedCallback(callback: Observable.OnPropertyChangedCallback) {
    callbacks.remove(callback)
  }

 fun notifyChange() {
    callbacks.notifyCallbacks(this, 0, null)
  }

 fun notifyPropertyChanged(fieldId: Int) {
    callbacks.notifyCallbacks(this, fieldId, null)
  }
}
```

^ - Observable implementation allows callback registration.

^ - Notify methods invoke callbacks on property change registry.

^ - Notify all properties as changed.

^ - Notify individual field granular control.

---

## `@Bindable`


```kotlin, [.highlight: 1]
class RepoViewModel(private val service: RepoService) : ObservableViewModel {

  val items = mutableLiveDataOf<List<String>>()
  val loading = mutableLiveDataOf<Boolean>()

  fun query(value: String) {
    loading.value = true
    
    service.fetch(value) {
      loading.value = false
      items.value = it
    }
  }
}
```

^ - Extend view model from observable view model.

^ - Lets change items to a bindable property.

---

## `@Bindable`

```kotlin, [.highlight: 3-8]
class RepoViewModel(private val service: RepoService) : ObservableViewModel {

  @get:Bindable
  var items: List<String> = emptyList()
    private set(value) {
      notifyPropertyChanged(BR.items)
      field = value
    }
      
  val loading = mutableLiveDataOf<Boolean>()

  fun query(value: String) {
    loading.value = true
    
    service.fetch(value) {
      loading.value = false
      items = it
    }
  }
}
```

^ Advantage of actual property over a wrapper class.

^ Private setter restricts modification.

^ Verbose boilerplate.

^ We can do better.

---

## `@Bindable`
### Delegated Properties

![right](business-cat.png)

^ - Remember our delegated properties.

^ - Reduce boilerplate property accessors with delegated properties.

^ - Create template for getter and setter to reuse elsewhere.

---

## Property Delegate
### ObservableProperty

---

## `@Bindable`

```kotlin
class BindableProperty<T>(
  initial: T, private val observable: ObservableViewModel, private val id: Int
) : ObservableProperty<T>(initial) {

  override fun beforeChange(
    property: KProperty<*>, oldValue: T, newValue: T
  ): Boolean = { /* ... */ }

  override fun afterChange(
    property: KProperty<*>, oldValue: T, newValue: T
  ) { /* ... */ }
}
```

^ - Extend observable property to manage observable notifications

---

## `@Bindable`

```kotlin, [.highlight: 5-7]
class BindableProperty<T>(
  initial: T, private val observable: ObservableViewModel, private val id: Int
) : ObservableProperty<T>(initial) {

  override fun beforeChange(
    property: KProperty<*>, oldValue: T, newValue: T
  ): Boolean = oldValue != newValue

  override fun afterChange(
    property: KProperty<*>, oldValue: T, newValue: T
  ) { /* ... */ }
}
```

^ - First callback indicates whether property change is allowed.

^ - Useful to prevent two-way binding loops.

---

## `@Bindable`

```kotlin, [.highlight: 9-11]
class BindableProperty<T>(
  initial: T, private val observable: ObservableViewModel, private val id: Int
) : ObservableProperty<T>(initial) {

  override fun beforeChange(
    property: KProperty<*>, oldValue: T, newValue: T
  ): Boolean = oldValue != newValue

  override fun afterChange(property: KProperty<*>, oldValue: T, newValue: T) {
    observable.notifyPropertyChanged(id)
  }
}
```

^ Second notifies observable of property change.

---

## ProTip: Extension Function! 👍
### `@Bindable`

```kotlin, [.highlight: 3-5, 14-16]
class RepoViewModel(private val service: RepoService) : ObservableViewModel() {

  @get:Bindable 
  var items by bindable<List<String>>(emptyList(), BR.items)
    private set

  val items = mutableLifeDataOf<List<String>>()

  init {
    service.fetch(items::setValue)
  }
}

fun <T> ObservableViewModel.bindable(initial: T, id: Int): BindableProperty<T> {
  return BindableProperty(initial, this, id)
}
```

^ - Extension function to create bindable property.

^ - Aiden McWilliams demonstrates this technique in blog post.

^ - Use reflection to look up BR property identifier.

---

## 🎉 Awesome! 🎉

^ Many more techniques can be applied with Kotlin and data binding.

---

## Data Binding Sample
### github.com/ashdavies/data-binding

![inline](data-binding-resample.png)

^ - Updated project demonstrates techniques in this talk

^ - More ways to reference bindings including mediator live data.

^ - Code is open source available on GitHub

---

## Android Data Binding with Kotlin
### bit.ly/2yU8qUz

^ Finally, all of these slides are available on GitHub

---

## Cheers! 🍻

### ![](twitter.png) _ashdavies
