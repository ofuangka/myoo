(function wrapper(angular) {
    'use strict';
    angular.module('Myoo')
        .controller('RecordController', ['$scope', '$stateParams', '$uibModal', '$q', 'Achievement', 'Record', 'INFINITY', function RecordController($scope, $stateParams, $uibModal, $q, Achievement, Record, INFINITY) {
            function loadAchievements() {
                $scope.isLoadingAchievements = true;
                $scope.achievementPromise = Achievement.query({pid: $stateParams.projectId}).$promise;
                $q.all([$scope.achievementPromise, Record.own.$promise]).then(function promiseDidResolve(result) {
                    var achievementResource = result[0],
                        recordResource = result[1];
                    $scope.achievements = [];
                    angular.forEach(achievementResource, function applyRecord(achievement) {
                        var i, len;
                        achievement.lastRecentRecordTs = 0;
                        for (i = 0, len = recordResource.length; i < len; i++) {
                            if (achievement.id === recordResource[i].achievementId && recordResource[i].ts > achievement.lastRecentRecordTs) {
                                achievement.lastRecentRecordTs = recordResource[i].ts;
                            }
                        }
                        $scope.achievements.unshift(achievement);
                    });
                    $scope.isLoadingAchievements = false;
                }, function promiseDidReject() {
                    $uibModal.open({
                        templateUrl: 'partials/message.html',
                        controller: 'GenericErrorMessageController',
                        scope: $scope,
                        size: 'sm'
                    });
                });
            }

            function getPeriod(achievement) {
                var ret;
                switch (achievement.frequency) {
                    case 'hourly':
                        ret = 3600;
                        break;
                    case 'daily':
                        ret = 86400;
                        break;
                    case 'weekly':
                        ret = 604800;
                        break;
                    case 'once':
                        ret = INFINITY;
                        break;
                    default:
                        break;
                }
                return ret;
            }

            function getUnits(remainder) {
                var ret;
                if (remainder < 3600) {
                    ret = 'minutes';
                } else if (remainder < 86400) {
                    ret = 'hours';
                } else {
                    ret = 'days';
                }
                return ret;
            }

            function getDivisor(remainder) {
                var ret;
                if (remainder < 3600) {
                    ret = 60;
                } else if (remainder < 86400) {
                    ret = 3600;
                } else {
                    ret = 86400;
                }
                return ret;
            }

            $scope.isAchievementLoading = {};

            $scope.$on('projectChangeSuccess', function projectDidChange(event, project) {
                if ($stateParams.projectId === project.id) {
                    loadAchievements();
                }
            });

            loadAchievements();

            $scope.showRecordConfirm = function showRecordAchievement(achievement) {
                $scope.selectedAchievement = achievement;
                $uibModal.open({
                    templateUrl: 'partials/record-confirm.html',
                    controller: 'RecordConfirmController',
                    scope: $scope
                });
            };

            $scope.getCooldown = function getCooldown(achievement) {
                if (achievement.lastRecentRecordTs === 0) {
                    return 1;
                } else {
                    var now = new Date().getTime() / 1000,
                        then,
                        period;
                    then = new Date(achievement.lastRecentRecordTs).getTime() / 1000;
                    period = getPeriod(achievement);
                    return (period === INFINITY) ? INFINITY : Math.floor(now - then) / period;
                }
            };
            $scope.getRemainder = function getRemainder(achievement) {
                var now = new Date().getTime() / 1000,
                    then,
                    period,
                    remainder,
                    divisor,
                    units;
                then = new Date(achievement.lastRecentRecordTs).getTime() / 1000;
                period = getPeriod(achievement);
                if (period === INFINITY) {
                    return 'Achieved';
                } else {
                    remainder = (then + period) - now;
                    divisor = getDivisor(remainder);
                    units = getUnits(remainder);
                    return Math.floor(remainder / divisor) + ' ' + units + ' remaining';
                }
            };
        }])
        .controller('AchievementRecordedMessageController', ['$scope', function AchievementRecordedMessageController($scope) {
            $scope.title = 'Achievement Recorded';
            $scope.message = 'You successfully recorded this achievement.';
        }])
        .controller('RecordConfirmController', ['$scope', '$q', '$uibModal','Record', 'RANDOM_BLURB_EXAMPLES', function RecordConfirmController($scope, $q, $uibModal, Record, RANDOM_BLURB_EXAMPLES) {
            function recordAchievement() {
                var result = Record.save({
                    achievementId: $scope.selectedAchievement.id,
                    blurb: $scope.shortBlurb
                }, function recordDidSucceed(result) {
                    $q.all([$scope.achievementPromise, Record.own.$promise]).then(function promiseDidResolve() {
                        Record.own.unshift(result);
                        $scope.selectedAchievement.lastRecentRecordTs = result.ts;
                        $uibModal.open({
                            templateUrl: 'partials/message.html',
                            controller: 'AchievementRecordedMessageController',
                            scope: $scope,
                            size: 'sm'
                        }).result.finally(function promiseDidSettle() {
                            $scope.$close();
                        });
                    }, function promiseDidReject() {
                        $scope.isConfirming = false;
                        $uibModal.open({
                            templateUrl: 'partials/message.html',
                            controller: 'GenericErrorMessageController',
                            scope: $scope,
                            size: 'sm'
                        });
                    });
                });
            }
            $scope.randomBlurbExample = RANDOM_BLURB_EXAMPLES[Math.floor(Math.random() * RANDOM_BLURB_EXAMPLES.length)];
            $scope.userDidConfirm = function userDidConfirm() {
                $scope.isConfirming = true;
                recordAchievement();
            };
        }])
}(window.angular));