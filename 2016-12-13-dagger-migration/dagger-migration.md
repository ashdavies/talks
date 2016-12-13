# Dagger Migration
## Problems, Solutions and Proposals

---

# Ease of Migration
- Migration guides only for Coffee makers

---

# Ease of Migration
- Migration guides only for Coffee makers
- Possible to use Dagger 1 & Dagger 2 but not helpful

---

# Ease of Migration
- Migration guides only for Coffee makers
- Possible to use Dagger 1 & Dagger 2 but not helpful
- We are already using scoped application graphs

---

# Ease of Migration
- Migration guides only for Coffee makers
- Possible to use Dagger 1 & Dagger 2 but not helpful
- We are already using scoped application graphs
- We are already using mocked dependencies

---

# Ease of Migration
- Migration guides only for Coffee makers
- Possible to use Dagger 1 & Dagger 2 but not helpful
- We are already using scoped application graphs
- We are already using mocked dependencies
- Fragments assume Injector implementation

---

# Ease of Migration
- Migration guides only for Coffee makers
- Possible to use Dagger 1 & Dagger 2 but not helpful
- We are already using scoped application graphs
- We are already using mocked dependencies
- Fragments assume Injector implementation
- Dependency injection used by convenience

---

# Assessment:
## Not Easy

---

# Proposal:
- Break down migration into smaller movements

---

# Proposal:
- Break down migration into smaller movements
- Simulate Dagger 2 architecture with Dagger 1

---

# Proposal:
- Break down migration into smaller movements
- Simulate Dagger 2 architecture with Dagger 1
- Limit access to Dagger 1 ObjectGraph

---

# Proposal:
- Break down migration into smaller movements
- Simulate Dagger 2 architecture with Dagger 1
- Limit access to Dagger 1 ObjectGraph
- Manually implement Dagger 2 style

---

## [fit] AN-1220 Create scoped graphs for required activities
## [fit] AN-1226 Persist injector though configuration change

**Problem**
- Retention of custom non configuration instance not used consistently

---

## [fit] AN-1220 Create scoped graphs for required activities
## [fit] AN-1226 Persist injector though configuration change

**Problem**
- Retention of custom non configuration instance not used consistently

**Solution**
- Creating scoped graphs for remaining activities
- Implement mandatory scoped graph persistence

---

## [fit] AN-1300 Repurpose Injector as Component wrapper
## [fit] AN-1221 Wrap graph with custom Component class
## [fit] AN-1224 Create components for each scoped graph

**Problem**
- Components should have injection responsibility

---

## [fit] AN-1300 Repurpose Injector as Component wrapper
## [fit] AN-1221 Wrap graph with custom Component class
## [fit] AN-1224 Create components for each scoped graph

**Problem**
- Components should have injection responsibility

**Solution**
- Wrap existing application graph
- Create components for each graph

---

## [fit] AN-1238 Reduce usage of Component casting

**Problem**
- Fragments cast activity context to injector
- Components will be many, not just a single interface
- Activity not guaranteed to have expected component

---

## [fit] AN-1238 Reduce usage of Component casting

**Problem**
- Fragments cast activity context to injector
- Components will be many, not just a single interface
- Activity not guaranteed to have expected component

**Solution**
- Retrieve component from application context

---

## [fit] AN-1358 Remove Injection for parameterized types

**Problem**
- Dagger 2 can only inject explicit parameterized types

---

## [fit] AN-1358 Remove Injection for parameterized types

**Problem**
- Dagger 2 can only inject explicit parameterized types

**Solution**
- Provide injection targets as inner "helper" classes

---

## [fit] AN-1223 Prepare activity injection interface
## [fit] AN-1239 Provide alternative module override
## [fit] AN-1344 DaggerActivity to ComponentActivity

**Problem**
- Injection targets must be explicitly defined
- Injection targets must define their component

---

## [fit] AN-1223 Prepare activity injection interface
## [fit] AN-1239 Provide alternative module override
## [fit] AN-1344 DaggerActivity to ComponentActivity

**Problem**
- Injection targets must be explicitly defined
- Injection targets must define their component

**Solution**
- Provide methods invokable by base implementation

