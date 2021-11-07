# Zipster

[![NPM Version](https://badge.fury.io/js/zipster.svg)](https://badge.fury.io/js/zipster)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ToeFungi_zipster&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ToeFungi_zipster)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=ToeFungi_zipster&metric=coverage)](https://sonarcloud.io/summary/new_code?id=ToeFungi_zipster)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=ToeFungi_zipster&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=ToeFungi_zipster)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=ToeFungi_zipster&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=ToeFungi_zipster)

Zipster aims to enable developers to easily create password-protected ZIP files. This library relies on a combination of
other libraries to function correctly as well as built-in Node functionality.

Although the core behind Zipster is password-protected ZIP files, you can also create passwordless ZIP files and pass in
a number of different options to configure how your ZIP files are created.

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
- [Tests](#running-tests)
- [Issues](#issues)
- [Contributions](#contributions)
- [License](#license)

## Getting Started

This is how to get a copy of this working locally. The only requirement is that Node is installed on the base machine.

```bash
$ git clone git@github.com:ToeFungi/zipster.git
$ cd zipster
$ npm i
```

## Installation

Use the following command to install the Zipster:

```
npm i zipster
```

## Usage

You can create a ZIP file containing a single file or multiple files, set a password or not and configure how you want
the ZIP to be created.

#### .fromPath(path: string, options: Options)

Create ZIP file containing a single file

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

Create ZIP file containing multiple files

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

ZIP all sub-directories at a given path, retaining the folder structure of the sub-directories

```typescript
const path = '/some/path/to/my/directory'
const options: Options = {
  format: Formats.ZIP
}

const zipster = new Zipster()
zipster.fromDirectory(path, options)
  .then((outputPath: string) => console.log({ outputPath }, 'Successfully created ZIP'))
```

#### Options

| Option      | Default     | Description                                                |
|-------------|-------------|------------------------------------------------------------|
| format      | null        | Whether the ZIP should be password protected or not        |
| password    | null        | The password for the ZIP if applicable format is specified |
| output name | UUID V4     | The name of the ZIP file to be created                     |
| output path | OS Specific | The path to where the ZIP file should be created           |

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
