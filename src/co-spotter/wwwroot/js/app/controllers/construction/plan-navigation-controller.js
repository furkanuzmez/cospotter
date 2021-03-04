angular.module('plan-navigation-controller', [])

    .controller('planNavigationController', ['$scope', '$http', '$stateParams', function ($scope, $http, $stateParams) {

        var view = document.getElementById('construction-subview');


        angular.element(document.querySelector('#loading')).addClass('fade-in');

        view.className = 'canvas-plan-navigation-container expand';

        var id = $stateParams.plan_id;

        $scope.searchPlan = '';
        $scope.plans = [];

        $http.get('/App/Construction/GetProjectPlans/' + id)
            .then(function (res) {
                console.log(res);
                $scope.plans = res.data.plans;
                angular.element(document.querySelector('#loading')).removeClass('fade-in');
            }, function (err) {
                console.log(err);
                angular.element(document.querySelector('#loading')).removeClass('fade-in');
            });


    }]);