(function wrapper(angular, google) {
    'use strict';
    angular.module('Myoo')
        .directive('barChartData', ['$window', function barChartDirective($window) {
            return {
                restrict: 'EA',
                link: function linkFn(scope, element) {
                    function drawChart() {

                        // Instantiate and draw our chart, passing in some options.
                        new scope.barChartType(element[0]).draw(scope.barChartData, scope.barChartOptions);

                    }

                    function windowDidResize() {
                        if (oldWidth !== $window.innerWidth) {
                            oldWidth = $window.innerWidth;
                            drawChart();
                        }
                    }

                    var oldWidth = $window.innerWidth,
                        deregistrationFn = scope.$watch('barChartData', function barChartDataDidChange(newValue, oldValue) {
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
                    barChartType: '=',
                    barChartOptions: '='
                }
            };
        }])
        .controller('ReviewController', ['$scope', '$filter', '$window', '$stateParams', '$q', '$uibModal', 'Record', 'User', 'Achievement', function ReviewController($scope, $filter, $window, $stateParams, $q, $uibModal, Record, User, Achievement) {
            function chartControlsDidChange(newValue, oldValue) {
                if (newValue !== oldValue) {
                    if (angular.isDate($scope.from) && angular.isDate($scope.to)) {
                        fetchChartData();
                    }
                }
            }

            function fetchChartData() {

                /**
                 * Generate an array of consecutive date strings between from and to inclusive
                 *
                 * @param from
                 * @param to
                 */
                function getDatesBetween(from, to) {
                    var ret = [], curr = new Date(from);
                    while (curr <= to) {
                        ret.push(new Date(curr));

                        // increment by one day
                        curr.setDate(curr.getDate() + 1);
                    }
                    return ret;
                }

                function generateTimelineDataTable(records) {
                    var dataTable = new google.visualization.DataTable();
                    dataTable.addColumn('date', 'Timestamp');
                    dataTable.addColumn('number', 'Points');
                    dataTable.addColumn({type: 'string', role: 'tooltip', p: {html: true}});
                    angular.forEach(records, function iterator(record) {
                        var ts = new Date(record.ts);
                        dataTable.addRow([ts, record.points, '<div class="panel-body"><h4>' + $filter('ddate')(ts) + '</h4><p>' + (record.blurb || 'No message') + '</p></div>']);
                    });
                    console.log(dataTable);
                    $scope.reviewChartType = google.visualization.ScatterChart;
                    $scope.reviewChartDataTable = dataTable;
                    $scope.reviewChartOptions = {
                        chartArea: {
                            left: '5%',
                            top: '5%',
                            width: '95%',
                            height: '85%'
                        },
                        fontName: 'Roboto',
                        fontSize: 12,
                        hAxis: {
                            baselineColor: '#999',
                            minValue: $scope.from,
                            maxValue: $scope.to,
                            textStyle: {
                                color: '#999'
                            }
                        },
                        vAxis: {
                            baselineColor: '#999',
                            textStyle: {
                                color: '#999'
                            }
                        },
                        legend: 'none',
                        tooltip: {
                            isHtml: true,
                            trigger: 'selection'
                        }
                    };
                    $scope.isLoading = false;
                }

                function generatePeopleDataTable(records) {
                    var rows, points = {}, username, i, j, len;

                    // generate a 2d array users[username][date] = points

                    // add the current user
                    points[User.self.username] = {};

                    angular.forEach(records, function iterator(record) {
                        var date = $filter('sdate')(new Date(record.ts));
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
                        var row = [$filter('ddate')(date)];
                        for (username in points) {
                            row.push(points[username][$filter('sdate')(date)] || 0);
                        }
                        rows.push(row);
                    });

                    /* make the points cumulative */
                    for (i = 2, len = rows.length; i < len; i++) {
                        for (j = 1; j < rows[i].length; j++) {
                            rows[i][j] += rows[i - 1][j];
                        }
                    }
                    $scope.reviewChartType = google.charts.Bar;
                    $scope.reviewChartDataTable = google.visualization.arrayToDataTable(rows);
                    $scope.reviewChartOptions = google.charts.Bar.convertOptions({});
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
                        var date = $filter('sdate')(new Date(record.ts));
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
                        var row = [$filter('ddate')(date)];
                        for (achievementId in achievementNames) {
                            row.push(points[achievementId][$filter('sdate')(date)] || 0);
                        }
                        rows.push(row);
                    });

                    $scope.reviewChartType = google.charts.Bar;
                    $scope.reviewChartDataTable = google.visualization.arrayToDataTable(rows);
                    $scope.reviewChartOptions = google.charts.Bar.convertOptions({});
                    $scope.isLoading = false;
                }

                var from = $filter('qdate')($scope.from),
                    to = $filter('qdate')($scope.to);
                $scope.isLoading = true;
                User.self.$promise.then(function promiseDidResolve() {
                    switch ($scope.selectedChartType) {
                        case 'timeline':
                            Record.query({
                                begin_date: from,
                                end_date: to,
                                pid: $stateParams.projectId,
                                own: true
                            }).$promise.then(generateTimelineDataTable);
                            break;
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
                }, function promiseDidReject() {
                    $uibModal.open({
                        templateUrl: 'partials/message.html',
                        controller: 'GenericErrorMessageController',
                        scope: $scope,
                        size: 'sm'
                    });
                });
            }

            var now = new Date(),
                lastWeek = new Date(),
                lastMonth = new Date();
            lastWeek.setDate(now.getDate() - 7);
            lastMonth.setMonth(now.getMonth() - 1);
            $scope.setChartType = function setChartType(chartType) {
                $scope.selectedChartType = chartType;
            };
            $scope.set1Day = function set1Day() {
                $scope.from = new Date(now);
                $scope.to = new Date(now);
            };
            $scope.set1Week = function set1Week() {
                $scope.from = new Date(lastWeek);
                $scope.to = new Date(now);
            };
            $scope.set1Month = function set1Month() {
                $scope.from = new Date(lastMonth);
                $scope.to = new Date(now);
            };
            $scope.maxDate = new Date(now);
            $scope.dateFormat = 'yyyy-MM-dd';
            $scope.chartTypes = ['timeline', 'people', 'achievements'];
            $scope.from = new Date(lastWeek);
            $scope.to = new Date(now);
            $scope.selectedChartType = $scope.chartTypes[0];
            $scope.$watch('from + to + selectedChartType', chartControlsDidChange);
            fetchChartData();
        }]);
}(window.angular, window.google));