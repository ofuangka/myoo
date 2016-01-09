(function wrapper(angular) {
    'use strict';
    angular.module('loadingBtn', [])
        .directive('loadingBtn', function loadingBtnDirective() {
            return {
                restrict: 'EA',
                scope: {
                    label: '=loadingBtn',
                    showLoading: '=',
                    useEllipses: '@'
                },
                template: '<span ng-switch="showLoading">' +
                '<i class="glyphicon glyphicon-refresh glyphicon-spin" ng-switch-when="true"></i>' +
                '<span ng-switch-default>{{ label }}</span></span>'
            };
        });
}(window.angular));