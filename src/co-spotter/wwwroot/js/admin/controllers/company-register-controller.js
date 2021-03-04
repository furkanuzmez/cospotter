angular.module('company-register-controller', [])

.controller('companyRegisterController', ['$scope', '$http', function ($scope, $http) {

    $scope.manager = {
        fullname: 'Bilal Arslan',
        email: 'bilal@beyazdev.com',
        password: '!Admin123'//for now
    };
    $scope.company = {
        name: 'BeyazDev',
        email: 'beyazdev@email.com',
        phone :'09123456789',
        address: 'Ankara',
        website: 'www.cospotter.com'
    };

    $scope.registerCompany = function () {
        console.log($scope.manager, $scope.company);

        $http.post('/Admin/registerNewCompany', {
            manager: $scope.manager,
            company: $scope.company
        })
        .then(
            function (res) {
                console.log(res);
            },
            function (err) {
                console.log(err);
            });
    }

}]);