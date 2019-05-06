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

^ graph editor contains a visual representation showing how the destinations interact with each other,

^ the arrows indicate actions which can be invoked programmatically,

^ each destination has attributes displayed on the right,

^ attributes allow you to configure arguments, and deep links.

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

### `NavController.navigate(R.id.viewTransactionsAction)`

^ From there you instruct the controller to navigate to an action defined in your navigation graph

---

## SafeArgs

---

When using the safeargs plugin in your project, you can add arguments to your destinations in your navigation graph to generate a type safe args class in Kotlin, that has default arguments and null safety to boot.

---

The navigation library also provides extensions for configuring BottomNavigationView simply and easily.

---

## Deep Link

---

The navigation library also allows you to easily configure deep linking by specifying a deep link in your navigation graph, which will be automatically includes in your manifest.

---

[Migration to Navigation Component]

---

[FragmentFactory]

---

Works natively with Activity and Fragment, and with custom views should you wish to define your own destinations.

---

Using an Activity as a larger scope with nested destination scopes, being able to share data across screens using ViewModel's or otherwise.


---

Fragments are an implementation of this destination concept, whilst mired with lifecycle issues, allowing the navigation component to handle the back stack makes this simple.
