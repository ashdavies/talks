![inline 25%](firebase.png)
# What's New in Firebase!
### Ash Davies
![inline 25%](immobilienscout24.png)

---

## What's Firebase?

^
- What is Firebase?
- This is how Google describes Firebase

---

![fit](firebase-developing-hard.png)

## Developing is Hard

^
- Developing modern apps is difficult

---

![fit](firebase-backend-scale.png)

^
- Need infrastructure that can scale
- Users expect high level compliancy

---

![fit](firebase-cross-platform.png)

^
- Cross platform collaboration
- Web, iOS, Android form factors
- Increasing number of platforms

---

![fit](firebase-auth.png)

^
- Social media integration
- Just to be considered

---

![inline](firebase.png)

^
- Firebase allows you to move quickly
- Without the worry of building infrastructure
- Series of tools to develop your apps
- Bring users to your app
- Grow your user base
- Earn money

---

![fit](firebase-all-tools.png)

^
- Set of 15 features
- Built around analytics
- Seamlessly communicate

---

![fit](firebase-auth.png)
## [fit] Authentication
- Authentication & account management
- Email & password authentication
- Google, Facebook, Twitter, GitHub
- Custom OAuth2 redirect domains

^
- Allows login with third party accounts
- Now runs with Google own authentication servers
- Firebase UI provides prepared environment set up

---

![fit](firebase-backend-scale.png)
## [fit] Realtime
## [fit] Database

^
- Firebase started as real time database
- Now a suite of development services
- Power still in Firebase Realtime Database

---

![fit](firebase-backend-scale.png)
## [fit] Data Synchronisation
- Graceful Connectivity Loss

^
- Would normally need lots of logic
- Handles poor connectivity gracefully

---

![fit](firebase-backend-scale.png)
## [fit] Data Synchronisation
- Graceful Connectivity Loss
- Application Data Cache

^
- Application data cached automatically
- Forget about connectivity issues
- Firebase will remain responsive
- Will synchronise when connectivity returns
- User auth tokens persisted
- Data writes resumed after token re-authentication

---

![fit](firebase-backend-scale.png)
## [fit] Data Synchronisation
- Graceful Connectivity Loss
- Application Data Cache
- Client Synchronisation

^
- Data is synchronised across all connected clients across platforms
- All clients share same realtime database with newest data
- Data freshness synchronised in real time

---

![fit](firebase-backend-scale.png)
## [fit] Data Synchronisation
- Graceful Connectivity Loss
- Application Data Cache
- Client Synchronisation
- Conflict Resolution

^
- Whilst Firebase doesn't yet support the ability to resolve complex conflicts
- Most conflicts will be automatically merged without any intervention required

---

## 10MB Cache

^
- Firebase will reserve up to 10MB by default to cache query results
- Will purge this data once it reaches the configured size.
- Data that is kept in sync however will not be cached.

---

## Can I still change the configured cache size?

---

## [fit] No!

^
- Legacy version offered `setPersistenceCacheSizeBytes` to override the configuration cache
- no longer available and it would generally be unwise to do so since this can cause application out of memory errors

---

## [fit] Cloud Hosted
## [fit] NoSql Database

^
- Your data is stored in a cloud hosted NoSql database powered by Google
- NoSql data structures can provide huge increases to speed and performance
- Require a different way of thinking when it comes to relational data structures

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

^
- Data is structured as a Json tree of key, value parameters
- Data must be de-normalized and some data might need to be repeated
- Structures do not really support relational data
- UUID keys easier to index when calling setValue

---

## What's New?

^
- Major changes to how Firebase is included in your project
- It is now fully integrated into Google Services
- Effortlessly interleave with the other aspects of your set up

---

## Set Up

```java
// Legacy SDK
compile "com.firebase:firebase-client-android:2.5.2"

// Distributed SDK
compile "com.google.firebase:firebase-core:9.8.0"
compile "com.google.firebase:firebase-auth:9.8.0"
compile "com.google.firebase:firebase-database:9.8.0"
compile "com.google.firebase:firebase-crash:9.8.0"
compile "com.google.firebase:firebase-config:9.8.0"
```

^
- The original Firebase SDK only provides auth and database
- Broken these down into individual modular components
- Choose which you want to include in your project
- Analytics not included separately but in core (2k)

---

^
- Firebase Admin SDK / API
- Configuration provided by google-play-services.json

---

## The Tasks API[^1]

```java
Task<AuthResult> task = FirebaseAuth.getInstance().signInAnonymously();

task.addOnSuccessListener(new OnSuccessListener<AuthResult>() {
  @Override public void onSuccess(AuthResult result) { /* ... */ }
});

task.addOnFailureListener(new OnFailureListener() {
  @Override public void onFailure(@NonNull Exception exception) { /* ... */ }
});
```

[^1]: https://developers.google.com/android/guides/tasks

^
- Since Firebase is now tied in with Google Play Services, many of its API operations use the Tasks API
- The Tasks API provides a meaningful semantic interface for asynchronous operations
- Which by themselves are more than enough to allow your application to follow a logical data flow

---

![](firebase-analytics.png)
## [fit] Analytics
- Free and Unlimited

^
- Free and unlimited
- No limit on the volume of events
- 500 distinct events
- 25 event parameters

---

![](firebase-analytics.png)
## [fit] Analytics
- Free and Unlimited
- Automatic Reporting

^
- Analytics baked in after integration
- Over a dozen of key analytic events automatically
- Device properties automatically logged
- Google powered user demographic properties
- Countries, age ranges, interests

---

![](firebase-analytics.png)
## [fit] Analytics
- Free and Unlimited
- Automatic Reporting
- Seamlessly Integrated

