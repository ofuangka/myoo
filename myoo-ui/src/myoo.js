/**
 * Created by ofuangka on 9/27/15.
 */
(function wrapper(angular) {
    angular.module('Myoo', ['ui.bootstrap', 'ngResource'])
        .config(['$httpProvider', function configFn($httpProvider) {
            $httpProvider.defaults.headers.post = {
                'Content-type': 'application/json'
            };
        }])
        .controller('ManageProjectsController', ['$scope', 'projectService', '$modal', function ManageProjectsController($scope, projectService, $modal) {
            $scope.allProjects = projectService.allProjects;
            $scope.showCreateProject = function showCreateProject() {
                $modal.open({
                    templateUrl: 'create-project.html',
                    controller: 'CreateProjectController'
                });
            };
        }])
        .controller('HamburgerMenuController', ['$scope', '$modal', function HamburgerMenuController($scope, $modal) {
            $scope.showManageProjects = function showManageProjects() {
                $modal.open({
                    templateUrl: 'manage-projects.html',
                    controller: 'ManageProjectsController',
                    size: 'lg'
                });
            };
        }])
        .controller('ProjectSidebarController', ['$scope', 'projectService', function ProjectSidebarController($scope, projectService) {
            $scope.userProjects = projectService.userProjects;
        }])
        .controller('CreateProjectController', ['$scope', '$modal', 'projectService', function CreateProjectController($scope, $modal, projectService) {
            $scope.modalTitle = 'Create Project';
            $scope.project = {
                achievements: []
            };
            $scope.showCreateAchievement = function showCreateAchievement() {
                $modal.open({
                    templateUrl: 'create-achievement.html',
                    controller: 'CreateAchievementController'
                });
            };
            $scope.submitProjectLabel = 'Submit';
            $scope.submitProject = function submitProject(project) {
                // TODO: show loading
                var result = projectService.create(project, function createDidSucceed() {
                    // TODO: hide loading
                    $scope.$close();
                });
            };
        }])
        .controller('CreateAchievementController', function CreateAchievementController($scope) {
            $scope.modalTitle = 'Create Achievement';
            $scope.submitAchievementLabel = 'Create';
        });
}(window.angular));