---

# Remaining

### AN-1222 Serialise module list
### AN-394 Split up current modules
### AN-1225 Update Dagger version

---

# Problems

---

# Problems
### Module provisions **cannot** be overridden

---

# Problems
### Module provisions **cannot** be overridden
### Overriden modules **cannot** change method signature

---

# Problems
### Module provisions **cannot** be overridden
### Overriden modules **cannot** change method signature
### Subcomponent builders **cannot** cannot be extended

---

# Problems
### Module provisions **cannot** be overridden
### Overriden modules **cannot** change method signature
### Subcomponent builders **cannot** cannot be extended
### Module provisions **must** be extracted to new modules

---

# Proposals

---

# `@Inject` vs `@Provides`

---

# `@Inject` vs `@Provides`

- `@Inject` drastically reduces injection targets

---

# `@Inject` vs `@Provides`

- `@Inject` drastically reduces injection targets
- `@Inject` can be overridden by mock modules

---

# `@Inject` vs `@Provides`

- `@Inject` drastically reduces injection targets
- `@Inject` can be overridden by mock modules
- `@Inject` reduces verbosity of modules

---

# `@Inject` vs `@Provides`

- `@Inject` drastically reduces injection targets
- `@Inject` can be overridden by mock modules
- `@Inject` reduces verbosity of modules
- `@Provides` for external or interfaces

---

# `@Inject` vs `@Provides`

- `@Inject` drastically reduces injection targets
- `@Inject` can be overridden by mock modules
- `@Inject` reduces verbosity of modules
- `@Provides` for external or interfaces
- `@Qualifier` for internal dependencies

---

# `@Inject` vs `@Provides`

- `@Inject` drastically reduces injection targets
- `@Inject` can be overridden by mock modules
- `@Inject` reduces verbosity of modules
- `@Provides` for external or interfaces
- `@Qualifier` for internal dependencies
- `@Reusable` for expensive dependencies

---

# Testing

- Do not use Dagger for unit tests

---

# Testing

- Do not use Dagger for unit tests
- Do not subclassing modules

---

# Testing

- Do not use Dagger for unit tests
- Do not subclassing modules
- Do not use Subcomponent builders

---

# Testing

- Do not use Dagger for unit tests
- Do not subclassing modules
- Do not use Subcomponent builders
- One module per published binding

---

# Testing

- Do not use Dagger for unit tests
- Do not subclassing modules
- Do not use Subcomponent builders
- One module per published binding
- Include no-alternative bindings

---

```java
/**
 * Provides auth bindings that will not change in different
 * auth configurations, such as the current user.
 */

@Module
class AuthModule {

  @Provides
  static User currentUser(AuthManager authManager) {
    return authManager.currentUser();
  }

  /**
   * Other bindings that don’t differ among AuthManager implementations.
   */
}
```

---

```java
/**
 * Provides a {@link AuthManager} that uses OAuth.
 */

@Module(includes = AuthModule.class) // Include no-alternative bindings.
class OAuthModule {

  @Provides
  static AuthManager authManager(OAuthManager authManager) {
    return authManager;
  }

  /**
   * Other bindings used only by OAuthManager.
   */
}
```

---

```java
/**
 * Provides a fake {@link AuthManager} for testing.
 */

@Module(includes = AuthModule.class) // Include no-alternative bindings.
class FakeAuthModule {

  @Provides
  static AuthManager authManager(FakeAuthManager authManager) {
    return authManager;
  }

  /**
   * Other bindings used only by FakeAuthManager.
   */
}
```

---

# TODO

---

# TODO

- Serialise `RequesterModule` modules

---

# TODO

- Serialise `RequesterModule` modules
- Move conflicting provisions to new modules

---

# TODO

- Serialise `RequesterModule` modules
- Move conflicting provisions to new modules
- Manually create generated components

---

# TODO

- Serialise `RequesterModule` modules
- Move conflicting provisions to new modules
- Manually create generated components
- Update Dagger version

---

# TODO

- Serialise `RequesterModule` modules
- Move conflicting provisions to new modules
- Manually create generated components
- Update Dagger version
- Profit.
