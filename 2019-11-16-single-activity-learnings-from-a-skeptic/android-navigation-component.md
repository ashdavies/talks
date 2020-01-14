autoscale: true
build-lists: true
footer: ![](twitter-logo.png) @askashdavies
footer-style: Open Sans
header: Open Sans
slide-transition: true
theme: Plain Jane, 3
text: Open Sans

![right inline 15%](immobilienscout24.png)

# [fit] Navigation and the Single Activity
## Learnings from a Skeptic
### DevFest Coimbra 🇵🇹

![left inline 20%](gde-badge-round.png)

![right](aerial-shot-ship.jpg)

^ Skepticism on fragments

^ Disliked fragments

^ Fragment hate

---

![](developing-hard.png)

^ Navigation is hard

^ Misnomer not great start to talk

^ Often a topic of confusion, difficult for new developers

^ Navigating from screen to screen being fundamental to your app

---

[.background-color: #ffffff]

![75%](starting-activity.png)

^ But this is just moving from one activity to the next?

^ What makes navigation so confusing?

^ Android Framework components

^ Activity, content providers, services and broadcast receivers

---

```kotlin
class MainActivity : AppCompatActivity {

  private val message: EditText
    get() = findViewById(R.id.message)
    
  override fun onCreate(savedInstanceState: Bundle) {
    /* ... */
  }
  
  fun sendMessage() {
    val intent = Intent(this, DisplayMessageActivity::class.java)
    intent.putExtra(DisplayMessageActivity.EXTRA_MESSAGE, message.text.toString())
    startActivity(intent)
  }
}
```

^ Simplest form, use Intent to navigate from one activity to the next

^ Activities dependent on other activity implementations

^ Store complex intent argument compositions

^ Conditional navigation difficult to maintain

---

# 😰

^ Hard to manage as your application grows in size

---

> ## "Once we have gotten in to this entry-point to your UI, we really don't care how you organise the flow inside."
-- Dianne Hackborn, Android Framework team, 2016

^ 2016 back when Google Plus was still a thing

^ Controversial, framework not opinionated, does not care about app structure

^ Once activity started, you can handle the flow

---

# 🍯 🐝

^ Honeycomb (14) breaks up screens into Fragments

^ Build richer, more interactive user interfaces

^ Beginning of design orientated thinking

---

[.background-color: #ebebeb]
[.footer: ]

![inline](contacts_full.png)

^ Demonstrated with a master / detail interface

^ Responsive layout for larger screens (tablets)

---

[.background-color: #ffffff]
[.text: #666666]

![150%](tablet-handset-fragments.png)

^ An example of two fragments can be combined into one activity for a tablet design

^ Separated for a handset design, "also run properly on smaller screen devices"

---

```java
public class MainActivity extends FragmentActivity {

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.news_articles);

    // Check that the activity is using the layout version with the fragment_container FrameLayout
    if (findViewById(R.id.fragment_container) != null) {

      // However, if we're being restored from a previous state, then we don't need to do anything,
      // and should return or else we could end up with overlapping fragments.
      if (savedInstanceState != null) {
        return;
      }

      // Create a new Fragment to be placed in the activity layout
      HeadlinesFragment firstFragment = new HeadlinesFragment();
    
      // In case this activity was started with special instructions from an
      // Intent, pass the Intent's extras to the fragment as arguments
      firstFragment.setArguments(getIntent().getExtras());

      // Add the fragment to the 'fragment_container' FrameLayout
      getSupportFragmentManager()
        .beginTransaction()
        .add(R.id.fragment_container, firstFragment)
        .commit();
    }
  }
}
```

^ Sample from Android documentation, not yet in Kotlin

---

```java, [.highlight: 18, 22, 25-28]
public class MainActivity extends FragmentActivity {

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.news_articles);

    // Check that the activity is using the layout version with the fragment_container FrameLayout
    if (findViewById(R.id.fragment_container) != null) {

      // However, if we're being restored from a previous state, then we don't need to do anything,
      // and should return or else we could end up with overlapping fragments.
      if (savedInstanceState != null) {
        return;
      }

      // Create a new Fragment to be placed in the activity layout
      HeadlinesFragment firstFragment = new HeadlinesFragment();
    
      // In case this activity was started with special instructions from an
      // Intent, pass the Intent's extras to the fragment as arguments
      firstFragment.setArguments(getIntent().getExtras());

      // Add the fragment to the 'fragment_container' FrameLayout
      getSupportFragmentManager()
        .beginTransaction()
        .add(R.id.fragment_container, firstFragment)
        .commit();
    }
  }
}
```

^ Fragments added / removed using fragment transactions

^ More complex than starting an Activity

---

```java, [.highlight: 11-15]
public class MainActivity extends FragmentActivity {

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.news_articles);

    // Check that the activity is using the layout version with the fragment_container FrameLayout
    if (findViewById(R.id.fragment_container) != null) {

      // However, if we're being restored from a previous state, then we don't need to do anything,
      // and should return or else we could end up with overlapping fragments.
      if (savedInstanceState != null) {
        return;
      }

      // Create a new Fragment to be placed in the activity layout
      HeadlinesFragment firstFragment = new HeadlinesFragment();
    
      // In case this activity was started with special instructions from an
      // Intent, pass the Intent's extras to the fragment as arguments
      firstFragment.setArguments(getIntent().getExtras());

      // Add the fragment to the 'fragment_container' FrameLayout
      getSupportFragmentManager()
        .beginTransaction()
        .add(R.id.fragment_container, firstFragment)
        .commit();
    }
  }
}
```

^ Additional state issues with checking for activity recreation

^ We can get overlapping fragments after configuration change.

---

# [fit] Activity Lifecycle != Fragment Lifecycle

^ Not just creation and use of fragments that included more complexity

^  Introduced more complex lifecycle behaviour than with Activities

---

## Activity Lifecycle != Fragment Lifecycle != View Lifecycle

![right](confused-meme.jpg)

^ Fragment lifecycle being detached from an activity makes view lifecycle even more complicated

---

[.footer: github.com/JoseAlcerreca/android-lifecycles/blob/a5dfd030a70989ad2496965f182e5fa296e6221a/cheatsheetfragments.pdf]
[.footer-style: #666666]
[.background-color: #ffffff]

![inline](fragment-lifecycle.png)

^ Jose Alcerreca | Lifecycle cheat sheet beta1 (AndroidP/Jetpack 1.0)

---

# ⬆️ ⬆️ ⬇️ ⬇️ ⬅️ ➡️️ ⬅️ ➡️️ ⏮ ⏭

^ Explicitly invoke addToBackStack or add on transactions

^ Can mess up back stack if not implemented correctly

^ Invalid stack, unexpected behaviour on configuration change.

^ Does anybody recognise this sequence?

---

![](konami-code.gif)

^ Actually the Konami cheat code

---

### (`supportFragmentManager` || `childFragmentManager`)?

^ Fragments allow adding fragments inside fragments

^ Used for nested view pagers inside fragments

^ Former can leak context if used inside fragments

---

![100%](fragment-communication.png)

^ Communication between fragments is quite difficult

^ Previously check for interface onAttach or use event bus

---

# Bundles 📦

^ Like activities we must let the system manage instance

^ Serialisation of data provided through bundles

^ Android framework needs to instantiate components

^ Shouldn't use fragment constructors 

---

# FragmentFactory
## androidx.fragment:fragment:1.1.0

^ As of 1.1.0 you can set a FragmentFactory on any FragmentManager

^ Control how new Fragment instances are instantiated

---

# Fragments? 🙀

^ These are pretty compelling arguments to avoid Fragments in general

^ Tempted to use pure Activity sequences or other alternatives

^ Many alternative architecture options created, Mortar / Flow

---

# Fragments? 🤔

^ There may be some good reasons to use Fragments

---

# Activity Capabilities ⏳

^ Activity capabilities tied to API version, need to wait for new features

^ Activity features in new versions of Android cannot be backported

---

## Shared Element Transition (API 21+)

![right 80% autoplay loop](shared-element-animation.mp4)

^ eg SharedElementTransitions only available on API 21 and above

^ Compat shims only provide graceful failure saving API checks

---

## CompatShims < Enough

^ Sometimes demonstrated erratic visual behaviour

^ Hidden gotchas, don't guarantee consistent user experience

---

## ~~android.app.Fragment~~
# [fit] `androidx.fragment.app.Fragment`

^ Native Android fragment deprecated in API 28

^ Fragments entirely in androidx can be updated per app

---

# Scopes 🔍

^ One of the real benefits comes in the form of scoping

---

[.background-color: #ffffff]
[.text: #666666]

# Scopes

![inline](activity-isolated.png)

^ Sharing instances or resources across different activities is difficult

^ Each activity exists in isolation without much of a larger scope

---

[.background-color: #ffffff]
[.text: #666666]

# Scopes

![inline](application-activity-scope.png)

^ Dependency graphs include resources only for a few screens

^ Survive for the entire duration in the application scope

---

[.background-color: #ffffff]
[.text: #666666]

# Scopes

![inline](application-fragment-scope.png)

^ With usage of a third framework type scopes can be nested

^ Shared data can be provided by activity scope by ViewModel

---

#  🤔🧁

^ So how can we have our cake and eat it?

^ To benefit from the features available in fragments

^ Without suffering from the difficulties of using them

---

![inline 100%](jetpack-hero.png)

^ Last year Google introduced us to Android JetPack which included a variety of tools

^ Dedicated to helping us bootstrap Android development

^ Opinionted and clean implementations for common problems

^ With the additional of comparmentalising the support library fragment 

^ Renaming support dependencies to androidx and starting with independent versioning 

---

# Android JetPack
## Navigation

![right 25%](jetpack-hero-navigation.png)

^ Introducing JetPack

^ JetPack is a set of...

---

## Android JetPack: Navigation
# Libraries 📚

---

## Android JetPack: Navigation
# Plugin 🔌

---

## Android JetPack: Navigation
# Tooling 🔧

^ Unifying and simplifying Android Navigation

---

# Android JetPack: Navigation

- Fragment transactions
- Up and back actions
- Standardised transition resources
- Deep link implementation
- Easy navigation patterns
- Type safe arguments

^ Handles all the common parts of navigation patterns

^ Easy handing of patterns like drawers or bottom navigation

---

# Principles of Navigation

^ Navigation core part of UX, principles set consistent / intuitive UX

^ Designed to implement principles of navigation by default

---

[.background-color: #ffffff]
[.text: #666666]

# Fixed Start Destination

![inline](navigation-principles-start-destination.png)

^ Every app has a fixed start destination

^ First and last screen pressing the back button

---

# State as Stack 🥞

^ Navigation state is represented as a stack of destinations

^ Representation history of the user flow that can be reversable and replayable

---

# ⬆️ ⬅️

^ Up and back are identical within your apps task

---

# ⬆️ 🙅‍♀️

^ Up never exist your application

---

[.background-color: #ffffff]
[.text: #666666]

# Deep Link Simulates Manual Navigation

![inline](navigation-principles-deep-linking.png) 

^ Back stack will be created as though you had navigated there yourself

---

# Android JetPack
## Navigation

![right 25%](jetpack-hero-navigation.png)

^ Primary ideal of Navigation is to use existing an accessible APIs

^ Not private or limited by library scope

^ as mentioned, built from three components

---

# Navigation: Tooling 🔧
# Navigation Graph

![](navigation-graph_2x-callouts.png)

^ Android Studio 3.3 introduces the new navigation editor as tooling

^ graphical editor to build your application navigation graph

^ composed of...

---

[.background-color: #2d3032]
[.footer: ]

![inline](navigation-editor-destinations.png)

^ First, destinations to the left showing the host and graph hierarchy

^ destinations can be an activity, fragment, dialog, or custom view

---

[.background-color: #2d3032]
[.footer: ]

![inline](navigation-editor-graph.png)

^ Second, graph editor contains a visual representation showing how the destinations interact

^ the arrows indicate actions which can be invoked programmatically

---

[.background-color: #2d3032]
[.footer: ]

![inline](navigation-editor-attributes.png)

^ each destination has attributes displayed on the right

^ attributes allow you to configure arguments and deeplinks

---

**nav_graph.xml**

```xml
<navigation xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:id="@+id/navigation"
    app:startDestination="@+id/fragmentMain">

  <fragment
      android:id="@+id/fragmentMain"
      android:name="com.google.sample.MainFragment"
      android:label="@string/main_title"
      tools:layout="@layout/main_fragment">

    <action
        android:id="@+id/mainToViewBalance"
        app:destination="@+id/fragmentViewBalance"/>

  </fragment>

  <fragment
      android:id="@+id/fragmentViewBalance"
      android:name="com.google.sample.ViewBalanceFragment"
      android:label="@string/view_balance_title"
      tools:layout="@layout/view_balance_fragment" />

</navigation>
```

^ But if you're like me and prefer to hand code you can create your graph in xml too

---

# Destination Types

- Activity `<activity>`

- Fragment `<fragment>`

- Dialog `<dialog>` (2.1.0+)

^ Navigation destinations can be an activity, fragment, or dialog

---

# Destination Types (Custom)
## [fit] developer.android.com/guide/navigation/navigation-add-new

- Extend `Navigator<T>` with your type

- Provide `Destination` implementation

- Configure arguments after inflation

- Augment `NavController`

^ If you have a destination not covered by these common framework types

^ You can provide a custom navigator to instruct navigation on how to navigate

^ Things like handling back stack and how to instantiate elements

---

# Resource Inflation 🎈

^ Navigation resource being an XML document subject to same lint rules as layouts, compile time validation of resource names, etc

^ Inflates the resource at runtime, thus resulting in graph errors at runtime with bad references

^ Negligible inflation cost, part of your layouting

---

## Navigation: Libraries 📚
# NavHostFragment

```xml
<fragment
    android:id="@+id/nav_host_fragment"
    android:name="androidx.navigation.fragment.NavHostFragment"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    app:defaultNavHost="true"
    app:navGraph="@navigation/nav_graph" />
```

^ Fragment widget that will act as a host for your destinations

^ Compatible only with Fragments as the navigation

^ Lifecycle, configuration, animations handled automatically

^ Navigation hosts all movement and screens

---

## Navigation: Libraries 📚
# NavController

- `Fragment.findNavController()`

- `View.findNavController()`

- `Activity.findNavController(viewId: Int)`

^ Each NavHostFragment has controller that allows you to invoke navigation actions 

^ NavController object manages navigation within navigation host

^ NavController can be retrieved from fragment, activity, or view

---

# Actions

```kotlin
viewTransactionsButton.setOnClickListener { view ->
   view.findNavController().navigate(R.id.viewTransactionsAction)
}
```

```kotlin
button.setOnClickListener(
    Navigation.createNavigateOnClickListener(R.id.next_fragment, null)
)
```

^ Recommended mechanism to navigate with `navigate` method and `@IdRes`

^ With controller, navigate to action defined in navigation graph

^ Alternatively create navigation listener to retrieve view controller

---

```xml
<activity
    android:name="com.example.android.GizmosActivity"
    android:label="@string/title_gizmos" >
    <intent-filter android:label="@string/filter_view_http_gizmos">
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <!-- Accepts URIs that begin with "http://www.example.com/gizmos” -->
        <data android:scheme="http"
              android:host="www.example.com"
              android:pathPrefix="/gizmos" />
        <!-- note that the leading "/" is required for pathPrefix-->
    </intent-filter>
    <intent-filter android:label="@string/filter_view_example_gizmos">
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <!-- Accepts URIs that begin with "example://gizmos” -->
        <data android:scheme="example"
              android:host="gizmos" />
    </intent-filter>
</activity>
```

^ Who loves creating intent filters in their Android manifest?

---

[.background-color: #000000]
[.footer: ]

![fit](nah.gif)

---

# Deep Links 🔗

![right](oh-really.gif)

^ The navigation component can generate deep link intent filters for you

---

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
