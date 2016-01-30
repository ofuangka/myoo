(function wrapper(angular) {
    'use strict';
    angular.module('spinner', [])
        .directive('spinner', function spinnerDirective() {
            return {
                restrict: 'E',
                scope: {
                    showWhen: '='
                },
                template: '<p class="text-center" ng-if="showWhen">' +
                '<i class="glyphicon glyphicon-refresh glyphicon-spin"></i></p>'
            };
        })
}(window.angular));