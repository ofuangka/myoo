(function wrapper(angular) {
    angular.module('Myoo')
        .provider('Project', function ProjectProvider() {
            this.$get = ['$resource', function ProjectServiceFactory($resource) {
                var Project = $resource('/api/projects/:id');
                return angular.extend(Project, {
                    all: Project.query(),
                    own: Project.query({own: true})
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
                return angular.extend(User, {
                    self: User.get({id: 'self'})
                });
            }];
        })
        .provider('Record', function RecordProvider() {
            this.$get = ['$resource', '$filter', function RecordFactory($resource, $filter) {
                var date = $filter('date'),
                    dateFormat = 'yyyy-MM-dd',
                    lastWeek,
                    now,
                    Record;
                lastWeek = new Date();
                lastWeek.setDate(lastWeek.getDate() - 7);
                now = new Date();
                Record = $resource('/api/records/:id', {
                    begin_date: date(lastWeek, dateFormat),
                    end_date: date(now, dateFormat)
                });
                return angular.extend(Record, {
                    own: Record.query({own: true})
                });
            }];
        })
        .provider('Subscription', function SubscriptionProvider() {
            this.$get = ['$resource', function SubscriptionFactory($resource) {
                var Subscription = $resource('/api/subscriptions/:id');
                return angular.extend(Subscription, {
                    own: Subscription.query({own: true})
                });
            }];
        });
}(window.angular));