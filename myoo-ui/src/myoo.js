/**
 * Created by ofuangka on 9/27/15.
 */
(function wrapper(angular) {
    function getIsResourceLoadingFn(resource) {
        return function isResourceLoading() {
            return resource.$promise.$$state.status === 0;
        }
    }

    angular.module('Myoo', ['ngResource', 'ui.router', 'ui.bootstrap', 'loadingBtn'])
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
        .controller('ManageSubscriptionsController', ['$scope', '$modal', '$state', 'Project', 'Subscription', 'User', 'Achievement', function ManageSubscriptionsController($scope, $modal, $state, Project, Subscription, User, Achievement) {
            function getSubscriptionForProject(project) {
                var i,
                    len,
                    ret = false,
                    own = Subscription.own;
                for (i = 0, len = own.length; i < len; i++) {
                    if (own[i].projectId === project.id) {
                        ret = own[i];
                        break;
                    }
                }
                return ret;
            }

            function isSubscribed(project) {
                return false !== getSubscriptionForProject(project);
            }

            $scope.allProjects = Project.all;
            $scope.isLoadingProjects = getIsResourceLoadingFn($scope.allProjects);
            $scope.showCreateProject = function showCreateProject() {
                $modal.open({
                    templateUrl: 'create-project.html',
                    controller: 'CreateProjectController',
                    scope: $scope
                });
            };
            $scope.isSubscribed = isSubscribed;
            $scope.toggleSubscription = function toggleSubscription(project) {
                var subscription,
                    own = Project.own,
                    isLoadingSubscriptions = getIsResourceLoadingFn(Subscription.own);
                if (!isLoadingSubscriptions()) {
                    if (subscription = getSubscriptionForProject(project)) {
                        Subscription.remove(subscription, function removeDidSucceed() {
                            var i,
                                len;
                            for (i = 0, len = own.length; i < len; i++) {
                                if (own[i].id === project.id) {
                                    own.splice(i, 1);
                                    break;
                                }
                            }
                        });
                    } else {
                        Subscription.create({projectId: project.id}, function saveDidSucceed() {
                            own.unshift(project);
                        });
                    }
                }

            };
            $scope.isOwner = function isOwner(project) {
                return project.createdBy === User.self.id;
            };
            $scope.showEditProject = function showEditProject(project) {
                $scope.selectedProject = angular.extend(project, {achievements: Achievement.query({pid: project.id})});
                $modal.open({
                    templateUrl: 'create-project.html',
                    controller: 'EditProjectController',
                    scope: $scope
                });
            };
            $scope.showEraseConfirm = function showEraseConfirm(project) {
                $modal.open({
                    templateUrl: 'confirm.html',
                    controller: 'EraseConfirmController',
                    scope: $scope,
                    size: 'sm'
                });
            };
            $scope.userDidClickProject = function userDidClickProject(project) {
                if (!isSubscribed(project)) {
                    Subscription.create({projectId: project.id}, function saveDidSucceed() {
                        Project.own.unshift(project);
                    });
                }
                $state.go('section', {
                    projectId: project.id,
                    sectionId: $scope.sectionId || 'record'
                });
                $scope.$close();
            };
        }])
        .controller('EraseConfirmController', ['$scope', '$modal', function EraseConfirmController($scope, $modal) {
            $scope.confirmTitle = 'Are you sure?';
            $scope.confirmBody = 'You are about to delete all of your progress with this project. This action cannot be undone.';
            $scope.confirmSubmitLabel = 'Erase';
            $scope.confirmSubmitFn = function confirmSubmitFn() {
                $scope.$close();
            };
        }])
        .controller('MainMenuController', ['$scope', '$modal', 'User', function MainMenuController($scope, $modal, User) {
            $scope.self = User.self;
            $scope.showManageSubscriptions = function showManageSubscriptions() {
                $modal.open({
                    templateUrl: 'manage-subscriptions.html',
                    controller: 'ManageSubscriptionsController',
                    size: 'lg',
                    scope: $scope
                });
            };
        }])
        .controller('ProjectSidebarController', ['$scope', '$modal', 'Project', '$rootScope', function ProjectSidebarController($scope, $modal, Project, $rootScope) {
            $scope.ownProjects = Project.own;
            $rootScope.$on('$stateChangeSuccess', function stateDidChange(event, toState, toParams) {
                $scope.sectionId = toParams.sectionId;
                $scope.projectId = toParams.projectId;
            });
            $scope.isLoadingProjects = getIsResourceLoadingFn($scope.ownProjects);
            $scope.showCreateProject = function showCreateProject() {
                $modal.open({
                    templateUrl: 'create-project.html',
                    controller: 'CreateProjectController',
                    scope: $scope
                });
            };
        }])
        .controller('CreateProjectController', ['$scope', '$modal', 'Project', 'Subscription', function CreateProjectController($scope, $modal, Project, Subscription) {
            $scope.modalTitle = 'Create Project';
            $scope.selectedProject = {
                achievements: []
            };
            $scope.showCreateAchievement = function showCreateAchievement() {
                $modal.open({
                    templateUrl: 'create-achievement.html',
                    controller: 'CreateAchievementController',
                    scope: $scope
                });
            };
            $scope.submitProjectLabel = 'Submit';
            $scope.submitProject = function submitProject(project) {
                $scope.projectSubmitted = true;
                var result = Project.create(project, function createDidSucceed() {
                    Subscription.own.$promise.then(function promiseDidResolve() {
                        Subscription.own.unshift({projectId: project.id});
                    });
                    $scope.$close();
                });
            };
        }])
        .controller('EditProjectController', ['$scope', '$modal', '$rootScope', 'Project', 'Achievement', function EditProjectController($scope, $modal, $rootScope, Project, Achievement) {
            $scope.modalTitle = 'Edit Project';
            $scope.showDeleteProjectConfirm = function showDeleteProjectConfirm(project) {
                $modal.open({
                    templateUrl: 'confirm.html',
                    controller: 'DeleteProjectConfirmController',
                    scope: $scope,
                    size: 'sm'
                });
            };
            $scope.showCreateAchievement = function showCreateAchievement() {
                $modal.open({
                    templateUrl: 'create-achievement.html',
                    controller: 'CreateAchievementController',
                    scope: $scope
                });
            };
            $scope.submitProjectLabel = 'Submit';
            $scope.submitProject = function submitProject(project) {
                $scope.projectSubmitted = true;
                var result = Project.update(project, function updateDidSucceed() {
                    $rootScope.$broadcast('projectChangeSuccess');
                    $scope.$close();
                });
            }
        }])
        .controller('DeleteProjectConfirmController', ['$scope', '$modal', function DeleteProjectConfirmController($scope, $modal) {
            $scope.confirmTitle = 'Are you sure?';
            $scope.confirmBody = 'You are about to delete the project and all its associated data. This action cannot be undone.';
            $scope.confirmSubmitLabel = 'Delete project';
            $scope.confirmSubmitFn = function confirmSubmitFn() {
                $scope.$close();
            };
        }])
        .controller('CreateAchievementController', ['$scope', function CreateAchievementController($scope) {
            $scope.modalTitle = 'Create Achievement';
            $scope.submitAchievementLabel = 'Create';
            $scope.selectedAchievement = {};
            $scope.submitAchievement = function submitAchievement(achievement) {
                $scope.selectedProject.achievements.unshift(achievement);
                $scope.$close();
            };
        }])
        .controller('RecordController', ['$scope', '$stateParams', '$modal', 'Achievement', 'Record', function RecordController($scope, $stateParams, $modal, Achievement, Record) {
            function loadAchievements() {
                $scope.projectAchievements = Achievement.query({pid: $stateParams.projectId});
                $scope.isLoadingAchievements = getIsResourceLoadingFn($scope.projectAchievements);
            }

            $scope.$on('projectChangeSuccess', loadAchievements);

            loadAchievements();

            $scope.recordAchievement = function recordAchievement(achievement) {
                Record.save({
                    achievementId: achievement.id,
                    points: achievement.points
                }, function recordDidSucceed() {
                    $modal.open({
                        templateUrl: 'alert.html',
                        controller: 'RecordSuccessController',
                        scope: $scope,
                        size: 'sm'
                    });
                });
            };
        }])
        .controller('RecordSuccessController', ['$scope', function RecordSuccessController($scope) {
            $scope.alertTitle = 'Record Succeeded';
            $scope.alertBody = 'You successfully recorded this achievement!';
        }])
        .controller('ReviewController', ['$scope', function ReviewController($scope) {
            // TODO: implement
        }])
        .controller('ProjectTopNavController', ['$scope', '$rootScope', function ProjectTopNavController($scope, $rootScope) {

            $rootScope.$on('$stateChangeSuccess', function stateDidChange(event, toState, toParams) {
                $scope.projectId = toParams.projectId;
                $scope.sectionId = toParams.sectionId;
            });
        }])
        .controller('FallbackController', ['$scope', '$modal', function FallbackController($scope, $modal) {
            $scope.showCreateProject = function showCreateProject() {
                $modal.open({
                    templateUrl: 'create-project.html',
                    controller: 'CreateProjectController',
                    scope: $scope
                });
            };
        }]);
}(window.angular));