^
- Runs at the core of Firebase integrating with all other services
- Augments other features through seamless integration

---

![](firebase-analytics.png)
## [fit] Analytics
- Free and Unlimited
- Automatic Reporting
- Seamlessly Integrated
- Cross Platform

^
- Runs on all platforms

---

![](firebase-analytics.png)
## [fit] Audiences

^
- Create audiences from our analytics events
- Further drill down reporting and dashboard filtering
- Seemlessly integrates with other Firebase features
- Set additional user properties to examine user habits

---

## Where's my Data?

^
- Firebase Analytics updates every 4 - 5 hours
- Developers complain that they need instant data
- Analytic events can be marked as conversion events

---

![left 70%](firebase.png)
![right 120%](google-bigquery.png)

^
- Conversion events are reported in real time
- realtime export of conversion events to BigQuery
- events available in seconds

---

## ![](google-data-studio.png) Google Data Studio
### Firebase Templates

![left](firebase-data-studio-template.png)
![right](firebase-data-studio-template-next.png)

^
- Real time events can be viewed in Google Data Studio
- Dev summit Google announced Firebase templates
- Drill down on your data to produce useful visuals

---

![](firebase-debug-view.png)
## Firebase Analytics
### Debug View

^
- Latency pain points for development
^
https://www.youtube.com/watch?v=zssCC6rXyGk&list=PLl-K7zZEsYLmYSsW6ED2QvHxuI3UzT0WZ

---

## Crash Reporting
![](firebase-crash.png)

^
- Integrated automatically
- Instance statistics, cluster summaries, and stack traces
- Fully integrated with analytics
- Includes events leading up to a crash

---

## Firebase Analytics
### Stream View

---

![fit](firebase-remote-config.png)

^
- Remote config is probably one of the most exciting features from this years Firebase announcements
- Firebase remote config allows you to update your application remotely without deploying a new version

---

## [fit] Remote Config
- Audience Customisation

^
- What brings power to Firebase remote config is being able to target your audience groups
- Services integrate seamlessly with each other you can create an audience based upon analytic metrics
- and then deliver features only to them.
- This can be useful for promotions by demographic.

---

## [fit] Remote Config
- Audience Customisation
- Staged Roll Out

^
- Remote config can be used to deliver a staged roll out to your users after deploying to the Play store,
- You can even tweak your configuration to roll out to different countries based on your market strategy.

---

## [fit] Remote Config
- Audience Customisation
- Staged Roll Out
- Feature Flags

^
- If you use feature flags for internal or public feature toggling then this can also be manipulated to the same strengths.

---

## [fit] Remote Config
- Audience Customisation
- Staged Roll Out
- Feature Flags
- A/B Testing

^
- Finally this could also be used for AB testing to deliver different variants.

---

## [fit] Hosting
- Serve Static Assets
- SSL by default
- Custom domains

^
- Firebase Hosting allows you to host static assets such as Jekyll and Angular built front end sites for free,
- Zero configuration SSL is built into Firebase hosting so you don't have to set anything up to be completely secure,
- With the new Firebase you can transfer custom domains for free.

---

## [fit] Storage
- Robust Operations
- Strong Security
- High Scalability

^
- Firebase storage benefits from the same infrastructure that makes the realtime database so powerful,
- With Firebase storage you can store your assets and resources backed by Google Cloud Storage,
- caching and resuming your downloads, protected by Firebase authentication and with high scalability.

---

## [fit] Cloud Messaging
![inline](compose-notification.png)

^
- Google Cloud Messaging is the most popular method for delivering notifications but it often leaves a lot to be desired for its UI,
- Now Google Cloud Messaging is now available through Firebase Cloud Messaging across all platforms so it works for iOS, Chrome, Android, and web push.
- Additionally Firebase Notification allows you to use the UI to compose a notification to your users via Google Cloud Messaging,
- As mentioned previously you can couple this with the Audience feature available in Firebase to directly target your users.

---

## [fit] But wait, there's more!
- App Invites
- App Indexing
- Dynamic Links
- Test Lab
- AdWords

^
- Lots of other stuff
- No more time

---

## [fit] 🌿 Android Peppermint
### [fit] Realtime Chat
### [fit] [github.com/ashdavies/peppermint](https://github.com/ashdavies/peppermint)
![right 200%](github-peppermint-qr.png)

---

## QR, SRSLY?!

^
- QR codes are so 2012?

---

## [fit] 🌿 Android Peppermint
### ![inline 70%](https://developers.google.com/nearby/images/ic_nearby_white_2x_web_48dp.png) Google Nearby API
### ...
### [fit] [github.com/ashdavies/peppermint](https://github.com/ashdavies/peppermint)

^
- Sample chat application with Firebase Realtime Database and Google Nearby
- Firebase Analytics, Auth, Database, Crash, Config

---

## [fit] Twitterers

- Doug Stevenson - [CodingDoug](https://twitter.com/CodingDoug)
- Laurence Moroney - [lmoroney](https://twitter.com/lmoroney)

---

## [fit] Twitterers

- Doug Stevenson - [CodingDoug](https://twitter.com/CodingDoug)
- Laurence Moroney - [lmoroney](https://twitter.com/lmoroney)

**Shameless...**

- Ash Davies - [DogmaticCoder](https://twitter.com/DogmaticCoder)

---

## [fit] Resources

### GitHub - [github.com/firebase](https://github.com/firebase)
### YouTube - [youtube.com/firebase](http://www.youtube.com/firebase)
### Slack - [firebase-community.appspot.com](https://firebase-community.appspot.com/)
### Slides - [github.com/ashdavies/talks](https://github.com/ashdavies/talks)

---

Thank You.
