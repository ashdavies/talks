# Dagger (Again...)
## Migration Review & 2.10 Update

---

# The Great Migration
## 2016 - 2017

- Dagger 1 with Dagger 2 behaviour
- Created global application component
- Migrated scoped graphs to subcomponents
- Introduction of additional scope(s)

---

# Learnings

- Migrating whilst still in use
- It took too fucking long

---

# Learnings

- Hard to encourage clean usage
- Very difficult to mock graphs
- Modules now contain partial mocks

---

# Now
## Subcomponents

---

```java
public AwesomeActivity extends ComponentActivity<AwesomeComponent> {

  private String awesomeParameter;

  @Override
  protected ActivityComponent<AwesomeActivity> createComponent() {
    return RequesterApplication.from(this).getBuilder(AwesomeActivity.class)
      .module(new AwesomeModule(awesomeParameter))
      .build();
  }

  @Override
  public void inject(ActivityComponent<AwesomeActivity> component) {
    component.injectMembers(this);
  }
}
```

^
- Component is of a weaker type
- Injects only the activity
- Dependency on the application

---

```java
public AwesomeActivity extends ComponentActivity<AwesomeComponent> {

  private String awesomeParameter;

  @Override
  protected AwesomeComponent createComponent() {
    return Injector.<AwesomeActivity, AwesomeComponent.Builder>getBuilder(this)
        .module(new AwesomeModule(awesomeParameter)
        .build();
  }

  @Override
  public void inject(AwesomeComponent component) {
    component.injectMembers(this);
  }
}
```

^
- Abstracted dependency of the application
- Components now have narrower type
- Can be used for fragment injection

---

```java
@Module(
  subcomponents = {
    ActivationComponent.class,
    BaufiComponent.class,
    ConversationComponent.class
  }
)
public abstract class ActivityBindingModule {

  @Binds
  @IntoMap
  @ComponentActivityKey(ActivationActivity.class)
  public abstract ActivityComponent.Builder
      activationComponentBuilder(ActivationComponent.Builder builder);

  @Binds
  @IntoMap
  @ComponentActivityKey(BaufiActivity.class)
  public abstract ActivityComponent.Builder
      baufiComponentBuilder(BaufiComponent.Builder builder);

  @Binds
  @IntoMap
  @ComponentActivityKey(ConversationActivity.class)
  public abstract ActivityComponent.Builder
      conversationComponentBuilder(ConversationComponent.Builder builder);
}
```

^
- Every subcomponent listed
- Unclear and unscalable

---


# Component Hierarchy
## Fragment Components

---

# Fragment Components

- Sharing parent activity components
- Tight coupling to component provider

---

# Fragment Components

- Usage of additional scopes?
- Introduce session or flow scope?
- Create fragment components?

---

# Dagger 2.10
## Android Injection ~~Migration~~

^
- Not a migration
- Still compatible
- Additional modules

^
- We tried to create something unimplemented
- Introduced with subcomponent multi-bindings
- Influenced by Gregory Kick

^
- Only affects fragment / activity injection
- Views can continue to use application component

---

# Subcomponent
## Dagger 2.0

---

```java
@Subcomponent(modules = AwesomeModule.class)
public interface AwesomeComponent extends ActivityComponent<AwesomeActivity> {

  void injectMembers(AwesomeFragment fragment);

  @Subcomponent.Builder
  interface Builder
      extends ActivityComponent.Builder<AwesomeActivity, AwesomeComponent> {
  }
}
```

---

# Subcomponent
## Dagger 2.10

---

```java
@Subcomponent
interface AwesomeComponent extends AndroidInjector<AwesomeActivity> {

  @Subcomponent.Builder
  public abstract class Builder extends AndroidInjector.Builder<AwesomeActivity> {
  }
}
```

^
- Activity components do not inject Fragments
- Subcomponents generally unaware of modules

---

# Module
## Dagger 2.0

---

```java
@Module
abstract class AwesomeModule {

  // Nothing to see here ... move along
}
```

---

# Module
## Dagger 2.10

---

```java
@Module(subcomponents = AwesomeComponent.class) {

  @Binds
  @IntoMap
  @ActivitKey(AwesomeActivity.class)
  abstract AndroidInjector.Factory<? extends Activity>
      injector(AwesomeComponent.Builder builder);
}
```

^
- Component defined in module instead of activity binding module
- Module included into application module

---

# Activity
## Dagger 2.0

---

