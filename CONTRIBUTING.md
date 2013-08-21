I'm always looking for the quality contributions and will be happy to accept your Pull Requests as long as those adhere to some basic rules:

* Please make sure that your contribution fits well in the project's context:
  * we are aiming at rebuilding jquery.payment in pure AngularJS, without any dependencies on any external JavaScript library;
  * directives should be html-agnostic as much as possible which in practice means:
    * templates should be referred to using the `templateUrl` property
    * it should be easy to change a default template to a custom one
* Please assure that you are submitting quality code, specifically make sure that:
  * your directive has accompanying tests and all the tests are passing