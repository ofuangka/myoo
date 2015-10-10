/**
 * Created by ofuangka on 9/27/15.
 */
(function wrapper(angular) {
    angular.module('Myoo', ['ui.bootstrap', 'ngResource', 'loadingBtn'])
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
                    controller: 'CreateProjectController',
                    scope: $scope
                });
            };
        }])
        .controller('HamburgerMenuController', ['$scope', '$modal', function HamburgerMenuController($scope, $modal) {
            $scope.showManageProjects = function showManageProjects() {
                $modal.open({
                    templateUrl: 'manage-projects.html',
                    controller: 'ManageProjectsController',
                    size: 'lg',
                    scope: $scope
                });
            };
        }])
        .controller('ProjectSidebarController', ['$scope', 'projectService', function ProjectSidebarController($scope, projectService) {
            $scope.userProjects = projectService.userProjects;
        }])
        .controller('CreateProjectController', ['$scope', '$modal', 'projectService', function CreateProjectController($scope, $modal, projectService) {
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
                var result = projectService.create(project, function createDidSucceed() {
                    $scope.$close();
                });
            };
        }])
        .controller('CreateAchievementController', ['$scope', function CreateAchievementController($scope) {
            $scope.modalTitle = 'Create Achievement';
            $scope.submitAchievementLabel = 'Create';
            $scope.selectedAchievement = {};
            $scope.submitAchievement = function submitAchievement(achievement) {
                $scope.achievementSubmitted = true;
                $scope.selectedProject.achievements.unshift(achievement);
                $scope.$close();
            };
        }])
        .controller('RecordAchievementsController', ['$scope', function RecordAchievementsController($scope) {
            $scope.projectAchievements = [{id:'1-ref',name:'Achievement 1', description:'Achievement 1 description', points:100}];
        }])
}(window.angular));