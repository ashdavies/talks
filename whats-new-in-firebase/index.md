![inline 25%](firebase.png)

# What's New in Firebase!
### Ash Davies

![inline 25%](immobilienscout24.png)

---

## [fit] What's Firebase?

^ What is Firebase? If you've been away from the scene for a while or you're just not familiar no sweat.

^ Direct from the source, this is how Google describes Firebase.

^ Firebase is a mobile platform that helps you quickly

---

![fit](develop-backdrop.png)

## Develop

^ develop high quality apps,

---

![fit](grow-backdrop.png)

## Grow

^ grow your user base,

---

![fit](earn-backdrop.png)

## Earn

^ and earn more money,

^ Firebase is made up of a complementary features that you can mix and match to fit your needs.

---

## What's New?

^ So what's new with Firebase? and how can you include it in your application?

---

## What's New?

### > Setup

^ The key difference to Firebase then and Firebase now is the set up process, in that now it is fully integrated into Google Play Services.

^ What this means is that it can interleave with the other aspects of your set up such as cloud storage, push notifications and analytics.

---

### Legacy SDK
`com.firebase:firebase-client-android:2.5.2`

### Distributed SDK
`com.google.firebase:firebase-core:9.8.0`
`com.google.firebase:firebase-auth:9.8.0`
`com.google.firebase:firebase-database:9.8.0`

^ In the previous iteration of Firebase, all the functionality was provided with a single SDK,

^ true to the style of Google Play Services, Google have broken these down into individual modular components.

^ The original Firebase SDK also only provides the latter two components you can see here (auth and database),

^ which were tightly coupled to each other, but now you specify each of the components you want to include in your application.

---

## What's New?

### > Google Services

---

## build.gradle (Project)

```groovy
dependencies {
  ...
}

apply plugin: 'com.google.gms.google-services'
```

^ Now this one is really important, the support documentation tells you to also include the Google Services plugin,

^ but doesn't explain why that its important to place it *below* your dependencies do to conflicts

---

## Before

```java
// App Invites
compile 'com.google.android.gms:play-services-appinvite'

// AdMob by Google
compile 'com.google.android.gms:play-services-admob'

// Google Cloud Messaging
compile 'com.google.android.gms:play-services-gcm:8.4.0'
```

^ To make use of the new integrations for Firebase Invites and AdMob you will also need to update these dependencies.

---

## After

```java
// Firebase Invites
compile 'com.google.firebase:firebase-invites:9.8.0'

// Firebase Ads
compile 'com.google.firebase:firebase-ads:9.8.0'

// Firebase Cloud Messaging
compile 'com.google.firebase:firebase-messaging:9.8.0'
```

^ For Firebase Cloud Messaging you will also need to update your manifest entry and listener services,

^ you can find more information about this on the Firebase migration docs site.

^ Firebase now integrates with Google Play services

^ Firebase configuration provided by google-play-services.json

---

## [fit] Firebase Origins:

## [fit] Realtime Database

^ When Firebase first started out, it was mostly just a realtime database.

^ Despite Firebase now describing a collective toolset of the suite of services provided now,

^ the real power of using Firebase when first starting out is still that.

^ The Firebase Realtime Database is a cloud hosted NoSQL utilising the strength of Google's infrastructure to power your application.

^ Firebase Realtime Database allows developers to implement fully functioning application interfaces across multiple platforms,

^ Without having to worry about things like realtime synchronisation and conflict resolution.

---

## [fit] Intuitive

## [fit] Easy to use API

^ The realtime database api is stupidly simple to use, and reacts to a callback interface allowing you to simply consume the data as it is received.

---

## Querying Data

### Ordering Data

`orderByChild()`

`orderByKey()`

`orderByValue()`

`orderByPriority()`

^ Firebase will still allow you to query against your data using a variety of methods,

^ but its important to remember which value you are querying against.

---

## Querying Data

### Limiting Data

`limitToFirst()`

`limitToLast()`

`startAt()`

`endAt()`

`equalTo()`

---

```java
reference.addChildEventListener(new ChildEventListener() {

  @Override
  public void onChildAdded(DataSnapshot dataSnapshot, String previousChildKey) { ... }

  @Override
  public void onChildChanged(DataSnapshot dataSnapshot, String previousChildKey) { ... }

  @Override
  public void onChildRemoved(DataSnapshot dataSnapshot) { ... }

  @Override
  public void onChildMoved(DataSnapshot dataSnapshot, String previousChildKey) { ... }

  @Override
  public void onCancelled(DatabaseError databaseError) { ... }
});
```

---

```java
reference.addValueEventListener(new ValueEventListener() {

    @Override
    public void onDataChange(DataSnapshot dataSnapshot) { ... }

    @Override
    public void onCancelled(DatabaseError databaseError) { ... }
});
```

---

```java
reference.addListenerForSingleValueEvent(new ValueEventListener() {

    @Override
    public void onDataChange(DataSnapshot dataSnapshot) { ... }

    @Override
    public void onCancelled(DatabaseError databaseError) { ... }
});
```

^ Firebase used with AutoValue object hydration

---

# [fit] Offline data
# [fit] synchronisation

^ When your app loses connectivity, you would normally have to compose extensive amounts of logic to handle this failure gracefully.

^ Even with RxJava operators considerable thought must be put into how data is cached and evaluated.

