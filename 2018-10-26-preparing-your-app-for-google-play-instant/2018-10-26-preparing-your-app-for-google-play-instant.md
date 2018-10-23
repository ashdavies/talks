footer: ![10%](immobilienscout24.png)
autoscale: true
build-lists: true
header: Roboto
text: Roboto

[.footer: ashdavies.io - @askashdavies]
![right inline 15%](immobilienscout24.png)

## Preparing your app for Google Play Instant

### Droidcon London 2018 

^ (Make Droidcon title white)

![inline left](ash-davies.png)

---

![fit](mobile-apps.png)

^ Mobile economy driven by apps

^ Mobile development business priority

---

![](mobile-first.png)

^ Mobile first business strategy often employed

^ Resulting in, growth (acquisition), user retention statistics used as measurement of success

---

[.background-color: #ffffff]

![100%](google-play.png)

^ Wherever the user journey starts

^ Referral, word-of-mouth, advertisement, social

^ It inevitably ends up on Google Play to install

---

# 💪

^ Incredibly useful tool, reliable distribution

^ Guaranteed safety, Google Play Protect

^ Brand identity, source of truth, trust

---

# 🧗 Friction 

^ One more step to your awesome user experience

---

![](https://media.giphy.com/media/ZelfdOk5XE7p6/giphy.gif)

^ This graceful feline had no friction,

^ but perhaps needed some.

---

![autoplay loop](material-progress-indicator.mp4)

^ How often have you seen this when trying to install?

^ Long installation times one of the leading cause of cancellation

^ User acquisition funnel already difficult

---

# 😡

---

# `< />`

^ Progressive web apps (mobile optimised sites)

^ Often clunky, unintuitive, require extensive dev time

^ Not as pleasant as a native mobile experience

---

[.background-color: #ffffff]

![100%](google-play-instant.png)

^ Instant apps are native apps that don't require an installation

^ Ideal for businesses with an existing Android app

---

## Park and Pay

^ Introduces as instant apps 2016, NFC concept with "Park and Pay"

^ SDK opened up next year for users running Lollipop or later

---

# <br />

## Performance

![50%](android-performance-patterns.png)

^ Doesn't make your app automatically performant

^ Encourages you to modularise from a single artifact

^ Instant apps, are by nature "instant"

^ AGP includes clever optimisations, incremental builds, parrallelisation

---

[.background-color: #ffffff]
[.header: #333333]

# <br />

## Security

![80%](android-security.jpg)

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

- `ACCESS_COARSE_LOCATION`
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

^ Elaborate on base module

---

[.background-color: #FFFFFF]
[.header: #666666]

## Size Limit ~~(4 Mb)~~ (10 Mb) 💪

![inline 50%](distribution-base-10mb.png) ![inline 50%](distribution-feature-a-10mb.png) ![inline 50%](distribution-feature-b-10mb.png)

^ Size increased to 10 Mb to enable Try Now

^ Should still keep small

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

^ Direct Acyclic Graph

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

![](awesome-farrel.gif)

^ Already a prime candidate for an instant app

---

![](california-road.jpeg)

^ Not there yet, still need to ensure within limitation

^ Mistakenly spent a lot of time on optimisation first

---

## App Bundle

---

## Dynamic Feature

---

![fit](apk-analyser.png)

^ Android Studio allows analysis of instant app apk

^ Emulator support, and refactoring tool

---

# Dagger

^ Dagger Multi-Binding for alternative dependencies

^ Separated finance dagger application component

---

# Optimisations

- Code minification (`minifyEnabled`)

- Resource shrinking (`shrinkResources`)

- Optimised SVG assets (`bit.ly/2SeZePQ`)

- Configuration splits (`splits { }`)

^ Remove rasterised images

^ Optimised vector graphics (Avocado)

^ Density, processor, language

---

## Third Party SDKs 🤦‍♂️

^ Largest library dependency to remove

---

`#RxMustDie`

![original](rx-must-die.jpg_large)

^ Droidcon Berlin 2018 RxMustDie Panel

---

[.header: #000000]

# Coroutines

![original](kotlin-android.png)

^ Kotlin Coroutines smaller than Rx

^ Not advocated, but advocating

---

# Try Now

![25% right](buzzfeed-try-now.png)

^ Try now button for installed apps

---

## Navigation

### `Intent(this, FinanceCalculatorActivity::class.java)`

^ You may be used to creating intents like this

---

## Navigation

### ~~`Intent(this, FinanceCalculatorActivity::class.java)`~~

^ No dice, intents cannot reference activity directly

---

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
</activity>
```

^ App linking URL parameters

^ Nullable parameters via query param

^ Don't use intent parameters

---

# URL Verification

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

## Next Steps

^ Finance calculator shipping before end of year

^ Search funnel 'Try Now' shipping before BER

---

[.footer: ashdavies.io - @askashdavies]
![right inline 15%](immobilienscout24.png)

# Cheers! 🍻

![inline left](ash-davies.png)
