# Deep Links 🔗

```xml, [.highlight: 10]
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
  package="com.example.myapplication">

  <application ... >

    <activity name=".ProfileActivity" ...>

        ...
        <nav-graph android:value="@navigation/main.xml" />
        ...
    </activity>
  </application>
</manifest>
```

^ Declare the relevant graph in your manifest to import

---

# Deep Links 🔗

```kotlin, [.highlight: 5-6]
<fragment 
  android:id="@+id/profile"
  android:name=".ProfileActivity">

  <deepLink android:autoVerify="true"
      app:uri="www.example.com/profile/{userId}" />
      
</fragment>
```

^ Define the deep link in your navigation graph destination

^ Define parameters as part of the URL to match the arguments

^ Include auto verify to enable link handling verification

---

# Deep Links 🔗

```kotlin, [.highlight: 5-6]
<fragment 
  android:id="@+id/profile"
  android:name=".ProfileActivity">

  <deepLink android:autoVerify="true"
      app:uri="www.example.com/profile/?userId={userId}" />
      
</fragment>
```

^ Adjust your URL to match your requirements if you need queries

---

[.footer ]

![](nice.gif)

---

# Deep Links 🔗
## Optional Args
### `2.2.0`

^ Deep links use regex matching under the hood, will ignore params if doesn't match exactlay

^ As of version 2.2.0 parameters evaluated as nullable types with default values

---

# Deep Links 🔗
## Implicit Links 🤝

^ Implementation for implicit deep links

^ Accessible by url navigation

^ Work best with app links

---

# Deep Links 🔗
## Explicit Links 🖕

^ Explicit deep links are built programmatically to produce a pending intent

^ Pending intents can be applied to notification, widget or view click listeners

---

# Deep Links 🔗
## Explicit Links 🖕

```kotlin
val pendingIntent = NavDeepLinkBuilder(context)
    .setGraph(R.navigation.nav_graph)
    .setDestination(R.id.android)
    .setArguments(args)
    .createPendingIntent()
```

^ Use the nav deep link builder to build a pending intent

---

# Deep Links 🔗
## Explicit Links 🖕

```kotlin
val pendingIntent = findNavController()
    .createDeepLink()
    .setDestination(R.id.android)
    .setArguments(args)
    .createPendingIntent()
```

^ Can also use NavController should already have navigation graph from host

^ Call `startActivites` from builder

---

# Navigation Styles 📐

^ Lets say your app uses an alternative navigation style

---

