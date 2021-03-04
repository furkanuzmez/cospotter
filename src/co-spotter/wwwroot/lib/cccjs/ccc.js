/*02.01.2017 - v001
  09.01.2017 - v002
*/

/**/
var cccjs = function (options) {

    this.version = '0.0.2';
    this.versionName = 'AngryWolf';

    options = options || {};

    this.isMobile = (/iPhone|iPad|iPod|Android/i).test(navigator.userAgent);

    this.width = options.width || 900;
    this.height = options.height || 600;

    this.setConstructionFooterScope = options.setConstructionFooterScope;

    this.planWidth = null;
    this.planHeight = null;

    this.debugMod = options.debugMod;

    this.canvas = document.getElementById(options.canvas || 'myCanvas');
    this.ctx = this.canvas.getContext("2d");

    this.progressBar = options.progressBar;

    this.allCanvasObjects = [];

    this.id = options.id || 1;
    this.sprite = '';

    this.img = null;

    this.inputHandler = new cccjs.inputHandler();
    this.selectedTool = 'cursor-default';

    this.$http = options.$http;
    this.markerSocketUri = options.markerSocketUri;
    this.newMarkerWindow = options.newMarkerWindow.window;
    this.newPhotoWindow = options.newPhotoWindow;
    this.ddlZoneType = options.newMarkerWindow.ddlZoneType;
    this.btnZoneSave = options.newMarkerWindow.btnZoneSave;
    this.txtZoneName = options.newMarkerWindow.txtZoneName;
    this.preventDocumentEvents = false;
    this.touchtext = '';
    this.$location = options.$location;
    this.markerClick = options.markerClick;
    this.pinClick = options.pinClick;

    this.incMarker = options.incMarkerCount;
    this.incPhoto = options.incPhotoCount;

    this.imgLoadProperty();
    this.init();
};
cccjs.prototype = {

    init: function () {

        //Response data
        var data;
        var _this = this;
        //Get plan and markers
        //this.$http.get('/plan/' + _this.id)
        this.$http.get('/App/GetPlan/' + _this.id)
            .then(function (res) {
                data = res.data;
                _this.setConstructionFooterScope(res.data.plan.name, res.data.markers.length, res.data.pins.length);
                //console.log(data);
                _this.ddlZoneType.setItemList(data.zoneTypes);
            }, function (err) {
                return console.log('ERROR: PLAN INIT');
            }).then(function () {
                //Plan Image
                _this.allCanvasObjects.push({});

                //Sprite
                var img = new Image();
                _this.sprite = img;
                img.onload = function () {
                    console.log('Sprite is loaded!');
                }
                //img.src = "./img/sprite.png";
                _this.img = img;
                img.src = "./lib/cccjs/img/sprite.png";

                //Markers
                for (var i = 0; i < data.markers.length; i++) {
                    var marker = data.markers[i];
                    var options = {
                        id: marker.id,
                        sprite: img,
                        type: 'red',
                        isVisible: false,
                        pos: {
                            x: marker.x,
                            y: marker.y
                        },
                        offset: {
                            x: 0,
                            y: 0
                        }
                    }
                    //console.log(options);
                    _this.allCanvasObjects.push(new cccjs.Marker(options));
                }

                //Pins
                for (var i = 0; i < data.pins.length; i++) {
                    var pin = data.pins[i];
                    var options = {
                        id: pin.id,
                        sprite: img,
                        type: pin.type,
                        isVisible: false,
                        pos: {
                            x: pin.x,
                            y: pin.y
                        },
                        offset: {
                            x: 0,
                            y: 0
                        }
                    }
                    //console.log(options);
                    _this.allCanvasObjects.push(new cccjs.Marker(options));
                }


            }).then(function () {
                //Plan
                _this.allCanvasObjects[0] = new cccjs.Plan({
                    src: data.plan.imgSrc,
                    width: data.plan.width,
                    height: data.plan.height,
                    progressBar: _this.progressBar
                });

                _this.planWidth = data.plan.width;
                _this.planHeight = data.plan.height;

            }).then(function () {
                //_this.setWidth(_this.width);
                //_this.setHeight(_this.height);
                if (_this.isMobile) {
                    _this.addTouchListeners();
                    _this.addDocumentPreventListeners();
                } else {
                    _this.addMouseListeners();
                }

                for (var i = 0; i < _this.allCanvasObjects.length; i++) {
                    var obj = _this.allCanvasObjects[i];
                    obj.isVisible = true;
                }

                _this.run();
            }).then(function () {
            });

        this.markerSocket = new WebSocket(this.markerSocketUri);

        this.markerSocket.onopen = function (event) {
            console.log("opened");
        };
        this.markerSocket.onclose = function (event) {
            console.log("closed");
            _this.markerSocket = new WebSocket(this.markerSocketUri);
        };
        this.markerSocket.onmessage = function (event) {

            var message = JSON.parse(event.data);

            if (message.messageType === 0) {
                var marker = JSON.parse(message.data);
                if (marker.planId === _this.id)
                    _this.notifyMarker(marker);
                else
                    console.log('message received but not blong to plan. dropped!')
                console.log('recieved:', marker);
            }

        };
        this.markerSocket.onerror = function (event) {
            console.log("error: " + event.data);
        };

    },

    update: function (evt, evtData) {

        //Update plan for each event
        this.allCanvasObjects[0].update('update', evtData);

        switch (this.selectedTool) {

            case 'cursor-default':

                for (var i = 0; i < this.allCanvasObjects.length; i++) {
                    var obj = this.allCanvasObjects[i];
                    obj.update(evt, evtData);
                }

                //Detect last object that mouseover
                var lastObj;
                for (var i = 1; i < this.allCanvasObjects.length; i++) {
                    var obj = this.allCanvasObjects[i];
                    obj.scale = 0.35;
                    if (obj.isMouseOver(evtData)) {
                        lastObj = obj;
                    }
                }

                if (this.isMobile && evtData.isDragging) {
                    return;
                }

                if (lastObj) {
                    lastObj.scale = 0.4;
                }


                if (evt === 'up') {
                    //Detecting last clicked marker
                    if (this.inputHandler.clickedMarkers.length > 0) {
                        console.log("clicked");
                        var marker = this.inputHandler.clickedMarkers[this.inputHandler.clickedMarkers.length - 1];
                        this.inputHandler.clickedMarkers = [];
                        if (marker.type == 'red') {
                            this.markerClick(marker);
                        }
                        else {
                            this.pinClick(marker);
                        }

                    }
                }


                break;

            case 'cursor-move':
                break;
            case 'cursor-marker':

                //Mouse Move
                if (evt === 'move') {

                }
                //Mouse click-down
                else if (evt === 'down') {
                    var plan = this.allCanvasObjects[0];

                    /*
                    if (evtData.imagePos.x <= 0 || evtData.imagePos.x >= (plan.width * evtData.zoomRatio) || evtData.imagePos.y <= 0 || evtData.imagePos.y >= plan.height * evtData.zoomRatio) {
                        return;
                    }*/

                    if (evtData.imagePos.x == -1 || evtData.imagePos.y == -1) {
                        return;
                    }

                    //New Marker
                    var marker = {
                        type: 'red',
                        pos: {
                            x: evtData.imagePos.x,
                            y: evtData.imagePos.y
                        }
                    }

                    this.newMarkerWindow.show({ clientX: evtData.canvasPos.x, clientY: evtData.canvasPos.y });
                    var x = evtData.canvasPos.x;
                    var y = evtData.canvasPos.y;
                    var _this = this;
                    var img = this.img;

                    this.btnZoneSave.onclick = function () {
                        var zoneName = _this.txtZoneName.value;
                        var zoneType = _this.ddlZoneType.getSelectedItem().value;

                        //Request to add new marker
                        _this.$http.post('/App/Construction/NewMarker/' + _this.id, {
                            data: { zoneName: zoneName, zoneType: zoneType },
                            marker: marker
                        }).then(function (res) {
                            //console.log(res);

                            var options = {
                                id: res.data.marker.id,
                                sprite: img,
                                type: 'red',
                                isVisible: true,
                                pos: {
                                    x: x,
                                    y: y
                                },
                                offset: {
                                    x: 0, y: 0
                                }
                            }

                            _this.allCanvasObjects.push(new cccjs.Marker(options));
                            _this.setSelectedTool('cursor-default');
                            //_this.markerSocket.send(JSON.stringify(res.data.marker))
                            _this.newMarkerWindow.hide();
                            //console.log('sent:', res.data);
                        }, function (err) {
                            console.log(err);
                        });
                    }

                    //console.log(options);
                }
                break;

            case 'cursor-zoom-in':
                if (evt === 'down') {
                    //var event = new WheelEvent('mousewheel');
                    //event.myDeltaY = -1;
                    //this.canvas.dispatchEvent(event);
                    this.zoomEvent({
                        myDeltaY: -1
                    });
                }
                if (evt === 'zoom') {
                    for (var i = 0; i < this.allCanvasObjects.length; i++) {
                        var obj = this.allCanvasObjects[i];
                        obj.update(evt, evtData);
                    }
                }
                break;
            case 'cursor-zoom-out':
                if (evt === 'down') {
                    //var event = new WheelEvent('mousewheel');
                    //event.myDeltaY = 1;
                    //this.canvas.dispatchEvent(event);
                    this.zoomEvent({
                        myDeltaY: 1
                    });
                }
                if (evt === 'zoom') {
                    for (var i = 0; i < this.allCanvasObjects.length; i++) {
                        var obj = this.allCanvasObjects[i];
                        obj.update(evt, evtData);
                    }
                }
                break;
            case 'cursor-photo':

                if (evt === 'down') {
                    var plan = this.allCanvasObjects[0];

                    /*if (evtData.imagePos.x <= 0 || evtData.imagePos.x >= (plan.width * evtData.zoomRatio) || evtData.imagePos.y <= 0 || evtData.imagePos.y >= plan.height * evtData.zoomRatio) {
                        return;
                    }*/
                    if (evtData.imagePos.x == -1 || evtData.imagePos.y == -1) {
                        return;
                    }

                    var marker = {
                        type: 'black',
                        pos: {
                            x: evtData.imagePos.x,
                            y: evtData.imagePos.y
                        },
                    }

                    this.newPhotoWindow.window.show({ clientX: evtData.canvasPos.x, clientY: evtData.canvasPos.y });

                    var _this = this;
                    var img = this.img;
                    var x = evtData.canvasPos.x;
                    var y = evtData.canvasPos.y;
                    this.newPhotoWindow.btnPhotoAdd.onclick = function () {
                        var file = _this.newPhotoWindow.planPhotoUploader.files[0];
                        var fd = new FormData();
                        fd.append('coordX', marker.pos.x);
                        fd.append('coordY', marker.pos.y);
                        fd.append('file', file);

                        //Request to add new marker
                        _this.$http.post('/App/Construction/NewPin/' + _this.id, fd, {
                            transformRequest: angular.identity,
                            headers: { 'Content-Type': undefined }
                        })
                            .then(function (res) {
                                var options = {
                                    id: res.data.marker.id,
                                    sprite: img,
                                    type: 'pin',
                                    isVisible: true,
                                    pos: {
                                        x: x,
                                        y: y
                                    },
                                    offset: {
                                        x: 0, y: 0
                                    }
                                }
                                _this.allCanvasObjects.push(new cccjs.Marker(options));
                                _this.setSelectedTool('cursor-default');
                                //_this.markerSocket.send(JSON.stringify(res.data.marker))
                                _this.newPhotoWindow.window.hide();
                            }, function (err) {
                                console.log(err);
                            });
                    }
                    //this.notifyMarker(marker);
                }


                break;

            case 'cursor-note':

                break;
            default:
                this.selectedTool = 'cursor-default';
                break;
        }
    },

    render: function () {

        this.width = this.canvas.width = this.canvas.parentElement.clientWidth;
        this.height = this.canvas.height = this.canvas.parentElement.clientHeight;

        this.ctx.clearRect(0, 0, this.width, this.height);
        for (var i = 0; i < this.allCanvasObjects.length; i++) {
            var obj = this.allCanvasObjects[i];
            obj.draw(this.ctx, this.width, this.height);
        }

        if (this.debugMod) {
            this.log(this.inputHandler.canvasPos.x + ' ' + this.inputHandler.canvasPos.y + ' ' + this.inputHandler.imagePos.x + ' ' + this.inputHandler.imagePos.y + ' ' + this.inputHandler.isClicked + ' ' + this.inputHandler.isDragging + ' ' + this.inputHandler.dragVec.x + ' ' + this.inputHandler.dragVec.y + ' ' + this.inputHandler.zoomRatio + ' ' + this.selectedTool + ' ' + this.allCanvasObjects.length);
            this.touchlog(this.touchtext);
        }
    },

    run: function () {

        var _this = this;
        var loop = function () {
            //_this.update();
            _this.render();
            window.requestAnimationFrame(loop, _this.canvas);
        }
        window.requestAnimationFrame(loop, _this.canvas);
    },

    setWidth: function (w) {
        this.width = this.canvas.width = w;
    },

    setHeight: function (h) {
        this.height = this.canvas.height = h;
    },

    addMouseListeners: function () {

        var _this = this;
        var inputHandler = this.inputHandler;

        this.canvas.addEventListener('mousemove', function (evt) {
            var rect = _this.canvas.getBoundingClientRect();
            inputHandler.canvasPos.x = Math.round(evt.clientX - rect.left);
            inputHandler.canvasPos.y = Math.round(evt.clientY - rect.top);
            if (inputHandler.isClicked) {
                inputHandler.isDragging = true;
            }
            if (inputHandler.isDragging) {

                var x = (inputHandler.canvasPos.x - inputHandler.lastPos.x) / inputHandler.zoomRatio;
                var y = (inputHandler.canvasPos.y - inputHandler.lastPos.y) / inputHandler.zoomRatio;

                if (Math.abs(x) > 7 || Math.abs(y) > 7) {
                    inputHandler.dragVec.x = -x;
                    inputHandler.dragVec.y = -y;
                }
            }
            _this.update('move', inputHandler.getData());
        }, false);

        this.canvas.addEventListener('mousedown', function (evt) {
            inputHandler.isClicked = true;
            inputHandler.lastPos.x = inputHandler.canvasPos.x;
            inputHandler.lastPos.y = inputHandler.canvasPos.y;

            _this.update('down', inputHandler.getData());
        }, false);

        this.canvas.addEventListener('mouseup', function () {

            inputHandler.isClicked = false;
            _this.update('up', inputHandler.getData());
            if (inputHandler.isDragging) {
                inputHandler.dragVec.x = 0;
                inputHandler.dragVec.y = 0;
                inputHandler.isDragging = false;
            }

        }, false);

        this.canvas.addEventListener('mouseout', function () {
            inputHandler.isClicked = false;

            _this.update('out', inputHandler.getData());

            if (inputHandler.isDragging) {
                inputHandler.dragVec.x = 0;
                inputHandler.dragVec.y = 0;
                inputHandler.isDragging = false;
            }

        }, false);

        this.canvas.addEventListener('mousewheel', function (evt) {

            if (!(_this.selectedTool === 'cursor-default' || _this.selectedTool === 'cursor-zoom-in' || _this.selectedTool === 'cursor-zoom-out')) {
                console.log('UH-UHH');
                return;
            }
            _this.zoomEvent(evt);

        }, false);
    },

    addTouchListeners: function () {
        var _this = this;
        var inputHandler = this.inputHandler;
        this.canvas.addEventListener('touchstart', function (evt) {


            //_this.preventDocumentEvents = true;
            var touches = evt.touches;

            var rect = _this.canvas.getBoundingClientRect();
            inputHandler.canvasPos.x = Math.round(touches[0].clientX - rect.left);
            inputHandler.canvasPos.y = Math.round(touches[0].clientY - rect.top);

            inputHandler.isClicked = true;
            inputHandler.lastPos.x = inputHandler.canvasPos.x;
            inputHandler.lastPos.y = inputHandler.canvasPos.y;

            //Detech initial touch start points for zoom event
            if (touches.length > 1) {

                var startTouchPos1 = {
                    x: Math.round(touches[0].clientX - rect.left),
                    y: Math.round(touches[0].clientY - rect.top)
                }

                var startTouchPos2 = {
                    x: Math.round(touches[1].clientX - rect.left),
                    y: Math.round(touches[1].clientY - rect.top)
                }


                var x = startTouchPos1.x - startTouchPos2.x;
                var y = startTouchPos1.y - startTouchPos2.y;

                var vect = Math.sqrt(Math.pow((x), 2) + Math.pow((y), 2));
                inputHandler.prevTouchVect = vect;
                return;
            }
            _this.update('down', inputHandler.getData());

        }, false);

        this.canvas.addEventListener('touchmove', function (evt) {

            _this.preventDocumentEvents = true;

            var touches = evt.touches;

            var rect = _this.canvas.getBoundingClientRect();

            inputHandler.canvasPos.x = Math.round(touches[0].clientX - rect.left);
            inputHandler.canvasPos.y = Math.round(touches[0].clientY - rect.top)


            if (inputHandler.isClicked == true) {
                inputHandler.isDragging = true;
            }

            if (touches.length == 1) {

                //inputHandler.canvasPos.x = Math.round(touches[0].clientX - rect.left);
                //inputHandler.canvasPos.y = Math.round(touches[0].clientY - rect.top)

                var x = (inputHandler.canvasPos.x - inputHandler.lastPos.x) / inputHandler.zoomRatio;
                var y = (inputHandler.canvasPos.y - inputHandler.lastPos.y) / inputHandler.zoomRatio;

                if (Math.abs(x) > 7 || Math.abs(y) > 7) {
                    inputHandler.dragVec.x = -x;
                    inputHandler.dragVec.y = -y;
                }

                _this.update('move', inputHandler.getData());

            } else if (touches.length == 2) {

                inputHandler.isDragging = false;
                inputHandler.dragVec.x = inputHandler.dragVec.y = 0;
                _this.update('up', inputHandler.getData());

                var currentTouchPos1 = {
                    x: inputHandler.canvasPos.x,
                    y: inputHandler.canvasPos.y
                }

                var currentTouchPos2 = {
                    x: Math.round(touches[1].clientX - rect.left),
                    y: Math.round(touches[1].clientY - rect.top)
                }

                var x = currentTouchPos1.x - currentTouchPos2.x;
                var y = currentTouchPos1.y - currentTouchPos2.y;

                var vect = Math.sqrt(Math.pow((x), 2) + Math.pow((y), 2));

                if (vect < 150) {
                    return;
                }


                if ((vect > inputHandler.prevTouchVect) && Math.abs(vect - inputHandler.prevTouchVect) > 3) {
                    _this.touchtext = 'Zoom - IN ' + vect;

                    _this.zoomEvent({
                        myDeltaY: -1
                    });

                } else if ((vect < inputHandler.prevTouchVect) && Math.abs(vect - inputHandler.prevTouchVect) > 3) {
                    _this.touchtext = 'Zoom - OUT ' + vect;
                    _this.zoomEvent({
                        myDeltaY: 1
                    });
                }
                inputHandler.prevTouchVect = vect;
            }

        }, false);

        this.canvas.addEventListener('touchend', function (evt) {

            _this.preventDocumentEvents = false;

            inputHandler.isClicked = false;
            _this.update('up', inputHandler.getData());
            if (inputHandler.isDragging) {
                inputHandler.dragVec.x = 0;
                inputHandler.dragVec.y = 0;
                inputHandler.isDragging = false;
            }
            _this.touchtext = '';

        }, false);

        this.canvas.addEventListener('touchcancel', function (evt) {

            _this.preventDocumentEvents = false;

            inputHandler.isClicked = false;
            _this.update('up', inputHandler.getData());
            if (inputHandler.isDragging) {
                inputHandler.dragVec.x = 0;
                inputHandler.dragVec.y = 0;
                inputHandler.isDragging = false;
            }

            _this.touchtext = '';

        }, false);
    },

    addDocumentPreventListeners: function () {

        var _this = this;
        document.addEventListener('touchstart', function (evt) {

            if (_this.preventDocumentEvents) {
                evt.preventDefault();
            }

        }, { passive: false });

        document.addEventListener('touchmove', function (evt) {

            if (_this.preventDocumentEvents) {
                evt.preventDefault();
            }

        }, { passive: false });

    },

    zoomEvent: function (evt, zoomRatio) {

        //console.log(this.width, this.height);

        var inputHandler = this.inputHandler;
        var delta = evt.myDeltaY || evt.deltaY;
        var zoomRatio = zoomRatio || 1.1;

        //To disable zoom when mouse is click-down
        if (evt.deltaY && inputHandler.isClicked == true) {
            return;
        }
        //Zoom In
        if (delta < 0) {
            inputHandler.zoomRatio *= zoomRatio;
            if (inputHandler.zoomRatio > inputHandler.maxZoomRatio)
                inputHandler.zoomRatio = inputHandler.maxZoomRatio;
        }
        //Zoom Out
        else if (delta > 0) {
            inputHandler.zoomRatio /= zoomRatio;
            if (inputHandler.zoomRatio < inputHandler.minZoomRatio)
                inputHandler.zoomRatio = inputHandler.minZoomRatio;
        }

        inputHandler.scale.x = this.planWidth / inputHandler.zoomRatio;
        inputHandler.scale.y = this.planHeight / inputHandler.zoomRatio;

        inputHandler.imgScale.x = this.planWidth - inputHandler.scale.x;
        inputHandler.imgScale.y = this.planHeight - inputHandler.scale.y;

        inputHandler.mouseScalePos.x = (((inputHandler.canvasPos.x / inputHandler.zoomRatio) / inputHandler.scale.x) * (inputHandler.imgScale.x - inputHandler.prevImgScale.x));
        inputHandler.mouseScalePos.y = (((inputHandler.canvasPos.y / inputHandler.zoomRatio) / inputHandler.scale.y) * (inputHandler.imgScale.y - inputHandler.prevImgScale.y));

        this.update('zoom', inputHandler.getData());

        inputHandler.prevImgScale.x = inputHandler.imgScale.x;
        inputHandler.prevImgScale.y = inputHandler.imgScale.y;
    },

    log: function (text) {
        this.ctx.font = '16pt Calibri';
        this.ctx.fillStyle = 'black';
        this.ctx.fillText(text, 10, 25);
    },

    touchlog: function (text) {
        this.ctx.font = '16pt Calibri';
        this.ctx.fillStyle = 'black';
        this.ctx.fillText(text, 10, 55);
    },

    setSelectedTool: function (toolName) {
        this.selectedTool = toolName;
    },

    notifyMarker: function (m) {

        //console.log(m);

        if (m.type === 'pin') {
            this.incPhoto();
            console.log('photo')
        } else {
            this.incMarker();
            console.log('marker')
        }

        var plan = this.allCanvasObjects[0];

        var x1 = (plan.pos.x + plan.offset.x + plan.drag.x) * plan.zoomRatio;
        var y2 = (plan.pos.y + plan.offset.y + plan.drag.y) * plan.zoomRatio;


        var img = this.img;

        var options = {
            id: m.id,
            sprite: img,
            type: m.type,
            isVisible: true,
            pos: {
                x: m.pos.x * plan.zoomRatio,
                y: m.pos.y * plan.zoomRatio
            },
            offset: {
                x: -x1,
                y: -y2
            },
            //$location: this.$location
        }

        this.allCanvasObjects.push(new cccjs.Marker(options));
        this.setSelectedTool('cursor-default');
    },

    imgLoadProperty: function (progressBar) {

        Image.prototype.load = function (url, progressBar) {

            progressBar.init();

            var thisImg = this,
                xmlHTTP = new XMLHttpRequest();

            thisImg.completedPercentage = 0;

            xmlHTTP.open('GET', url, true);
            xmlHTTP.responseType = 'arraybuffer';

            xmlHTTP.onload = function (e) {
                var h = xmlHTTP.getAllResponseHeaders(),
                    m = h.match(/^Content-Type\:\s*(.*?)$/mi),
                    mimeType = m[1] || 'image/png';
                // Remove your progress bar or whatever here. Load is done.

                var blob = new Blob([this.response], {
                    type: mimeType
                });
                thisImg.src = window.URL.createObjectURL(blob);
                //if (callback) callback(this);
            };

            xmlHTTP.onprogress = function (e) {
                if (e.lengthComputable)
                    thisImg.completedPercentage = parseInt((e.loaded / e.total) * 100);
                // Update your progress bar here. Make sure to check if the progress value
                // has changed to avoid spamming the DOM.
                // Something like: 
                // if ( prevValue != thisImage completedPercentage ) display_progress();

                //console.log('Loading ' + thisImg.completedPercentage);
                progressBar.setValue(thisImg.completedPercentage);

            };

            xmlHTTP.onloadstart = function () {
                // Display your progress bar here, starting at 0
                console.log('Started Dowloading Image');
                progressBar.show();
                thisImg.completedPercentage = 0;
                progressBar.setValue(thisImg.completedPercentage);
            };

            xmlHTTP.onloadend = function () {
                // You can also remove your progress bar here, if you like.
                console.log('Completed');
                thisImg.completedPercentage = 100;
                progressBar.setValue(thisImg.completedPercentage);
                progressBar.hide();
            }
            xmlHTTP.send();
        };
    }
};


