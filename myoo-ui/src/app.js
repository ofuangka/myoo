(function wrapper(angular, google) {
    'use strict';
    angular.module('Myoo', ['ngResource', 'ui.router', 'ui.bootstrap', 'loadingButton', 'spinner', 'cooldown', 'sprite'])
        .constant('INFINITY', -1)
        .constant('QUERY_DATE_FORMAT', 'yyyy-MM-dd')
        .constant('SORTABLE_DATE_FORMAT', 'yyyy-MM-dd')
        /**
         * Configures the application
         */
        .config(['$httpProvider', '$stateProvider', '$urlRouterProvider', function configFn($httpProvider, $stateProvider, $urlRouterProvider) {
            $httpProvider.defaults.headers.post = {
                'Content-type': 'application/json'
            };
            $stateProvider.state('section', {
                url: '/projects/{projectId:.+}/sections/{sectionId:(?:record|review)}',
                templateUrl: function getTemplateUrl(stateParams) {
                    return 'partials/' + stateParams.sectionId + '.html'
                }
            }).state('fallback', {
                url: '/',
                templateUrl: 'partials/fallback.html'
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
        .directive('barChartData', ['$window', function barChartDirective($window) {
            return {
                restrict: 'EA',
                link: function linkFn(scope, element) {
                    function drawChart() {

                        // Instantiate and draw our chart, passing in some options.
                        new google.charts.Bar(element[0]).draw(scope.barChartData, scope.barChartOptions);

                    }

                    angular.element($window).on('resize', function windowDidResize(newValue, oldValue) {
                        if (newValue !== oldValue) {
                            drawChart();
                        }
                    });
                    scope.$watch('barChartData', function barChartDataDidChange(newValue, oldValue) {
                        if (newValue !== oldValue) {
                            drawChart();
                        }
                    });
                },
                scope: {
                    barChartData: '=',
                    barChartOptions: '='
                }
            };
        }])
        .controller('UserMenuController', ['$scope', '$uibModal', 'User', function UserMenuController($scope, $uibModal, User) {
            $scope.my = User.self;
            $scope.showManageSubscriptions = function showManageSubscriptions() {
                $uibModal.open({
                    templateUrl: 'partials/manage-subscriptions.html',
                    controller: 'ManageSubscriptionsController',
                    size: 'lg',
                    scope: $scope
                });
            };
            $scope.showLeaderboards = function showLeaderboards() {
                $uibModal.open({
                    templateUrl: 'partials/leaderboards.html',
                    controller: 'LeaderboardsController',
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
                        break;
                    }
                }
                return project && project.createdBy === User.self.id;
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
        }])
        .controller('FallbackController', ['$filter', '$state', 'Project', function FallbackController($filter, $state, Project) {

            // go to the first subscribed project, if it exists
            Project.own.$promise.then(function promiseDidResolve() {
                if (Project.own.length > 0) {
                    $state.go('section', {
                        projectId: $filter('orderBy')(Project.own, 'name')[0].id,
                        sectionId: 'record'
                    });
                }
            });
        }])
        .controller('SharedScopeController', ['$scope', '$uibModal', 'Project', 'Achievement', function SharedScopeController($scope, $uibModal, Project, Achievement) {
            $scope.showManageSubscriptions = function showManageSubscriptions() {
                $uibModal.open({
                    templateUrl: 'partials/manage-subscriptions.html',
                    controller: 'ManageSubscriptionsController',
                    scope: $scope,
                    size: 'lg'
                });
            };
            $scope.showCreateProject = function showCreateProject() {
                $scope.selectedProject = {achievements: []};
                $uibModal.open({
                    templateUrl: 'partials/create-project.html',
                    controller: 'CreateProjectController',
                    scope: $scope
                });
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
                        templateUrl: 'partials/create-project.html',
                        controller: 'EditProjectController',
                        scope: $scope
                    });
                });
            };
        }])
        .controller('LeaderboardsController', ['$scope', '$filter', 'Record', 'QUERY_DATE_FORMAT', function LeaderboardsController($scope, $filter, Record, QUERY_DATE_FORMAT) {
            function getBeginDate() {
                var ret = new Date();
                switch ($scope.period) {
                    case 'week':
                        // go back to the most recent Sunday
                        ret.setDate(ret.getDate() - ret.getDay());
                        break;
                    case 'month':
                        // go back to the first of the month
                        ret.setDate(1);
                        break;
                    case 'year':
                        // go back to January 1 of this year
                        ret.setMonth(0);
                        ret.setDate(1);
                        break;
                    default:
                        break;
                }
                return ret;
            }

            $scope.period = 'week';
            $scope.$watch('period', function periodDidChange(newValue, oldValue) {
                var date = $filter('date'),
                    now = new Date();
                $scope.isLoading = true;
                Record.query({
                    begin_date: date(getBeginDate(), QUERY_DATE_FORMAT),
                    end_date: date(now, QUERY_DATE_FORMAT)
                }).$promise.then(function promiseDidResolve(records) {
                    var key,
                        map;
                    map = records.reduce(function reduceFn(acc, record) {
                        if (angular.isDefined(acc[record.username])) {
                            acc[record.username] += record.points;
                        } else {
                            acc[record.username] = record.points;
                        }
                        return acc;
                    }, {});
                    $scope.leaders = [];
                    for (key in map) {
                        $scope.leaders.push({username: key, points: map[key]})
                    }
                    $scope.isLoading = false;
                });
            });
        }]);
}(window.angular, window.google));