[.background-color: #e5e5e5]
[.text: #666666]

# Navigation Styles 📐
## Toolbar

![inline](title-navigation.png)![inline](contextual-toolbar.png)

^ The familiar toolbar navigation style and it's contextual variant

---

[.background-color: #e5e5e5]
[.text: #666666]

# Navigation Styles 📐
## Bottom

![inline](bottom-navigation.png)

^ The ever popular bottom navigation bar that has no become enshrined in Material design

^ The familiar toolbar navigation style and it's contextual variant

---

[.background-color: #e5e5e5]
[.text: #666666]

# Navigation Styles 📐
## Drawer

![inline](navigation-drawer.png)

^ The historically relevant navigation drawer allowing for extensible navigation items

---

# NavigationUI
## `setupWithNavController()`

^ Configuration of your navigation structure is provided with an AppBarConfiguration

^ Responsible for configuring top-level destinations with navigation drawer

---

```kotlin
class AwesomeActivity : AppCompatActivity() {

  private val controller: NavController by lazy(NONE) { findNavController(this, R.id.host) }
  private val drawer: DrawerLayout by lazy(NONE) { findViewById<DrawerLayout>(R.id.drawer) }
  private val toolbar: Toolbar by lazy(NONE) { findViewById<Toolbar>(R.id.toolbar) }
  
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.awesome_activity)

    toolbar.setupWithNavController(controller, drawer)
  }
}
```

^ In most cases this will be enough to configure a navigation drawer

^ Many other variations provided via NavigationUI and Kotlin extensions for other flavours

---

# NavigationUI

```kotlin
NavigationUI.setupActionBarWithNavController(
  activity: AppCompatActivity,
  controller: NavController,
  configuration: AppBarConfiguration
)

NavigationUI.setupWithNavController(
  toolbar: Toolbar,
  controller: NavController,
  configuration: AppBarConfiguration
)
```

^ Setup with actionBar retrieves ActionBar from Activity by getSupportActionBar

^ Both methods have variants for each different use case of DrawerLayout, CollapsingToolbar, Toolbar, and BottomSheet

^ Each variants constructs an appropriate `AppBarConfiguration` for use 

---

# NavigationUI: AppBarConfiguration

- Top level destinations

- Drawer layout

- Fallback "up" listener

^ AppBarConfiguration configures behaviour to top toolbar

^ Top level destinations (should not display back button)

^ Fallback on "up" listener for unhandled cases

^ Building class from extension of default parameters take graph root elements

---

# OnDestinationChangedListener
## NavController.addOnDestinationChangedListener

```kotlin
interface OnDestinationChangedListener {

  fun onDestinationChanged(
    controller: NavController,
    destination: NavDestination,
    arguments: Bundle?
  );
}
```

^ Not a closed API, functionality can be modified or handled specifically

---

# Bundles 📦

^ Despite having a better scope hierarchy some parameters need to be serialised

^ No different from activities or traditional fragments

---

## Plugin 🔌
# SafeArgs 💪

^ Simple concept, plugin enables generation of type safe args from your nav graph

^ Kotlin class, null safe, and provides defaults

^ Only use primitive or parcelable values

^ Mark with @Keep to keep after Proguard

---

# SafeArgs: Directions

## [fit] `MainFragmentDirections.mainToViewBalance()`

```xml
<fragment
  android:id="@+id/fragmentMain"
  android:name="com.google.sample.MainFragment"
  android:label="@string/main_title"
  tools:layout="@layout/main_fragment">

  <action
    android:id="@+id/mainToViewBalance"
    app:destination="@+id/fragmentViewBalance"/>

</fragment> 
```

^ Given example, safe args generates direction class for destinations with an action

^ Includes necessary arguments, graph changes will break compilation

---

# SafeArgs: Directions

```xml
<fragment
  android:id="@+id/fragmentViewBalance"
  android:name="com.google.sample.ViewBalanceFragment"
  android:label="@string/view_balance_title"
  tools:layout="@layout/view_balance_fragment">
  
  <argument
    android:name="balanceAmount"
    app:argType="integer"/>

</fragment>
```

^ Lets add an argument to the view balance fragment

^ This will update the generated direction class to take the argument

^ Will also generate an args class on the destination to deserialise

---

# SafeArgs: Args

[.code-highlight: 7, 17-18]

```kotlin
class MainFragment: Fragment() {
  
  override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    super.onViewCreated(view, savedInstanceState)

    viewTransactionsButton.setOnClickListener { view ->
      MainFragmentDirections.mainToViewBalance(100)
    }
  }
}

class ViewBalanceFragment : Fragment() {
  
  override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    super.onViewCreated(view, savedInstanceState)

    val args = ViewBalanceFragmentArgs.fromBundle(arguments!!)
    balance.setText(String.format("%.2d", args.balanceAmount))
  }
}
```

^ Must now pass a parameter to the main fragment direction

^ Deserialise in the receiving balance fragment used the extras

---

# SafeArgs: Generated Args 💻

```kotlin
data class ViewBalanceFragmentArgs(val balanceAmount: Int) : NavArgs {
    @Suppress("CAST_NEVER_SUCCEEDS")
    fun toBundle(): Bundle {
        val result = Bundle()
        result.putInt("balanceAmount", this.balanceAmount)
        return result
    }

    companion object {
        @JvmStatic
        fun fromBundle(bundle: Bundle): FinanceBorrowerFragmentArgs {
            bundle.setClassLoader(FinanceBorrowerFragmentArgs::class.java.classLoader)
            val __balanceAmount : Int
            if (bundle.containsKey("balanceAmount")) {
                __balanceAmount = bundle.getInt("balanceAmount")
            } else {
                throw IllegalArgumentException("Required argument \"balanceAmount\" is missing and does not have an android:defaultValue")
            }
            return FinanceBorrowerFragmentArgs(__balanceAmount)
        }
    }
}
```

^ As with most generated code, it's not always so pretty to look at, but it's consistent and reliable

^ Simple operations serialise the data correctly, and has support for enums, parcelables and other primitive types

^ Nothing magical here, except reliable and scalable

---

# SafeArgs: Generated Directions 💻

```kotlin
class MainFragmentDirections private constructor() {
  private data class MainToViewBalance(val balanceAmount: Int) : NavDirections {
    override fun getActionId(): Int = R.id.mainToViewBalance

    @Suppress("CAST_NEVER_SUCCEEDS")
    override fun getArguments(): Bundle {
      val result = Bundle()
      result.putInt("balanceAmount", this.index)
      return result
    }
  }

  companion object {
    fun mainToViewBalance(balanceAmount: Int): NavDirections = BorrowerToBorrower(index, financeBorrower)
  }
}
```

^ Again not very exciting, but we can be certain that our serialisation will happen correctly

---

# Single Source of Truth

^ By defining your navigation graph as a resource

^ Resource acts as a single source of truth

^ Not open to interpretation by calling activities

---

# SafeArgs: Activities 🎉🍾

^ Also works with activity destinations

^ Can use plugin immediately

---

# SafeArgs: Activities

```kotlin
class MainActivity : Activity {

  override fun onCreate(savedInstanceState: Bundle) {
    super.onCreate(savedInstanceState)
    
    val args = ViewBalanceActivityArgs(100)
    val intent = Intent(this, ViewBalanceActivity::class.java)
    
    startActivity(intent, bundle.toBundle())
  }
}
```

^ Destinations class not generated for destinations without navigation host

^ Directly use args class for intent bundle

---

# 🛠 Migrating

^ How should you migrate to the paging library

---

[.footer: © Fox Entertainment]

![](careful.gif)

^ With any migration, carefully

---

# 🛠 Migrating

^ May be Difficult with heavy use of activities

^ Use safeargs for activity arguments

^ Decide on benefit of migration

---

# 🛠 Migrating

![](cheese-list.png)
![](cheese-details.png)

^ Consider on the left an activity to display a list

^ and on the right an activity to view the details

---

# 🛠 Migrating

## Move screen behaviour away from activities

^ Should already be using an architecture to keep modular components separate

^ Following single responsibility principle keep activity logic abstract

^ Recommended approach to use view models

---

# 🛠 Migrating

## Create new activity for `Fragment`'s

^ Blank activity to host fragments 

^ Can be achieved with a FrameLayout

^ Will later become host to navigation graph

---

# 🛠 Migrating

## Move existing activity logic to fragment

- FragmentBindings -> ActivityBindings

- `onCreate()` -> `onCreateView()`

- `onViewCreated()`

- `getViewLifecycleOwner()`

^ - Update layouts for fragments with databinding layouts changing

^ - Don't include toolbar of other navigation layouts in Fragment

^ - onCreate becomes onCreateView to inflate your layout with parent and state

^ - Move post view creation behaviour to onViewCreated()

^ - ViewLifecycyleOwner should be used instead of Fragment

^ - Inconsistencies of view lifecycle for retained fragments

---

# 🛠 Migrating

## Initialise fragment in host activity

---

# Initialise fragment in host activity

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
  super.onCreate(savedInstanceState)
  setContentView(R.layout.main_activity)

  if (savedInstanceState == null) {
    supportFragmentManager
            .beginTransaction()
            .add(R.id.main_content, CheeseListFragment())
            .commit()
  }

  fun navigateToDetails(productId: String) {
    /* ... */
  }
}
```

^ No more complicated than adding a fragment to your host

---

# Pass arguments as necessary

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
  super.onCreate(savedInstanceState)
  setContentView(R.layout.main_activity)

  if (savedInstanceState == null) {
    val fragment = CheeseListFragment() // 🧀
    fragment.arguments = intent.extras

    supportFragmentManager
        .beginTransaction()
        .add(R.id.main_content, fragment)
        .commit()
  }

  fun navigateToDetails(productId: String) {
    /* ... */
  }
}
```

---

# 🛠 Migrating

## Create navigation graph

---

# Create navigation graph

```
<navigation xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    app:startDestination="@+id/cheeseGraph">

  <fragment
      android:id="@+id/cheeseListFragment"
      android:name="com.sample.CheeseListFragment"
      android:label="@string/cheese_list_title"
      tools:layout="@layout/cheese_list_fragment" />

  <fragment
      android:id="@+id/cheeseDetailsFragment"
      android:name="com.sample.CheeseDetailsFragment"
      android:label="@string/cheese_details_title"
      tools:layout="@layout/cheese_details_fragment" />

</navigation>
```

---

# Create navigation host

```
<fragment
   android:id="@+id/main_content"
   android:layout_width="match_parent"
   android:layout_height="match_parent"
   android:name="androidx.navigation.fragment.NavHostFragment"
   app:navGraph="@navigation/main_graph"
   app:defaultNavHost="true" />
```

^ Default implementation for a fragment host

^ Indicate nav graph with attribute

^ Default nav host requires no further initialisation

---

# 🛠 Migrating

```
class MainHostActivity : AppCompatActivity() {

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.main_activity)
  }
}
```

^ Activity no longer needs the navigate to list method

^ Can be included with directions and arguments

---

## Navigation Directions

```xml, [.highlight: 11-13, 23-25]
<navigation xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    app:startDestination="@+id/cheeseListFragment">

  <fragment
      android:id="@+id/cheeseListFragment"
      android:name="com.sample.CheeseListFragment"
      android:label="@string/cheese_list_title"
      tools:layout="@layout/cheese_list_fragment">
  
    <action
        android:id="@+id/navigateToDetails"
        app:destination="@+id/cheeseDetailsFragment"/>

  </fragment>

  <fragment
      android:id="@+id/cheeseDetailsFragment"
      android:name="com.sample.CheeseDetailsFragment"
      android:label="@string/cheese_details_title"
      tools:layout="@layout/cheese_details_fragment">
  
    <argument
      android:name="itemId"
      app:argType="string" />
    
  </fragment>

</navigation>
```

^ Include argument and action to navigation graph

^ Action indicates direction from fragment

^ Argument implies dependency for next fragment

---

# CheeseListFragment 🧀

```
class CheeseListFragment : Fragment() {
  ...
  override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    binding
      .productsList
      .adapter = ListAdapter(clickCallback)
  }
  ...

  // The callback makes the call to the activity to make the transition.
  private val clickCallback = ClickCallback { item ->
    val directions = MainDirections.navigateToDetails(item.id)
    findNavController().navigate(directions)
  }
}
```

---

# 💰 Profit

---

# onActivityResult?

^ Activity and fragment onActivityResult still available for calling other activities

^ Communication within graph better achieved with shared ViewModel LiveData Event

---

# [fit] ⭐️ issuetracker.google.com/issues/79672220

^ Development announced at ADS more coming soon

^ Star this issue, do not comment +1

---

# LiveData<Event<T>>
## bit.ly/2YuSYXi

^ Using an event with LiveData from Jose Alcérreca

^ Communicate safely with navigation commands

^ Not executed again after configuration change

---

# Dynamic Features

## bit.ly/navigation-dynamic

^ Dynamic features can be installed at runtime so compile time support is limited

^ Starting to see support with this after ADS but it's still early access

^ Deep links, safe args, navigation editor in dynamic graphs not yet supported

---

[.background-color: #ffffff]
[.text: #444444]
[.footer: ]

# [fit] Single Activity: Why, When, and How 
## bit.ly/2Jo94x9

![inline](ian-lake-single-activity.jpg)

^ Ian covers how to take advantage of single activity

^ How you take advantage of that structure and migrate to it

---

[.background-color: #f1f6d2]
[.text: #444444]
[.footer: ]

# [fit] Fragments: Past, present future
## bit.ly/fragments-ads-19

![inline](fragments-past-future-present.jpg)

---

# Thanks! 🍻

![right](aerial-shot-ship.jpg)
