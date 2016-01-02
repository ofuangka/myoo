(function wrapper(angular) {
    angular.module('Myoo')
        .provider('Project', function ProjectProvider() {
            this.$get = ['$resource', function ProjectServiceFactory($resource) {
                var Project = $resource('/api/projects/:id'),
                    all = Project.query(),
                    own = Project.query({own: true});
                return angular.extend({}, Project, {
                    all: all,
                    own: own,
                    /**
                     * Calls the save project service and subscribes to it
                     * @param project The project to create
                     * @param successHandler An optional callback
                     */
                    create: function create(project, successHandler) {
                        var result = Project.save(project, function saveDidSucceed() {
                            all.unshift(result);
                            own.unshift(result);

                            if (angular.isFunction(successHandler)) {
                                successHandler();
                            }
                        });
                        return result;
                    },
                    /**
                     * Calls the update project service, then updates the all and own project arrays to reflect the update
                     * @param project The project that changes
                     * @param successHandler An optional callback
                     */
                    update: function update(project, successHandler) {
                        var result = Project.save({id: project.id}, project, function updateDidSucceed() {
                            var i, len;
                            for (i = 0, len = all.length; i < len; i++) {
                                if (all[i].id === result.id) {
                                    all.splice(i, 1, result);
                                    break;
                                }
                            }
                            for (i = 0, len = own.length; i < len; i++) {
                                if (own[i].id === result.id) {
                                    own.splice(i, 1, result);
                                    break;
                                }
                            }

                            if (angular.isFunction(successHandler)) {
                                successHandler();
                            }
                        });
                        return result;
                    }
                });
            }];
        })
        .provider('Achievement', function AchievementProvider() {
            this.$get = ['$resource', function AchievementFactory($resource) {
                return $resource('/api/achievements/:id');
            }];
        })
        .provider('User', function UserProvider() {
            this.$get = ['$resource', function UserFactory($resource) {
                var User = $resource('/api/users/:id');
                return angular.extend({}, User, {
                    self: User.get({id: 'self'})
                });
            }];
        })
        .provider('Record', function RecordProvider() {
            this.$get = ['$resource', function RecordFactory($resource) {
                return $resource('/api/records/:id');
            }];
        })
        .provider('Subscription', function SubscriptionProvider() {
            this.$get = ['$resource', function SubscriptionFactory($resource) {
                var Subscription = $resource('/api/subscriptions/:id'),
                    own = Subscription.query({own: true});
                return angular.extend({}, Subscription, {
                    own: own,
                    create: function create(subscription, successHandler) {
                        var ret = Subscription.save(subscription, function saveDidSucceed() {
                            own.unshift(ret);
                            if (angular.isFunction(successHandler)) {
                                successHandler();
                            }
                        });
                        return ret;
                    },
                    remove: function remove(subscription, successHandler) {
                        Subscription.remove({id: subscription.id}, subscription, function removeDidSucceed() {
                            var i,
                                len;
                            for (i = 0, len = own.length; i < len; i++) {
                                if (own[i].id === subscription.id) {
                                    own.splice(i, 1);
                                    break;
                                }
                            }
                            if (angular.isFunction(successHandler)) {
                                successHandler();
                            }
                        });
                    }
                });
            }];
        });
}(window.angular));