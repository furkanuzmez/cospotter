angular.module('manage-zone-type-controller', [])

    .controller('manageZoneTypeController', ['$scope', '$http', '$location', '$window', '$stateParams', 'appMainService', 'appManageIdService', function ($scope, $http, $location, $window, $stateParams, appMainService, appManageIdService) {

        var id = appManageIdService.getProjectId();
        if (id == 'new' || id == '') {
            $location.path('/manage/project/');
            return;
        }
        //console.log('hello from zone type controller' + id);

        $scope.zoneTypes = [];
        $scope.newZoneTypes = [];
        $scope.deletedZoneTypes = [];

        $scope.zoneType = {
            name: ''
        }
        $scope.error = '';
        $scope.progressing = false;
        $http.get('/App/Manage/Project/GetZoneTypes/' + id)
            .then(function (res) {
                //console.log(res);
                $scope.zoneTypes = res.data.zoneTypes;
            }, function err(err) {
                $scope.error = err.data.error;
            });

        $scope.addZoneType = function () {

            if ($scope.zoneType.name.length <= 1) {
                $scope.error = 'Text Length';
                return;
            }

            for (var i = 0; i < $scope.zoneTypes.length; i++) {
                var zoneTypes = $scope.zoneTypes[i];
                if ($scope.zoneType.name.toLowerCase() === zoneTypes.name.toLowerCase()) {
                    $scope.error = 'This Department Already Exists';
                    return;
                }
            }


            for (var i = 0; i < $scope.newZoneTypes.length; i++) {
                var zoneTypes = $scope.newZoneTypes[i];
                if ($scope.zoneType.name.toLowerCase() === zoneTypes.name.toLowerCase()) {
                    $scope.error = 'This Department Already Exists';
                    return;
                }
            }

            for (var i = 0; i < $scope.deletedZoneTypes.length; i++) {
                var zoneTypes = $scope.deletedZoneTypes[i];
                if ($scope.zoneType.name.toLowerCase() === zoneTypes.name.toLowerCase()) {
                    //$scope.error = 'This Department Already Exists';
                    $scope.deletedZoneTypes.splice(i, 1);
                    break;
                }
            }

            $scope.newZoneTypes.push({ name: $scope.zoneType.name })
            $scope.zoneType.name = '';
        }

        $scope.deleteZoneType = function (z) {

            var index = $scope.zoneTypes.indexOf(z);
            if (index >= 0) {
                $scope.deletedZoneTypes.push($scope.zoneTypes[index]);
                $scope.zoneTypes.splice(index, 1);
                return;
            }

            index = $scope.newZoneTypes.indexOf(z);
            if (index >= 0) {
                $scope.newZoneTypes.splice(index, 1);
                return;
            }

            index = $scope.deletedZoneTypes.indexOf(z);
            if (index >= 0) {
                $scope.zoneTypes.push($scope.deletedZoneTypes[index]);
                $scope.deletedZoneTypes.splice(index, 1);
                return;
            }

        }


        $scope.saveZoneType = function () {
            $scope.progressing = true;
            $http.post('/App/Manage/Project/ZoneType/' + id, { zoneTypes: $scope.newZoneTypes })
                .then(function (res) {
                    console.log(res);
                    $scope.zoneTypes = res.data.zoneTypes;
                    $scope.newZoneTypes = [];
                    $scope.deletedZoneTypes = [];
                    $scope.zoneType.name = '';
                    $scope.error = '';
                    $scope.progressing = false;
                    //$location.path('/manage/project/' + id + '/staffs');
                }, function (err) {
                    $scope.error = err.data.error;
                    $scope.progressing = false;
                });

            //$location.path('/manage/project/' + id + '/departments');
        }

    }]);