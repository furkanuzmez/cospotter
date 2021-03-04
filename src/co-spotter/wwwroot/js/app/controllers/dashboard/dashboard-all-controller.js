angular.module('dashboard-all-controller', [])

    .controller('dashboardAllController', ['$scope', '$http', '$location', '$stateParams', 'dashboardService', function ($scope, $http, $location, $stateParams, dashboardService) {


        var id = $stateParams.project_id;

        angular.element(document.querySelector('#loading')).addClass('fade-in');

        var tabPanelNotes = SmartDesign.TabPanel.fetchById('dash-notes-tabpanel');

        if (id === null) { return; }

        $scope.notes = [{}];
        $scope.noteImages = [{}];

        //Plans
        dashboardService.getProjectPlans(id).then(function (res) {
            //console.log(res)
            $scope.plans = res.data.plans;
            angular.element(document.querySelector('#loading')).removeClass('fade-in');
        }, function (err) {
            console.log(err)
        });

        $('#datepicker').datepicker("destroy");
        $('#datepicker').datepicker({
            dateFormat: "dd/mm/yy",
            onSelect: function (date) {
                angular.element(document.querySelector('#loading')).addClass('fade-in');
                dashboardService.setDateTime(date);
                dashboardService.getProjectNotes()
                    .then(function (res) {
                        console.log(res);
                        $scope.notes = res.data.notes;
                        angular.element(document.querySelector('#loading')).removeClass('fade-in');
                    }, function (err) {
                        console.log(err);
                        angular.element(document.querySelector('#loading')).removeClass('fade-in');
                    });

                dashboardService.getProjectImages().
                    then(function (res) {
                        //console.log(res);
                        //$scope.noteImages = res.data.noteImages;
                        var arr = res.data.noteImages.concat(res.data.pins);
                        $scope.noteImages = arr;
                        //console.log(arr);
                    }, function (err) {
                        console.log(err);
                    });

            }
        });
        $('#datepicker').datepicker('setDate', dashboardService.today);
        dashboardService.setDateTime('Today');
        tabPanelNotes.onActiveTabChanged = function () {

            angular.element(document.querySelector('#loading')).addClass('fade-in');
            var type = this.activeTab.dataset.type;
            dashboardService.setNoteType(type);
            dashboardService.getProjectNotes()
                .then(function (res) {
                    console.log(res);
                    $scope.notes = res.data.notes;
                    angular.element(document.querySelector('#loading')).removeClass('fade-in');
                }, function (err) {
                    console.log(err);
                    angular.element(document.querySelector('#loading')).removeClass('fade-in');
                });

        }
        $scope.deleteNote = function (note) {
            var item = $scope.notes.indexOf(note);
            $http.get('/App/Construction/DeleteNote/' + note.noteId).then(function (res) {
                $scope.notes.splice(item, 1);
                console.log(res);
            }, function (err) { console.log(err); });
            console.log(note);
        }
        tabPanelNotes.selectTab(0);

        dashboardService.getProjectImages().
            then(function (res) {
                var arr = res.data.noteImages.concat(res.data.pins);
                $scope.noteImages = arr;
            }, function (err) {
                console.log(err);
            });

    }]);
