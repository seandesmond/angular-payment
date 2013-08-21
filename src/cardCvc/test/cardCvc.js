/*global describe: false, beforeEach: false, inject: false, it: false, module: false */
describe('card number directive', function () {
    'use strict';
    var $rootScope, element;
    beforeEach(module('payment.service'));
    beforeEach(module('payment.cardCvc'));
    beforeEach(module('template/cardCvc/cardCvc.html'));
    beforeEach(inject(function (_$compile_, _$rootScope_) {
        var $compile = _$compile_;
        $rootScope = _$rootScope_;
        element = $compile('<card-cvc-input ng-model="cardCvc"></card-cvc-input>')($rootScope);
        $rootScope.$digest();
    }));

    it('contains the default number of icons', function () {
    });

    it('handles correctly the click event', function () {
    });

    it('should fire onHover', function () {
    });
});