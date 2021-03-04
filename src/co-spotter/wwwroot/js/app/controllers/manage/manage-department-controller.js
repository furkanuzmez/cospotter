angular.module('manage-department-controller', [])

    .controller('manageDepartmentController', ['$scope', '$http', '$location', '$window', '$stateParams', 'appMainService', 'appManageIdService', function ($scope, $http, $location, $window, $stateParams, appMainService, appManageIdService) {

        var id = appManageIdService.getProjectId();
        if (id == 'new' || id == '') {
            $location.path('/manage/project/');
            return;
        }



        var modal = new SmartDesign.Modal({
            id: 'project-manage-dialog',
            dissmiss: false,
            close_button: true,
            size: 'medium',//defalut
            animation: true,
            fit_to_bot: false
        });

        modal.onhide = function () {
            setTimeout(function () {
                window.location.href = '#!/manage'
            }, 300);
        }

        setTimeout(function () {
            modal.show();
        }, 100);

        $scope.back = function () {
            // open project management panel in subview
            appMainService.redirectToLocation('/manage');
        }



        //console.log('hello from department controller ' + id);

        $scope.departments = [];
        $scope.newDepartments = [];
        $scope.deletedDepartments = [];
        $scope.department = {
            name: ''
        };
        $scope.error = '';
        $scope.progressing = false;

        $http.get('/App/Manage/Project/GetDepartments/' + id)
            .then(function (res) {
                //console.log(res);
                $scope.departments = res.data.departments;
            }, function err() {
                $scope.error = err.data.error;
            });

        $scope.addDepartment = function () {
            if ($scope.department.name.length <= 1) {
                $scope.error = 'Text Length';
                return;
            }

            for (var i = 0; i < $scope.departments.length; i++) {
                var department = $scope.departments[i];
                if ($scope.department.name.toLowerCase() === department.name.toLowerCase()) {
                    $scope.error = 'This Department Already Exists';
                    return;
                }
            }

            for (var i = 0; i < $scope.newDepartments.length; i++) {
                var department = $scope.newDepartments[i];
                if ($scope.department.name.toLowerCase() === department.name.toLowerCase()) {
                    $scope.error = 'This Department Already Exists';
                    return;
                }
            }

            for (var i = 0; i < $scope.deletedDepartments.length; i++) {
                var department = $scope.deletedDepartments[i];
                if ($scope.department.name.toLowerCase() === department.name.toLowerCase()) {
                    //$scope.error = 'This Department Already Exists';
                    $scope.deletedDepartments.splice(i, 1);
                    break;
                }
            }

            //$scope.departments.push({ name: $scope.department.name })
            $scope.newDepartments.push({ name: $scope.department.name });
            $scope.department.name = '';
        }

        $scope.deleteDepartment = function (d) {
            var index = $scope.departments.indexOf(d);
            if (index >= 0) {
                $scope.deletedDepartments.push($scope.departments[index]);
                $scope.departments.splice(index, 1);
                return;
            }

            index = $scope.newDepartments.indexOf(d);
            if (index >= 0) {
                $scope.newDepartments.splice(index, 1);
                return;
            }

            index = $scope.deletedDepartments.indexOf(d);
            if (index >= 0) {
                $scope.departments.push($scope.deletedDepartments[index]);
                $scope.deletedDepartments.splice(index, 1);
            }
        }

        $scope.saveDepartment = function () {
            // console.log($scope.departments);
            $scope.progressing = true;
            $http.post('/App/Manage/Project/Department/' + id, { departments: $scope.newDepartments })
                .then(function (res) {
                    $scope.departments = res.data.departments;
                    $scope.newDepartments = [];
                    $scope.deletedDepartments = [];
                    $scope.department.name = '';
                    $scope.error = '';
                    $scope.progressing = false;
                    //$location.path('/manage/project/' + id + '/staffs');
                }, function (err) {
                    $scope.error = err.data.error;
                    $scope.progressing = false;
                });

        }
    }]);