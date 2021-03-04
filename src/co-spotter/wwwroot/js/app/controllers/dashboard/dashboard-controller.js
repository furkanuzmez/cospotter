angular.module('dashboard-controller', [])

    .controller('dashboardController', ['$scope', '$http', '$location', '$window', '$stateParams', 'dashboardService', function ($scope, $http, $location, $window, $stateParams, dashboardService) {

        var id = $stateParams.project_id;

        dashboardService.projectId = id;

        angular.element(document.querySelector('#loading')).addClass('fade-in');
        $scope.projects = [];
        $scope.error = '';
        $scope.dashSearchInput;

        $http.get('/Dashboard/GetProjects')
            .then(function (res) {
                $scope.projects = res.data.projects;
                angular.element(document.querySelector('#loading')).removeClass('fade-in');
            }, function (err) {
                console.log(err);
                angular.element(document.querySelector('#loading')).removeClass('fade-in');
            });

        dashboardService.getProject(id).then(function (res) {
            $scope.projectName = res.data.staff.projectName;
        }, function (err) {
            console.log(err)
        });

        var modalProject = new SmartDesign.Modal({
            id: 'dash-projects',
            size: 'small',
            dissmiss: true
        });

        $scope.showProjects = function () {
            modalProject.show();
        }

        var lastProject = $window.localStorage.getItem('last-project');


        if (!lastProject) {
            modalProject.show();
        }

        $scope.routeToProject = function (id) {
            $window.localStorage.setItem('last-project', id)

            modalProject.hide();
            $location.path('dashboard/' + id + '/all')

        }

        $scope.dashRoute = function (route) {
            $location.path('/dashboard/' + lastProject + '/' + route);
        }

        $scope.showNoteImage = function (album, image) {

            SmartDesign.ImageViewer.dispose();
            SmartDesign.ImageViewer.init();
            SmartDesign.ImageViewer.setAlbum(album);
            if (image) {
                SmartDesign.ImageViewer.show(album.indexOf(image) + 1)
            } else {
                SmartDesign.ImageViewer.show()
            }
        }

        $scope.searchOpen = function (e) {
            var search = document.getElementById('dash-search');
            if (e.target === search || e.target === search.children[0]) {
                document.getElementById('dash-search-box').classList.add('show');

            }
        }

        $scope.searchClose = function (e) {
            document.getElementById('dash-search-box').classList.remove('show');
            $scope.dashSearchInput = '';
        }



    }]);