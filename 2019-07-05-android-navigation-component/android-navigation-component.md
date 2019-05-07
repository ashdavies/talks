footer: @askashdavies
autoscale: true
build-lists: true
header: Open Sans
text: Open Sans
footer-style: Open Sans

![right inline 15%](immobilienscout24.png)

## Android JetPack
### Navigation Component

![left inline](gde-badge-round.png)

![right](aerial-shot-ship.jpg)

---

Navigation is hard.

^ Starting off with a misnomer like this might not seem like a great start to a talk.

---

![](developing-hard.png)

^ Often a topic of confusion and difficult for new developers to grasp,

^ With navigating from screen to screen being such a fundamental part of your android app,

^ Why is this, what makes navigation so confusing?

---

[.background-color: #ffffff]

![75%](starting-activity.png)

^ In the beginning we had activities, 

^ like content providers, services and broadcast receivers, 

^ activities are an Android level component.

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

^ In it's simplest form you would have an Android Activity, and would use an Intent to navigate from one to the other.

^ but this gets quickly out of hand in larger projects.

---

## 😰

^ Activities knowing about other activity implementations,

^ Putting and retrieving complex intent extra compositions,

^ Conditional navigation becoming difficult to maintain.

---

## 🔍 Scoping

^ When building large applications you might have dependencies that need to survive a few screens,

^ expensive repositories, databases, network clients, or in-memory persisted data,

---

[.background-color: #ffffff]

![100%](application-scope.png)

^ Since you need to pass data from one activity to the next,

^ dependency graphs with repositories, databases only needed for a few screens,

^ survive for the entire duration in the application scope.

---

> ## "Once we have gotten in to this entry-point to your UI, we really don't care how you organise the flow inside."
-- Dianne Hackborn, Android Framework team

^ Quite controversial, but framework isn't opinionated, and does not care about the structure of your application,

^ Once your activity is started, you can handle the flow however you see fit.

---

## 🍯 🐝

^ With Android 3.0 (Honeycomb) developers could break up screens into Fragments,

^ in order to build richer, more interactive user interfaces.

---

[.background-color: #ebebeb]
[.footer: ]

![fit](contacts_full.png)

^ Demonstrated with a master / detail interface, 

^ responsive layout for use with larger screens such as tablets,

^ "also run properly on smaller screen devices".

---

```java
public class MainActivity extends FragmentActivity {

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.news_articles);

    // Check that the activity is using the layout version with
    // the fragment_container FrameLayout
    if (findViewById(R.id.fragment_container) != null) {

      // However, if we're being restored from a previous state,
      // then we don't need to do anything and should return or else
      // we could end up with overlapping fragments.
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

^ Sample provided from the Android documentation, not available yet in Kotlin,

^ Fragments would be added, and removed using fragment transactions, 

^ quite a bit more complex than starting an Activity.

---

[.footer: ]
[.background-color: #ffffff]

![fit](fragment-lifecycle.png)

^ but would introduce a much more complex lifecycle behaviour than what we have been used to with Activities.

^ link provided with slide sources

^ https://github.com/JoseAlcerreca/android-lifecycles/blob/a5dfd030a70989ad2496965f182e5fa296e6221a/cheatsheetfragments.pdf

---

## ➡️ ⬆️ ➡️ ⬅️ ➡️

^ Furthermore if not implemented correctly, it's really easy to mess up your back stack,

^ leading to invalid stack and unexpected behaviour on configuration change.

---

![100%](fragment-communication.png)

^ Additionally communication between fragments is quite difficult,

^ different mechanisms such as checking for interface implementation onAttach,

^ dispatching data through an event bus.

---

## JetPack: Navigation

![right 100%](jetpack-hero.png)

^ JetPack is...

---

## 📚 Libraries

---

## 🔌 Plugin

---

## 🔧 Tooling

^ for unifying and simplifying Android Navigation

---

- Fragment transactions
- Up and back actions
- Standardised transition resources
- Deep link implementation
- Easy navigation patterns
- Type safe arguments

^ Handles all the common facets of navigation patterns

^ Easy navigation patterns such as navigation drawers or bottom navigation

---

## Principles of Navigation

^ The navigation component is designed to implement the principles of navigation by default

^ So you don't have to worry about breaking guideline patterns

---

[.background-color: #ffffff]

## Fixed Start Destination

![inline](navigation-principles-start-destination.png)

^ Every app has a fixed start destination

^ First and last screen pressing the back button

---

## 🥞

^ Navigation state is represented as a stack of destinations

^ Representation history of the user flow

---

## ⬆️ ⬅️

^ Up and back are identical within your apps task

---

## ⬆️ 🙅‍♀️

^ Up never exist your application

---

[.background-color: #ffffff]

## Deep linking simulates manual navigation

![inline](navigation-principles-deep-linking-2.png) 

^ Back stack will be created as though you had navigated there yourself

---

## JetPack: Navigation

![right 100%](jetpack-hero.png)

^ To getting started with JetPack you'll need to familiarise yourself with three components

---

## Navigation Graph

![](navigation-graph_2x-callouts.png)

^ Android Studio 3.3 introduces the new navigation editor, 

^ allowing you to utilise a graphical editor to build your application navigation graph.

---

[.background-color: #2d3032]
[.footer: ]

![inline](navigation-editor_2x.png)

^ Destinations are listed on the left showing the host and graph hierarchy,

^ destinations can be an activity, fragment, or your own custom view implementation,

^ graph editor contains a visual representation showing how the destinations interact with each other,

^ the arrows indicate actions which can be invoked programmatically,

^ each destination has attributes displayed on the right,

^ attributes allow you to configure arguments, and deep links.

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

## NavHostFragment

```xml
<fragment
    android:id="@+id/nav_host_fragment"
    android:name="androidx.navigation.fragment.NavHostFragment"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    app:defaultNavHost="true"
    app:navGraph="@navigation/nav_graph" />
```

^ Simply a fragment widget that will act as a host for each of your fragment destinations,

^ compatible only with Fragments as the navigation library can easily navigate between screens,

^ lifecycle, configuration, animations handled for you automatically.

---

## NavController

- `Fragment.findNavController()`

- `View.findNavController()`

- `Activity.findNavController(viewId: Int)`

^ Each NavHostFragment has a controller that allows you to invoke navigation actions 

^ NavController can be retrieved from fragment, activity, or view.

---

## Actions

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

^ The recommended mechanism to navigate is with the navigate method with a resource ID,

^ After retrieving the controller you can navigate to an action defined in your navigation graph,

^ Alternatively you can create a navigation listener which will retrieve the view controller.

---

## 💪 SafeArgs

^ As mentioned earlier the navigation component includes a plugin,

^ this plugin enabled generation of type safe argument classes from your navigation graph,

^ generates Kotlin class, null safe, and provides defaults

^ Only use primitive or parcelable values

^ Mark with @Keep to keep after Proguard

---

## SafeArgs: Directions

### [fit] `MainFragmentDirections.mainToViewBalance()`

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

^ Safeargs will generate a directions class for each destination where an action originates,

^ In our navigation graph the fragment is defined as MainFragment and action mainToViewBalance,

^ Useful since it will include necessary arguments and will break if you adjust your graph.

---

## SafeArgs: Directions

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

## SafeArgs: Args

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

^ Here we must now pass a parameter to the main fragment direction,

^ which we can deserialise in the receiving balance fragment used the extras.

---

## SafeArgs: Activities 🎉🍾

^ SafeArgs also work with activity destinations so you can immediately make use of the plugin

---

## SafeArgs: Activities

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

^ Instead of using a destinations class since it will not be generated you can directly instantiate the args

---

## SafeArgs: Getting Started

```gradle
buildscript {
  repositories {
    google()
  }
  
  dependencies {
    classpath "androidx.navigation:navigation-safe-args-gradle-plugin:2.0.0"
  }
}

apply plugin: 'androidx.navigation.safeargs.kotlin'
```

---

## 🛠 Migrating

^ Making use of the navigation library might be difficult if you're already heavily using activities,

^ can already make use of safeargs to generate your activity arguments,

^ should probably decide whether you need to.

---

## 🛠 Migrating

- Move screen behaviour away from activities

- Create new activity for NavHostFragment

- Move existing activity logic to fragment

- Initialise fragment in host activity

- Pass arguments as necessary

- Create navigation graph

- Profit

^ Convert activity to fragment and include within navigation graph

^ Invoke navigation manually without using NavHost or NavController

^ Slowly move single activity/fragment pairs into larger navigation graph

---

## 🔍 Scoping

^ Remember earlier with the application scope being too large for a flow of activities?

---

[.background-color: #ffffff]

![100%](application-scope.png)

---

[.background-color: #ffffff]

![50%](application-destination-scope.png)

^ Introducing destinations with our navigation graph means we can share data with activity view models

---

[.footer: ]

## Ian Lake: Single Activity: Why, When, and How 
### bit.ly/2Jo94x9

![inline](ian-lake-single-activity.jpg)

^ Ian goes covers the topic of the Single Activity and how you take advantage of that structure and migrate to it.

---

## New Features: 2.1.0-alpha2

> You can now create ViewModels that are scoped at a navigation graph level via the by `navGraphViewModels()` property delegate for Kotlin users or by using the `getViewModelStore()` API added to `NavController`. b/111614463

^ When using large navigation graphs, you can choose to structure your architecture by graph instead of by activity,

^ instead of retrieving your ViewModel from your activity or fragment you can store it in a scope between the two.

---

## Thanks!

![right](aerial-shot-ship.jpg)
