(function wrapper(angular) {
    angular.module('Myoo', ['ngResource', 'ui.router', 'ui.bootstrap', 'loadingBtn', 'spinner'])
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
        .controller('UserMenuController', ['$scope', '$modal', 'User', function UserMenuController($scope, $modal, User) {
            $scope.my = User.self;
            $scope.showManageSubscriptions = function showManageSubscriptions() {
                $modal.open({
                    templateUrl: 'manage-subscriptions.html',
                    controller: 'ManageSubscriptionsController',
                    size: 'lg',
                    scope: $scope
                });
            };
        }])
        .controller('SectionNavController', ['$scope', '$rootScope', function SectionNavController($scope, $rootScope) {
            $rootScope.$on('$stateChangeSuccess', function stateDidChange(event, toState, toParams) {
                $scope.projectId = toParams.projectId;
                $scope.sectionId = toParams.sectionId;
            });
        }])
        .controller('ProjectSidebarController', ['$scope', '$modal', 'Project', '$rootScope', function ProjectSidebarController($scope, $modal, Project, $rootScope) {
            $scope.projects = Project.own;
            $rootScope.$on('$stateChangeSuccess', function stateDidChange(event, toState, toParams) {
                $scope.sectionId = toParams.sectionId;
                $scope.projectId = toParams.projectId;
            });
            $scope.isLoadingProjects = function isLoadingProjects() {
                return Project.own.$promise.$$state.status === 0;
            };
            $scope.showCreateProject = function showCreateProject() {
                $modal.open({
                    templateUrl: 'create-project.html',
                    controller: 'CreateProjectController',
                    scope: $scope
                });
            };
        }])
        .controller('RecordController', ['$scope', '$stateParams', '$modal', 'Achievement', 'Record', function RecordController($scope, $stateParams, $modal, Achievement, Record) {
            function loadAchievements() {
                $scope.projectAchievements = Achievement.query({pid: $stateParams.projectId});
                $scope.isLoadingAchievements = function isLoadingAchievements() {
                    return $scope.projectAchievements.$promise.$$state.status === 0;
                };
            }

            $scope.$on('projectChangeSuccess', loadAchievements);

            loadAchievements();

            $scope.recordAchievement = function recordAchievement(achievement) {
                Record.save({
                    achievementId: achievement.id,
                    points: achievement.points
                }, function recordDidSucceed() {
                    $modal.open({
                        templateUrl: 'message.html',
                        controller: 'AchievementAchievedMessageController',
                        scope: $scope,
                        size: 'sm'
                    });
                });
            };
        }])
        .controller('AchievementAchievedMessageController', ['$scope', function AchievementAchievedessageController($scope) {
            $scope.title = 'Achievement Achieved';
            $scope.message = 'You successfully achieved this achievement.';
        }])
        .controller('ReviewController', ['$scope', function ReviewController($scope) {
            // TODO: implement
        }])
        .controller('FallbackController', ['$scope', '$modal', function FallbackController($scope, $modal) {
            $scope.showManageSubscriptions = function showManageSubscriptions() {
                $modal.open({
                    templateUrl: 'manage-subscriptions.html',
                    controller: 'ManageSubscriptionsController',
                    scope: $scope
                });
            };
            $scope.showCreateProject = function showCreateProject() {
                $modal.open({
                    templateUrl: 'create-project.html',
                    controller: 'CreateProjectController',
                    scope: $scope
                });
            };
        }]);
}(window.angular));