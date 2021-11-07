# Zipster

[![NPM Version](https://badge.fury.io/js/zipster.svg)](https://badge.fury.io/js/zipster)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ToeFungi_zipster&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ToeFungi_zipster)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=ToeFungi_zipster&metric=coverage)](https://sonarcloud.io/summary/new_code?id=ToeFungi_zipster)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=ToeFungi_zipster&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=ToeFungi_zipster)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=ToeFungi_zipster&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=ToeFungi_zipster)

Zipster aims to enable developers to rapidly and easily create password-protected ZIP files. With various handy
functions available to satisfy different use-cases, this promise-based library is built using TypeScript and uses native
Node functionality and leverages two primary libraries.

Although the fundamental principle behind Zipster is password-protected ZIP files, you can also create unprotected ZIP
files and pass in a number of different options to configure how your ZIP files are created.

**This project is still in development. Please report any bugs or feature requests as an
[issue](https://github.com/ToeFungi/zipper/issues/new).**

## Contents

- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
    - [Create a ZIP with a single file](#frompathpath-string-options-options)
    - [Create a ZIP with multiple files](#frompathspaths-string-options-options)
    - [Create a ZIP from a directory](#fromdirectorypath-string-options-options)
    - [Options](#options)
    - [Password Example](#password-example)
- [Tests](#running-tests)
- [Issues](#issues)
- [Contributions](#contributions)
- [License](#license)

## Getting Started

You can get started with cloning the Zipster repository by using the following command:

```bash
$ git clone git@github.com:ToeFungi/zipster.git
$ cd zipster
$ npm i
```

## Installation

Use the following command to install the Zipster package:

```
npm i zipster
```

## Usage

There are various ways in which you can create your ZIP file and even more options on how you want it configured. You
can set a password or not, compress or not, specify patterns to match for zipping files, etc.

Here are some examples of how to use the functionality provided by this package:

#### .fromPath(path: string, options: Options)

Create an unprotected ZIP file containing a single specified file

```typescript
const path = '/some/path/to/my/file.txt'
const options: Options = {
  format: Formats.ZIP
}

const zipster = new Zipster()
zipster.fromPath(path, options)
  .then((outputPath: string) => console.log({ outputPath }, 'Successfully created ZIP'))
```

#### .fromPaths(paths: string[], options: Options)

Create an unprotected ZIP file containing multiple specified files

```typescript
const paths = [
  '/some/path/to/my/file.txt',
  '/some/path/to/my/file.csv'
]
const options: Options = {
  format: Formats.ZIP
}

const zipster = new Zipster()
zipster.fromPaths(paths, options)
  .then((outputPath: string) => console.log({ outputPath }, 'Successfully created ZIP'))
```

#### .fromDirectory(path: string, options: Options)

Create an unprotected ZIP file containing all the sub-directories at a given path, retaining the folder structure of the
sub-directories

```typescript
const path = '/some/path/to/my/directory'
const options: Options = {
  format: Formats.ZIP
}

const zipster = new Zipster()
zipster.fromDirectory(path, options)
  .then((outputPath: string) => console.log({ outputPath }, 'Successfully created ZIP'))
```

#### .fromPattern(path: string, pattern: string, options: Options)

Create an unprotected ZIP file containing all the files matching the given pattern at the given path

```typescript
const path = '/some/path/to/my/directory'
const pattern = 'foo*.txt'
const options: Options = {
  format: Formats.ZIP
}

const zipster = new Zipster()
zipster.fromPattern(path, pattern, options)
  .then((outputPath: string) => console.log({ outputPath }, 'Successfully created ZIP'))
```

#### Options

| Option      | Default     | Description                                                |
|-------------|-------------|------------------------------------------------------------|
| format      | null        | Whether the ZIP should be password protected or not        |
| password    | null        | The password for the ZIP if applicable format is specified |
| output name | UUID V4     | The name of the ZIP file to be created                     |
| output path | OS Specific | The path to where the ZIP file should be created           |

#### Password Example

Create a password-protected ZIP file containing the specified file

```typescript
const path = '/some/path/to/my/file.txt'
const options: Options = {
  format: Formats.ZIP_ENCRYPTABLE,
  password: 'super-sensitive-password'
}

const zipster = new Zipster()
zipster.fromPath(path, options)
  .then((outputPath: string) => console.log({ outputPath }, 'Successfully created ZIP'))
```

## Tests

To run tests, you should be able to simply run be able to run the following.

```bash
$ npm run test
$ npm run coverage
```

The testing framework used is Mocha. Chai, Chai-as-promised and nyc are used for assertions and coverage reporting
respectively. Ensure that any new changes are covered by an accompanying test suite.

## Issues

If you find any problems while working with this library, please log an issue
[here](https://github.com/ToeFungi/zipster/issues) so that development can begin to rectify the error.

## Contributions

This project is completely open source and as such, you are invited to make contributions. Fork the project, make some
changes and make the pull request. If you have any feedback regarding the functionality, please don't hesitate to open
an issue so this can be resolved. Please ensure that any pull requests have unit tests that cover any additional
functionality.

## License

MIT License

Copyright (c) 2021 Alex Pickering
