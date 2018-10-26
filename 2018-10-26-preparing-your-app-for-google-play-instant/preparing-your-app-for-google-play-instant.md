footer: ![10%](immobilienscout24.png)
autoscale: true
build-lists: true
header: Roboto
text: Roboto
theme: Next

[.footer: ashdavies.io - @askashdavies]
![right inline 15%](immobilienscout24.png)

[.header-strong: #e7dc6f]
[.header: #ffffff]

## **Preparing your app for Google Play Instant**

### DevFestCZ Prague 2018

![inline left](ash-davies.png) ![right](dev-fest-cz.png)

^ Speaker introduction

^ Our experience modularising

^ Preparing for Google Play Instant

---

![fit](mobile-apps.png)

^ The mobile economy relies on mobile apps

^ Most businesses will think about developing very early

^ Mobile first business strategy

---

![](mobile-first.png)

^ Businesses often take on a mobile first strategy

^ Growth, user retention measurement of success

^ Spend time on promotion and acquisition

---

[.background-color: #ffffff]

![100%](google-play.png)

^ Wherever the user journey starts, often using a URL

^ Referral, social, search, developer swag, or written on a toilet cubicle door

^ It inevitably ends up on Google Play to install

---

# 💪

^ Incredibly useful tool, reliable distribution

^ Brand identity, source of truth, trust

---

[.background-color: #ffffff]

![100%](google-play-protect.png)

^ Protection from harmful software

---

# 🧗 Friction

^ One more step to your awesome user experience

^ Want to reduce friction

---

![](https://media.giphy.com/media/ZelfdOk5XE7p6/giphy.gif)

^ This graceful feline had no friction,

^ but perhaps needed some.

---

![autoplay loop](material-progress-indicator.mp4)

^ How many times have you seen this when trying to install?

---

# 😡

^ Long installation times one of the leading cause of frustration

^ User acquisition funnel already difficult

^ Causes installation cancellation

^ Poor user experience

---

# `< />`

^ Progressive web apps (mobile optimised sites)

^ Often clunky, unintuitive, require extensive dev time

^ Not as pleasant as a native mobile experience

---

[.background-color: #ffffff]

![100%](google-play-instant.png)

^ Instant apps are really small native apps that don't require an installation

^ Ideal for businesses with an existing Android team

^ Managed by Google Play and Support Services, installs minimised version

^ Runs instantly with little or no friction to user experience

---

![](park-and-pay.png)

^ Introduces as instant apps 2016, with concept "Park and Pay"

^ Uses NFC to navigate to URL at parking meter

^ Pay instantly with Google Pay

^ Outstanding technology, two years ago

---

![](lollipop.jpg)

## Lollipop

^ SDK opened up next year for users running Lollipop or later

---

[.background-color: #ffffff]

![100%](two-flavours.jpg)

^ Two flavours of instant app

---

# `<a href />`

^ One registered to a url

^ Unlimited registered urls

---

# Try Now

![25% right](buzzfeed-try-now.png)

^ Try now button for installed apps

^ Only one per installed app

^ Default activity declared in manifest

^ Declare default URL

---

```xml
<activity android:name="com.example.base.MainActivity" ... >
    
    <meta-data
        android:name="default-url"
        android:value="https://example.com/welcome" />

</activity>
```

^ Release try now instant apps via Google Play Store

^ Test releases through internal test track

---

# <br />

## Performance

![50%](android-performance-patterns.png)

^ Doesn't automatically improve performance

^ Instant apps, are by nature "instant"

^ Encourages you to modularise from a single artifact

^ Moduralised apps take advantage of parallel tasks

---

[.background-color: #ffffff]
[.header: #333333]

# <br />

## Security

![80%](android-security.jpg)

^ When executing native code automatically from a URL

^ Concern for instant security implications

^ Careful precautions have been taken

---

## 🔐 HTTPS

^ All network traffic must be secure

^ If you don't already do so you're a bad person

---

[.background-color: #478ff9]

## Smart Lock

![60% right](netflix-retrieve.png)

^ Smart lock for passwords on Android

^ Retrieve previously stored credentials from Credentials API

^ Apps linked by verified URL in Play Developer Console

^ Requires explicit user permission

---

```java
Auth.CredentialsApi.save(mCredentialsClient, credential).setResultCallback(
    new ResultCallback() {
        @Override
        public void onResult(Status status) {
            if (status.isSuccess()) {
                // Credentials were saved
            } else {
                if (status.hasResolution()) {
                    // Try to resolve the save request. This will prompt the user if
                    // the credential is new.
                    try {
                        status.startResolutionForResult(this, RC_SAVE);
                    } catch (IntentSender.SendIntentException e) {
                        // Could not resolve the request
                    }
                }
            }
        }
    });
```

^ Example from code docs

---

## 💳 Play Billing Library

^ Payments offered though Google Play Billing Library

^ Fast and easy payments in over 135 countries

^ Google Pay for physical goods

---

## 🔒 Runtime Permissions

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

^ Location permissions useful for instant apps, benefit of native mobile experience

^ Still able to request access to hardware permissions that warrant native mobile development

---

## Limitations

^ But with great security, can come great irresponsibility

^ To abide by security and performance, limitations observed

---

# 🙈 ₿ ⛏️ 💰

^ Maybe you're a bad person?

^ Mine Bitcoin in the background without users consent?

---

## ~~Background Services~~

^ No dice, background services are disabled!

---

## ~~Push Notifications~~

^ Like background services, no background notifications

^ Beta program available by application

^ Goat sacrifice necessary

---

## ~~External Storage~~

^ No access to external storage, shared photos and media

^ Cannot detect installed apps, leak sensitive data

---

## 🎉 Local Storage

^ Don't worry! Still have access to local storage

^ Internal cache, internal storage, shared preferences

^ SqlLiteDatabase and content providers, but not exported

---

## Instant <-> Installed

^ Instant apps great for user acquisition and growth

^ Promote installed app, tease user with features

^ But you want to offer a seamless experience

---

## Cookie API

![](cookie-monster.gif)

^ Great news! Use cookies just like on the web

^ Available to installed and instant apps

^ Help migrate users over to installed app

^ Used with PackageManager (or SupportPackageManager) API

---

[.background-color: #FFFFFF]
[.header: #666666]

## Size Limit (4 Mb)

![inline 50%](distribution-base-2mb.png) ![inline 50%](distribution-feature-a-2mb.png) ![inline 50%](distribution-feature-b-2mb.png)

^ Instant Apps should be instant, small as possible

^ Arbitrary size limit imposed for fast download

---

[.background-color: #FFFFFF]
[.header: #666666]

## Size Limit ~~(4 Mb)~~ (10 Mb) 💪

![inline 50%](distribution-base-10mb.png) ![inline 50%](distribution-feature-a-10mb.png) ![inline 50%](distribution-feature-b-10mb.png)

^ After Google Playtime event,

^ Size increased to 10 Mb

^ Should still keep small

---

[.background-color: #000000]
![fit](history-lesson.gif)

^ Talk on *preparing* your app, useful to give example case study

^ Need to give a bit of our app history

---

[.footer: ]

![](immobilienscout24-outside.jpg)

![inline 20%](immobilienscout24.png)

^ Started at Scout just over two years ago

^ Joined financing teams, connecting users with mortgage providers

^ Low interest, high costs, need to offer best deal

^ Dream of digitising entire moving process

---

# The Monolith

![](monolith.jpg)

^ Not only back ends work with a monolith

^ Two modules app and search (java only)

^ Lighter module contained interface contracts

^ Larger module, implementations, *everything* else

^ Tight feature coupling

---

# Location Input

![100% right](calculator-location.gif)

^ Early initiative, offer financing location input

^ Reused search funnel location searching, makes sense?

^ Quickly grew out of control, multiple behaviours, technical debt

---

![](common-architectures.jpg)

[^]: https://www.lynda.com

^ Realised we needed to update architecture

^ Started cross segment Android Guild, opened discussions

^ Modularisation, autonomy, confidence

---

# Dependency Graph

![120% right](directed-acyclic-graph.png)

^ Started with dependencies, Direct Acyclic Graph

^ Migration from Dagger 1 long and arduous

^ Heavy use of Dagger Components allowed modularisation

---

# <br />

## `@Component`

^ Alternative app component allowed dependencies substitution

^ Proguard removes for installed app on production

^ Multi-binding to provide subset of dependencies

---

![50%](architecture-monolith.png)

^ Monolith application

^ Tight coupling

---

![fit](application-hierarchy.png)

^ Highly modularised, mostly unidirectional dependency flow, few upward relationships

^ Actually high level of feature modularisation, hard to show in diagram

^ Interface contracts pushed down to base modules, implemented by app modules

---

Flat Hierarchy

![60% original](flat-hierarchy.png)

^ Aim to achieve independent modules

^ Horizontal (flat) hierarchy

^ `internal` encapsulated implementation

---

![](awesome-farrel.gif)

^ Already put work into heavy modularisation

^ Why not one step further?

^ Prime candidate for an instant app

---

[.background-color: #ffffff]

![100%](android-app-bundle.png)

^ Distribute bundle with resources

^ Defers apk build and signing to Google Play

^ Keys stored with Google secure infrastructure

^ Check out Ben's talk

---

[.background-color: #ffffff]

![50% original](dynamic-feature-module.png)

Dynamic Feature

^ Similar to instant apps, shipped with installed app

^ Allows user to download features on-demand

^ Ship smaller apk, great for secondary features

---

![](california-road.jpeg)

^ Not there yet, still need to ensure within limitation

^ Started analysing build artifact to reduce size

^ Looking for optimisation opportunities

---

# Optimisations

- Code minification (`minifyEnabled`)

- Resource shrinking (`shrinkResources`)

- Optimised SVG assets (`bit.ly/2SeZePQ`)

- Configuration splits (`splits { }`)

- Third party SDKs 😲

^ Remove rasterised images

^ Optimised vector graphics

^ Avocado SVG optimiser

^ Density, processor, language

---

![fit](apk-analyser.png)

^ How can you identify size of your dependencies

^ Android Studio allows analysis of instant app apk

---

## Proguard / R8 🤦‍♂️

^ Verify proguard configuration (I didn't)

---

## Third Party SDKs 🙄

^ Twitter question: largest library dependency to remove?

^ Not sure about you, reporting frameworks, all of them

---

## Data Binding 😥

```
Error: Currently, data binding does not work for non-base feature modules.
Please, move data binding code to the base feature module.
See https://issuetracker.google.com/63814741 for details
```

---

## Data Binding 😌

`android.enableExperimentalFeatureDatabinding=true`

---

## Navigation

`Intent(context, CalculatorActivity::class.java)`

^ You may be used to creating intents like this

---

## Navigation

~~`Intent(context, CalculatorActivity::class.java)`~~

^ No dice, intents cannot reference activity directly

---

## App Links

---

```xml
<activity android:name=".calculator.CalculatorActivity">
  <intent-filter>

    <action android:name="android.intent.action.VIEW"/>

    <category android:name="android.intent.category.DEFAULT"/>
    <category android:name="android.intent.category.BROWSABLE"/>

    <data android:host="www.immobilienscout24.de"
        android:path="/baufinanzierung/finanzierungsrechner/"
        android:scheme="https"/>

  </intent-filter>
</activity>
```

^ App linking URL parameters

---

```xml, [.highlight: 9-11]
<activity android:name=".calculator.CalculatorActivity">
  <intent-filter>

    <action android:name="android.intent.action.VIEW"/>

    <category android:name="android.intent.category.DEFAULT"/>
    <category android:name="android.intent.category.BROWSABLE"/>

    <data android:host="www.immobilienscout24.de"
        android:path="/baufinanzierung/finanzierungsrechner/"
        android:scheme="https"/>

  </intent-filter>
</activity>
```

^ Matches explicit URL

^ Use pathPrefix for parameters

---

## Intent Extras

```kotlin
val intent = Intent(context, CalculatorActivity::class.java)
intent.putExtra("location", "Berlin")
```

---

[.background-color: #ffffff]

## ❗

^ Nope!

---

## Query Params

### `intent.data?.getQueryParameter("location")`

^ Nullable parameters via query param

^ Don't use intent parameters

---

## ?

^ Nullable

---

## Query Params

```kotlin
val geocode = intent.data?.getQueryParameter("location")
val label = intent.data?.getQueryParameter("label")

val region = if (geocode != null && label != null) Region(geocode, label)
else null
```

^ Problem compounded when you create objects

---

## Query Params

```kotlin
data class Region(val geocode: String, val label: String) {

  companion object {

    operator fun invoke(
      geocode: String?,
      label: String?
    ) : Region(
      geocode ?: "1276001010",
      label ?: "Berlin - Mitte (Mitte)"
    )
  }
}
```

^ Operator invocation companion function mirrors constructor API

---

## Query Params

```kotlin
val region = Region(
    intent.data?.getQueryParameter("location"),
    intent.data?.getQueryParameter("label")
)
```

---

## Verify Site Associations

^ Digital asset link json file

^ Published to your website

^ Verify ownership

---

### `keytool -list -v -keystore release.keystore`

^ Use keytool to retrieve keystore fingerprint

----

```
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "de.is24.android",
    "sha256_cert_fingerprints": ["..."]
  }
}]
```
---

![10% left](android-studio.png)

![fit right](app-link-assistant.png)

^ Android Studio includes app link assistant

^ URL mapping editor to build app links

^ Generate URL verification file to upload to your server

---

# <br />

# Emulator
# Support

![100% right](android-emulator.png)

^ Android Emulator supports instant apps

^ Can be used to test your app links

---

# Topeka

### github.com/googlesamples/android-topeka

^ Topeka from Ben Weiss

^ Instant app without URL

---

# Plaid

### github.com/nickbutcher/plaid

^ Plaid with Nick, Florina, Ben

^ Dynamic feature and distribution

---

## Next Steps

^ Hoped to demonstrate at conference

^ Finance calculator shipping before end of year

^ Search funnel 'Try Now' shipping before BER

---

[.footer: ashdavies.io - @askashdavies]
![right inline 15%](immobilienscout24.png)

# Cheers! 🍻

![inline left](ash-davies.png)



^ https://issuetracker.google.com/issues/63814741
