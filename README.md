# xneek-gpx

> A set of tools for compressing/decompressing gpx tracks. And helper functions to compress numeric sequences into a small string

## Prerequisites

This project requires NodeJS (version 8 or later) and NPM.
[Node](http://nodejs.org/) and [NPM](https://npmjs.org/) are really easy to install.
To make sure you have them available on your machine,
try running the following command.

```sh
$ npm -v && node -v
6.4.1
v8.16.0
```

## Table of contents

- [Project Name](#project-name)
  - [Prerequisites](#prerequisites)
  - [Table of contents](#table-of-contents)
  - [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Running the tests](#running-the-tests)
    - [Building a distribution version](#building-a-distribution-version)
  - [API](#api)
    - [decodeNumbersSequence](#decodeNumbersSequence)
    - [encodeNumbersSequence](#encodeNumbersSequence)
  - [Built With](#built-with)
  - [Versioning](#versioning)
  - [Authors](#authors)
  - [License](#license)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

## Installation

**BEFORE YOU INSTALL:** please read the [prerequisites](#prerequisites)

Start with cloning this repo on your local machine:

```sh
$ git clone https://github.com/xneek/xneek-gpx.git
$ cd xneek-gpx
```

To install and set up the library, run:

```sh
$ npm install xneek-gpx
```

Or if you prefer using Yarn:

```sh
$ yarn add xneek-gpx
```

## Usage

### Running the tests

```sh
$ npm run test
```

### Building a distribution version

```sh
$ npm run build
```

This task will create a distribution version of the project
inside your local `lib/` folder

*Note* this requires
[Building a distribution version](#building-a-distribution-version) first.

## API

### encodeNumbersSequence

```typesript
encodeNumbersSequence(numbersSequence: number[])
```

Encodes a one-dimensional array of numbers (vector) into a string. Both integer and floating point numbers up to 5 decimal places are allowed
Example:

```js
    const seqString = encodeNumbersSequence([53.14299, 53.14238, 53.14184, 53.14128, 53.14067, 53.14003, 53.13944, 53.13885, 53.13828, 53.13767, 53.13705]);
    // returns: unjcIxBjBnBxB~BtBtBpBxBzB
```


### decodeNumbersSequence


```typesript
decodeNumbersSequence(encodedNumbersSequenceStr: string)
```

Decodes a string into a one-dimensional array of numbers (vector).

```js
    const seq = decodeNumbersSequence('unjcIxBjBnBxB~BtBtBpBxBzB');
    // returns: [53.14299, 53.14238, 53.14184, 53.14128, 53.14067, 53.14003, 53.13944, 53.13885, 53.13828, 53.13767, 53.13705]
```


## Built With
* Love

## Versioning

We use [SemVer](http://semver.org/) for versioning. 

## Authors

* **Nikolay Fedoseev** - [xneek](https://github.com/xneek)

## License

[MIT License](https://andreasonny.mit-license.org/2019) 
