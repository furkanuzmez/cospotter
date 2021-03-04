angular.module('note-navigation-controller', [])

    .controller('noteNavigationController', ['$scope', '$http', '$location', '$stateParams', function ($scope, $http, $location, $stateParams) {

        var view = document.getElementById('construction-subview');


        angular.element(document.querySelector('#loading')).addClass('fade-in');
        view.className = 'canvas-note-navigation-container expand';

        var id = $stateParams.plan_id;
        //console.log(id);
        $scope.notes = [];
        $http.get('/App/Construction/GetPlanNotes/' + id)
            .then(function (res) {
                $scope.notes = res.data.notes;
                angular.element(document.querySelector('#loading')).removeClass('fade-in');
            }, function (err) {
                console.log(err);
                angular.element(document.querySelector('#loading')).removeClass('fade-in');
            });

        $scope.navigateZone = function (z_id) {
            $location.path('/construction/' + id + '/' + z_id);
        }
    }]);