/*global angular: false */
angular.module('payment.cardExpiry', ['payment.service', 'payment.restrictNumeric'])
    .directive('cardExpiryInput', ['payment', function (payment) {
        'use strict';
        return {
            restrict: 'E',
            templateUrl: 'template/cardExpiry/cardExpiry.html',
            replace: true
        };
    }])

    .directive('cardExpiryFormatter', ['payment', function (payment) {
        'use strict';
        var formatExpiry = function (e) {
                var elm, digit, val;

                digit = String.fromCharCode(e.which);
                if (!/^\d+$/.test(digit)) { return; }
                elm = angular.element(e.currentTarget);
                val = elm.val() + digit;
                if (/^\d$/.test(val) && (val !== '0' && val !== '1')) {
                    e.preventDefault();
                    elm.val('0' + val + ' / ');
                } else if (/^\d\d$/.test(val)) {
                    e.preventDefault();
                    elm.val(val + ' / ');
                }
            },
            formatForwardExpiry = function (e) {
                var elm, digit, val;

                digit = String.fromCharCode(e.which);
                if (!/^\d+$/.test(digit)) { return; }
                elm = angular.element(e.currentTarget);
                val = elm.val();
                if (/^\d\d$/.test(val)) { elm.val(val + ' / '); }
            },
            formatForwardSlash = function (e) {
                var elm, slash, val;

                slash = String.fromCharCode(e.which);
                if (slash !== '/') { return; }
                elm = angular.element(e.currentTarget);
                val = elm.val();
                if (/^\d$/.test(val) && val !== '0') { elm.val(val + " / "); }
            },
            formatBackExpiry = function (e) {
                var elm, value;

                if (e.meta) { return; }
                elm = angular.element(e.currentTarget);
                value = elm.val();
                if (e.which !== 8) { return; }
                if ((elm.prop('selectionStart') != null) && elm.prop('selectionStart') !== value.length) { return; }
                if (/\d(\s|\/)+$/.test(value)) {
                    e.preventDefault();
                    elm.val(value.replace(/\d(\s|\/)*$/, ''));
                } else if (/\s\/\s?\d?$/.test(value)) {
                    e.preventDefault();
                    elm.val(value.replace(/\s\/\s?\d?$/, ''));
                }
            },
            restrictExpiry = function (e) {
                var elm = angular.element(e.currentTarget), digit, value;

                digit = String.fromCharCode(e.which);
                if (!/^\d+$/.test(digit)) { return; }
                if (payment.hasTextSelected(elm)) { return; }
                value = elm.val() + digit;
                value = value.replace(/\D/g, '');
                if (value.length > 6) { e.preventDefault(); }
            };

        return {
            link: function postLink(scope, element) {
                element.bind('keypress', restrictExpiry);
                element.bind('keypress', formatExpiry);
                element.bind('keypress', formatForwardSlash);
                element.bind('keypress', formatForwardExpiry);
                element.bind('keydown', formatBackExpiry);
            }
        };
    }])

    .directive('cardExpiryValidator', ['payment', function (payment) {
        'use strict';
        var cardExpiryVal = function (value) {
            var month, prefix, year, ref;

            value = value.replace(/\s/g, '');
            ref = value.split('/', 2);
            month = ref[0];
            year = ref[1];

            if ((year ? year.length : undefined) === 2 && /^\d+$/.test(year)) {
                prefix = (new Date()).getFullYear();
                prefix = prefix.toString().slice(0, 2);
                year = prefix + year;
            }

            month = parseInt(month, 10);
            year = parseInt(year, 10);

            return {month: month, year: year};
        };

        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ngModelCtrl) {
                ngModelCtrl.$parsers.unshift(function (value) {
                    var expiry = cardExpiryVal(value), valid = payment.validateCardExpiry(expiry.month, expiry.year);
                    ngModelCtrl.$setValidity('cardExpiry', valid);
                    return valid ? expiry : undefined;
                });

                ngModelCtrl.$formatters.unshift(function (value) {
                    var valid = (value && value.hasOwnProperty('month') && value.hasOwnProperty('year')) ?
                            payment.validateCardExpiry(value.month, value.year) : false;
                    ngModelCtrl.$setValidity('cardExpiry', valid);
                    return valid ? value.month + ' / ' + value.year : undefined;
                });
            }
        };
    }]);