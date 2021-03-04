angular.module('admin-route', ['ui.router'])

    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('register', {
                url: "/register-new-company",
                controller: 'companyRegisterController',
                templateUrl: "/Admin/registerCompany"
            })
    }]);