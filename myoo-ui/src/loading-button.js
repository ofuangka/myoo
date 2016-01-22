(function wrapper(angular) {
    'use strict';
    angular.module('loadingButton', [])
        .directive('loadingButton', function loadingButtonDirective() {
            return {
                restrict: 'EA',
                scope: {
                    label: '=loadingButton',
                    isLoading: '=',
                    useEllipses: '@'
                },
                template: '<span ng-switch="isLoading">' +
                '<i class="glyphicon glyphicon-refresh glyphicon-spin" ng-switch-when="true"></i>' +
                '<span ng-switch-default>{{ label }}</span></span>'
            };
        });
}(window.angular));