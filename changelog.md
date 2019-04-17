# Changelog

## 1.5.0

Features:

* `tap` method
* `tapCatch` method

Docs:

* README typo

## 1.4.0

Features:

* `is` method
* `allAwait` method
* `await` option for `all`, `props`, `propsOwn`
* `settle` method

Refactor:

* Move entry point to `index.js`

Tests:

* Import only method under test

Docs:

* README typo

## 1.3.0

Features:

* Drop support for Node 6

Refactor:

* Fix ESLint errors

Dev:

* Reformat changelog
* CI run tests on Node v11
* Rename `travis` npm script to `ci`
* git ignore `package-lock.json`
* Use ESLint instead of JSHint
* Update dev dependencies

## 1.2.0

Features:

* `promisify` method

## 1.1.1

Bug fixes:

* Collection methods handle empty arrays/objects

Refactor:

* `Queue` class drain queue after checking if done

## 1.1.0

Features:

* `wait` method

## 1.0.1

* README update

## 1.0.0

* Initial release
