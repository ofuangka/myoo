(function wrapper(angular) {
    angular.module('Myoo')
        .controller('CreateProjectController', ['$scope', '$modal', 'Project', 'Subscription', function CreateProjectController($scope, $modal, Project, Subscription) {
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
            $scope.saveProjectLabel = 'Save project';
            $scope.userDidSaveProject = function userDidSaveProject() {
                $scope.isSavingProject = true;
                var result = Project.save($scope.selectedProject, function requestDidSucceed() {

                    // add project to Project.all
                    Project.all.$promise.then(function promiseDidResolve() {
                        Project.all.unshift(result);
                    });

                    // add project to Project.own
                    Project.own.$promise.then(function promiseDidResolve() {
                        Project.own.unshift(result);
                    });

                    var subscriptionResult = Subscription.save({projectId: result.id}, function requestDidSucceed() {

                        // add the project to Subscription.own
                        Subscription.own.$promise.then(function promiseDidResolve() {
                            Subscription.own.unshift(subscriptionResult);

                            $scope.isSavingProject = false;

                            $scope.$close();
                        });
                    });
                });
            };
        }])
        .controller('EditProjectController', ['$scope', '$modal', '$rootScope', 'Project', 'Achievement', function EditProjectController($scope, $modal, $rootScope, Project, Achievement) {
            $scope.isEditingProject = true;
            $scope.isLoadingAchievements = function isLoadingAchievements() {
                return $scope.selectedProject.achievements.$promise.$$state.status === 0;
            };
            $scope.showDeleteProjectConfirm = function showDeleteProjectConfirm() {
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
            $scope.saveProjectLabel = 'Save changes';
            $scope.userDidSaveProject = function userDidSaveProject() {
                $scope.isSavingProject = true;
                var result = Project.save({id: $scope.selectedProject.id}, $scope.selectedProject, function requestDidSucceed() {
                    var i,
                        len;

                    // update Project.all references
                    for (i = 0, len = Project.all.length; i < len; i++) {
                        if (Project.all[i].id === result.id) {
                            Project.all.splice(i, 1, result);
                            break;
                        }
                    }

                    // update Project.own references
                    for (i = 0, len = Project.own.length; i < len; i++) {
                        if (Project.own[i].id === result.id) {
                            Project.own.splice(i, 1, result);
                        }
                    }
                    $rootScope.$broadcast('projectChangeSuccess');
                    $scope.isSavingProject = false;
                    $scope.$close();
                });
            };
        }])
        .controller('DeleteProjectConfirmController', ['$scope', '$modal', '$stateParams', '$state', 'Project', 'Subscription', function DeleteProjectConfirmController($scope, $modal, $stateParams, $state, Project, Subscription) {
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
                });

                // delete any references in Project.own
                Project.own.$promise.then(function promiseDidResolve() {
                    for (i = 0, len = Project.own.length; i < len; i++) {
                        if (Project.own[i].id === $scope.selectedProject.id) {
                            Project.own.splice(i, 1);
                            break;
                        }
                    }
                });

                // delete any references in Subscription.own
                Subscription.own.$promise.then(function promiseDidResolve() {
                    for (i = 0, len = Subscription.own.length; i < len; i++) {
                        if (Subscription.own[i].projectId === $scope.selectedProject.id) {
                            Subscription.own.splice(i, 1);

                            // there might be more than one Subscription with the same projectId, so remove them all
                        }
                    }
                });
            }

            $scope.title = 'Are you sure?';
            $scope.message = 'You are about to delete the project and all its associated data. This action cannot be undone.';
            $scope.confirmLabel = 'I\'m sure';
            $scope.userDidConfirm = function userDidConfirm() {
                $scope.isLoading = true;
                Project.remove({id: $scope.selectedProject.id}, function requestDidSucceed() {
                    // delete everything related to the project in memory
                    deleteProjectReferences();

                    // if the user is currently on this project, go to the fallback page
                    if ($stateParams.projectId === $scope.selectedProject.id) {
                        $state.go('fallback');
                    }
                    $scope.$close();
                    $scope.$parent.$close();
                });
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
}(window.angular));