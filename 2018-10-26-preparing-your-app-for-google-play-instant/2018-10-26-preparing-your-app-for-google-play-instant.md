footer: ![10%](immobilienscout24.png)
autoscale: true
slidenumbers: true
header: Roboto
text: Roboto

[.footer: ashdavies.io - @askashdavies]
![right inline 15%](immobilienscout24.png)

# Preparing your app
# for Google Play Instant

![inline left](ash-davies.png)

---

### Super Duper Exclusive 
### London Preview

![](london-aerial.jpg)

---

![fit](mobile-apps.png)

^ Mobile economy runs on apps

---

![](mobile-first.png)

^ Mobile first business strategy

---

[.background-color: #ffffff]

![100%](google-play.png)

^ Wherever the user journey starts

^ It inevitably ends up on Google Play

---

# 💪

^ Incredibly useful tool, reliable distribution

^ Guaranteed safety, brand identity, trust

---

# 🧗 Friction 

^ One more step to your app

---

![](https://media.giphy.com/media/ZelfdOk5XE7p6/giphy.gif)

^ This graceful feline had no friction,

^ but perhaps needed some.

---

![autoplay loop](material-progress-indicator.mp4)

^ Long installation times leading cause of cancellation

---

# 😡

---

# `< />`

^ Mobile optimised sites as solution

---

[.background-color: #ffffff]

![100%](google-play-instant.png)

^ Renamed from instant apps

---

# Performance

- Monolith
- Feature artifacts
- Parallel builds [Citation Needed]

---

[.background-color: #ffffff]
[.header: #333333]

## Security

![100%](android-security.jpg)

^ Concern for instant security implications

^ Careful precautions have been taken

---

## 🔐 HTTPS

^ All network traffic must be secure

---

[.background-color: #478ff9]

## Smart Lock

![60% right](netflix-retrieve.png)

^ Smart lock for passwords on Android

^ Retrieve stored credentials from Credentials API 

^ Requires explicit user permission

---
 
## 💳 Play Billing Library

^ Payments via Play Billing Library

^ Fast and easy payments in over 135 countries

---
 
## Runtime Permissions

^ Must use runtime permissions

---

- `ACCESS_COURSE_LOCATION`
- `ACCESS_FINE_LOCATION`
- `ACCESS_NETWORK_STATE`
- `BILLING` (Deprecated as of Play Billing Library 1.0)
- `CAMERA`
- `INSTANT_APP_FOREGROUND_SERVICE` (Only in Android Oreo)
- `INTERNET`
- `READ_PHONE_NUMBERS` (Only in Android Oreo)
- `RECORD_AUDIO`
- `VIBRATE`

^ Limited to supported permissions

---

# Limitations

---

# ₿ ⛏️ 💰

^ Mine Bitcoin without users consent?

---

## ~~Background Services~~

^ No dice, background services are disabled!

---

## ~~External Storage~~

^ No access to external storage,

^ no sniffing for installed apps

---

## 🎉 Local Storage 

^ Still have access to local storage, cache and preferences

^ SqlLiteDatabase and content providers without export

---

## Cookie API

![](cookie-monster.gif)

^ Available to installed and instant apps

^ Help migrate users over to installed app

^ Used with PackageManager (or support) API

---

## ~~Push Notifications~~

^ Like background services, no background notifications

^ Beta program available by application

---

## ~~Bluetooth~~

^ Many hardware facilities limited

---

[.background-color: #FFFFFF]
[.header: #666666]

## Size Limit (4 Mb)

![inline 50%](distribution-base-2mb.png) ![inline 50%](distribution-feature-a-2mb.png) ![inline 50%](distribution-feature-b-2mb.png)

^ Instant Apps should be instant

^ Arbitrary size limit for fast download

---

[.background-color: #FFFFFF]
[.header: #666666]

## Size Limit (10 Mb) 💪

![inline 50%](distribution-base-10mb.png) ![inline 50%](distribution-feature-a-10mb.png) ![inline 50%](distribution-feature-b-10mb.png)

^ Size increased to 10 Mb to enable Try Now

---

# History

---

[.footer: ]

![](immobilienscout24-outside.jpg)

![inline 20%](immobilienscout24.png)

--- 

# The Monolith

![](monolith.jpg)

^ Not only back ends work with a monolith

^ Two modules app and search

^ Tightly coupled

---

# Location Input

![100% right](calculator-location.gif)

^ Location searching existed on web

^ Reused search funnel location

^ Multiple behaviours

---

![](common-architectures.jpg)

[^]: https://www.lynda.com

^ Updating architecture

^ Android Guild discussions

^ Modularisation, autonomy

--- 

# Dependency Graph

![120% right](directed-acyclic-graph.png)

^ Migration from Dagger 1 long and arduous

^ Heavy use of Dagger Android allowed modularisation

---

![50%](architecture-monolith.png)

^ Monolith application with tight coupling

^ Heavy modularisation and responsible workflow

---

![fit](application-hierarchy.png)

^ Highly modularised, mostly unidirectional dependency flow

^ Vertically structured architectural hierarchy

^ Top-level god module

---
 
Flat Hierarchy

![60% original](flat-hierarchy.png)

^ Horizontal hierarchy encapsulating implementation

---

![](kotlin-android.png)

^ Kotlin internal modifier

---

![](how-did-i-get-here.gif)

^ How did I get here?

^ Already a prime candidate for an instant app

---

# Analysis

^ Which tools did you use for measuring APK size per package?

^ Android Studio APK analyser

^ Emulator support

^ Refactoring tool

---

# Modularisation

^ App Bundle

^ Dynamic feature modules

^ Independent feature modules

^ How did you decide for your base module? 

^ Feature module data binding

---

# Dagger

^ Dagger Multi-Binding for alternative dependencies

^ Separated finance dagger application component

---

# Optimisations

- Proguard (`minifyEnabled`)

- SVG assets (optimised)

^ Remove bloated images

^ Avocado optimiser

---

# Libraries

^ Largest library dependency to remove

---

`#RxMustDie`

![original](rx-must-die.jpg_large)

^ Droidcon Berlin 2018 RxMustDie Panel

---

![](kotlin-android.png)

^ Kotlin Coroutines smaller than Rx

^ Not advocated, but advocating

---

# Try Now

![25% right](buzzfeed-try-now.png)

^ Try now button for installed apps

---

Navigation

^ Intent cannot reference activity

```xml
<activity android:name=".calculator.FinanceCalculatorActivity">

  <intent-filter>

    <action android:name="android.intent.action.VIEW"/>

    <category android:name="android.intent.category.DEFAULT"/>
    <category android:name="android.intent.category.BROWSABLE"/>

    <data android:host="www.immobilienscout24.de"
        android:pathPrefix="/baufinanzierung/finanzierungsrechner/"
        android:scheme="https"/>

  </intent-filter>

  <meta-data android:name="default-url"
      android:value="https://www.immobilienscout24.de/baufinanzierung/finanzierungsrechner/"/>

</activity>
```

^ App linking URL parameters

^ Certificate file uploaded to server

^ Play store verifies fingerprint

---

# Topeka

### github.com/googlesamples/android-topeka

^ Topeka from Ben Weiss

---

# Plaid

### github.com/nickbutcher/plaid

^ Plaid from Nick Butcher and Google

---

# Current State

---

# Next Steps

---

[.footer: ashdavies.io - @askashdavies]
![right inline 15%](immobilienscout24.png)

# Cheers! 🍻

![inline left](ash-davies.png)
