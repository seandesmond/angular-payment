# payment - [AngularJS](http://angularjs.org/) directives specific to [jquery-payment](https://github.com/stripe/jquery.payment)

***

## Demo

Do you want to see directives in action? Visit http://seandesmond.github.io/angular-payment/!

## Installation

Installation is easy as angular-payment has minimal dependencies - only AngularJS is required.
After downloading this dependency (or better yet, referencing AngularJS from your favourite CDN) you need to download the build version of this project. All the files and their purposes are described here:
https://github.com/seandesmond/angular-payment/tree/gh-pages#build-files
Don't worry, if you are not sure which file to take, opt for `angular-payment-tpls-[version].min.js`.

When you are done downloading all the dependencies and project files the only remaining part is to add dependencies on the `payment` AngularJS module:

```javascript
angular.module('myModule', ['payment']);
```

Project files are also available through bower with:
* `bower install angular-payment`

## Project philosophy

### Native, lightweight directives

I'm aiming to provide a set of AngularJS directives based on Stripe's jquery.payment library. The goal is to provide **native AngularJS directives** without a dependency on jQuery or external JavaScript.
It is often better to rewrite existing JavaScript code and create new, pure AngularJS directives. Most of the time the resulting directive is smaller than the original JavaScript code and better integrated into the AngularJS ecosystem.

### Customizable

All the directives in this repository should have their markup externalized as templates (loaded via `templateUrl`). In practice it means that you can **customize directive's markup at will**.

### Quality and stability

Directives should work. All the time and in all browsers. This is why all the directives have a comprehensive suite of unit tests.

## Contributing to the project

I'm always looking for quality contributions! Please check the [CONTRIBUTING.md](CONTRIBUTING.md) for the contribution guidelines.

### Development
#### Prepare your environment
* Install [Node.js](http://nodejs.org/) and NPM (should come with)
* Install global dev dependencies: `npm install -g grunt-cli karma`
* Install local dev dependencies: `npm install` while current directory is the angular-payment repo

#### Build
* Build the whole project: `grunt` - this will run `lint`, `test`, and `concat` targets

Check the Grunt build file for other tasks that are defined for this project

#### TDD
* Run test: `grunt watch`

This will start Karma server and will continuously watch files in the project, executing tests upon every change.

### Release
* Bump up version number in `package.json`
* Commit the version change with the following message: `chore(release): [version number]`
* tag
* push changes and a tag (`git push --tags`)
* switch to the `gh-pages` branch: `git checkout gh-pages`
* copy content of the dist folder to the main folder
* Commit the version change with the following message: `chore(release): [version number]`
* push changes
* switch back to the `main branch` and modify `package.json` to bump up version for the next iteration
* commit (`chore(release): starting [version number]`) and push
