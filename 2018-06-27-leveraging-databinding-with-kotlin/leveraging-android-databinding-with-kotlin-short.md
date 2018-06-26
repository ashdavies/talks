footer: ashdavies.io
autoscale: true

![right inline 15%](immobilienscout24.png)

# Leveraging Android Databinding<br /> with Kotlin

^ - Speaker introduction.

^ - Avatar bemusement.

---

## What is Data Binding?

![right](confused-cat.jpg)

^ - Beta released Google IO 2015.

^ - Support library binds UI to data declaratively not programmatically.

^ - Potentially convoluted, used effectively reduces presentation boilerplate.

^ - V2 includes incremental pre-compilation class generation from AGP 3.2.

---

## Data Binding

```kotlin
class RepoActivity : AppCompatActivity() {

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_repo)
  }

  override fun onResume() {
    super.onResume()
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

  override fun onResume() {
    super.onResume()
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

  override fun onResume() {
    super.onResume()
  }
}
```

^ - From AGP 3.1 data binding is lifecycle aware, allowing lifecycle components.

^ - Inform binding of lifecycle owner to manage lifecycle subscription.

---

## Data Binding

```kotlin, [.highlight: 4, 12, 17]
internal class Repoactivity : AppCompatActivity() {

  private lateinit var binding: ActivityRepoBinding
  private lateinit var service: RepoService

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    binding = DataBindingUtil.setContentView(this, R.layout.activity_repo)
    binding.setLifecycleOwner(this)

    service = RepoServiceFactory().get()
  }

  override fun onResume() {
    super.onResume()
    service.fetch { binding.items = it }
  }
}
```

^ - Finally domain behaviour passes items to view binding

---

## Data Binding

```kotlin
class RepoActivity : AppCompatActivity() {

  private lateinit var binding: ActivityRepoBinding
  private lateinit var service: RepoService

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    binding = DataBindingUtil.setContentView(this, R.layout.activity_home)
    binding.setLifecycleOwner(this)

    service = RepoServiceFactory().get()
  }

  override fun onResume() {
    super.onResume()
    service.fetch { binding.items = it }
  }
}
```

^ - Not yet an improvement, presentation behaviour contained in activity

^ - How can we use Kotlin to improve it.

---

## Delegated Properties

^ - Reduce boilerplate property accessors with delegated properties.

^ - Create template for getter and setter to reuse elsewhere.

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

---

## Delegated Properties

```kotlin
class ActivityBindingProperty<out T : ViewDataBinding> : ReadOnlyProperty<Activity, T> {

  override operator fun getValue(thisRef: Activity, property: KProperty<*>): T {
    TODO("not implemented")
  }
}
```

^ - Our binding property is an immutable value so we need ReadOnlyProperty.

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

^ - Lazily instantiate the data binding when retrieving value.

---

## ProTip: Extension Function!

```kotlin, [.highlight: 3, 20-22]
class RepoActivity : AppCompatActivity() {

  private val binding by activityBinding<ActivityRepoBinding>(R.layout.activity_repo)

  private lateinit var service: RepoService

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    binding.setLifecycleOwner(this)

    service = RepoServiceFactory().get()
  }

  override fun onResume() {
    super.onResume()
    service.fetch { binding.items = it }
  }
}

fun <T : ViewDataBinding> FragmentActivity.activityBinding(
  @LayoutRes resId: Int
) = ActivityBindingProperty(resId)
```

^ - Kotlin property delegates are provided via extension function.

^ - Reads nicely when written from receiving class.

^ - Binding must be referenced in onCreate otherwise layout will not be inflated.

^ - Domain behaviour still not testable.

---

### Introducing
## Android Architecture Components

![inline right](jetpack-hero.png)

^ - Google announced architecture components last year at Google IO.

^ - Announced JetPack this year to quickly build framework applications.

---

## Model-View-ViewModel

^ - Suggestion design pattern for fresh projects.

^ - Data binding works well with MVVM, view state designed to be observed.

^ - Lifecycle aware components react accordingly to presence of owner.

^ - View observes VM state, notifies VM of user interaction or intent.

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

^ - Domain behaviour now removed from activity

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

^ - Activity VM store retrieved from non configuration instance in onCreate.

---

## ProTip: Extension Function!

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

## ViewModel

```kotlin
class RepoViewModel(service: RepoService) : ViewModel {

  val items: ObservableField<List<String>> = ObservableField()

  init {
    service.fetch(items::set)
  }
}
```

