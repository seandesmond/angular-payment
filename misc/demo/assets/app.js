angular.module('paymentDemoApp', ['payment', 'ui.bootstrap.dropdownToggle']);

function MainCtrl($scope, $location, $anchorScroll) {
    'use strict';

    $scope.scrollTo = function(id) {
        $location.hash(id);
        $anchorScroll();
    }
}
