/**
 * Created by ofuangka on 9/27/15.
 */
(function wrapper(angular) {
    angular.module('Myoo')
        .provider('projectService', function ProjectServiceProvider() {
            this.$get = ['$resource', function ProjectServiceFactory($resource) {
                var Project = $resource('/api/projects/:projectId'),
                    projectService = {
                        allProjects: Project.query(),
                        userProjects: Project.query(),
                        create: function create(project, successHandler) {
                            var allProjects = projectService.allProjects,
                                userProjects = projectService.userProjects,
                                result = Project.save(project, function saveDidSucceed() {
                                    allProjects.unshift(result);
                                    userProjects.unshift(result);

                                    if (angular.isFunction(successHandler)) {
                                        successHandler();
                                    }
                                });
                        },
                        update: function update(project, successHandler) {
                            var allProjects = projectService.allProjects,
                                userProjects = projectService.userProjects,
                                result = Project.save(project, function updateDidSucceed() {
                                    var i, len;
                                    for (i = 0, len = allProjects.length; i < len; i++) {
                                        if (allProjects[i].id === result.id) {
                                            allProjects.splice(i, 1, result);
                                            break;
                                        }
                                    }
                                    for (i = 0, len = userProjects.length; i < len; i++) {
                                        if (userProjects[i].id === result.id) {
                                            userProjects.splice(i, 1, result);
                                            break;
                                        }
                                    }

                                    if (angular.isFunction(successHandler)) {
                                        successHandler();
                                    }
                                });
                        },
                        remove: Project.remove
                    };
                return projectService;
            }];
        })
        .provider('Achievement', function AchievementProvider() {
            this.$get = ['$resource', function AchievementFactory($resource) {
                return $resource('/api/achievement/:achievementId');
            }];
        });
}(window.angular));