```java
public AwesomeActivity extends ComponentActivity<AwesomeComponent> {

  private String awesomeParameter;

  @Override
  protected AwesomeComponent createComponent() {
    return Injector.<AwesomeActivity, AwesomeComponent.Builder>getBuilder(this)
        .module(new AwesomeModule(awesomeParameter)
        .build();
  }

  @Override
  public void inject(AwesomeComponent component) {
    component.injectMembers(this);
  }
}
```

---

# Activity
## Dagger 2.10

---

```java
public AwesomeActivity extends AppCompatActivity {

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    AndroidSupportInjection.inject(this);
  }
}
```

^
- No need to extend ComponentActivity or BaseActivity
- Injection handled wherever it needs to

---

# Application
## 2.0

---

```java
public class AwesomeApplication extends Application {

  @Inject Map<Class<? extends ComponentActivity>,
      ActivityComponent.Builder> builders;

  @Override
  @SuppressWarnings("unchecked")
  public <T extends ComponentActivity, B extends
      ActivityComponent.Builder<T, ? extends ActivityComponent>>
      B getBuilder(Class<T> kls) {
    return (B) builders.get(kls);
  }
}
```

---

# Application
## 2.10

---

```java
public class AwesomeApplication extends Application {

  @Inject DispatchingAndroidInjector<Activity> injector;

  @Override
  public DispatchingAndroidInjector<Activity> activityInjector() {
    return injector;
  }
}
```

---

# Fragment Components
## 2.10

---

```java
public class AwesomeActivity extends AppCompatActivity {

  @Inject DispatchingAndroidInjector<Fragment> injector;

  @Override
  public DispatchingAndroidInjector<Fragment> fragmentInjector() {
    return injector;
  }
}
```

^
- We now have a recommended way to handle fragment injection
- No direct coupling of activity to fragment
- Activity needs fragment module

---

```java
public class AwesomeFragment extends Fragment {

  @Override
  public void onAttach(Context context) {
    super.onAttach(context);
    AndroidSupportInjection.inject(this);
  }
}
```

---

# Considerations
## Intentional Restrictions

- Module constructors
- Component persistence

---

# Considerations
## Module Constructors

---

```java
@Module
public class AwesomeModule {

  private static final String AWESOME_PARAMETER = "...";

  @Provides
  @Named(AWESOME_PARAMETER)
  String awesomeParameter(AwesomeActivity awesomeActivity) {
    return awesomeActivity.getAwesomeParameter();
  }
}
```

---

# Component Persistence
## Understanding Scope

---

# Understanding Scope

- Scope exceeds injection target
- Malformed by Android framework

---

# Understanding Scope
## State Persistence

- `savedInstanceState`
- `BundleService`
- `@RetainScope`

^
- Configuration change is an Android problem
- The Times have implemented a BundleService
- Should have an Android solution

---

# Understanding Scope
## Proposed Scopes

- `@ApplicationScope`
- `@ActivityScope`
- `@FragmentScope`
- `@RetainScope`?

---

# Redundancies
## Potential Deprecations

---

# Redundancies
## Potential Deprecations

- ~~ActivityComponent~~
- ~~ApplicationComponentActivity~~
- ~~ApplicationComponentDialogFragment~~
- ~~ApplicationComponentFragment~~
- ~~ComponentActivity~~
- ~~ComponentFragment~~
- ~~ComponentDialogFragment~~

---

# Redundancies
## Potential Deprecations

- ~~ComponentActivityKey~~
- ~~HasComponent~~
- ~~HasSubcomponents~~
- ~~Injector~~
- ~~SubScope~~
- ~~UsesComponent~~

---

# Redundancies
## Potential Deprecations
### Basically Everything

^
- Dagger works best when its able to inject everything
- We did some hard learning and changes
- Now we can rely on Google's Dagger support

---

# Considerations
## BaseActivity

- Composition vs Inheritance (CompositeAndroid)
- NavigationActivity -> BaseActivity -> Activity

^
- Must now extend AppCompatActivity
- BaseActivity extends ComponentActivity
- Break off functionality from BaseActivity

---

```java
public class SmellyActivity extends HomeActivity<Void> {

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    AndroidSupportInjection.inject(this);
  }

  @Override
  protected Void createComponent() {
    return null;
  }

  @Override
  public void inject(Void aVoid) {
    /* no op */
  }
}
```

---

# Features
## Alternative Bindings

---

## Alternative bindings

- `@Binds` - performant abstract and static methods
- `@Provides` - mostly not compatible with `@Binds`
- `@Reusable` - for expensive dependencies only!

^
- Modules should be abstract wherever possible
- Better performance and clearer dependencies
- Reusable is not a replacement for scope
