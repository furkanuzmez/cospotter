angular.module('manage-project-controller', [])

    .controller('manageProjectController', ['$scope', '$http', '$location', '$window', '$stateParams', 'appMainService', 'appManageIdService', function ($scope, $http, $location, $window, $stateParams, appMainService, appManageIdService) {

        var modal = new SmartDesign.Modal({
            id: 'project-manage-dialog',
            dissmiss: false,
            close_button: true,
            size: 'medium',//defalut
            animation: true,
            fit_to_bot: false
        });

        var modalClose = modal.closeButton;

        modalClose.onclick = function () {
            modal.hide();
            setTimeout(function () {
                window.location.href = '#!/manage'
            }, 300);
        }


        setTimeout(function () {
            modal.show();
        }, 100);

        var id = appManageIdService.getProjectId();

        $scope.project = {
            startDate: new Date().toISOString(),
            estimatedFinishtDate: new Date().toISOString()
        };
        $scope.error = '';
        $scope.progress = false;



        if (id !== 'new' && id != '') {

            //console.log('Updating an exisiting project ' + id);
            $http.get('/App/Manage/GetProject/' + id)
                .then(function (res) {
                    //console.log(res);
                    $scope.project = res.data.project;
                }, function (err) {
                    console.log(err);
                });
        } else {
            //console.log('New project...');
        }

        $scope.saveProject = function () {

            var fd = new FormData();
            fd.append("projectName", $scope.project.name);
            fd.append("projectDescription", $scope.project.description);
            fd.append("projectImg", $scope.project.img);

            var sDate = new Date($scope.project.startDate);
            var eDate = new Date($scope.project.estimatedFinishtDate);

            fd.append("projectStartDate", sDate.toJSON());
            fd.append("projectEstimatedFinishtDate", eDate.toJSON());
            $scope.progress = true;

            if (id === 'new' || id === '') {
                $http.post('/App/Manage/NewProject', fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                })
                    .then(function (res) {
                        var id = res.data.project.projectId;
                        $scope.progress = false;
                        appManageIdService.setProjectId(id);
                        $location.path('/manage/project/' + id + '/plans');
                    }, function (err) {
                        console.log(err);
                        $scope.progress = false;
                    });

            } else {

                $http.post('/App/Manage/UpdateProject/' + id, fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                })
                    .then(function (res) {
                        var id = res.data.project.projectId;
                        $scope.progress = false;
                        appManageIdService.setProjectId(id);
                        $location.path('/manage/project/' + id + '/plans');
                    }, function (err) {
                        console.log(err);
                        $scope.progress = false;
                    });


                console.log("update project");
            }
        }

    }])
    .directive('ngFileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.ngFileModel);
                var isMultiple = attrs.multiple;
                var modelSetter = model.assign;
                element.bind('change', function () {
                    var values = [];
                    angular.forEach(element[0].files, function (item) {
                        values.push(item);
                    });
                    scope.$apply(function () {
                        if (isMultiple) {
                            modelSetter(scope, values);
                        } else {
                            modelSetter(scope, values[0]);
                        }
                    });
                });
            }
        };
    }]);