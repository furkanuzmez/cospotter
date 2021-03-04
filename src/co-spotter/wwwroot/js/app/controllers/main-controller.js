angular.module('main-controller', [])

    .controller('mainController', ['$scope', '$http', '$location', '$window', function ($scope, $http, $location, $window) {

        /*Initialize Materials*/

        SmartDesign.DropDownList.init();

        /****************************/

        var modal = new SmartDesign.Modal({
            id: 'user-settings',
            close_button: false,
            size: 'small'
        });

        $scope.openDash = function () {
            var lastProject = $window.localStorage.getItem('last-project') === null ? '' : $window.localStorage.getItem('last-project');
            $location.path('/dashboard/' + lastProject + '/all')
        }

        $scope.redirectTo = function (url) {
            $location.path(url);
        }

        $scope.loggOff = function () {
            $http.post('/Account/LogOff').then(
                function (res) {
                    if (res.data === 'OK') {
                        window.location.href = '/';
                    }
                },
                function (err) {
                    console.log(err)
                });
        }

        $scope.showUserSettings = function () {

            modal.show();
        }

        $scope.hideUserSettings = function () {

            modal.hide();
        }

        $scope.saveUserSettings = function () {
            return;
            $http.post('/Account/UpdateAccount', {})
                .then(function (res) {
                    console.log(res);
                }, function (err) {
                    console.log(err);
                });
        }

        $scope.showPasswordChangePanel = function () {
            var panel = angular.element(document.querySelector('#password-change'));
            panel.toggleClass('hide');
        }

        $scope.user = {};
        $http.get('/Account/Me')
            .then(function (res) {
                $scope.user = res.data.user;
                //console.log($scope.user);
            }, function (err) {
                console.log(err);
            });

        var lastProject = $window.localStorage.getItem('last-project');
        var noteCount = 0;

        $http.get('/App/Construction/GetNoteCount/' + lastProject)
            .then(function (res) {
                noteCount = res.data._notes;
            }, function (err) {
                console.log(err);
            });

        setInterval(function () {

            $http.get('/App/Construction/GetNoteCount/' + lastProject)
                .then(function (res) {

                    if (res.data._notes > noteCount) {

                        noteCount = res.data._notes;

                        $http.get('/App/Construction/GetLastNote/' + lastProject)
                            .then(function (res) {

                                console.log(res);

                                document.getElementById('notif').href = '/app#!/construction/' + res.data.plan.planId + '/' + res.data.lastNote.zone.zoneId;

                                document.getElementById('note-notification-title').innerHTML = res.data.plan.name + ' - ' + res.data.noteType.name + ' - ' + res.data.lastNote.zone.name;

                                document.getElementById('note-notification-content').innerHTML = res.data.lastNote.content;

                                document.getElementById('notif').classList.add('expand');

                                setTimeout(function () {

                                    document.getElementById('notif').classList.remove('expand');

                                }, 5000)

                            }, function (err) {
                                console.log(err);
                            });
                    }

                }, function (err) {
                    console.log(err);
                });
        }, 5000);

    }]);