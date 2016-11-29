# [fit] Retrofit 2
## What the IOException?!

^
- HttpException is more accurate

---

# [fit] Retrofit 2
## ~~What the IOException?!~~
## What the HttpException?!

^
- When planning IOException sounded cooler

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

![](immobilien-scout-outside.jpg)

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

  // Retrofit 2.1
  compile 'com.squareup.retrofit2:retrofit:2.1.0'  

}
```

^
- Retrofit 2 is distributed with a package name
- Meaning you include both libraries in your project

---

## Method Counts

---

## Retrofit2: Dependencies

**Retrofit 1.9 (1997)**
Retrofit (776)
Gson (1231)

**Retrofit 2.1 (3349)**
Retrofit (508)
OkHttp (2180)
OkIo (661)

^
- Considerable difference because of dependency on OkHttp

---

## OkHttp

^
- Retrofit inherits OkHttp call pattern
- Uses request elements from OkHttp too
- Interceptor, Response, RequestBody

---

## Awesome!
### What's Next?

^
- Lets build our rest adapter

---

## Retrofit2: RestAdapter

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
- No Retrofit client wrapper (Ok3Client)
- `Adapter` renamed to `Retrofit`
- `baseUrl` renamed to `endpoint`

---

## Converters

---

## Converters
### Serialisation / Deserialisation

^
- Converters deal with the serialisation of your data objects

---

## Retrofit2: Converters
```java
Retrofit retrofit = new Retrofit.Builder()
  .addConverterFactory(GsonConverterFactory.create())
  .build();
```

^
- Retrofit 1.9 included GsonConverter and had gson as a dependency
- Retrofit 2.1 does not include any converters automatically

---

## Retrofit2: Converters

```java
compile 'com.squareup.retrofit2:converter-gson:2.1.0'
```

^
- No duplication of converters when choosing an alternative
- This covers all of your request and response body converters

---

## Retrofit2: Converters

```java
compile 'com.squareup.retrofit2:converter-gson:2.1.0'
```

moshi, scalars, simplexml, wire, jackson, protobuf

^
- Also available for other adapters

---

![](looking-good.gif)

^
- So good so far...
- What else?

---

![](logging-background.jpeg)

## Logging

^
- Original request logging is no longer included with Retrofit

---

## Retrofit2: Logging

```groovy
dependencies {
  compile 'com.squareup.okhttp3:logging-interceptor:3.4.1'
}
```

^
- Since Retrofit now uses OkHttp as its client

---

## Retrofit2: Logging

```java
HttpLoggingInterceptor logger = new HttpLoggingInterceptor();
logger.setLevel(HttpLoggingInterceptor.Level.BODY);

OkHttpClient client = new OkHttpClient.Builder()
        .addInterceptor(logger)
        .build();
```

^
- Logging must be performed via an interceptor

---

## Adapters

---

## Adapters
### Call -> Asynchronous Consumer

^
- Adapters convert a standard call to another asynchronous consumer
- Unlike Retrofit1 call adapters do not come included

---

## Retrofit2: Adapters

```java
// RxJava: Observable<T>
com.squareup.retrofit2:adapter-rxjava
```

^
- RxJava to use with observables

---

## Retrofit2: Adapters

```java
// RxJava: Observable<T>
com.squareup.retrofit2:adapter-rxjava

// RxJava2: Flowable<T>
com.jakewharton.retrofit:retrofit2-rxjava2-adapter
```

^
- RxJava2 provided by Jake Wharton until RxJava2 stable release

---

## Retrofit2: Adapters

```java
// RxJava: Observable<T>
com.squareup.retrofit2:adapter-rxjava

// RxJava2: Flowable<T>
com.jakewharton.retrofit:retrofit2-rxjava2-adapter

