(function wrapper(angular, google, FastClick) {
    'use strict';
    angular.module('Myoo', ['ngResource', 'ui.router', 'ui.bootstrap', 'loadingButton', 'spinner', 'cooldown', 'sprite'])
        .constant('INFINITY', -1)
        .constant('QUERY_DATE_FORMAT', 'yyyy-MM-ddTHH:mm:ss.sssZ')
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
        .run(function runFn() {

            // frozen version until Google fixes bug with scrolling on iOS
            google.charts.load('41', {packages: ['bar']});

            FastClick.attach(document.body);
        })
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
            $scope.showManageProjects = function showManageProjects() {
                $uibModal.open({
                    templateUrl: 'partials/manage-projects.html',
                    controller: 'ManageProjectsController',
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
        .controller('SectionNavController', ['$scope', '$rootScope', '$state', '$uibModal', 'Project', function SectionNavController($scope, $rootScope, $state, $uibModal, Project) {
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
                }, function promiseDidReject() {
                    $uibModal.open({
                        templateUrl: 'partials/message.html',
                        controller: 'GenericErrorMessageController',
                        scope: $scope,
                        size: 'sm'
                    });
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
        .controller('FallbackController', ['$filter', '$state', '$uibModal', 'Project', function FallbackController($filter, $state, $uibModal, Project) {

            // go to the first subscribed project, if it exists
            Project.own.$promise.then(function promiseDidResolve() {
                if (Project.own.length > 0) {
                    $state.go('section', {
                        projectId: $filter('orderBy')(Project.own, 'name')[0].id,
                        sectionId: 'record'
                    });
                }
            }, function promiseDidReject() {
                $uibModal.open({
                    templateUrl: 'partials/message.html',
                    controller: 'GenericErrorMessageController',
                    scope: $scope,
                    size: 'sm'
                });
            });
        }])
        .controller('SharedScopeController', ['$scope', '$uibModal', 'Project', 'Achievement', function SharedScopeController($scope, $uibModal, Project, Achievement) {
            $scope.showManageProjects = function showManageProjects() {
                $uibModal.open({
                    templateUrl: 'partials/manage-projects.html',
                    controller: 'ManageProjectsController',
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
            $scope.showEditProject = function showEditProject(projectArg, event) {
                if (event) {
                    event.stopPropagation();
                    event.preventDefault();
                }
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
                }, function promiseDidReject() {
                    $uibModal.open({
                        templateUrl: 'partials/message.html',
                        controller: 'GenericErrorMessageController',
                        scope: $scope,
                        size: 'sm'
                    });
                });
            };
        }])
        .controller('LeaderboardsController', ['$scope', '$filter', '$uibModal', 'Record', 'QUERY_DATE_FORMAT', function LeaderboardsController($scope, $filter, $uibModal, Record, QUERY_DATE_FORMAT) {
            function getBeginDate() {
                var ret = new Date();
                switch ($scope.period) {
                    case 'week':
                        // go back a week
                        ret.setDate(ret.getDate() - 7);
                        break;
                    case 'month':
                        // go back a month
                        ret.setMonth(ret.getMonth() - 1);
                        break;
                    case 'year':
                        // go back a year
                        ret.setYear(ret.getYear() - 1);
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
                }, function promiseDidReject() {
                    $uibModal.open({
                        templateUrl: 'partials/message.html',
                        controller: 'GenericErrorMessageController',
                        scope: $scope,
                        size: 'sm'
                    });
                    $scope.isLoading = false;
                });
            });
        }])
        .controller('GenericErrorMessageController', ['$scope', function GenericErrorMessageController($scope) {
            $scope.title = 'Generic error';
            $scope.message = 'Oops! Something went wrong and I don\'t know what. Try reloading the page.';
        }]);
}(window.angular, window.google, window.FastClick));