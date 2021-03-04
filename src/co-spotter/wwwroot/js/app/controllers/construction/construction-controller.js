angular.module('construction-controller', [])

    .controller('constructionController', ['$scope', '$http', '$location', '$stateParams', '$window', 'appMainService', function ($scope, $http, $location, $stateParams, $window, appMainService) {
        /*Smart Design*/
        SmartDesign.ImageViewer.dispose();
        SmartDesign.ImageViewer.init();
        /*****************************/

        var fullscreenState = $window.localStorage.getItem('screen-state');

        if (fullscreenState === 'on') {
            document.getElementById('fullscreen-switcher').classList.add('focus-bg');
            document.getElementById('fullscreen-switcher').dataset.state = 'on';
        }

        /*Initialize Canvas Toolbar*/

        var canvasToolbar = new Toolbar('canvas-tools');

        function emphasizeToolSelection(sender) {

            var icon = sender.getElementsByTagName('I')[0];

            var emph_overlay = document.getElementById('emph-overlay');

            emph_overlay.innerHTML = '';

            var icon_for_overlay = document.createElement("I");

            icon_for_overlay.className = icon.className;

            emph_overlay.appendChild(icon_for_overlay);

            if (sender.attributes['tool-title']) {
                var title = document.createElement('p');
                title.innerHTML = sender.attributes['tool-title'].value;

                emph_overlay.appendChild(title);
            }

            emph_overlay.classList.add('show');

            setTimeout(function () {
                emph_overlay.classList.remove('show');
            }, 750);
        }

        /****************************/


        /*CCC.js Initialize*/

        var id = $stateParams.plan_id;
        $scope.plan_id = id;
        console.log("ID : " + id);

        var btnZoneSave = document.getElementById('btnZoneSave');
        var txtZoneName = document.getElementById('txtZoneName');
        var btnPhotoAdd = document.getElementById('btnPhotoAdd');
        var planPhotoUploader = document.getElementById('planPhotoUploader');
        $scope.markers;
        $scope.photos;
        $scope.plan;

        var config = {
            width: 300,
            height: 300,
            canvas: 'construction-canvas',
            id: id,
            $http: $http,
            debugMod: false,
            markerSocketUri: "ws://" + window.location.host + "/ws/marker",
            newMarkerWindow: {
                window: new Window('zone-create-window'),
                ddlZoneType: SmartDesign.DropDownList.fetchById('ddlZoneType', {
                    collapse_after_select: true,
                    show_selected: true,
                    toggle: true
                }),
                txtZoneName: txtZoneName,
                btnZoneSave: btnZoneSave
            },
            newPhotoWindow: {
                window: new Window('photo-create-window'),
                btnPhotoAdd: btnPhotoAdd,
                planPhotoUploader: planPhotoUploader
            },
            markerClick: function (marker) {
                console.log(marker);
                //console.log($location);
                window.location.href = '#!construction/' + $stateParams.plan_id + '/' + marker.id;
            },
            pinClick: function (marker) {

                $http.get('/App/Construction/GetPin/' + marker.id)
                    .then(function (res) {
                        console.log(res.data);
                        SmartDesign.ImageViewer.setAlbum([{ src: res.data.pin.content }]);
                        SmartDesign.ImageViewer.show();
                    }, function (err) {
                        console.log(err);
                    })

            },
            progressBar: new LoadingBar('canvas-loading'),
            error: $scope.error,
            setConstructionFooterScope: function (plan, marker, photo) {
                $scope.plan = plan;
                $scope.marker = marker;
                $scope.photo = photo;
            },
            incMarkerCount: function () {
                $scope.marker = $scope.marker + 1;
            },
            incPhotoCount: function () {
                $scope.photo = $scope.photo + 1;
            }
        };

        document.getElementById('planPhotoUploader').onchange = function () {
            var uploadList = document.getElementById('planPhotoThumb');

            if (this.files.length === 0) uploadList.innerHTML = '<h4 style="color: rgba(0, 0, 0, 0.5); font-weight: lighter">Select an image..</h4>';
            else uploadList.innerHTML = '';

            var imgSrcList = [];

            for (var i = 0; i < this.files.length; i++) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    var img = document.createElement('IMG');

                    img.className = 'file';
                    img.src = e.target.result;

                    img.onclick = function () {
                        SmartDesign.ImageViewer.setAlbum([{ src: this.src }]);
                        SmartDesign.ImageViewer.show();
                    }

                    uploadList.appendChild(img);
                }

                reader.readAsDataURL(this.files[i]);
            }
        }

        var ccc = new cccjs(config);

        canvasToolbar.setToolFunction('all', function () {

            ccc.setSelectedTool(this.toolType);

            emphasizeToolSelection(this);

        });


        /* SCOPE FUNCTIONS */
        $scope.redirectToPath = function (url) {
            appMainService.redirectToLocation('construction/' + $stateParams.plan_id + url);
            console.log($stateParams.plan_id);
            console.log('construction/' + $stateParams.plan_id + url);
        }

        angular.element(document.querySelector('#loading')).addClass('fade-in');

        angular.element(document).ready(function () {
            angular.element(document.querySelector('#loading')).removeClass('fade-in');
        });
    }]);