 # easy
 The easiest framework to build robust and stable microservices in TypeScript on node.js.

<a href="https://www.npmjs.com/package/@thisisagile/easy" target="_blank"><img src="https://img.shields.io/npm/v/@thisisagile/easy.svg" alt="npm version" /></a>
<a href="https://www.npmjs.com/package/@thisisagile/easy" target="_blank"><img src="https://img.shields.io/npm/dm/@thisisagile/easy.svg" alt="npm downloads" /></a>
<a href="https://github.com/thisisagile/easy/actions?query=workflow%3A%22pipeline%22"><img src="https://github.com/thisisagile/easy/workflows/pipeline/badge.svg?branch=main" alt="pipeline status" /></a>
<a href="https://sonarcloud.io/dashboard?id=thisisagile_easy" target="_blank"><img src="https://sonarcloud.io/api/project_badges/measure?project=thisisagile_easy&metric=alert_status" alt="quality gate" /></a>
<a href="https://github.com/semantic-release/semantic-release" target="_blank"><img src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg" alt="semantic-release" /></a>
<a href="https://sonarcloud.io/dashboard?id=thisisagile_easy" target="_blank"><img src="https://sonarcloud.io/api/project_badges/measure?project=thisisagile_easy&metric=coverage" alt="coverage" /></a>

## Note
The **easy** framework captures the best practices we (the contributors) have build up on implementing microservices architectures at a diverse range of clients in Typescript, running on node.js and deployed on Amazon, Google Cloud and even on Windows Server. The companies that contribute / have contributed include a well-known Dutch insurance company, an insurance software vendor, an IoT scale-up, a software vendor in logistics and an online e-commerce company. From those practices, the **easy** framework grows step-by-step. 

The **easy** framework already works fine in many situations. However, it also continuously improves and grows. It is a work-in-progress, including its documentation. Being a framework, it probably not always perfectly fits your situation. Therefore, we aim to implement **easy** so that it is straightforward, simple to use, standardized, and open to extensions. 

## Welcome!
The **easy** framework is a straightforward, smart library for building domain-driven microservice architectures, implementing a simple evolutionary architecture. This library is distilled from projects where the teams I've worked with built platforms based on a simple, common architecture where each service centers around a small part of the platform domain.

This framework will include best and foremost simple practices to support building microservices, based on the following software architecture and patterns:

## Architecture
Microservices built with **easy** have a four layered architecture: *services*, *process*, *domain*, *data*. Each of the layers serves a single purpose and follows clear patterns and communications:

- *Services*. This layer contains resource classes, which handle requests to the microservice's endpoints.
- *Process*. This second layer contains use cases, which handle all process logic of the microservice.
- *Domain*. At the heart of each microservice lies its domain, which consists of entities, values objects, enumerations and structs. To approach the objects in the domain, this layer also contains repositories. 
- *Data*. The bottom layer of each microservice contains gateways, that allow the microservice to interact with its outside world, such as relational databases, no-sql databases, file storage or other services.

The **easy** framework supports this architecture by supplying root classes (or layer supertypes) for each of the types describe above. The repository `easy-test` contains utilities to assist you with testing **easy** specific constructs, such as `toMatchText` or `toMatchPath` for checking paths in uri's. The repository `easy-sample` contains examples of microservices built with the **easy** framework.

## Root
At the root of each microservice built using **easy**, there is a class that inherits from `Service`. These are used to initiate the service, set the `port` at which it runs,  register all resource classes, and start the service. An example services class is the one below for a movie service.

    SampleService.Movie
      .with(MoviesResource, MovieResource)
      .atPort(9001)
      .start();

This movie service registers two resources, `MoviesResource` and `MovieResource`, each of which handle endpoints. The service listens at port `9001`.

In general, you will not build a single microservice, but rather a collection of microservices, each responsible for a distinct part of the complete business domain. In that case, it can be useful to build a root class for your services, such as the `SampleService` class below. 

    class SampleService extends Service {
      static readonly Movie = new SampleService('movie');
      pre = () => [correlation];
      post = () => [error, notFound];
    }

