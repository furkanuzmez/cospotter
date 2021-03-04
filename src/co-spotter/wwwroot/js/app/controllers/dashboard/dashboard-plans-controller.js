angular.module('dashboard-plans-controller', [])

    .controller('dashboardPlansController', ['$scope', '$http', '$location', '$window', '$stateParams', function ($scope, $http, $location, $window, $stateParams) {

        angular.element(document.querySelector('#loading')).addClass('fade-in');

        $scope.plans = [{}];

        $http.get('/Dashboard/GetProjectPlans/' + $stateParams.project_id)
            .then(function (res) {
                console.log(res);
                $scope.plans = res.data.plans;
                angular.element(document.querySelector('#loading')).removeClass('fade-in');
            }, function (err) {
                console.log(err);
                angular.element(document.querySelector('#loading')).removeClass('fade-in');
            });



        angular.element(document).ready = function () {
            angular.element(document.querySelector('#loading')).removeClass('fade-in');
        }
    }]);