// Java8: CompletableFuture<T>
com.squareup.retrofit:converter-java8
```

^
- Java8 futures for Java projects (not available on Jack compiler)

---

## Retrofit2: Adapters

```java
// RxJava: Observable<T>
com.squareup.retrofit2:adapter-rxjava

// RxJava2: Flowable<T>
com.jakewharton.retrofit:retrofit2-rxjava2-adapter

// Java8: CompletableFuture<T>
com.squareup.retrofit:converter-java8

// Guava: ListenableFuture<T>
com.squareup.retrofit:converter-guava
```

^
- Guava futures if you MultiDex and hate your users

---

## Services

^
- There is no difference between asynchronous and synchronous call definitions

---

## Retrofit2: Services

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

## Retrofit2: Services

```java
/* Retrofit 2.1 */
public interface Service {

  @GET("articles")
  Call<List<Article>> articles();
}
```

^
- Retrofit 2 does not allow this in the interface definition
- Responses are now encapsulated in a parameterized call
- Take another look at the url in this service

---

## Retrofit2: Services

```java
/* Retrofit 1.9 */
@GET("/articles")

/* Retrofit 2.1 */
@GET("articles")
```

^
- Base url resolution provided by HttpUrl.resolve()
- Use relative urls for your partial endpoints

---

## Retrofit2: Services

```java
public interface AwsService {

  @GET
  public Call<File> getImage(@Url String url);
}
```

^
- Retrofit now supports dynamic urls

---

## Retrofit2: Services

```java
public interface AwsService {

  @GET
  public Call<File> getImage(@Url String url);
}
```

Useful when working with external Services

^
- If you need to upload an image to AWS
- Needed to create a new retrofit client

---

## Retrofit2: Services

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

## Retrofit2: Cancel Requests

```java
/* Retrofit 2.1 */

Call<ResponseBody> call = service.get("...");

call.enqueue(new Callback<ResponseBody>() { ... });

call.cancel();
```

^
- Either because the user has navigated somewhere where the request isn't necessary
- Cancelling on Retrofit 2 is as simple as calling a method on the call
- and you can check if the call was cancelled with `isCancelled()`

---

![](baldwin-nice.gif)

---

![inline](all-the-things-emoji.png)
# Rx all the things!

^
- For the rest of this I'm going to assume the use of RxJava adapters

---

## Life is Good

![](life-is-good.gif)

^
- Life is good right now
- This migration seems easy!

---

![](suspicious.gif)

## What happens when things go wrong?

^
- How would retrofit1 handle server errors

---

## Retrofit2: Errors

^
- Lets say we have a standard user journey
- But the user puts in a wrong email address

---

## Retrofit2: Errors

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

```java
/* Retrofit 1.9 */
service.login(username, password)
  .subscribe(user -> {
    session.storeUser(user);
    view.gotoProfile();
  }, throwable -> {
    if (throwable instanceof RetrofitError) {
      processServerError(
        ((RetrofitError) throwable).getBodyAs(ServerError.class)
      );
    }

    view.onError(throwable.getMessage());
  });
```

^
- How would you consume this error in Retrofit 1?
- Goto user profile on success, process server error on failure

---

```
FAILURE: Build failed with an exception.
`error: cannot find symbol class RetrofitError`
```

---

![](sobbing-continues.gif)

^
- What happened to RetrofitError?
- Has it moved? renamed?
- What can I do about this?

---

`* goes to stackoverflow.com *`

---

## RetrofitError is dead.
### Long live HttpException.

---

## RetrofitError

^
- Lets first take a look at RetrofitError
- What was it doing for us and why it gets such a bad rep

---

## Retrofit: RetrofitError

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

^
- RetrofitError allows you to cast the error body response
- Violation of single responsibility principle

---

> "How do you know if it was a conversion error, network error, random error inside Retrofit? Yuck."
-- Jake Wharton (Jul 25, 2013)

---

## Retrofit: RetrofitError

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

Introduced in Retrofit v1.7 (Oct 8, 2014)

---

> "I find that API to awful (which I'm allowed to say as the author)"
-- Jake Wharton (Nov 7, 2015)

^
- Forces creating messy bug prone code in the caller

---

## What Now?

^
- So what do we do now?
- Lets revisit our login code

---

```java
/* Retrofit 2.1 */
service.login(username, password)
  .subscribe(user -> {
    session.storeUser(user);
    view.gotoProfile();
  }, throwable -> {
    // Now What?!
  });
