/*global describe: false, beforeEach: false, inject: false, it: false, module: false, expect: false, runs: false, waitsFor: false, jQuery: false */
describe('restrict numeric directive', function () {
    'use strict';
    var $rootScope, $compile, element;
    beforeEach(module('payment.restrictNumeric'));
    beforeEach(inject(function (_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        element = $compile('<div><input ng-model="someNumber" restrict-numeric/></div>')($rootScope);
        $rootScope.$digest();
    }));

    it('will not allow non-numeric input', function () {
        var keyPressHandled = false, defaultPrevented;
        runs(function () {
            element.bind('keypress', function (e) {
                keyPressHandled = true;
                defaultPrevented = e.isDefaultPrevented();
            });

            element.find('input').trigger(jQuery.Event('keypress', {which: 65}));
        });

        waitsFor(function () {
            return keyPressHandled;
        }, "The keypress event should be handled.", 100);

        runs(function () {
            expect(keyPressHandled).toBeTruthy();
        });
    });

    it('will allow numeric input', function () {
        var keyPressHandled = false, defaultPrevented;
        runs(function () {
            element.bind('keypress', function (e) {
                keyPressHandled = true;
                defaultPrevented = e.isDefaultPrevented();
            });

            element.find('input').trigger(jQuery.Event('keypress', {which: 49}));
        });

        waitsFor(function () {
            return keyPressHandled;
        }, "The keypress event should be handled.", 100);

        runs(function () {
            expect(defaultPrevented).toBeFalsy();
        });
    });
});