^ - Data Binding provides observable class wrappers to notify of data changes

^ - Primitive types: Boolean, Byte, Char, Short, Int, Long, Float, Double, Parcelable.

---

## Observable

^ - Implement observable interface to add and remove property change listeners.

^ - Extending from BaseObservable to implement property change listeners.

^ - Extend from this for complex objects, usefulness apparent later.

---

## LiveData Data Binding

^ - From AGP 3.1 Live Data can be used with Data Binding with lifecycle owner

---

## LiveData Data Binding

```kotlin, [.highlight: 3]
class RepoViewModel(service: RepoService) : ViewModel {

  val items = MutableLiveData<List<String>>()

  init {
    service.fetch(items::setValue)
  }
}
```

^ - Unlike observables LiveData lifecycle aware

^ - Provides additional benefits like value post, transformations.

---

## ProTip: Extension Functions!

```kotlin, [.highlight: 3, 10]
class RepoViewModel(service: RepoService) : ViewModel {

  val items = mutableLiveData<List<String>>()

  init {
    service.fetch(items::setValue)
  }
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

^ - Introduce basic asynchronous operation to update loading and item state.

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

---

## Layout Expressions

```xml, [.highlight: 6]
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

## Simple Property Bindings

^ - Prefer single property bindings.

^ - Business behaviour more easily testable.

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

## `@BindingMethod`

^ - Data Binding can detect simple properties like visibility.

^ - Binding methods can be specified for other properties.

^ - How can we apply logic?

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

## ProTip: Extension Property!

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

---

## `@Bindable`

^ - Remember ObservableField extends BaseObservable?

^ - Applied to generated binding properties from layout.

^ - BaseObservable uses PropertyChangeRegistry.

^ - Can be applied to any accessor or property.

^ - Result generates Bindable resources.

---

## `@Bindable`

### ObservableViewModel

^ - Create Bindable VM properties by extending from Observable interface.

---

## `@Bindable`

### PropertyChangeRegistry

^ - BaseObservable uses property change registry to add and remove notification listeners.

---

## `@Bindable`

```kotlin
abstract class BaseObservableViewModel : ViewModel(), Observable {

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

^ - Remember our delegated properties.

^ - Reduce boilerplate property accessors with delegated properties.

^ - Create template for getter and setter to reuse elsewhere.

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

  override fun afterChange(property: KProperty<*>, oldValue: T, newValue: T) {
    observable.notifyPropertyChanged(id)
  }
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

## `@Bindable`

```kotlin, [.highlight: 3-4]
class RepoViewModel(private val service: RepoService) : ObservableViewModel() {

  @get:Bindable 
  var items by bindable<List<String>>(emptyList(), BR.items)
    private set

  val items = mutableLifeDataOf<List<String>>()

  init {
    service.fetch(items::setValue)
  }
}

fun <T> ObservableViewModel.bindable(initial: T, id: Int): BindableProperty<T> = BindableProperty(initial, this, id)
```

^ - Extension function to create bindable property.

^ - Use reflection to look up BR property identifier.

---

## Data Binding Sample
### github.com/ashdavies/data-binding

![inline](data-binding-resample.png)

^ - Updated project demonstrates techniques in this talk

^ - Code is open source available on GitHub

---

## Additional Resources

---

- **Android Data Binding Library samples**
Google Samples - [bit.ly/2MK5GMb]
<br />

- **Make your view-model properties great again**
Aiden McWilliams - [bit.ly/2llVVHz]
<br />

- **MVVM, Viewmodel and architecture components**
Danny Preussler - [bit.ly/2yxvGay]
<br />

- **Android Data Binding: RecyclerView**
George Mount - [https://bit.ly/2IgwY9w]
<br />

^ - Google provides some examples on how to use layout expressions, binding adapters, animations, and inverse converters.

^ - Aiden mcwilliams wrote a great article covering the bindable property delegates which I covered in this talk, and I highly suggest you go check it out.

^ - Danny had a cool talk last year covering the architecture components, which work really well with data binding.

^ - Finally, George Mount covered how you can use data binding with the recycler view to create a single layout adapter that I've demonstrated in the sample project.

---

## Android Databinding with Kotlin
### bit.ly/coming-soon

^
Finally, all of these slides are available on GitHub

---

## Cheers! 🍻
