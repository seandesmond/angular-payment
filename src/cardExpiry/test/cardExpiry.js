/*global describe: false, beforeEach: false, inject: false, it: false, module: false */
describe('card number directive', function () {
    'use strict';
    var $rootScope, element;
    beforeEach(module('payment.service'));
    beforeEach(module('payment.cardExpiry'));
    beforeEach(module('template/cardExpiry/cardExpiry.html'));
    beforeEach(inject(function (_$compile_, _$rootScope_) {
        var $compile = _$compile_;
        $rootScope = _$rootScope_;
        element = $compile('<card-expiry-input ng-model="cardExpiry"></card-expiry-input>')($rootScope);
        $rootScope.$digest();
    }));

    it('contains the default number of icons', function () {
    });

    it('handles correctly the click event', function () {
    });

    it('should fire onHover', function () {
    });
});