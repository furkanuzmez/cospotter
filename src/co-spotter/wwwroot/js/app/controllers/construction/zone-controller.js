angular.module('zone-controller', [])

    .controller('zoneController', ['$scope', '$http', '$window', '$stateParams', 'appMainService', function ($scope, $http, $window, $stateParams, appMainService) {

        /*Initialize Materials*/

        SmartDesign.Accrodion.init();
        SmartDesign.ImageViewer.dispose();
        SmartDesign.ImageViewer.init();

        /****************************/

        /*Create a modal window for zone details*/

        var modal = new SmartDesign.Modal({
            id: 'modal-zone-notes',
            dissmiss: false,
            close_button: true,
            size: 'medium',//defalut
            animation: true,
            fit_to_bot: false
        });

        $scope.showZoneDetail = function () { modal.show(); }

        setTimeout(function () {
            modal.show();
        }, 300);

        modal.onhide = function () {
            setTimeout(function () {
                window.location.href = '#!/construction/' + $stateParams.plan_id;
            }, 300)
        }

        /****************************/

        /*Note Type Dropdown*/

        var ddlNoteType = SmartDesign.DropDownList.fetchById('ddlNoteType', {
            collapse_after_select: true,
            show_selected: true,
            toggle: true
        });

        /****************************/
        document.getElementById('noteImageUploader').onchange = function () {
            var uploadList = document.getElementById('noteImageUploadList');

            if (this.files.length === 0) uploadList.innerHTML = '<h4 style="color: rgba(0, 0, 0, 0.5); font-weight: lighter">Select your note image(s)..</h4>';
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

        var id = $stateParams.zone_id;

        $scope.noteHeading;
        $scope.noteContent;
        $scope.noteImages = [];

        $scope.notes = [{}];

        $http.get('/App/Construction/GetNoteTypes')
            .then(function (res) {
                console.log(res);
                ddlNoteType.setItemList(res.data.noteTypes);
            }, function (err) {
                console.log(err);
            })

        $scope.getNotes = function () {
            angular.element(document.querySelector('#loading')).addClass('fade-in');

            $http.get('/App/Construction/GetNotes/' + id)
                .then(function (res) {
                    $scope.notes = res.data.notes;
                    angular.element(document.querySelector('#loading')).removeClass('fade-in');
                }, function (err) {
                    console.log(err);
                    angular.element(document.querySelector('#loading')).removeClass('fade-in');
                })

            $scope.show = true;
        }

        $scope.newNote = function () {

            $scope.process = true;
            var submitBtn = document.getElementById('btnNewNote');
            submitBtn.disabled = true;
            submitBtn.classList.add('disabled');
            var date = new Date();
            var fd = new FormData();

            for (var i = 0; i < $scope.noteImages.length; i++) {
                var img = $scope.noteImages[i];
                var blob = dataURItoBlob(img.compressed.dataURL, img.compressed.type);
                var file = new File([blob], img.file.name);
                fd.append('files', file);
            }

            fd.append('noteHeading', $scope.noteHeading);
            fd.append('noteContent', $scope.noteContent);
            fd.append('noteType', ddlNoteType.getSelectedItem().value)
            fd.append('dateTime', date.toJSON());

            $http.post('/App/Construction/NewNote/' + id, fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            })
                .then(function (res) {
                    console.log(res);
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('disabled');
                    $scope.process = false;
                    $scope.notes = res.data.notes;
                    $scope.noteHeading = '';
                    $scope.noteContent = '';
                    $scope.error = '';
                    angular.element(document.querySelector('noteImageUploader')).val = '';
                    document.getElementById('noteImageUploadList').innerHTML = '<h4 style="color: rgba(0, 0, 0, 0.5); font-weight: lighter">Select your note image(s)..</h4>';

                }, function (err) {
                    console.log(err);
                    $scope.error = err.data.error;
                })
        }

        $scope.onEnd = function () {
            SmartDesign.Accrodion.init();
        }

        $scope.openImg = function (img, album) {
            SmartDesign.ImageViewer.setAlbum(album);
            SmartDesign.ImageViewer.show(album.indexOf(img) + 1);
        }

        $scope.deleteNote = function (note) {
            console.log(note.noteId); var item = $scope.notes.indexOf(note);
            $http.get('/App/Construction/DeleteNote/' + note.noteId).then(function (res) {
                $scope.notes.splice(item, 1);
                console.log(res);
            }, function (err) { console.log(err); });
            console.log(note);
        }

        function dataURItoBlob(dataURI, type) {
            var byteString = atob(dataURI.split(',')[1]);
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            return new Blob([ab], { type: type });
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
    }])

    .directive('ngImageCompress', ['$q',
        function ($q) {


            var URL = window.URL || window.webkitURL;

            var getResizeArea = function () {
                var resizeAreaId = 'fileupload-resize-area';

                var resizeArea = document.getElementById(resizeAreaId);

                if (!resizeArea) {
                    resizeArea = document.createElement('canvas');
                    resizeArea.id = resizeAreaId;
                    resizeArea.style.visibility = 'hidden';
                    document.body.appendChild(resizeArea);
                }

                return resizeArea;
            };

            /**
             * Receives an Image Object (can be JPG OR PNG) and returns a new Image Object compressed
             * @param {Image} sourceImgObj The source Image Object
             * @param {Integer} quality The output quality of Image Object
             * @return {Image} result_image_obj The compressed Image Object
             */

            var jicCompress = function (sourceImgObj, options) {
                var outputFormat = options.resizeType;
                var quality = options.resizeQuality * 100 || 70;
                var mimeType = 'image/jpeg';
                if (outputFormat !== undefined && outputFormat === 'png') {
                    mimeType = 'image/png';
                }


                var maxHeight = options.resizeMaxHeight || 300;
                var maxWidth = options.resizeMaxWidth || 250;

                var height = sourceImgObj.height;
                var width = sourceImgObj.width;

                // calculate the width and height, constraining the proportions
                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round(height *= maxWidth / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round(width *= maxHeight / height);
                        height = maxHeight;
                    }
                }

                var cvs = document.createElement('canvas');
                cvs.width = width; //sourceImgObj.naturalWidth;
                cvs.height = height; //sourceImgObj.naturalHeight;
                var ctx = cvs.getContext('2d').drawImage(sourceImgObj, 0, 0, width, height);
                var newImageData = cvs.toDataURL(mimeType, quality / 100);
                var resultImageObj = new Image();
                resultImageObj.src = newImageData;
                return resultImageObj.src;

            };

            var resizeImage = function (origImage, options) {
                var maxHeight = options.resizeMaxHeight || 300;
                var maxWidth = options.resizeMaxWidth || 250;
                var quality = options.resizeQuality || 0.7;
                var type = options.resizeType || 'image/jpg';

                var canvas = getResizeArea();

                var height = origImage.height;
                var width = origImage.width;

                // calculate the width and height, constraining the proportions
                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round(height *= maxWidth / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round(width *= maxHeight / height);
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                //draw image on canvas
                var ctx = canvas.getContext('2d');
                ctx.drawImage(origImage, 0, 0, width, height);

                // get the data from canvas as 70% jpg (or specified type).
                return canvas.toDataURL(type, quality);
            };

            var createImage = function (url, callback) {
                var image = new Image();
                image.onload = function () {
                    callback(image);
                };
                image.src = url;
            };

            var fileToDataURL = function (file) {
                var deferred = $q.defer();
                var reader = new FileReader();
                reader.onload = function (e) {
                    deferred.resolve(e.target.result);
                };
                reader.readAsDataURL(file);
                return deferred.promise;
            };


            return {
                restrict: 'A',
                scope: {
                    image: '=',
                    resizeMaxHeight: '@?',
                    resizeMaxWidth: '@?',
                    resizeQuality: '@?',
                    resizeType: '@?'
                },
                link: function postLink(scope, element, attrs) {

                    var doResizing = function (imageResult, callback) {
                        createImage(imageResult.url, function (image) {
                            //var dataURL = resizeImage(image, scope);
                            var dataURLcompressed = jicCompress(image, scope);
                            // imageResult.resized = {
                            // 	dataURL: dataURL,
                            // 	type: dataURL.match(/:(.+\/.+);/)[1]
                            // };
                            imageResult.compressed = {
                                dataURL: dataURLcompressed,
                                type: dataURLcompressed.match(/:(.+\/.+);/)[1]
                            };
                            callback(imageResult);
                        });
                    };

                    var applyScope = function (imageResult) {
                        scope.$apply(function () {
                            if (attrs.multiple) {
                                scope.image.push(imageResult);
                            } else {
                                scope.image = imageResult;
                            }
                        });
                    };


                    element.bind('change', function (evt) {
                        //when multiple always return an array of images
                        if (attrs.multiple) {
                            scope.image = [];
                        }

                        var files = evt.target.files;
                        for (var i = 0; i < files.length; i++) {
                            //create a result object for each file in files
                            var imageResult = {
                                file: files[i],
                                url: URL.createObjectURL(files[i])
                            };

                            fileToDataURL(files[i]).then(function (dataURL) {
                                imageResult.dataURL = dataURL;
                            });

                            if (scope.resizeMaxHeight || scope.resizeMaxWidth) { //resize image
                                doResizing(imageResult, function (imageResult) {
                                    applyScope(imageResult);
                                });
                            } else { //no resizing
                                applyScope(imageResult);
                            }
                        }
                    });
                }
            };
        }
    ])

    .directive("repeatEnd", function () {
        return {
            restrict: "A",
            link: function (scope, element, attrs) {
                if (scope.$last) {
                    scope.$eval(attrs.repeatEnd);
                }
            }
        };
    });