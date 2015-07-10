angular.module('payment.cardNumber', ['payment.service', 'payment.restrictNumeric'])
    .directive('cardNumberInput', function () {
        'use strict';
        return {
            restrict: 'E',
            templateUrl: 'template/cardNumber/cardNumber.html',
            replace: true
        };
    })

    .directive('cardNumberFormatter', ['$timeout', '$parse', 'payment', function ($timeout, $parse, payment) {
        'use strict';
        var restrictCardNumber = function (e) {
                var card, digit = String.fromCharCode(e.which), value, elm = angular.element(e.currentTarget);

                if (!/^\d+$/.test(digit)) { return; }
                if (payment.hasTextSelected(elm)) { return; }

                value = (elm.val() + digit).replace(/\D/g, '');
                card = payment.cardFromNumber(value);

                if (card && value.length > card.length[card.length.length - 1]) {
                    e.preventDefault();
                } else if (value.length > 16) {
                    e.preventDefault();
                }
            },
            formatCardNumber = function (e) {
                var elm, card, digit, length, re, upperLength = 16, value;

                digit = String.fromCharCode(e.which);
                if (!/^\d+$/.test(digit)) { return; }

                elm = angular.element(e.currentTarget);
                value = elm.val();
                card = payment.cardFromNumber(value + digit);
                length = (value.replace(/\D/g, '') + digit).length;

                if (card) { upperLength = card.length[card.length.length - 1]; }
                if (length >= upperLength) { return; }
                if ((elm.prop('selectionStart') !== null) && elm.prop('selectionStart') !== value.length) { return; }
                if (card && card.type === 'amex') {
                    re = /^(\d{4}|\d{4}\s\d{6})$/;
                } else {
                    re = /(?:^|\s)(\d{4})$/;
                }

                if (re.test(value)) {
                    e.preventDefault();
                    elm.val(value + ' ' + digit);
                } else if (re.test(value + digit)) {
                    e.preventDefault();
                    elm.val(value + digit + ' ');
                }
            },
            reFormatCardNumber = function (e) {
                var elm = angular.element(e.currentTarget);
                $timeout(function () {
                    var value = elm.val();
                    value = payment.formatCardNumber(value);
                    elm.val(value);
                });
			},
			originalCards = payment._paymentCards._copyCards(payment._paymentCards._cards);
        return {
            require: 'ngModel',
            link: function postLink(scope, element, attrs, ngModelCtrl) {
                var cardType = $parse(attrs.cardType);

                attrs.$observe('cardWhitelist', function (whitelist) {
                    if(!whitelist) {
                        payment._paymentCards.setCards(originalCards);
                        return;
                    }
                    var _cards = [];
                    angular.forEach(originalCards, function(card) {
                        if(whitelist.indexOf(card.type) >= 0) {
                            _cards.push(card);
                        }
                    });
                    payment._paymentCards.setCards(_cards);
                });

                element.bind('keypress', restrictCardNumber);
                element.bind('keypress', formatCardNumber);
                element.bind('paste', reFormatCardNumber);

                function applyCardType(value) {
                    if (attrs.cardType) {
                        var card = payment.cardFromNumber(value);
                        cardType.assign(scope, (card && cardType !== card.type) ? card.type : null);
                    }
                }

                ngModelCtrl.$formatters.unshift(function (value) {
                    applyCardType(value);
                    return payment.formatCardNumber(value);
                });

                ngModelCtrl.$parsers.unshift(function (value) {
                    applyCardType(value);
                    return value;
                });
            }
        };
    }])

    .directive('cardNumberValidator', ['payment', function (payment) {
        'use strict';
        var originalCards = payment._paymentCards._copyCards(payment._paymentCards._cards);
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ngModelCtrl) {
                if(!attrs.cardNumberFormatter) {
                    attrs.$observe('cardWhitelist', function (whitelist) {
                        if(!whitelist) {
                            payment._paymentCards.setCards(originalCards);
                            return;
                        }
                        var _cards = [];
                        angular.forEach(originalCards, function(card) {
                            if(whitelist.indexOf(card.type) >= 0) {
                                _cards.push(card);
                            }
                        });
						payment._paymentCards.setCards(_cards);
					});
                }

                function validate(value) {
                    if (!value) { return false; }
                    var valid = payment.validateCardNumber(value);
                    ngModelCtrl.$setValidity('cardNumber', valid);
                    return valid;
                }

                ngModelCtrl.$parsers.push(function (value) {
                    return validate(value) ? value.replace(/ /g, '') : undefined;
                });

                ngModelCtrl.$formatters.unshift(function (value) {
                    validate(value);
                    return value;
                });
            }
        };
    }]);