/**/
cccjs.inputHandler = function (options) {

    var options = options || {};

    //Mouse at canvas
    this.canvasPos = {
        x: 0,
        y: 0
    }

    //Mouse at imagePos
    //This value sets from plan update
    this.imagePos = {
        x: 0,
        y: 0
    }

    //Mouse last clicked position
    //Calculating dragging vector
    this.lastPos = {
        x: 0,
        y: 0
    }

    //Mouse is clicked and dragging
    this.dragVec = {
        x: 0,
        y: 0
    }

    //Zoom scaling
    this.scale = {
        x: 0,
        y: 0
    }

    //Image zoom scaling
    this.imgScale = {
        x: 0,
        y: 0
    }

    //Image previous zoom scaling
    this.prevImgScale = {
        x: 0,
        y: 0
    }

    //Mouse position when scaling
    this.mouseScalePos = {
        x: 0,
        y: 0
    }

    this.prevTouchVect = 0;


    this.clickedMarkers = [];
    this.animQueue = [];

    this.isClicked = false;
    this.isDragging = false;
    this.isActive = true;

    this.zoomRatio = 1;
    //Min and max zoom ratios will be calculated the ratio of canvas and plan size
    this.minZoomRatio = options.minZoomRatio || 0.3;
    this.maxZoomRatio = options.maxZoomRatio || 2.5;

}
cccjs.inputHandler.prototype = {
    getData: function () {
        return this;
    },
    setImagePos: function (x, y) {
        this.imagePos.x = x;
        this.imagePos.y = y;
    },
    setScale: function () { }
};


