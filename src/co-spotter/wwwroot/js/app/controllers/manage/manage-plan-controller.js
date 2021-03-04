angular.module('manage-plan-controller', [])

    .controller('managePlanController', ['$scope', '$http', '$location', '$window', '$stateParams', 'appMainService', 'appManageIdService', function ($scope, $http, $location, $window, $stateParams, appMainService, appManageIdService) {


        var id = appManageIdService.getProjectId();
        if (id === 'new' || id === '') {
            $location.path('/manage/project/');
            return;
        }

        $scope.plans = [];
        $scope.deletedPlans = [];
        $scope.files = [];
        $scope.error = '';
        $scope.filename = false;
        $scope.$watch('files', function (files) {
            if (files.length) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    var flag = true;
                    for (var j = 0; j < $scope.plans.length; j++) {
                        var plan = $scope.plans[j];
                        //console.log(file, plan);
                        if (file.name === plan.name) {
                            flag = false;
                            $scope.files.splice(i, 1);
                            i--;
                            break;
                        }
                    }
                }
            }

        });

        $http.get('/App/Manage/Project/GetPlans/' + id)
            .then(function (res) {
                $scope.plans = res.data.plans;
            }, function (err) {
                $scope.error = err.data.error;
            });

        $scope.deletePlan = function (plan) {
            var index = $scope.plans.indexOf(plan);
            if (index >= 0) {
                $scope.deletedPlans.push($scope.plans[index]);
                $scope.plans.splice(index, 1);
                return;
            }

            index = $scope.files.indexOf(plan);
            if (index >= 0) {
                $scope.files.splice(index, 1);
                return;
            }

            index = $scope.deletedPlans.indexOf(plan);
            if (index >= 0) {
                $scope.plans.push($scope.deletedPlans[index]);
                $scope.deletedPlans.splice(index, 1);
            }
        }

        $scope.savePlan = function () {
            //console.log($scope.plans, $scope.files);

            var fd = new FormData();
            for (var i = 0; i < $scope.files.length; i++) {
                var file = $scope.files[i];
                fd.append('files', file);
            }

            $http.post('/App/Manage/Project/Plan/' + id, fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            })
                .then(function (res) {
                    console.log(res);
                    $scope.plans = res.data.plans;
                    $scope.files = [];
                    $scope.deletedPlans = [];
                    $scope.error = '';
                }, function (err) {
                    $scope.files = [];
                    $scope.error = err.data.error;
                });

        }

    }])
    .directive('ngFileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.ngFileModel);
                var isMultiple = attrs.multiple;
                var modelSetter = model.assign;
                element.bind('change', function () {
                    var values = [];
                    angular.forEach(element[0].files, function (item) {
                        values.push(item);
                    });
                    scope.$apply(function () {
                        if (isMultiple) {
                            modelSetter(scope, values);
                        } else {
                            modelSetter(scope, values[0]);
                        }
                    });
                });
            }
        };
    }]);
