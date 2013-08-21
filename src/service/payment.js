/*global angular: false */
angular.module('payment.service', [])
    .factory('payment', ['$document', function ($document) {
        'use strict';

        var defaultFormat = /(\d{1,4})/g,
            cards = [
                {
                    type: 'maestro',
                    pattern: /^(5018|5020|5038|6304|6759|676[1-3])/,
                    format: defaultFormat,
                    length: [12, 13, 14, 15, 16, 17, 18, 19],
                    cvcLength: [3],
                    luhn: true
                }, {
                    type: 'dinersclub',
                    pattern: /^(36|38|30[0-5])/,
                    format: defaultFormat,
                    length: [14],
                    cvcLength: [3],
                    luhn: true
                }, {
                    type: 'laser',
                    pattern: /^(6706|6771|6709)/,
                    format: defaultFormat,
                    length: [16, 17, 18, 19],
                    cvcLength: [3],
                    luhn: true
                }, {
                    type: 'jcb',
                    pattern: /^35/,
                    format: defaultFormat,
                    length: [16],
                    cvcLength: [3],
                    luhn: true
                }, {
                    type: 'unionpay',
                    pattern: /^62/,
                    format: defaultFormat,
                    length: [16, 17, 18, 19],
                    cvcLength: [3],
                    luhn: false
                }, {
                    type: 'discover',
                    pattern: /^(6011|65|64[4-9]|622)/,
                    format: defaultFormat,
                    length: [16],
                    cvcLength: [3],
                    luhn: true
                }, {
                    type: 'mastercard',
                    pattern: /^5[1-5]/,
                    format: defaultFormat,
                    length: [16],
                    cvcLength: [3],
                    luhn: true
                }, {
                    type: 'amex',
                    pattern: /^3[47]/,
                    format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
                    length: [15],
                    cvcLength: [3, 4],
                    luhn: true
                }, {
                    type: 'visa',
                    pattern: /^4/,
                    format: defaultFormat,
                    length: [13, 14, 15, 16],
                    cvcLength: [3],
                    luhn: true
                }
            ],
            trim = function (str) {
                return str.toString().replace(/^\s+|\s+$/g, '');
            },
            hasTextSelected = function (elm) {
                var ref;
                if ((elm.prop('selectionStart') != null) && elm.prop('selectionStart') !== elm.prop('selectionEnd')) { return true; }
                return $document !== undefined && $document !== null ? (ref = $document.selection) != null ? typeof ref.createRange === "function" ? ref.createRange().text : undefined : undefined : undefined;
            },
            cardFromNumber = function (num) {
                var card, i, len;
                if (!num) { return null; }
                num = num.toString().replace(/\D/g, '');
                for (i = 0, len = cards.length; i < len; i++) {
                    card = cards[i];
                    if (card.pattern.test(num)) { return card; }
                }

                return null;
            },
            luhnCheck = function (num) {
                var digit, digits = num.toString().split('').reverse(), sum = 0, i, odd = true;
                for (i = 0; i < digits.length; i++) {
                    digit = digits[i];
                    digit = parseInt(digit, 10);
                    if ((odd = !odd)) { digit *= 2; }
                    if (digit > 9) { digit -= 9; }
                    sum += digit;
                }

                return sum % 10 === 0;
            },
            validateCardNumber = function (num) {
                if (!num) { return false; }

                var card;
                num = num.toString().replace(/\s+|-/g, '');
                if (!/^\d+$/.test(num)) { return false; }
                card = cardFromNumber(num);

                return card ? (card.length.indexOf(num.length) >= 0) && (card.luhn === false || luhnCheck(num)) : false;
            },
            formatCardNumber = function (num) {
                var card = cardFromNumber(num), groups, upperLength, ref, result;
                if (!card) { return num; }
                upperLength = card.length[card.length.length - 1];
                num = num.replace(/\D/g, '');
                num = num.slice(0, +upperLength + 1 || 9e9);
                if (card.format.global) {
                    result = (ref = num.match(card.format)) !== null ? ref.join(' ') : undefined;
                } else {
                    groups = card.format.exec(num);
                    if (groups !== null) { groups.shift(); }
                    result = groups !== null ? groups.join(' ') : undefined;
                }

                return result;
            },
            validateCardExpiry = function (month, year) {
                var currentTime, expiry, prefix;
                if (typeof month === 'object' && month.hasOwnProperty('month')) {
                    year = month.year;
                    month = month.month;
                }

                if (!(month && year)) { return false; }

                month = trim(month);
                year = trim(year);
                if (!/^\d+$/.test(month)) { return false; }
                if (!/^\d+$/.test(year)) { return false; }
                if (!(parseInt(month, 10) <= 12)) { return false; }
                if (year.length === 2) {
                    prefix = (new Date()).getFullYear();
                    prefix = prefix.toString().slice(0, 2);
                    year = prefix + year;
                }

                expiry = new Date(year, month);
                currentTime = new Date();
                expiry.setMonth(expiry.getMonth() - 1);
                expiry.setMonth(expiry.getMonth() + 1, 1);

                return expiry > currentTime;
            },
            cardFromType = function (type) {
                var i;
                for (i = 0; i < cards.length; i++) {
                    if (cards[i].type === type) { return cards[i]; }
                }

                return undefined;
            },
            validateCardCVC = function (cvc, type) {
                var card;
                cvc = trim(cvc);
                if (!/^\d+$/.test(cvc)) { return false; }
                if (type) {
                    card = cardFromType(type);
                    return card ? card.cvcLength.indexOf(cvc.length) >= 0 : false;
                }

                return cvc.length >= 3 && cvc.length <= 4;
            };

        return {
            hasTextSelected: hasTextSelected,
            cardFromNumber: cardFromNumber,
            validateCardNumber: validateCardNumber,
            validateCardExpiry: validateCardExpiry,
            validateCardCvc: validateCardCVC,
            formatCardNumber: formatCardNumber
        };
    }]);