```

^
- How can we react to this throwable?

---

## Exceptions

^
- In Retrofit2 there are two main exception

---

## Retrofit2: Exceptions
### IOException: Network errors

^
- Loss of connectivity
- Serialisation errors
- Hard to know which

---

## Retrofit2: Exceptions
### HttpException: Non 2xx responses

^
- Server errors giving a non-2xx responses

---

## HttpException

---

## Retrofit2: HttpException

- Included in Retrofit2 adapters

---

## Retrofit2: HttpException

- Included in Retrofit2 adapters
- Contains a response object

---

## Retrofit2: HttpException

- Included in Retrofit2 adapters
- Contains a response object
- Response is not serialisable

^
- So what will our throwable look like?

---

```java
/* Retrofit 2.1 */
throwable -> {
  if (throwable instanceof HttpException) {
    // non-2xx error
  }

  else if (throwable instanceof IOException) {
    // Network or conversion error
  }

  else {
    // ¯\_(ツ)_/¯
  }
}
```

---

## Cool story bro

^
- Ok cool so we know what we're dealing with
- How can we deal with it?

---

## "RetrofitException"

---

![inline](retrofit-exception-gist.png)

gist.github.com/koesie10/bc6c62520401cc7c858f

^
- Introduces Retrofit1 error handling in Retrofit2
- Doesn't really solve the problem that RetrofitError had

---

```java
@AutoValue
public abstract class ServerError implements Throwable {
  public int getStatusCode()
  public String message();
}
```

^
- Lets say we have a server error object
- For brevity here I'm using AutoValue

---

```java
// Server error response body converter
Converter<ResponseBody, ServerError> converter =
  retrofit.responseBodyConverter(ServerError.class, new Annotation[0]);
```

^
- Create a response body converter from the Retrofit adapter

---

```java
public void login(String username, String password) {
  service.login(username, password)
    .onErrorResumeNext(throwable -> {
      if (throwable instanceof HttpException) {

        // Get error response body
        Response<?> response = ((HttpException) throwable).response();

        // Return serialised ServerError
        return Observable.error(converter.convert(response.errorBody()));
      }

      // Return any other errors
      return Observable.error(throwable);
    });
}
```

^
- Use Rx onErrorResumeNext to check for an HttpException

---

## RxJava Adapters

```java
public class Service {

  // Calls onNext with the deserialized body for 2XX responses and calls onError
  // with HttpException for non-2XX responses and IOException for network errors.
  Observable<T> call();

  // Calls onNext with a Response object for all HTTP responses and calls
  // onError with IOException for network errors.
  Observable<Response<T>> call();

  // Calls onNext with a Result object for all HTTP responses and errors.
  Observable<Result<T>> call();

}
```

---

## RxJava2 Adapter Observables

```java
// Flowable<Response<T>>: Creates observable from call, throws IOException
public class CallObserver<T> extends Observable<Response<T>> {
  CallObservable(Call<T> originalCall) {}
}

// Flowable<T>: Wraps CallObserver, gives HttpException on server error
public class BodyObserver<T> extends Observable<T> {
  BodyObservable(Observable<Response<T>> upstream) {}
}

// Flowable<Result<T>>: Wraps CallObserver, includes IOException inside Result
public class ResultObservable<T> extends Observable<Result<T>> {
  ResultObservable(Observable<Response<T>> upstream) {}
}
```

---

> "I love Factories!"
-- @alosdev
