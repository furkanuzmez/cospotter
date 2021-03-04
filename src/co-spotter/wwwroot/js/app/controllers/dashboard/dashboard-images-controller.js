angular.module('dashboard-images-controller', [])

    .controller('dashboardImagesController', ['$scope', '$http', '$location', '$window', '$stateParams', 'dashboardService', function ($scope, $http, $location, $window, $stateParams, dashboardService) {

        angular.element(document.querySelector('#loading')).addClass('fade-in');

        $scope.noteImages = [{}];

        dashboardService.setDateTime("All");
        dashboardService.getProjectImages().
            then(function (res) {
                console.log(res);
                var arr = res.data.noteImages.concat(res.data.pins);
                $scope.noteImages = arr;
                angular.element(document.querySelector('#loading')).removeClass('fade-in');
            }, function (err) {
                console.log(err);
                angular.element(document.querySelector('#loading')).removeClass('fade-in');
            });


        $('#datepicker').datepicker("destroy");
        $('#datepicker').datepicker({
            dateFormat: "dd/mm/yy",
            onSelect: function (date) {
                angular.element(document.querySelector('#loading')).addClass('fade-in');
                dashboardService.setDateTime(date);
                dashboardService.getProjectImages().
                    then(function (res) {
                        var arr = res.data.noteImages.concat(res.data.pins);
                        $scope.noteImages = arr;
                        angular.element(document.querySelector('#loading')).removeClass('fade-in');
                    }, function (err) {
                        console.log(err);
                        angular.element(document.querySelector('#loading')).removeClass('fade-in');
                    });

            }
        });
        //$('#datepicker').datepicker('setDate', dashboardService.dateTime);




    }]);