The `SampleService` inherits directly from the `Service` layer supertype from **easy**. The methods `pre()` and `post()` can be used to register middleware (by default **easy** uses express as its web server). However, this can easily be changed if you require so. The middlewares `correlation`, `error` and `notFound` are also provided by **easy**.  

## Services
The services layer has resource as the layer supertype, to model the API exposed.

## Process
The process layer contains use cases, that model your process.

## Domain
In the domain layer there are supertypes to model the domain, such as entities, records, value objects and enumerations.
The domain layer also knows the repository layer supertype, for handling instances of entities and structs.

### Entities
Using **easy**, your entities, as described in domain driven design, inherit from the `Entity` class. This gives your entities identity. The default implementation of `Entity` provides a generated `id` property (it's a UUID by default). 

All classes that inherit from `Record` or `Entity` will have an internal object called `state`. Normally, the state of an object is passed to it during construction. Using this internal object `state` allows for easy mapping of the content of an entity, which is usually JSON, to its properties. We prefer to keep our entities immutable. Properties therefore can be readonly. An update to an object is considered a state change and should therefore always return a new instance of the entity, instead of modifying the state of the current instance.

An example of an entity is the `Movie` class below. Here the content of the object comes from an external service (called OMDb), and is mapped to the actual properties of the `Movie` class.

    export class Movie extends Entity {
        @required() readonly id: Id = this.state.imdbID;
        @required() readonly title: string = this.state.Title;
        @required() readonly year: number = this.state.Year;
        readonly poster: string = this.state.Poster;
        
        update = (add?: Json): Movie => new Movie(this.toJSON(add));
    }

Some properties of `Movie` have decorators, such as `@required`. These decorators can be used to validate the object, using the separate `validate()` function. 

### Enumerables
Most modern programming languages support the use of enumerables. The goal of enumerables is to allow only a limited set of values to be chosen for a particular property or passed as a parameter of a function, or its return type. Although this seems trivial, there are some drawbacks to using enumerables. 

First, in most languages, you can not inherit from enumerables. As a result, if you define an enumerable in a library, and would like to add values to it in another repository, this is not possible. If you would, as we do in **easy** support a list of scopes, we could have created an enumerable `Scope`, with the scopes we see. However, if you use **easy** and would like to add your own scopes, this is not possible with a default enumerable.

Secondly, in most languages (Java not included), enumerations only have two properties, the name and the index of its items. If you want to have some more properties on you enumerations, or add some behavior, an enumerable is not your best bet.

Thirdly, and perhaps the most dangerous one, if you persist your enumerables to a storage facility (a database for instance), enumerations are usually stored using their index. This makes the data hard to interpret. After all, what does scope `2` really mean? But even worse, if you would add more items to your enumerable later on, the index of the items might alter, and hence the stored data gets a different meaning, often without noticing.

Therefore, **easy** provides an `Enum` class, which is both extendable and allows you to define meaningful identifiers for your items, and also add additional properties. And still, the behaviour of enumerables created using the `Enum` class, is comparable to traditional enumerables. Here's the `UseCase` enumerable from **easy** as an example.

    export class UseCase extends Enum {
      constructor(readonly scope: Scope, name: string, id: string = text(name).kebab) {
        super(name, id);
      }

      static readonly Main = new UseCase(Scope.Basic, "Main");
      static readonly Login = new UseCase(Scope.Auth, "Login");
      static readonly Logout = new UseCase(Scope.Auth, "Logout");
      static readonly ForgotPassword = new UseCase(Scope.Auth, "Forgot password");
      static readonly ChangePassword = new UseCase(Scope.Auth, "Change password");
    }

The class `UseCase` has five items, such as `UseCase.Main` or `UseCase.ChangePassword`. The constructor has an additional property `scope`, which the `Enum` class does not have, but it calls on the constructor of its superclass to actual make it work. All instances of `Enum` have a property `id`, which is used to store the enums, when used as property on entities, or for comparison.

### Value objects
When we are not so much interested in the identity of objects, as with entities, but are merely interested in the values of the object, we use value objects. A nice useful definition of value objects is presented by Eric Evens in his seminal book *Domain Driven Design*.

> An object that represents a descriptive aspect of the domain with no conceptual identity is called a Value Object. Value Objects are instantiated to represent elements of the design that we care about only for what they are, not who or which they are.

The nice thing about value objects is that you can define them once, and then use everywhere, usually as the types of properties of entities, or even of other value objects. Straightforward examples of value objects are `Email`, and `Address`. The nice thing about value objects is that checking its validity is done at the value object itself, so reusing them does not result in validations being re-implemented everywhere. 

In **easy** we have defined two base classes to implement your value objects. For single valued objects, such as `Email`, we use the base class `Value`. For value objects that have multiple properties, such as `Address` or `Money`, we tend to inherit from the base class `Struct`. Classes that derive from `Value` or `Struct` can be easily validated using the `validate()` function.

### Value
Values are single property objects that are immutable and give meaning to that single property. If you take a string `john.doe@example.com`. This string is a valid string and any validation on whether this string is an email or not needs to be done externally. 

However, if you would create an `Email` value object, the validation can be implemented internally, and the `Email` class can then be reused everywhere emails are needed.
    
    class Email extends Value<string> {
        get isValid(): boolean {
            return validator.isEmail(this.value);
        }
    }

You can now use the above `Email` class as the type of email properties in an entity or struct to make sure that this property is a valid email.

#### DateTime
DateTime is a value object that takes either a Date object, RFC-3339 formatted string, or a number representing Epoch in milliseconds. The json is always an RFC-3339 formatted string. [momentjs](https://momentjs.com/) is used internally.

A few examples of DateTime:

    new DateTime().toJSON() // returns the date formatted as 2021-03-25T08:39:44.000Z
    new DateTime(new Date()).toJSON() // same as above
    DateTime.now.toJSON() // same as above
    new DateTime(1617288152000).toJSON() // returns 2021-04-01T14:42:32.000Z

## Validation
All **easy** microservices evolve around their part of the total business domain you are implementing. Quite usually, in its domain layer, a microservice contains an *aggregate*. In domain-driven design an aggregate maps to a part of the domain that is persisted together. In a relational database, this is usually guarded with a transaction. In a document database, such as MongoDB, this is more often a single serialized `Json` object.

To assure that such an aggregate is valid, when persisted, it is validated, usually starting from the *aggregate root*. In most cases, the aggregate root is the entity that is also the resource that requests are about, and in most often it is also the name of the microservice itself.

### Validate
The **easy** framework supplies a nice and easy mechanism for validating instances of the microservice's aggregate. We supply to easy-to-use functions, named `validate(subject?: unknown): Results` and `validateReject = <T>(subject?: T): Promise<T>`. Although you can pass any object to these functions, in general, you will pass the aggregate root as an argument.

    validate = (dev: Developer): Results => validate(dev);

The `validate()` function will validate its `subject`, and recursively the subjects properties. The outcome of this validation is always a `Results` object, with a list of shortcomings (in its `results` property) of the subject. The `Results` object also has a property `isValid`, which is set to `true` if the subject is valid, or to `false` when it is not.

The `validate()` validates the following:

- First it will check if the object you are validating is actually defined. If not, validation fails.
- On value objects (objects that inherit from the `Value` class), it will check the `isValid` property. Therefore, `isValid` is a suitable location for implementing your value objects validity.
- On enumerations (objects inheriting from the `Enum` class), it will also check the `isValid` property. However, usually, if enumerations are creating through their `byId()` function, if they are not valid, then `byId()` will have returned `undefined`.

### Constraints
The easiest way to validate objects is to use constraints. By adding constraints, as decorators, to the properties and functions on the object you would like to validate, these properties and functions will be checked when the object is validated through calling `validate(myObject)`. **easy** comes with a variety of ready-to-use constraints, but it is also easy (no pun intended) to add your own.

Below is a typical example of an entity, which derives from the `Entity` class in **easy**. It has a number of properties, which are pre-filled with values from the internal state (in `state`) of the entity. As you can see, several of these properties have constraint decorators, such as `@required()`, `@valid()` and `@lt()`. As you can see, properties may have multiple constraints. 

    export class Product extends Entity {
        @required() readonly name: string = this.state.name;
        @required() readonly erpId: Id = this.state.erpId;
        readonly suppliers: List<Id> = toList(this.state.suppliers);
        @valid() readonly ean: Ean = new Ean(this.state.ean);
        @valid() readonly type: ProductType = ProductType.byId(this.state.type);
        readonly brand: string = this.state.brand;
        @gt(0) @lt(100) readonly weight: number = this.state.weight;
        @gt(0, 'Current value {this.height} for height is insufficient.') readonly height: number = this.state.height;
        @gt(0) readonly width: number = this.state.width;
        
        update = (add: Json): Product => new Product(this.merge(add));
    }

When an instance of the `Product` class is validated, through `validate(myProduct)`, all constraint decorators will be checked.
If one or more constraints fail, the object is considered as invalid. The outcome of `validate()` will contain a `Results` object that has a list of `Result` objects (consisting of `message`, `location` and `domain`). Each failed constrained will have added a `Result` to the list.

Each constraint in **easy** comes with a pre-defined and templated message. However, if needed, you can specify your own messages by adding them to the decorators you use. In the example above, we have added a custom message to the `height` property.

### Custom constraints
It is quite easy to create your own custom constraints. Below is an example of a custom constraint `is42`.

    const is42 = (message?: Text): PropertyDecorator => constraint(v => v === 42, message ?? "Property {property} should have value '42' instead of '{actual}'.");

This custom constraint makes use of the `constraint()` function in **easy**. The first parameter for your constraint is a function that returns true or false. When you use your new constraint, as a decorator on a property, the `validate()` function will pick it up automatically. If your constraint fails, the message will be added to the results. 

After creating your custom constraint, you can add them to your classes, like in the example below. 

    class Person extends Struct {
        @valid() readonly age: Age = new Age(this.state.age);
        @is42('Value for real age must be 42, not {actual}.') readonly realAge: number = this.state.age;
    }

P.S. If you create custom constraints that might be helpful for other developers, don't hesitate to do a pull request on **easy**.

## Data
Microservices can use data from a variety of sources, transform and process that data, and expose that to their users through their own API. In the different microservices architecture implementations we've seen data for instance come from:

- a variety of relational databases, such as SQL Server, MySQL, or PostgreSQL.
- a variety of non-relational databases, quite often MongoDB.
- file systems.
- systems the organization owns. such as HR, marketing, ERP or CMS.
- other microservices, internal to the own organization.
- other microservices, implemented with **easy** too.
- other services, external to the own organization.
- systems running in the cloud, such as SalesForce, Office365.
- identity access platforms, often in the cloud.
- last but not least, data could even be fixed in the service itself, as a JSON array for instance.

### Gateways
The data layer in an **easy** microservice provide the service with gateways to all these possible sources. It is the responsibility of the classes in the data layer to fetch and deliver data from outside to the microservices. Depending on the type of the source, **easy** provides a number of gateways, which all implement the `Gateway` interface:

- `InMemoryGateway` (formerly `CollectionGateway`). Used to provide data which is statically stored inside the services, e.g. in a JSON array.
- `RouteGateway`. This allows services to talk to other API's, using a predefined URI. This gateway is often used for talking to other **easy** services, which provide a similar experience and API.
- `MappedRouteGateway`. It allows services to talk to other API's, similar to the `RouteGateway`, but with the ability to map the incoming data (in JSON format) to an internally preferred format. This mapping is based on an instance of the `Map` class.
- `TableGateway`. This allows to get data (in JSON format) from a relational database. It uses a `QueryProvider` to connect to a specific relational database. We're currently adding providers for SQL Server, MySQL, and PostgreSQL. It uses a `Table` to map the incoming data to the format internal to the service.
- `CollectionGateway` (formerly `MongoGateway`). It allows to get data (in JSON format) from a document database, for now MongoDB. It uses the `MongoProvider` to connect to the database. It uses a `Collection` to map the incoming data to the format internal to the service.
 
### The `Map`, `Table`, and `Collection` mappings 
Because data in existing databases rarely supplies the format you need in your service, you can define a `Map` (for other services), a `Table` (for relational databases), or a `Collection` (for MongoDB) to contain all mappings that transform the incoming data to the service internal format, as below.

    export class ErpProductView extends Table {
        readonly db = MyDatabase.Erp;
        readonly id = this.prop('id', { convert: toId.fromLegacyId });
        readonly brandId = this.prop('brandId', { convert: toId.fromLegacyId });

        toString(): string {
            return 'mover_product_view';
        }
    }

The `Map` and `Table` classes have a property called `db` that represents the database to connect to. This is usually an instance of the `Database` enumeration, which in its turn defines the database (and its provider) to connect to, as in the example below.

    export class MyDatabase extends Database {
        static readonly Erp = new Database('openerp', PostgreSqlProvider);
        static readonly Cms = new Database('cms', MySqlProvider);
    }

Next, the `Map`, `Table` and `Collection` classes, describe a list of properties that you would want mapped in the incoming JSON. Properties in the incoming JSON that are not described here are copied automatically. Properties can use converters, e.g. to converter from number to string and vice versa. Converters are bi-directional, as data that needs to go from the service to storage is mapped back to the database specific format too. 

## Handling exceptions in services
During the execution of a request, lots of things can go wrong. Here as some common failures that occur when you try to reach an endpoint, and how **easy** normally responds, and where and how such failures are handled in a typical **easy** microservices:

* For starters, you might not reach the endpoint, because you've typed in the wrong URL. If this happens, and you still reach your microservice, **easy** handles this in the `NotFoundHandler`, which is plugged-in by default.
* If you are not allowed to execute an endpoint, for instance because it is secured with one of the security decorators in **easy**, such as `@requires.useCase()`, `@requires.Scope()` or `@requires.token`, the endpoint will not execute, and you will receive a 403. In this case the middleware from the `SecurityHandler` already breaks the loop, and the code in you microservices is not executed at all.
* All other failures are handled by the `ErrorHandler`, an can result in any custom HTTP status code, most likely a 400, or a 500. In case the caller makes a mistake, the code should come from the 400 range, in cases the microservice makes the mistake, the code comes from the 500 range.

## Utilities
Additionally, this library contains utility classes for standardizing e.g. uri's, and ids, constructors, lists, queries, and errors. Quite often these are constructed as monads, which renders robust code.

### When
The `When` class is a utility that is usually exposed through the `when()` function. It is one of many monads we use in **easy** to make code more robust, and easier to read. It can be used to make validations in promises a little easier such as the following example.

    update = (json: Json): Promise<T> =>
    this.gateway
    .byId(json.id as Id)
    .then(j => when(j).not.isDefined.reject(Exception.DoesNotExist))
    .then(j => new this.ctor(j).update(json))
    .then(i => when(i).not.isValid.reject())
    .then(i => this.gateway.update(toJson(i)))
    .then(j => new this.ctor(j));

The `reject()` method is used to reject the chain, so it will not execute any of its following statements. The `reject()` method accept any error type. A special case is made for `when().not.isValid`. This statement validates the subject of the `when`, and reject with the results (an instance of `Results`) if no parameter is passed to `reject()`.

## Authentication and Authorization
Access to endpoints is configured using the `@requires` decorator group.
If multiple decorators are added, all conditions must be met to access the endpoint.

To use these decorators, the generic `security` middleware must be loaded first.
In most cases, it should be added to the `pre` list of handlers of a service.
The security middleware takes an optional configuration object, which is documented [in code](packages/easy-express/src/express/SecurityHandler.ts).