^ With Firebase this is all handled for you and you can simply treat your application as though connectivity wasn't an issue.

^ Since Firebase will remain responsive regardless of network latency or internet connectivity,

^ and will synchronise on its own after data connectivity returns.

---

`FirebaseDatabase.getInstance()
.setPersistenceEnabled(true);`

---

## [fit] Includes authentication tokens

^ If your application used Firebase authentication, the users authentication tokens will be persisted across restarts allowing a seamless user experience.

^ If the token expires, database writes will be resumed until the user has been re-authenticated to make sure authentication rules are observed.

---

## [fit] Keeping data fresh

^ Additionally you can instruct Firebase to keep a particular reference updated whilst the client still has connectivity,

^ even whilst not maintaining an active reference to this Firebase reference in your code.

----

`FirebaseDatabase.getInstance()
  .getReference("...")
  .keepSynced(true);`

---

## [fit] Acquiring

## [fit] connectivity state

^ Firebase even offers a way to detect your current connection state using the same API for fetching data with the .info/connected reference.

---

```java
FirebaseDatabase.getInstance()
  .getReference(".info/connected")
  .addValueEventListener(new ValueEventListener() {

    @Override
    public void onDataChange(DataSnapshot snapshot) {
      boolean connected = snapshot.getValue(Boolean.class);
    }

    @Override
    public void onCancelled(DatabaseError error) {
      System.err.println("Listener was cancelled");
    }
  });
```

---


## 10MB

^ Firebase will reserve up to 10MB by default to cache query results, and will purge this data once it reaches the configured size.

^ Data that is kept in sync however will not be cached.

---

## Can I change the configured cache size?

^ You might ask, can I increase the configured cache size to greater than 10MB?

---

## [fit] No!

^ The legacy version of Firebase offered the method setPersistenceCacheSizeBytes to override the default configuration cache size,

^ but this is no longer available and it would generally be unwise to do so since this can cause application out of memory errors.

---

## [fit] Automatic data
## [fit] synchronisation

^ Synchronisation remains central to core principles of the Firebase Realtime Database,

^ meaning that your data is not just synchronised on the one device but across every connected client.

^ This is massively beneficial when developing cross platform applications,

^ it means all of your clients are sharing the same realtime database and will automatically received updates with the newest data.

---

## [fit] Cloud hosted
## [fit] NoSql database

^ Your data is stored in a cloud hosted NoSql database powered by Google,

^ being one of the front runners for data indexing and big data infrastructures.

^ NoSql data structures can provide huge increases to speed and performance but require a different way of thinking when it comes to relational data structures.

---

```json
{
  "users": {
    "alovelace": {
      "name": "Ada Lovelace",
      "contacts": {
        "ghopper": true
      },
    },
    "ghopper": { ... },
    "eclarke": { ... }
  }
}
```

^ One of the most important things to remember about Firebase is how to structure your data.

^ The Firebase Realtime Database does not offer a feasible environment for relational data,

^ so as a result you must de-normalize your data structure.

^ All Firebase Realtime Database data is structured as a Json tree of key, value parameters.

^ It's recommended to use uuid as keys rather than using arrays since these are easier to use when calling `setValue` on your data.

---

## The Tasks API[^1]
^ Since Firebase is now tied in with Google Play Services, many of its API operations use the Tasks API.

^ The Tasks API provideS a meaningful semantic interface for asynchronous operations,

^ which by themselves are more than enough to allow your application to follow a logical data flow.

```java
Task<AuthResult> task = FirebaseAuth.getInstance().signInAnonymously();

task.addOnSuccessListener(new OnSuccessListener<AuthResult>() {

  @Override
  public void onSuccess(AuthResult result) {
      /* ... */
  }
});

task.addOnFailureListener(new OnFailureListener() {

  @Override
  public void onFailure(@NonNull Exception exception) {
      /* ... */
  }
});
```

[^1]: https://developers.google.com/android/guides/tasks

---

## Analytics

- Analytics funnels
- Designed for apps
- Event and user centric
- Connects across Firebase
- Free & Unlimited

---

## Authentication
- Authentication & account management
- Supports
- Email & password
- Google, Facebook, Twitter, GitHub

---

## Cloud Messaging

---

## Storage
- Static asset hosting
- Free domain transfer

---

## Hosting

- Serve static assets
- SSL by default
- Custom domains

---

## Test Lab

---

## Crash Reporting

---

## Notifications

---

## Remote Config

---

## App Indexing

---

## Dynamic Links

---

## Invites

---

## AdWords

---

## [fit] 🌿 Android Peppermint

### [fit] Realtime Chat

### [fit] [github.com/ashdavies/peppermint](https://github.com/ashdavies/peppermint)

![right 200%](github-peppermint-qr.png)

---

## QR, SRSLY?!

^ QR codes are so 2012 right?

---

## [fit] 🌿 Android Peppermint

### ![inline 70%](https://developers.google.com/nearby/images/ic_nearby_white_2x_web_48dp.png) Google Nearby API

### ...

### [fit] [github.com/ashdavies/peppermint](https://github.com/ashdavies/peppermint)

^ The sample application demonstrates usage of the Google Nearby API for Android.

^ So that messages you send will be broadcast to everybody in the area,

^ and the message history you are seeing is *your* personal history,

^ stored using Firebase Realtime Database.
