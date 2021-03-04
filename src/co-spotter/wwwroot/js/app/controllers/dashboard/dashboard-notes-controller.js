angular.module('dashboard-notes-controller', [])

    .controller('dashboardNotesController', ['$scope', '$http', '$location', '$window', '$stateParams', 'dashboardService', function ($scope, $http, $location, $window, $stateParams, dashboardService) {

        angular.element(document.querySelector('#loading')).addClass('fade-in');

        var tabPanelNotes = SmartDesign.TabPanel.fetchById('dash-notes-tabpanel');

        var id = $stateParams.project_id;
        if (id === null) { return; }


        $scope.notes = [{}];

        $('#datepicker').datepicker("destroy");
        $('#datepicker').datepicker({
            dateFormat: "dd/mm/yy",
            onSelect: function (date) {
                dashboardService.setDateTime(date);
                dashboardService.getProjectNotes()
                    .then(function (res) {
                        $scope.notes = res.data.notes;
                        angular.element(document.querySelector('#loading')).removeClass('fade-in');
                    }, function (err) {
                        console.log(err);
                    });
            }
        });
        //$('#datepicker').datepicker('setDate', dashboardService.dateTime);

        tabPanelNotes.onActiveTabChanged = function () {
            angular.element(document.querySelector('#loading')).addClass('fade-in');
            var type = this.activeTab.dataset.type;
            dashboardService.setDateTime("All");
            dashboardService.setNoteType(type);
            dashboardService.getProjectNotes()
                .then(function (res) {
                    $scope.notes = res.data.notes;
                    angular.element(document.querySelector('#loading')).removeClass('fade-in');
                }, function (err) {
                    console.log(err);
                });

        }
        tabPanelNotes.selectTab(0);

        $scope.deleteNote = function (note) {
            var item = $scope.notes.indexOf(note);
            $http.get('/App/Construction/DeleteNote/' + note.noteId).then(function (res) {
                $scope.notes.splice(item, 1);
                console.log(res);
            }, function (err) { console.log(err); });
            console.log(note);
        }
    }]);