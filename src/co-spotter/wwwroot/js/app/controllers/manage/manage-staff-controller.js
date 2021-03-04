angular.module('manage-staff-controller', [])

    .controller('manageStaffController', ['$scope', '$http', '$location', '$window', '$stateParams', 'appMainService', 'appManageIdService', function ($scope, $http, $location, $window, $stateParams, appMainService, appManageIdService) {


        var id = appManageIdService.getProjectId();
        if (id == 'new' || id == '') {
            $location.path('/manage/project/');
            return;
        }

        /*Departments DropDownList*/
        var ddlDepartment = SmartDesign.DropDownList.fetchById('ddlDepartment', {
            collapse_after_select: true,
            show_selected: true,
            toggle: true
        });

        ddlDepartment.onSelectedItemChanged = function () {
            //console.log(this.getSelectedItem());
        }
        /**/


        /*Roles DropDownList*/
        var ddlRole = SmartDesign.DropDownList.fetchById('ddlRole', {
            collapse_after_select: true,
            show_selected: true,
            toggle: true
        });

        ddlRole.onSelectedItemChanged = function () {
            //console.log(this.getSelectedItem());
        }
        /***/

        $scope.staff = {
            email: ''
        };
        $scope.staffs = [];
        $scope.newStaffs = [];
        $scope.invs = [];
        $scope.error = '';
        
        var tmpRoles;

        $http.get('/App/Manage/Project/GetStaffs/' + id)
            .then(function (res) {

                //User and Roles
                $scope.staffs = setModels(res.data.users, res.data.roles);
                $scope.invs = setModels(res.data.invs, res.data.roles);

                //Copy of a roles
                tmpRoles = Object.create(res.data.roles);

                //Delete manager from model
                for (var i = 0; i < res.data.roles.length; i++) {
                    var role = res.data.roles[i];
                    if (role.content == "Manager") {
                        res.data.roles.splice(i, 1);
                        break;
                    }
                }

                ddlDepartment.setItemList(res.data.departments);
                ddlRole.setItemList(res.data.roles);

            }, function (err) {
                console.log(err);
            });


        $scope.addStaff = function () {

            if ($scope.staff.email.length < 5) {
                $scope.error = 'Invalid Email Address';
                return;
            }
            if (ddlDepartment.getSelectedItem() == null) {
                $scope.error = 'Select a department..';
                return;
            }
            if (ddlRole.getSelectedItem() == null) {
                $scope.error = 'Select a role..';
                return;
            }
            $scope.error = '';


            for (var i = 0; i < $scope.staffs.length; i++) {
                var staff = $scope.staffs[i];
                if (staff.email == $scope.staff.email) {
                    $scope.error = 'Staff is already exist..';
                    return;
                }
            }

            for (var i = 0; i < $scope.newStaffs.length; i++) {
                var staff = $scope.newStaffs[i];
                if (staff.email == $scope.staff.email) {
                    $scope.error = 'Staff is already exist..';
                    return;
                }
            }

            for (var i = 0; i < $scope.invs.length; i++) {
                var staff = $scope.invs[i];
                if (staff.email == $scope.staff.email) {
                    $scope.error = 'Staff is already exist..';
                    return;
                }
            }


            var s = {
                email: $scope.staff.email,
                role: ddlRole.getSelectedItem().content,
                roleId: ddlRole.getSelectedItem().value,
                department: ddlDepartment.getSelectedItem().content,
                departmentId: ddlDepartment.getSelectedItem().value
            }


            $scope.newStaffs.push(s);
            $scope.staff.email = '';
            ddlRole.resetPlaceHolder();
            ddlDepartment.resetPlaceHolder();
        }

        $scope.deleteStaff = function (s) {

            for (var i = 0; i < $scope.newStaffs.length; i++) {
                var staff = $scope.newStaffs[i];
                if (staff.email == s.email) {
                    $scope.newStaffs.splice(i, 1);
                    return;
                    break;
                }
            }
        }

        $scope.saveStaffs = function () {
            console.log($scope.newStaffs);
            $http.post('/App/Manage/Project/Staff/' + id, { staffs: $scope.newStaffs })
                .then(function (res) {
                    console.log(res);
                    $scope.newStaffs = [];
                    $scope.error = '';

                    //User and Roles
                    $scope.staffs = setModels(res.data.users, tmpRoles);
                    $scope.invs = setModels(res.data.invs, tmpRoles);

                }, function (err) {
                    console.log(err);
                });

        }

        function setModels(users, roles) {

            for (var i = 0; i < users.length; i++) {
                var user = users[i];
                for (var j = 0; j < roles.length; j++) {
                    var role = roles[j];
                    if (user.roleId == role.value) {
                        user.role = role.content;
                        break;
                    }
                }
            }
            return users;
        }

    }]);