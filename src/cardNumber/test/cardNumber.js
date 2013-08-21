/*global describe: false, beforeEach: false, inject: false, it: false, module: false, expect: false, waitsFor: false, jQuery: false, runs: false */
describe('card number input directive', function () {
    'use strict';
    var $rootScope, $compile, element;
    beforeEach(module('payment.cardNumber'));
    beforeEach(module('template/cardNumber/cardNumber.html'));
    beforeEach(inject(function (_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        element = $compile('<card-number-input ng-model="cardNumber"></card-number-input>')($rootScope);
        $rootScope.$digest();
    }));

    it('will format the number with correct spacing', function () {
        $rootScope.cardNumber = '5105105105105100';
        $rootScope.$digest();
        expect(element.val().split(' ').length).toBe(4);

        $rootScope.cardNumber = '378282246310005';
        $rootScope.$digest();
        expect(element.val().split(' ').length).toBe(3);
    });

    it('sets card type appropriately', function () {
        element = $compile('<card-number-input ng-model="cardNumber" card-type="cardType"></card-number-input>')($rootScope);
        $rootScope.$digest();

        $rootScope.cardNumber = '5105105105105100';
        $rootScope.$digest();
        expect($rootScope.cardType).toBe('mastercard');

        $rootScope.cardNumber = '4242424242424242';
        $rootScope.$digest();
        expect($rootScope.cardType).toBe('visa');

        $rootScope.cardNumber = '378282246310005';
        $rootScope.$digest();
        expect($rootScope.cardType).toBe('amex');

        $rootScope.cardNumber = '6011111111111117';
        $rootScope.$digest();
        expect($rootScope.cardType).toBe('discover');

        $rootScope.cardNumber = '30569309025904';
        $rootScope.$digest();
        expect($rootScope.cardType).toBe('dinersclub');

        $rootScope.cardNumber = '3530111333300000';
        $rootScope.$digest();
        expect($rootScope.cardType).toBe('jcb');
    });

    it('will restrict card number length', function () {
        var keyPressHandled = false, defaultPrevented;
        $rootScope.cardNumber = '5105105105105100';
        $rootScope.$digest();

        runs(function () {
            element.bind('keypress', function (e) {
                keyPressHandled = true;
                defaultPrevented = e.isDefaultPrevented();
            });

            element.trigger(jQuery.Event('keypress', {which: 49}));
        });

        waitsFor(function () {
            return keyPressHandled;
        }, "The keypress event should be handled.", 100);

        runs(function () {
            expect(defaultPrevented).toBeTruthy();
        });
    });
});