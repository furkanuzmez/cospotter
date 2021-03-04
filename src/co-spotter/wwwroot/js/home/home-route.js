angular.module('home-route', ['ui.router'])

    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                url: '/',
                controller: function ($location) {
                    angular.element(document).ready = function () {
                        var subDomain = $location.host().split('.')[0];
                        if (subDomain === 'app' || subDomain === 'admin') window.location.replace('/' + subDomain);
                    }
                }
            })

    }]);