/**/
cccjs.Plan = function (options) {

    var options = options || {};

    this.img = new Image();

    this.src = options.src || '';

    this.isLoaded = false;

    this.isVisible = false;

    this.progressBar = options.progressBar;

    this.pos = {
        x: 0,
        y: 0
    }

    this.offset = {
        x: 0,
        y: 0
    }

    this.drag = {
        x: 0,
        y: 0
    }

    this.width = options.width;
    this.height = options.height;

    this.zoomRatio = 1;

    this.init();

}

cccjs.Plan.prototype = {

    init: function () {

        //Load image
        this.img.load(this.src, this.progressBar);

    },

    update: function (evt, data) {

        switch (evt) {
            case 'move':
                if (data.isDragging) {
                    this.drag.x = data.dragVec.x;
                    this.drag.y = data.dragVec.y;
                }
                break;
            case 'up':
                this.offset.x += this.drag.x;
                this.offset.y += this.drag.y;
                this.drag.x = 0;
                this.drag.y = 0;
                break;
            case 'out':
                this.offset.x += this.drag.x;
                this.offset.y += this.drag.y;
                this.drag.x = 0;
                this.drag.y = 0;
                break;
            case 'zoom':
                this.zoomRatio = data.zoomRatio;

                //Calculation of scaling
                //var x = this.width / data.zoomRatio;
                //var y = this.height / data.zoomRatio;

                //var sx = this.width - x;
                //var sy = this.height - y;

                //var _sx = this.scale.x;
                //var _sy = this.scale.y;

                //var mx = ((data.canvasPos.x / data.zoomRatio) / x) * (sx - _sx);
                //var my = ((data.canvasPos.y / data.zoomRatio) / y) * (sy - _sy);

                this.offset.x += data.mouseScalePos.x;
                this.offset.y += data.mouseScalePos.y;

                //this.scale.x = sx;
                //this.scale.y = sy;

                break;

            case 'update':
                var x = Math.ceil((data.canvasPos.x / data.zoomRatio) + (this.pos.x + this.offset.x));
                var y = Math.ceil((data.canvasPos.y / data.zoomRatio) + (this.pos.y + this.offset.y));
                data.setImagePos(x, y);
                break;
            default:
                break;
        }

        var x = Math.ceil((data.canvasPos.x / data.zoomRatio) + (this.pos.x + this.offset.x));
        var y = Math.ceil((data.canvasPos.y / data.zoomRatio) + (this.pos.y + this.offset.y));
        data.setImagePos(x, y);

    },

    draw: function (ctx, width, height) {
        ctx.drawImage(this.img, (this.pos.x + this.offset.x + this.drag.x), (this.pos.y + this.offset.y + this.drag.y), width / this.zoomRatio, height / this.zoomRatio, 0, 0, width, height);
    }
};


