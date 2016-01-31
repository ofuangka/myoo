(function wrapper(angular) {
    'use strict';
    angular.module('Myoo')
        .directive('barChartData', ['$window', function barChartDirective($window) {
            return {
                restrict: 'EA',
                link: function linkFn(scope, element) {
                    function drawChart() {

                        // Instantiate and draw our chart, passing in some options.
                        new google.charts.Bar(element[0]).draw(scope.barChartData, scope.barChartOptions);

                    }

                    function windowDidResize(newValue, oldValue) {
                        if (newValue !== oldValue) {
                            drawChart();
                        }
                    }

                    var deregistrationFn = scope.$watch('barChartData', function barChartDataDidChange(newValue, oldValue) {
                        if (newValue !== oldValue) {
                            drawChart();
                        }
                    });
                    angular.element($window).on('resize', windowDidResize);
                    element.on('$destroy', function $destroy() {
                        angular.element($window).off('resize', windowDidResize);
                    });
                    scope.$on('$destroy', deregistrationFn);
                },
                scope: {
                    barChartData: '=',
                    barChartOptions: '='
                }
            };
        }])
        .controller('ReviewController', ['$scope', '$filter', '$window', '$stateParams', '$q', 'Record', 'User', 'Achievement', 'QUERY_DATE_FORMAT', 'SORTABLE_DATE_FORMAT', function ReviewController($scope, $filter, $window, $stateParams, $q, Record, User, Achievement, QUERY_DATE_FORMAT, SORTABLE_DATE_FORMAT) {
            function fetchChartData(newValue, oldValue) {
                function dateAsQueryString(d) {
                    return dateFilter(d, QUERY_DATE_FORMAT);
                }

                function dateAsSortableString(d) {
                    return dateFilter(d, SORTABLE_DATE_FORMAT);
                }

                /**
                 * Generate an array of consecutive date strings between from and to inclusive
                 *
                 * @param from
                 * @param to
                 */
                function getDatesBetween(from, to) {
                    var ret = [], curr = new Date(from), currKey;
                    while (curr <= to) {
                        ret.push(dateAsSortableString(curr));

                        // increment by one day
                        curr.setDate(curr.getDate() + 1);
                    }
                    return ret;
                }

                function generatePeopleDataTable(records) {
                    var rows, points = {}, username;

                    // generate a 2d array users[username][date] = points

                    // add the current user
                    points[User.self.username] = {};

                    angular.forEach(records, function iterator(record) {
                        var date = dateAsSortableString(new Date(record.ts));
                        username = record.username;

                        // make a new object on first sight of this username
                        if (angular.isUndefined(points[username])) {
                            points[username] = {};
                        }

                        // sum the points
                        if (angular.isUndefined(points[username][date])) {
                            points[username][date] = record.points;
                        } else {
                            points[username][date] += record.points;
                        }
                    });

                    // generate a 2d array of rows/columns
                    rows = [['Date']];

                    // add the usernames as header columns
                    for (username in points) {
                        rows[0].push(username);
                    }

                    angular.forEach(getDatesBetween($scope.from, $scope.to), function iterator(date) {
                        var row = [date];
                        for (username in points) {
                            row.push(points[username][date] || 0);
                        }
                        rows.push(row);
                    });

                    $scope.reviewChartDataTable = google.visualization.arrayToDataTable(rows);
                    $scope.reviewChartOptions = {};
                    $scope.isLoading = false;
                }

                function generateAchievementsDataTable(results) {
                    var records = results[0], achievements = results[1], achievementNames = {}, achievementId, points = {}, rows = [['Date']];

                    // generate a map achievementNames[achievementId] = achievementName
                    angular.forEach(achievements, function iterator(achievement) {
                        achievementNames[achievement.id] = achievement.name;
                    });

                    // generate a 2d array points[achievementId][date] = points
                    angular.forEach(records, function iterator(record) {
                        var date = dateAsSortableString(new Date(record.ts));
                        achievementId = record.achievementId;
                        if (angular.isUndefined(points[achievementId])) {
                            points[achievementId] = {};
                        }
                        if (angular.isUndefined(points[achievementId][date])) {
                            points[achievementId][date] = record.points;
                        } else {
                            points[achievementId][date] += record.points;
                        }

                    });

                    angular.forEach(achievementNames, function iterator(achievementName, achievementId) {
                        rows[0].push(achievementName);
                        if (angular.isUndefined(points[achievementId])) {
                            points[achievementId] = {};
                        }
                    });

                    angular.forEach(getDatesBetween($scope.from, $scope.to), function iterator(date) {
                        var row = [date];
                        for (achievementId in achievementNames) {
                            row.push(points[achievementId][date] || 0);
                        }
                        rows.push(row);
                    });

                    $scope.reviewChartDataTable = google.visualization.arrayToDataTable(rows);
                    $scope.reviewChartOptions = {};
                    $scope.isLoading = false;
                }

                var from = dateAsQueryString($scope.from),
                    to = dateAsQueryString($scope.to);
                if (newValue !== oldValue) {
                    $scope.isLoading = true;
                    User.self.$promise.then(function promiseDidResolve() {
                        switch ($scope.selectedChartType) {
                            case 'people':
                                Record.query({
                                    begin_date: from,
                                    end_date: to,
                                    pid: $stateParams.projectId
                                }).$promise.then(generatePeopleDataTable);
                                break;
                            case 'achievements':
                                $q.all([Record.query({
                                        begin_date: from,
                                        end_date: to,
                                        pid: $stateParams.projectId,
                                        own: true
                                    }).$promise, Achievement.query({pid: $stateParams.projectId}).$promise])
                                    .then(generateAchievementsDataTable);
                                break;
                            default:
                                break;
                        }
                    });
                }
            }

            var now = new Date(),
                lastWeek = new Date(),
                lastMonth = new Date(),
                dateFilter = $filter('date');
            lastWeek.setDate(now.getDate() - 7);
            lastMonth.setMonth(now.getMonth() - 1);
            $scope.setChartType = function setChartType(chartType) {
                $scope.selectedChartType = chartType;
            };
            $scope.set1Day = function set1Day() {
                $scope.from = now;
                $scope.to = now;
            };
            $scope.set1Week = function set1Week() {
                $scope.from = lastWeek;
                $scope.to = now;
            };
            $scope.set1Month = function set1Month() {
                $scope.from = lastMonth;
                $scope.to = now;
            };
            $scope.maxDate = now;
            $scope.dateFormat = 'yyyy-MM-dd';
            $scope.chartTypes = ['people', 'achievements'];
            $scope.from = lastWeek;
            $scope.to = now;
            $scope.selectedChartType = $scope.chartTypes[0];
            $scope.$watch('from', fetchChartData);
            $scope.$watch('to', fetchChartData);
            $scope.$watch('selectedChartType', fetchChartData);
            fetchChartData(true, false);
        }])
}(window.angular));