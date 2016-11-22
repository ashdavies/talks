# [fit] Retrofit 2
## What the IOException?!

---

## Ash Davies
### @DogmaticCoder

^
- Why dogmatic coder?

---

## Ash Davies
### ~~@AshDavies~~

^
- Because my name was taken
- and I like to shout at thing

---

## Ash Davies
### @DogmaticCoder

^
- Let me remind you of a quote from a couple of years back

---

> "Retrofit 2 will be out by the end of this year"
-- Jake Wharton (Droidcon NYC 2014)

^
- Cool!

---

> "Retrofit 2 will be out by the end of *this* year"
-- Jake Wharton (Droidcon NYC 2015)

^
- Erm, ok?

---

> "Retrofit 2.0.0 is now released!"
-- @JakeWharton (11 Mar 2016)

^
- Finally! Lets get going!

---

![](ron-burgundy-awesome.gif)

### Finally!

---

![](immobilien-scout-outside.png)

![inline 50%](immobilien-scout-logo.png)

^
- Over at ImmobilienScout24 GmbH we recently decided to update to Retrofit 2

---

![](brilliant-idea.gif)

---

## Retrofit2: Dependencies

```groovy
dependencies {

  // Retrofit 1.9
  compile 'com.squareup.retrofit:retrofit:1.9.0'

  // Retrofit 2.1: Core
  compile 'com.squareup.retrofit2:retrofit:2.1.0'  

  // Retrofit 2.1: Transitive
  compile 'com.squareup.okhttp3:okhttp:3.3.0'
  compile 'com.squareup.okio:okio:1.8.0'

}
```

^
- Retrofit 2 is distributed with a package name
- Meaning you include both libraries in your project
- OkHttp: RequestBody, Header, Interceptor replaced

---

## Awesome!
### what next?

^
- Lets build our rest adapter

---

## Retrofit2: Adapter

```java
// Retrofit 1.9
RestAdapter adapter = new RestAdapter.Builder()
  .setClient(new Ok3Client(okHttpClient))
  .setEndpoint("...")
  .build();

// Retrofit 2.1
Retrofit retrofit = new Retrofit.Builder()
  .client(okHttpClient)
  .baseUrl("...")
  .build();
```

^
- No Retrofit client (Ok3Client)
- Adapter -> Retrofit
- baseUrl -> endpoint

---

So good so far...

^
- What else?

---

## Retrofit2: Converters
```java
Retrofit retrofit = new Retrofit.Builder()
  .addConverterFactory(GsonConverterFactory.create())
  .build();
```

^
- Retrofit 1.9 included GsonConverter to automatically parse your DAO's
- Retrofit 2.1 does not include any converters automatically

---

## Retrofit2: Converters

```java
com.squareup.retrofit:converter-gson // Gson
com.squareup.retrofit:converter-jackson // Jackson
com.squareup.retrofit:converter-moshi // Moshi
com.squareup.retrofit:converter-protobuf // Protobuf
com.squareup.retrofit:converter-wire // Wire
com.squareup.retrofit:converter-simplexml // Simple XML
```

^
- No duplication of converters when choosing an alternative

---

## Asynchronous

^
- There is no difference between asynchronous and synchronous call definitions

---

```java
/* Retrofit 1.9 */
public interface Service {

  // Synchronous
  @GET("/articles")
  List<Article> articles();

  // Asynchronous
  @GET("/articles")
  void articles(Callback<List<Article>> callback);
}
```

^
- Retrofit 1 allows you to define both in the service definitions

---

```java
/* Retrofit 2.1 */
public interface Service {

  @GET("articles")
  Call<List<Article>> articles();
}
```

^
- Retrofit 2 does not allow this in the interface definition

---

```java
/* Retrofit 2.1 */
Call<List<Article>> call = service.articles();

// Synchronous
call.execute();

// Asynchronous
call.enqueue();
```

^
- Call can be made synchronously with `execute()` or asynchronously with `enqueue()`

---

## Response<T>

^
- Responses are now parameterized
- Encapsulated as a single request

---

## Cancel Requests

^
- What if I start making a network request in my application that I want to Cancel
- Either because the user has navigated somewhere where the request isn't necessary
- Or the user actively cancelled the network operation

---

```java
/* Retrofit 1.9 */

ExecutorService executors = Executors.newCachedThreadPool();

RestAdapter adapter = new RestAdapter.Builder()
  .setExecutor(executors)
  .build();

adapter.create(MyService.class).myMethod();

executors.shutdownNow();
```

^
- Cancelling on Retrofit 1 requires you to kill a custom thread

---

```java
/* Retrofit 2.1 */

Call<ResponseBody> call = service.get("...");

call.enqueue(new Callback<ResponseBody>() { ... });

call.cancel();
```

^
- Cancelling on Retrofit 2 is as simple as calling a method on the call
- and you can check if the call was cancelled with `isCancelled()`

---

## RxJava not integrated by default

---

## Base url resolution provided by HttpUrl.resolve()

---

## OkHttp logging interceptor

---

## Dependency on OkHttp where default http client used previously

---

## OkHttp interceptors

---

## HttpException used for non 2xx http responses

---

## IOException used for network exceptions

---

## Hard to distinguish serialisation exceptions

---

## No more synchronous requests (makes sense)

---

## onResponse called even if request not successful

---

## isSuccessful to check if call succeeded

---

## Not documented on official docs

---

## Call, Result, Response

---

## When response has error body is null

---

## What happens when things go wrong?

^
- How would retrofit1 handle server errors

---

```json
{
    statusCode: 400,
    message: "Malformed email"
}
```

^
- Here the server gives us some useful information
- This may also localised using your accept headers

---

## RetrofitError

---

```java
public void onError(Throwable throwable) {
 if (throwable instanceof RetrofitError) {
   return onError((RetrofitError) throwable).getBody(ServerError.class));
 }
}

public void onError(ServerError error) {
  Toast.makeText(getContext(), error.getMessage(), Toast.LENGTH_SHORT).show();
}
```

^
- Here RetrofitError allows you to cast the body response

---

```java
/* Retrofit 1.9: RetrofitError */
public Object getBodyAs(Type type) {
  if (response == null) {
    return null;
  }
  TypedInput body = response.getBody();
  if (body == null) {
    return null;
  }
  try {
    return converter.fromBody(body, type);
  } catch (ConversionException e) {
    throw new RuntimeException(e);
  }
}
```

---

```java
/** Identifies the event kind which triggered a {@link RetrofitError}. */
public enum Kind {
  /** An {@link IOException} occurred while communicating to the server. */
  NETWORK,
  /** An exception was thrown while (de)serializing a body. */
  CONVERSION,
  /** A non-200 HTTP status code was received from the server. */
  HTTP,
  /**
   * An internal error occurred while attempting to execute a request. It is best practice to
   * re-throw this exception so your application crashes.
   */
  UNEXPECTED
}
```

---

> "I love Factories!"
-- @alosdev

---

> "I find that API to awful (which I'm allowed to say as the author)"
-- Jake Wharton (Nov 7, 2015)
