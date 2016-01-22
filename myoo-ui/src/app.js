(function wrapper(angular) {
    angular.module('Myoo', ['ngResource', 'ui.router', 'ui.bootstrap', 'loadingButton', 'spinner', 'cooldown', 'sprite'])
        .constant('INFINITY', -1)
        /**
         * Configures the application
         */
        .config(['$httpProvider', '$stateProvider', '$urlRouterProvider', function configFn($httpProvider, $stateProvider, $urlRouterProvider) {
            $httpProvider.defaults.headers.post = {
                'Content-type': 'application/json'
            };
            $stateProvider.state('section', {
                url: '/projects/:projectId/sections/{sectionId:(?:record|review)}',
                templateUrl: function getTemplateUrl(stateParams) {
                    return stateParams.sectionId + '.html'
                }
            }).state('fallback', {
                url: '/',
                templateUrl: 'fallback.html'
            });
            $urlRouterProvider.otherwise('/');

        }])
        .filter('capitalize', function capitalizeFactory() {
            return function capitalize(data) {
                if (angular.isString(data) && data.length > 0) {
                    return data.charAt(0).toUpperCase() + data.slice(1);
                } else {
                    return data;
                }
            }
        })
        .controller('UserMenuController', ['$scope', '$uibModal', 'User', function UserMenuController($scope, $uibModal, User) {
            $scope.my = User.self;
            $scope.showManageSubscriptions = function showManageSubscriptions() {
                $uibModal.open({
                    templateUrl: 'manage-subscriptions.html',
                    controller: 'ManageSubscriptionsController',
                    size: 'lg',
                    scope: $scope
                });
            };
        }])
        .controller('SectionNavController', ['$scope', '$rootScope', '$state', 'Project', function SectionNavController($scope, $rootScope, $state, Project) {
            $rootScope.$on('$stateChangeSuccess', function stateDidChange(event, toState, toParams) {
                $scope.projectId = toParams.projectId;
                $scope.sectionId = toParams.sectionId;

                // check if the user is subscribed to this project
                Project.own.$promise.then(function promiseDidResolve() {
                    var i, len, isSubscribed;
                    for (i = 0, len = Project.own.length; i < len; i++) {
                        if (Project.own[i].id === $scope.projectId) {
                            isSubscribed = true;
                            break;
                        }
                    }
                    if (!isSubscribed) {
                        $state.go('fallback');
                    }
                });

            });
        }])
        .controller('ProjectSidebarController', ['$scope', '$uibModal', '$rootScope', '$state', 'Project', 'Achievement', 'User', function ProjectSidebarController($scope, $uibModal, $rootScope, $state, Project, Achievement, User) {
            $scope.isOwner = function (projectId) {
                var i, len, project;
                for (i = 0, len = Project.own.length; i < len; i++) {
                    if (projectId === Project.own[i].id) {
                        project = Project.own[i];
                    }
                }
                return project.createdBy === User.self.id;
            };
            $scope.projects = Project.own;
            $scope.xsProjectSelect = {};
            $rootScope.$on('$stateChangeSuccess', function stateDidChange(event, toState, toParams) {
                $scope.sectionId = toParams.sectionId;
                $scope.xsProjectSelect.projectId = $scope.projectId = toParams.projectId;
            });
            $scope.$watch('xsProjectSelect.projectId', function xsProjectSelectDidChange(newValue, oldValue) {
                if (newValue !== oldValue) {
                    $state.go('section', {
                        projectId: newValue,
                        sectionId: $scope.sectionId || 'record'
                    });
                }
            });
            $scope.isLoadingProjects = function isLoadingProjects() {
                return Project.own.$promise.$$state.status === 0;
            };
            $scope.showEditProject = function showEditProject(projectArg) {
                Project.own.$promise.then(function promiseDidResolve() {
                    var i, len, project;
                    if (angular.isString(projectArg)) {
                        for (i = 0, len = Project.own.length; i < len; i++) {
                            if (projectArg === Project.own[i].id) {
                                project = Project.own[i];
                                break;
                            }
                        }
                    } else if (angular.isObject(projectArg)) {
                        project = projectArg;
                    }
                    $scope.selectedProject = angular.extend({}, project, {achievements: Achievement.query({pid: project.id})});
                    $uibModal.open({
                        templateUrl: 'create-project.html',
                        controller: 'EditProjectController',
                        scope: $scope
                    });
                });
            };
        }])
        .controller('RecordController', ['$scope', '$stateParams', '$uibModal', '$q', 'Achievement', 'Record', 'INFINITY', function RecordController($scope, $stateParams, $uibModal, $q, Achievement, Record, INFINITY) {
            function loadAchievements() {
                $scope.isLoadingAchievements = true;
                achievementPromise = Achievement.query({pid: $stateParams.projectId}).$promise;
                $q.all([achievementPromise, Record.own.$promise]).then(function promiseDidResolve(result) {
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

            var achievementPromise = Achievement.query({pid: $stateParams.projectId}).$promise;

            $scope.isAchievementLoading = {};

            $scope.$on('projectChangeSuccess', loadAchievements);

            loadAchievements();

            $scope.recordAchievement = function recordAchievement(achievement) {
                $scope.isAchievementLoading[achievement.id] = true;
                var result = Record.save({
                    achievementId: achievement.id,
                    points: achievement.points
                }, function recordDidSucceed(result) {
                    $q.all([achievementPromise, Record.own.$promise]).then(function promiseDidResolve() {
                        Record.own.unshift(result);
                        achievement.lastRecentRecordTs = result.ts;
                        $uibModal.open({
                            templateUrl: 'message.html',
                            controller: 'AchievementRecordedMessageController',
                            scope: $scope,
                            size: 'sm'
                        });
                        $scope.isAchievementLoading[achievement.id] = false;
                    });
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
        .controller('ReviewController', ['$scope', '$filter', function ReviewController($scope, $filter) {
            function refreshChart(newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.isLoading = true;
                }
            }

            var now = new Date(),
                yesterday = new Date(),
                lastWeek = new Date(),
                lastMonth = new Date(),
                format = 'yyyy-MM-dd',
                date = $filter('date');
            yesterday.setDate(now.getDate() - 1);
            lastWeek.setDate(now.getDate() - 7);
            lastMonth.setMonth(now.getMonth() - 1);
            $scope.setChartType = function setChartType(chartType) {
                $scope.selectedChartType = chartType;
            };
            $scope.set1Day = function set1Day() {
                $scope.from = yesterday;
                $scope.to = now;
            };
            $scope.set1Week = function set1Week() {
                $scope.from = lastWeek;
                $scope.to = now;
            };
            $scope.set1Month = function set1Month() {
                $scope.from = lastMonth;
                $scope.to = now;
            };
            $scope.maxDate = now;
            $scope.dateFormat = 'yyyy-MM-dd';
            $scope.chartTypes = ['comparison', 'achievements'];
            $scope.from = lastWeek;
            $scope.to = now;
            $scope.selectedChartType = $scope.chartTypes[0];
            $scope.$watch('from', refreshChart);
            $scope.$watch('to', refreshChart);
            $scope.$watch('selectedChartType', refreshChart);
            refreshChart(true, false);
        }])
        .controller('FallbackController', ['$scope', '$uibModal', '$filter', '$state', 'Project', function FallbackController($scope, $uibModal, $filter, $state, Project) {
            $scope.showManageSubscriptions = function showManageSubscriptions() {
                $uibModal.open({
                    templateUrl: 'manage-subscriptions.html',
                    controller: 'ManageSubscriptionsController',
                    scope: $scope
                });
            };
            $scope.showCreateProject = function showCreateProject() {
                $uibModal.open({
                    templateUrl: 'create-project.html',
                    controller: 'CreateProjectController',
                    scope: $scope
                });
            };

            // go to the first subscribed project, if it exists
            Project.own.$promise.then(function promiseDidResolve() {
                if (Project.own.length > 0) {
                    $state.go('section', {
                        projectId: $filter('orderBy')(Project.own, 'name')[0].id,
                        sectionId: 'record'
                    });
                }
            });
        }]);
}(window.angular));