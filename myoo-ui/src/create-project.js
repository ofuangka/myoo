(function wrapper(angular) {
    'use strict';
    angular.module('Myoo')
        .controller('CreateProjectController', ['$scope', '$uibModal', '$state', '$filter', 'Project', 'Subscription', function CreateProjectController($scope, $uibModal, $state, $filter, Project, Subscription) {
            $scope.selectedProject = {
                achievements: []
            };
            $scope.showCreateAchievement = function showCreateAchievement() {
                $scope.selectedAchievement = {frequency: 'daily', spriteX: 0, spriteY: 0};
                $uibModal.open({
                    templateUrl: 'partials/create-achievement.html',
                    controller: 'CreateAchievementController',
                    scope: $scope
                });
            };
            $scope.showDeleteAchievementConfirm = function showDeleteAchievementConfirm(achievement) {
                $scope.selectedAchievement = achievement;
                $uibModal.open({
                    templateUrl: 'partials/confirm.html',
                    controller: 'DeleteAchievementConfirmController',
                    scope: $scope,
                    size: 'sm'
                });
            };
            $scope.showEditAchievement = function showEditAchievement(achievement) {
                $scope.originalAchievement = achievement;
                $scope.selectedAchievement = angular.extend({}, achievement);
                $uibModal.open({
                    templateUrl: 'partials/create-achievement.html',
                    controller: 'EditAchievementController',
                    scope: $scope
                });
            };
            $scope.saveProjectLabel = 'Save project';
            $scope.userDidSaveProject = function userDidSaveProject() {
                $scope.isSavingProject = true;
                var result = Project.save($scope.selectedProject, function requestDidSucceed() {

                    // add project to Project.all
                    Project.all.$promise.then(function promiseDidResolve() {
                        Project.all.unshift(angular.fromJson(angular.toJson(result)));
                    }, function promiseDidReject() {
                        $uibModal.open({
                            templateUrl: 'partials/message.html',
                            controller: 'GenericErrorMessageController',
                            scope: $scope,
                            size: 'sm'
                        });
                    });

                    // add project to Project.own
                    Project.own.$promise.then(function promiseDidResolve() {
                        Project.own.unshift(angular.fromJson(angular.toJson(result)));

                        // if this is the user's only project, navigate to it
                        if (Project.own.length == 1) {
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

                    var subscriptionResult = Subscription.save({projectId: result.id}, function requestDidSucceed() {

                        // add the project to Subscription.own
                        Subscription.own.$promise.then(function promiseDidResolve() {
                            Subscription.own.unshift(subscriptionResult);
                            $scope.$close();
                        }, function promiseDidReject() {
                            $uibModal.open({
                                templateUrl: 'partials/message.html',
                                controller: 'GenericErrorMessageController',
                                scope: $scope,
                                size: 'sm'
                            });
                        });
                    });
                });
            };
        }])
        .controller('EditProjectController', ['$scope', '$uibModal', '$rootScope', '$q', 'Project', 'Achievement', function EditProjectController($scope, $uibModal, $rootScope, $q, Project, Achievement) {
            $scope.isEditingProject = true;
            $scope.isLoadingAchievements = function isLoadingAchievements() {
                return $scope.selectedProject.achievements.$promise.$$state.status === 0;
            };
            $scope.showDeleteAchievementConfirm = function showDeleteAchievementConfirm(achievement) {
                $scope.selectedAchievement = achievement;
                $uibModal.open({
                    templateUrl: 'partials/confirm.html',
                    controller: 'DeleteAchievementConfirmController',
                    scope: $scope,
                    size: 'sm'
                });
            };
            $scope.showDeleteProjectConfirm = function showDeleteProjectConfirm() {
                $uibModal.open({
                    templateUrl: 'partials/confirm.html',
                    controller: 'DeleteProjectConfirmController',
                    scope: $scope,
                    size: 'sm'
                });
            };
            $scope.showCreateAchievement = function showCreateAchievement() {
                $scope.selectedAchievement = {points: 0, frequency: 'daily'};
                $uibModal.open({
                    templateUrl: 'partials/create-achievement.html',
                    controller: 'CreateAchievementController',
                    scope: $scope
                });
            };
            $scope.showEditAchievement = function showEditAchievement(achievement) {
                $scope.originalAchievement = achievement;
                $scope.selectedAchievement = angular.extend({}, achievement);
                $uibModal.open({
                    templateUrl: 'partials/create-achievement.html',
                    controller: 'EditAchievementController',
                    scope: $scope
                });
            };
            $scope.saveProjectLabel = 'Save changes';
            $scope.userDidSaveProject = function userDidSaveProject() {
                $scope.isSavingProject = true;
                var result = Project.save({id: $scope.selectedProject.id}, $scope.selectedProject, function requestDidSucceed() {
                    var i,
                        len;

                    $q.all([Project.all.$promise, Project.own.$promise]).then(function promiseDidResolve() {

                        // update Project.all references
                        for (i = 0, len = Project.all.length; i < len; i++) {
                            if (Project.all[i].id === result.id) {
                                Project.all.splice(i, 1, angular.fromJson(angular.toJson(result)));
                                break;
                            }
                        }

                        // update Project.own references
                        for (i = 0, len = Project.own.length; i < len; i++) {
                            if (Project.own[i].id === result.id) {
                                Project.own.splice(i, 1, angular.fromJson(angular.toJson(result)));
                                break;
                            }
                        }
                        $rootScope.$broadcast('projectChangeSuccess', result);
                        $scope.$close();
                    }, function promiseDidReject() {
                        $uibModal.open({
                            templateUrl: 'partials/message.html',
                            controller: 'GenericErrorMessageController',
                            scope: $scope,
                            size: 'sm'
                        });
                    });
                });
            };
        }])
        .controller('DeleteProjectConfirmController', ['$scope', '$uibModal', '$stateParams', '$state', 'Project', 'Subscription', function DeleteProjectConfirmController($scope, $uibModal, $stateParams, $state, Project, Subscription) {
            function deleteProjectReferences() {
                var i,
                    len;

                // delete any references in Project.all
                Project.all.$promise.then(function promiseDidResolve() {
                    for (i = 0, len = Project.all.length; i < len; i++) {
                        if (Project.all[i].id === $scope.selectedProject.id) {
                            Project.all.splice(i, 1);
                            break;
                        }
                    }
                }, function promiseDidReject() {
                    $uibModal.open({
                        templateUrl: 'partials/message.html',
                        controller: 'GenericErrorMessageController',
                        scope: $scope,
                        size: 'sm'
                    });
                });

                // delete any references in Project.own
                Project.own.$promise.then(function promiseDidResolve() {
                    for (i = 0, len = Project.own.length; i < len; i++) {
                        if (Project.own[i].id === $scope.selectedProject.id) {
                            Project.own.splice(i, 1);
                            break;
                        }
                    }
                }, function promiseDidReject() {
                    $uibModal.open({
                        templateUrl: 'partials/message.html',
                        controller: 'GenericErrorMessageController',
                        scope: $scope,
                        size: 'sm'
                    });
                });

                // delete any references in Subscription.own
                Subscription.own.$promise.then(function promiseDidResolve() {
                    for (i = 0, len = Subscription.own.length; i < len; i++) {
                        if (Subscription.own[i].projectId === $scope.selectedProject.id) {
                            Subscription.own.splice(i, 1);

                            // there might be more than one Subscription with the same projectId, so remove them all
                        }
                    }
                }, function promiseDidReject() {
                    $uibModal.open({
                        templateUrl: 'partials/message.html',
                        controller: 'GenericErrorMessageController',
                        scope: $scope,
                        size: 'sm'
                    });
                });
            }

            $scope.title = 'Are you sure?';
            $scope.message = 'You are about to delete the project and all its associated data. This action cannot be undone.';
            $scope.confirmLabel = 'Go ahead';
            $scope.userDidConfirm = function userDidConfirm() {
                $scope.isConfirming = true;
                Project.remove({id: $scope.selectedProject.id}, function requestDidSucceed() {
                    // delete everything related to the project in memory
                    deleteProjectReferences();

                    // if the user is currently on this project, go to the fallback page
                    if ($stateParams.projectId === $scope.selectedProject.id) {
                        $state.go('fallback');
                    }
                    $scope.$close();
                    $scope.$parent.$close();
                }, function requestDidFail() {
                    $uibModal.open({
                        templateUrl: 'partials/message.html',
                        controller: 'GenericErrorMessageController',
                        scope: $scope,
                        size: 'sm'
                    });
                });
            };
        }])
        .controller('CreateAchievementController', ['$scope', function CreateAchievementController($scope) {
            $scope.setIcon = function setIcon(spriteX, spriteY) {
                $scope.selectedAchievement.spriteX = spriteX;
                $scope.selectedAchievement.spriteY = spriteY;
            };
            $scope.title = 'Create an achievement';
            $scope.saveAchievementLabel = 'Save achievement';
            $scope.userDidSaveAchievement = function userDidSaveAchievement() {
                $scope.isSavingAchievement = true;
                $scope.selectedProject.achievements.unshift($scope.selectedAchievement);
                $scope.$close();
            };
        }])
        .controller('EditAchievementController', ['$scope', function EditAchievementController($scope) {
            $scope.setIcon = function setIcon(spriteX, spriteY) {
                $scope.selectedAchievement.spriteX = spriteX;
                $scope.selectedAchievement.spriteY = spriteY;
            };
            $scope.title = 'Edit achievement details';
            $scope.saveAchievementLabel = 'Save changes';
            $scope.userDidSaveAchievement = function userDidSaveAchievement() {
                var i, len;
                $scope.isSavingAchievement = true;
                for (i = 0, len = $scope.selectedProject.achievements.length; i < len; i++) {
                    if ($scope.selectedProject.achievements[i] === $scope.originalAchievement) {
                        $scope.selectedProject.achievements.splice(i, 1, $scope.selectedAchievement);
                        break;
                    }
                }
                $scope.$close();
            };
        }])
        .controller('DeleteAchievementConfirmController', ['$scope', function DeleteAchievementConfirmController($scope) {
            $scope.title = 'Are you sure?';
            $scope.message = 'This will delete the achievement.';
            $scope.confirmLabel = 'Do it';
            $scope.userDidConfirm = function userDidConfirm() {
                var i, len;
                for (i = 0, len = $scope.selectedProject.achievements.length; i < len; i++) {
                    if ($scope.selectedProject.achievements[i] === $scope.selectedAchievement) {
                        $scope.selectedProject.achievements.splice(i, 1);
                        break;
                    }
                }
                $scope.$close();
            };
        }])
}(window.angular));