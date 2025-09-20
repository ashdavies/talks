autoscale: true
build-lists: true
footer: ashdavies.dev
slide-transition: fade(0.5)
theme: Work, 8

[.text: line-height(2)]
[.footer: ashdavies.dev]

# [fit] Crafting Idiomatic APIs with Kotlin and Compose

## Droidcon Berlin - September '25 🇩🇪

![inline right](kotti-sticker.webp)

---

# What is an API?

```shell
curl --request GET \
  --url "https://api.github.com/octocat" \
  --header "Authorization: Bearer YOUR-TOKEN" \
  --header "X-GitHub-Api-Version: 2022-11-28"
```

^ May think API is exclusively retrieving data

^ Familiar to most developers

---

# Protocols?

- SOAP
- Rest
- GraphQL
- gRPC

^ Protocols define a mechanism for communication, are they APIs?

---

# SDKs?

^ SDKs often built upon public APIs to assist developers

^ Are they considered APIs?

---

# "Ordinary" Code?

^ Code that you might produce in your day job

---

# Unit Tests?

^ Unit tests are production code that doesn't ship

^ Tests verify Production code, need to be understandable

---

# Temporary Code?

^ Under pressure, time constraints, should temporary code by considered an API?

---

> There is nothing more permanent than a temporary solution

^ Perhaps short lived code doesn't need to be perfect?

---

![](everything-is-an-api.jpeg)

# Everything is an API
### Droidcon Berlin - Oct 21'

---

# Who is your API for?

^ API design is fundamentally a consideration to the consumer

---

# Consumers?

^ Maybe you're an SDK or framework developer

^ Your code is used by other developers

^ Consider their requirements

---

# Colleagues?

^ Your code will likely be peer-reviewed

^ Once you push, your code is no longer yours

---

# Future Self?

^ No scenario where your code will not be used by someone else

^ Even if that somebody else is you

---

[.text: line-height(2), text-scale(0.5)]
[.footer: ]

![right](kotti-py-sleepy.jpeg)

# [fit] Thank You!

Ash Davies | ashdavies.dev
Android GDE Berlin
