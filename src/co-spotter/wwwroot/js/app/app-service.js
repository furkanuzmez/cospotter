angular.module('app-service', [])

    .factory('appMainService', ['$location', function ($location) {

        var service = {};

        service.redirectToLocation = function (location) {
            $location.path(location);
        }



        return service;
    }])
    .factory('appManageIdService', ['$stateParams', function ($stateParams) {

        var service = {};

        service.tabpanel = null;

        service.id = '';

        service.getProjectId = function () {
            return service.id;
        }

        service.setProjectId = function (id) {
            service.id = id;
        }

        service.nextTab = function () {
            var tab = service.tabpanel.activeTabIndex + 1;
            service.tabpanel.selectTab(tab);
        }
        return service;
    }])
    .factory('appMainProjectsService', ['$scope', function ($scope) {
        
    }]);