/**/
cccjs.Marker = function (options) {

    this.id = options.id;

    this.width = null;
    this.height = null;

    this.$location = options.$location;

    this.pos = {
        x: options.pos.x,
        y: options.pos.y
    }

    this.offset = {
        x: options.offset.x || 0,
        y: options.offset.y || 0
    }

    this.drag = {
        x: 0,
        y: 0
    }

    this.spriteCords = {
        redMarker: {
            x: 0,
            y: 0,
            w: 91,
            h: 128
        },
        blueMarker: {
            x: 74,
            y: 0,
            w: 73,
            h: 102
        },
        yellowMarker: {
            x: 148,
            y: 0,
            w: 73,
            h: 102
        },
        orangeMarker: {
            x: 222,
            y: 0,
            w: 73,
            h: 102
        },
        blackMarker: {
            x: 0,
            y: 130,
            w: 93,
            h: 85
        }
    }
    this.selectedMarker = null;

    this.scale = 0.3;

    this.type = options.type;

    this.isDragging = false;
    this.isVisible = options.isVisible || false;

    this.sprite = options.sprite;

    this.init();
}
cccjs.Marker.prototype = {

    init: function () {

        //Set selected marker
        console.log(this.type);
        switch (this.type) {

            case 'red':
                this.selectedMarker = this.spriteCords.redMarker;
                this.width = this.spriteCords.redMarker.w;
                this.height = this.spriteCords.redMarker.h;
                break;
            case 'blue':
                this.selectedMarker = this.spriteCords.blueMarker;
                this.width = this.spriteCords.blueMarker.w;
                this.height = this.spriteCords.blueMarker.h;
                break;
            case 'yellow':
                this.selectedMarker = this.spriteCords.yellowMarker;
                this.width = this.spriteCords.yellowMarker.w;
                this.height = this.spriteCords.yellowMarker.h;
                break;
            case 'orange':
                this.selectedMarker = this.spriteCords.orangeMarker;
                this.width = this.spriteCords.orangeMarker.w;
                this.height = this.spriteCords.orangeMarker.h;
                break;
            case 'pin':
                this.selectedMarker = this.spriteCords.blackMarker;
                this.width = this.spriteCords.blackMarker.w;
                this.height = this.spriteCords.blackMarker.h;
                break;
            default:
                this.selectedMarker = this.spriteCords.redMarker;
                this.width = this.spriteCords.redMarker.w;
                this.height = this.spriteCords.redMarker.h;
                break;

        }

    },
    update: function (evt, data) {
        //this.isMouseOver(data);
        switch (evt) {
            //Mouse is moving
            case 'move':

                if (data.isDragging) {
                    this.drag.x = -(data.dragVec.x * data.zoomRatio);
                    this.drag.y = -(data.dragVec.y * data.zoomRatio);
                }

                /*if(this.isMouseOver(data)){
                    this.scale = 0.5;
                }else{  
                    this.scale = 0.4;
                }*/

                break;

            //Mouse is clicked-down
            case 'down':

                break;
            //Mouse is clicked-up
            case 'up':

                this.offset.x += this.drag.x;
                this.offset.y += this.drag.y;
                this.drag.x = this.drag.y = 0;

                if (!data.isDragging && this.isMouseOver(data)) {
                    data.clickedMarkers.push(this);
                }

                break;
            //Mouse is at out of canvas
            case 'out':
                this.offset.x += this.drag.x;
                this.offset.y += this.drag.y;
                this.drag.x = this.drag.y = 0;

                break;
            //Mouse wheel
            case 'zoom':

                this.offset.x += (((this.pos.x + this.offset.x) / data.scale.x) * (data.imgScale.x - data.prevImgScale.x));
                this.offset.y += (((this.pos.y + this.offset.y) / data.scale.y) * (data.imgScale.y - data.prevImgScale.y));

                this.offset.x -= data.mouseScalePos.x * data.zoomRatio;
                this.offset.y -= data.mouseScalePos.y * data.zoomRatio;

                break;
            default:
                break;
        }
    },
    anim: function () {

    },
    draw: function (ctx) {
        if (this.isVisible === true) {
            //var box = this.getBoxModel();
            //ctx.fillRect(box.x, box.y, box.w, box.h);
            ctx.drawImage(this.sprite, this.selectedMarker.x, this.selectedMarker.y, this.selectedMarker.w, this.selectedMarker.h,
                (this.pos.x + this.offset.x + this.drag.x) - ((this.width / 2) * this.scale), (this.pos.y + this.offset.y + this.drag.y) - (this.height * this.scale), this.width * this.scale, this.height * this.scale);

        }

    },
    getBoxModel: function () {
        return {
            x: (this.pos.x + this.offset.x + this.drag.x) - ((this.width / 2) * this.scale),
            y: (this.pos.y + this.offset.y + this.drag.y) - (this.height * this.scale),
            w: (this.width * this.scale),
            h: (this.height * this.scale)
        }
    },
    isMouseOver: function (data) {
        if (this.isVisible === false)
            return;

        var box = this.getBoxModel();
        if ((data.canvasPos.x > box.x) && (data.canvasPos.x < (box.x + box.w)) && (data.canvasPos.y > box.y) && (data.canvasPos.y < (box.y + box.h))) {
            return true;
        } else {
            return false;
        }
    }
};

