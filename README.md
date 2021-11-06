# Zipster

Zipster aims to enable developers to easily create password-protected ZIP files. This library relies on a combination of
other libraries to function correctly as well as built-in Node functionality.

Although the core behind Zipster is password-protected ZIP files, you can also create passwordless ZIP files and pass in
a number of different options to configure how your ZIP files are created.

**This project is still in development. Please report any bugs or feature requests as an 
[issue](https://github.com/ToeFungi/zipper/issues/new).**

## Installation 

Use the following command to install the package:

```
npm i zipster
```

## Usage

The following example will create a password-protected ZIP file called `protected.zip` in the execution directory, 
containing the `test.csv` with the password to access the ZIP being `foo-fighters`.

```typescript
const fileToZip = './src/test.csv'
const options: Options = {
  format: Formats.ZIP_ENCRYPTABLE,
  password: 'foo-fighters',
  output: {
    name: 'protected',
    directory: __dirname
  }
}

const zipster = new Zipster()
zipster.create(fileToZip, options)
  .then((outputDirectory: string) => console.log({ outputDirectory }, 'Successfully created ZIP'))
```
