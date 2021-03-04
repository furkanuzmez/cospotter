angular.module('manage-controller', [])

    .controller('manageController', ['$scope', '$http', '$location', '$stateParams', 'appMainService', 'appManageIdService', function ($scope, $http, $location, $stateParams, appMainService, appManageIdService) {

        var tabpanel = SmartDesign.TabPanel.fetchById('manageTabPanel');

        tabpanel.onActiveTabChanged = function () {
            window.location.href = '#!/manage/project/' + tabpanel.activeTab.attributes['target-url'].value;
        }

        appManageIdService.tabpanel = tabpanel;

        $scope.projects = [];
        $scope.error = '';
        $http.get('/App/Manage/Projects')
            .then(function (res) {
                //console.log(res.data.projects);
                $scope.projects = res.data.projects;
            }, function (err) {
                $scope.error = err.data.error;
            });

        $scope.manageProject = function (project_id) {

            if (project_id === "new") {
                appManageIdService.setProjectId('new');
            } else {
                appManageIdService.setProjectId(project_id);
            }
            $scope.appManageIdService = appManageIdService;
            $location.path('/manage/project/' + appManageIdService.getProjectId());
        }

    }]);