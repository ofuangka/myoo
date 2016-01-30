(function wrapper(angular) {
    'use strict';
    angular.module('Myoo')
        .controller('ManageSubscriptionsController', ['$scope', '$uibModal', '$state', '$stateParams', '$q', 'Project', 'Subscription', 'User', 'Achievement', function ManageSubscriptionsController($scope, $uibModal, $state, $stateParams, $q, Project, Subscription, User, Achievement) {
            function getSubscription(project) {
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
                return false !== getSubscription(project);
            }

            function subscribe(project) {
                var result = Subscription.save({projectId: project.id}, function requestDidSucceed() {

                    // create the Subscription.own reference
                    Subscription.own.$promise.then(function promiseDidResolve() {
                        Subscription.own.unshift(result);
                    });

                    // create the Project.own reference
                    Project.own.$promise.then(function promiseDidResolve() {
                        Project.own.unshift(project);

                        // if this is the user's only subscription, navigate to it
                        if (Project.own.length === 1) {
                            $state.go('section', {
                                projectId: Project.own[0].id,
                                sectionId: 'record'
                            });
                        }

                    });
                });
                return result;
            }

            $scope.isOwner = function isOwner(project) {
                return project && project.createdBy === User.self.id;
            };

            $scope.isSubscribed = isSubscribed;

            $scope.projects = Project.all;
            $scope.isLoadingProjects = function isLoadingProjects() {
                return Project.all.$promise.$$state.status === 0;
            };
            $scope.subscribe = subscribe;
            $scope.unsubscribe = function unsubscribe(project) {
                var subscription = getSubscription(project);
                if (subscription) {
                    Subscription.remove({id: subscription.id}, function requestDidSucceed() {

                        $q.all([Subscription.own.$promise, Project.own.$promise]).then(function promiseDidResolve() {
                            var i,
                                len;
                            for (i = 0, len = Subscription.own.length; i < len; i++) {
                                if (Subscription.own[i].id === subscription.id) {
                                    Subscription.own.splice(i, 1);
                                    break;
                                }
                            }
                            for (i = 0, len = Project.own.length; i < len; i++) {
                                if (Project.own[i].id === project.id) {
                                    Project.own.splice(i, 1);
                                    break;
                                }
                            }

                            // fallback if the current project is being unsubscribed
                            if ($stateParams.projectId === project.id) {
                                $state.go('fallback');
                            }
                        });
                    });
                }
            };
            /**
             * Subscribe to the project, navigate to it, and close the modal
             * @param project
             */
            $scope.userDidChooseProject = function userDidChooseProject(project) {
                if (!isSubscribed(project)) {
                    subscribe(project).$promise.then(function promiseDidResolve() {
                        $state.go('section', {
                            projectId: project.id,
                            sectionId: $scope.sectionId || 'record'
                        });
                        $scope.$close();
                    });
                } else {
                    $state.go('section', {
                        projectId: project.id,
                        sectionId: $scope.sectionId || 'record'
                    });
                    $scope.$close();
                }
            };
        }]);
}(window.angular));