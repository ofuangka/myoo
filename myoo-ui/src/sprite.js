(function wrapper(angular) {
    'use strict';
    angular.module('sprite', [])
        .directive('spriteX', function spriteDirective() {
            return {
                restrict: 'EA',
                link: function linkFn(scope, element, attrs) {
                    function positionDidChange() {
                        element.css('background-position', scope.spriteX + 'px ' + scope.spriteY + 'px');
                    }

                    scope.$watch('spriteX', positionDidChange);
                    scope.$watch('spriteY', positionDidChange);
                },
                scope: {
                    spriteX: '=',
                    spriteY: '='
                }
            };
        });
}(window.angular));