(function wrapper(angular) {
    'use strict';
    angular.module('loadingBtn', [])
        .directive('loadingBtn', function loadingBtnDirective() {
            return {
                restrict: 'EA',
                scope: {
                    label: '=loadingBtn',
                    showLoading: '='
                },
                template: '<i class="glyphicon glyphicon-refresh glyphicon-spin" ng-if="showLoading"></i><span ng-if="!showLoading">{{ label }}</span>'
            };
        });
}(window.angular));