cccjs.Services = {
    sayHello: function () {
        console.log("Hello world from services");
    }
};


/*
(function cccjs() {
    return;
    Image.prototype.load = function (url, callback) {
        var thisImg = this,
            xmlHTTP = new XMLHttpRequest();

        thisImg.completedPercentage = 0;

        xmlHTTP.open('GET', url, true);
        xmlHTTP.responseType = 'arraybuffer';

        xmlHTTP.onload = function (e) {
            var h = xmlHTTP.getAllResponseHeaders(),
                m = h.match(/^Content-Type\:\s*(.*?)$/mi),
                mimeType = m[1] || 'image/png';
            // Remove your progress bar or whatever here. Load is done.

            var blob = new Blob([this.response], {
                type: mimeType
            });
            thisImg.src = window.URL.createObjectURL(blob);
            if (callback) callback(this);
        };

        xmlHTTP.onprogress = function (e) {
            if (e.lengthComputable)
                thisImg.completedPercentage = parseInt((e.loaded / e.total) * 100);
            // Update your progress bar here. Make sure to check if the progress value
            // has changed to avoid spamming the DOM.
            // Something like: 
            // if ( prevValue != thisImage completedPercentage ) display_progress();
            console.log('Loading ' + thisImg.completedPercentage);
        };

        xmlHTTP.onloadstart = function () {
            // Display your progress bar here, starting at 0
            console.log('Started Dowloading Image');
            thisImg.completedPercentage = 0;
        };

        xmlHTTP.onloadend = function () {
            // You can also remove your progress bar here, if you like.
            console.log('Completed');
            thisImg.completedPercentage = 100;
        }

        xmlHTTP.send();
    };

})()
*/