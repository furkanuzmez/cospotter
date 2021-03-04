angular.module('dashboard-service', [])
    .factory('dashboardService', function ($http) {
        var service = {};

        service.projectId = '';
        service.today = new Date();
        service.dateTime = new Date();
        service.noteType = '';

        service.setDateTime = function (date) {
            if (date == "All") {
                $('#datepicker').val("All");
                service.dateTime = "All";
            }
            else if (date == "Today") {
                service.dateTime = service.today;
            }
            else {
                var dateArr = date.split("/");
                var d = dateArr[2] + '-' + dateArr[1] + '-' + dateArr[0];
                service.dateTime = new Date(d);
            }

        }

        service.setNoteType = function (type) {
            console.log(type);
            service.noteType = type;
        }

        service.updateNotes = function () {
            service.getProjectNotes(service.projectId, service.dateTime, service.noteType)
                .then(function (res) {
                    console.log(res);
                    service.notes = res.data.notes;
                }, function (err) {
                    console.log(err);
                });
        }

        service.getProject = function () {
            return $http.get('/Dashboard/GetProject/' + service.projectId);
        }

        service.getProjectPlans = function () {
            return $http.get('/Dashboard/GetProjectPlans/' + service.projectId);
        }

        service.getProjectNotes = function () {
            var date = service.dateTime;
            //console.log(date);
            if (date != "All")
                date = date.toJSON();
            return $http.get('/Dashboard/GetProjectNotes/' + service.projectId + '/' + date + '/' + service.noteType);
        }

        service.getProjectImages = function () {
            var date = service.dateTime;
            //console.log(date);
            if (date != "All")
                date = date.toJSON();
            return $http.get('/Dashboard/GetProjectImages/' + service.projectId + '/' + date);
        }

        return service;
    });