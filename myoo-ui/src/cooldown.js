(function wrapper(angular) {
    'use strict';
    angular.module('cooldown', [])
        .directive('cooldown', function cooldownDirective() {
            return {
                restrict: 'EA',
                link: function linkFn(scope, element) {
                    var canvas = document.createElement('canvas'),
                        width = element[0].offsetWidth,
                        height = element[0].offsetHeight;
                    canvas.style.position = 'absolute';
                    canvas.style.zIndex = 1;
                    canvas.width = width;
                    canvas.height = height;
                    element.prepend(canvas);
                    var ctx = canvas.getContext('2d');
                    scope.$watch('cooldown', function cooldownDidChange(newValue, oldValue) {
                        ctx.clearRect(0, 0, width, height);
                        if (newValue < 1) {
                            ctx.beginPath();
                            ctx.moveTo(width / 2, height / 2);
                            ctx.arc(width / 2, height / 2, Math.max(width, height), 2 * Math.PI * newValue - Math.PI / 2, 0 - Math.PI / 2);
                            ctx.strokeStyle = scope.strokeStyle || '#000000';
                            ctx.fillStyle = scope.fillStyle || '#333333';
                            ctx.globalAlpha = scope.globalAlpha || 0.25;
                            ctx.closePath();
                            ctx.stroke();
                            ctx.fill();
                        }
                    });
                },
                scope: {
                    cooldown: '=',
                    strokeStyle: '=',
                    fillStyle: '=',
                    globalAlpha: '='
                }
            };
        });
}(window.angular));