autoscale: true
build-lists: true
footer: @askashdavies
footer-style: Open Sans
header: Open Sans
slidenumbers: true
slide-transition: true
theme: Plain Jane, 3
text: Open Sans

![right inline 15%](immobilienscout24.png)

## [fit] Implementing the Paging Library
### Droidcon NYC

![left inline 30%](gde-badge-round.png)

![right](blurred-books.jpg)

---

[.footer: ]

![inline](reddit-sfw.png) ![inline](twitter-sfw.png) ![inline](youtube-sfw.png) ![inline](feedly-sfw.png)

^ Nearly all applications display lists of data

^ Surprisingly hard to find SFW screenshots

^ Simple concept but many hidden complexities

---

# Up-To-Date

![right 25%](pull-to-refresh.png)

^ Ensure that you deliver the latest content

^ Should poll for updates or push notifications

---

# Offline

![right 25%](offline-screenshot.png)

^ How should your content behave when offline

---

# State

![right 25%](empty-state.png)

^ How to accurately represent state to users

---

[.background-color: #eae9ea]
[.text: #666666]

# Progress

![autoplay right](loading-indicator.mp4)

^ Indicate progress and network operations

---

# 🛠 🕰

^ How could we have handled this before paging?

---

# `ListView`

```xml
<ListView
    android:id="@+id/list_view"
    android:layout_width="match_parent"
    android:layout_height="match_parent" />
```

^ From Android API 1 we had the ListView for lists

^ Displays a vertically scrollable collection of views

---

# `ArrayAdapter`

```kotlin
// extends BaseAdapter>

list.adapter = ArrayAdapter<String>(
    context, 
    R.layout.simple_list_item_1, 
    arrayOf("Kotlin", "Java" /* ... */)
)
```

^ It was enough in most cases to use the ArrayAdapter

^ Extends BaseAdapter providing filtering comparator for Strings

---

# BaseAdapter

```kotlin
class ListAdapter : BaseAdapter() {

  override fun getView(position: Int, convertView: View, container: ViewGroup) {
    val view = convertView ?: layoutInflater.inflate(
        R.layout.simple_list_item_1, 
        container, 
        false
    )
        
    convertView
        .findViewById(R.id.text1)
        .text = getItem(position)
            
    return convertView
  }
}
```

^ More complex data types required extending the base adapter

^ Inflation of view and binding of types in same method

---

# BaseAdapter

```kotlin, [.highlight: 3-7, 9, 11]
class ListAdapter() : BaseAdapter() {

  var items: List<String> = emptyList()
    set(value) {
      field = value
      notifyDataSetChanged()
    }

  override fun getCount(): Int = items.size

  override fun getItem(position: Int): String = items[position]
    
  override fun getView(position: Int, convertView: View, container: ViewGroup) {
    /* ... */
  }
}
```

^ Additionally we would have to implement retrieval of items

^ Notification of data invalidation

---

# Paging

^ How would you handle infinite scrolling with a list view?

---

# Paging
## OnScrollListener

^ Attach a scroll listener to listen for scroll events

^ Detect if the user has scrolled sufficiently and load data

^ Really unreliable and blindly updating data

---

# BaseAdapter / ListView

- Manages list of it's own data
- Manages view inflation and configuration
- Notify entire data set of change
- Not capable of diffing items

^ What else do we have available

---

# RecyclerView

![right 75%](recycler-view.png)

^ Now included in AndroidX, introduced with support library in April 2015

^ Independent of Android platform, though AndroidX requires 28

^ Previous artifacts available via Maven if you're really unlucky

---

# RecyclerView

![right 75%](card_travel.png)

^ `RecyclerView` more advanced and flexible version of `ListView`

^ Minimal implementation, focused primarily on recycling

^ Much more efficient, doesnt have to handle extras

^ Though OnClickListener, and item dividers handled manually

---

# Paging
## `AsyncListUtil` 

^ Many early paging attempts achieved with Cursor to load chunks

^ Would avoid querying on the UI thread and keep memory overhead low

^ Optimised for low memory usage, raw cursor access, struggles with large datasets

^ No way of managing data invalidation, crash if previous items removed

---

ListAdapter

- Takes immutable lists
- Provides animated updates
- Computes diff in background
- Released in support lib 27.1
- See also AsyncListDiffer

^ How to migrate to the ListAdapter from standard RecyclerView.Adapter

---

# ItemCallback

```kotlin
abstract class ItemCallback<T> {
    
  abstract fun areItemsTheSame(oldItem: T, newItem: T): Boolean

  abstract fun areContentsTheSame(oldItem: T, newItem: T): Boolean
}
```

^ Null assumed to be the same and not equal to not null value

^ areContentsTheSame only called if areItemsTheSame returns true for both

^ areItemsTheSame used to compare unique identifiers

---

![inline 100%](jetpack-hero.png)

^ Last year Google introduced us to Android JetPack which included a variety of tools

^ Dedicated to helping us bootstrap Android development

^ Opinionated and clean implementations for common problems

^ With the additional of compartmentalising the support library fragment 

^ Renaming support dependencies to androidx and starting with independent versioning 

---

[.background-color: #ffffff]
[.text: #666666]

# Android JetPack
## Foundation Components

![inline 100%](foundation-components.png)

^ Foundation picking up where the support library left off

^ Including ktx helpers, multidexing, and security

---

[.background-color: #ffffff]
[.text: #666666]

# Android JetPack
## Architecture Components

![inline 100%](architecture-components.png)

^ Architecture components like LiveData and ViewModel

^ Navigation, paging, and room persistence

---

[.background-color: #ffffff]
[.text: #666666]

# Android JetPack 
## Behaviour Components

![inline 100%](behaviour-components.png)

^ Media playback, notifications, permissions, and slices

---

[.background-color: #ffffff]
[.text: #666666]

# Android JetPack
## UI Components

![inline](ui-components.png)

^ Finally UI, including Fragments, Transitions, Animations, and Emoji

---

# Android JetPack
## Paging 

![right 100%](jetpack-hero.png)

^ Introducing JetPack

^ JetPack is...

---

## Android JetPack: Paging ![](jetpack-hero.png)

- DataSource ⛲️
- PagedList 📑
- PagedListAdapter ⚙️

^ Like many of the JetPack components, paging built from three fundamental parts

^ `DataSource` base class for loading data with relevant subclasses

^ `PagedList` implements list to manage loading of data from `DataSource`

^ Finally `PagedListAdapter` to present loaded data and manage diffing

---

# Paging ❤ Room

---

# PagedList<T> : List<T>

- Loads data asynchronously
- Backed by a DataSource

---

# PagedList.Config

```kotlin
val config: PagedList.Config = PagedList.Config.Builder()
    .setEnablePlaceholders(true)
    .setInitialLoadSizeInt(50)
    .setPrefetchDistance(10)
    .setPageSize(20)
    .build()

val data: LiveData<PagedList<T>> = LivePagedListBuilder(factory, config)
    .build()
```

---

# Placeholders

- Users can scroll past whats loaded
- Scrollbars look correct
- Don't need loading spinner

---

# Placeholders

- Items should be same size
- Adapter must handle null items
- DataSource must count items

---

# RxJava
## RxHavaPagedListBuilder()

- `buildObservable()`
- `buildFlowable()`

---

[.footer: github.com/chrisbanes/tivi/blob/master/data-android/src/main/java/app/tivi/data/FlowPagedListBuilder.kt]

# Coroutines
## FlowPagedListBuilder()

---

# PositionalDataSource

- Able to scroll to different elements
- Load initial with start position
- Returns position with total count
- Load range with start position

---

# ItemKeyedDataSource

- List of names from `DataSource`
- Item key indicates positon
- Works well for ordered lists

---

# PageKeyedDataSource

---

# Source of truth

- Consistent data presentation
- Simple process - need more, load more
- Gracefully degrades on failure
- Optionally refresh on observe

---

# Database + Network

- Needs out of data signal from DB
- Triggers network load from DB
- Paging calls BoundaryCallback

---

## Thanks!

![right](blurred-books.jpg)
