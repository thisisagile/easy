# easy
[![Easy pipeline](https://github.com/thisisagile/easy/workflows/Easy%20pipeline/badge.svg?branch=main)](https://github.com/thisisagile/easy/actions?query=workflow%3A%22Easy+pipeline%22)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=thisisagile_easy&metric=alert_status)](https://sonarcloud.io/dashboard?id=thisisagile_easy)
[![npm package](https://img.shields.io/npm/v/@thisisagile/easy.svg)](https://www.npmjs.com/package/@thisisagile/easy)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Straightforward library for building domain-driven microservice architectures, implementing a simple evolutionary architecture. This library is distilled from projects where the teams I've worked with built platforms based on a simple, common architecture where each service centers around a small part of the platform domain.

This library will include best and foremost simple practices to support building microservices, based on the following software architecture and patterns:

# Architecture
Microservices built with easy have a four layered architecture: services, process, domain, data. Each of the layers serves a single purpose and follows clear patterns and communications.

# Data
It is the responsibility of the classes in the data layer to fetch and deliver data from outside the microservices. This data can come from e.g. a file system, relational and other types of databases (we prefer document databases), or from other services on your domain, or from services outside your domain. Classes performing this function are called gateways. 

# Domain
In the domain layer there are supertypes to model the domain, such as entities, records, value objects and enumerations.
The domain layer also knows the repository layer supertype, for handling instances of entities and structs.

## Entities
Using **easy**, your entities, as described in domain driven design, inherit from the `Entity` class. This gives your entities identity. The default implementation of `Entity` provides a generated `id` property (it's a UUID by default). 

All classes that inherit from `Record`  or `Entity` will have an internal object called `state`. Normally, the state of an object is passed to it during construction. Using this internal object `state` allows for easy mapping of the content of an entity, which is usually JSON, to its properties. We prefer to keep our entities immutable. Properties therefore can be readonly. An update to an object is considered a state change and should therefore always return a new instance of the entity, instead of modifying the state of the current instance.

An example of an entity is the `Movie` class below. Here the content of the object comes from an external service (called Omdb), and is mapped to the actual properties of the `Movie` class.

    export class Movie extends Entity {
        @required() readonly id: Id = this.state.imdbID;
        @required() readonly title: string = this.state.Title;
        @required() readonly year: number = this.state.Year;
        readonly poster: string = this.state.Poster;
        
        update = (add?: Json): Movie => new Movie(this.toJSON(add));
    }

Some of the properties of `Movie` have decorators, such as `@required`. These decorators can be used to validate the object, using the separate `validate()` function. 

# Process
The process layer contains use cases, that model your process.

# Services
The services layer has resource as the layer supertype, to model the API exposed.

# Utilities
Additionally, this library contains utility classes for standardizing e.g. uri's, and ids, constructors, lists, queries, and errors. Quite often these are constructed as monads, which renders robust code.

This library will contain a simple validation mechanism, using decorators.

We keep this library simple on purpose, extending it using additional libraries and frameworks should be possible simply by embedding their API's.

Likely we will use jest for unit testing, wrap axios for request handling, and a simple mongodb connector, and wrap tsyringe for dependency injection.

Please note: we are slowly adding more value to the library, step by step. Most of our additions are useful as such, both it will take some effort for the full architecture to be in place to implement fully working microservices. Please bare with us.
