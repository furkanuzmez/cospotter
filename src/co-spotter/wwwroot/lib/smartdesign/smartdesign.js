var SmartDesign = function () {

    /* Privates */
    var smartDesign = {};
    var getScrollbarWidth = function () {
        var outer = document.createElement("div");
        outer.style.visibility = "hidden";
        outer.style.width = "100px";
        outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps

        document.body.appendChild(outer);

        var widthNoScroll = outer.offsetWidth;
        // force scrollbars
        outer.style.overflow = "scroll";

        // add innerdiv
        var inner = document.createElement("div");
        inner.style.width = "100%";
        outer.appendChild(inner);

        var widthWithScroll = inner.offsetWidth;

        // remove divs
        outer.parentNode.removeChild(outer);

        if (document.body.parentElement.scrollHeight - document.body.parentElement.offsetHeight)
            return widthNoScroll - widthWithScroll;
        else
            return 0;
    };
    var hideScrollBar = function () {
        document.body.parentElement.style['overflow'] = 'hidden';
        document.body.parentElement.style['padding-right'] = getScrollbarWidth() + 'px';
    };
    var showScrollBar = function () {
        document.body.parentElement.style['overflow'] = 'initial';
        document.body.parentElement.style['padding-right'] = 'initial';
    };

    /* Materials */
    smartDesign.Modal = function (conf) {
        var modal_fade = document.getElementById(conf.id);
        var modal_dialog = modal_fade.getElementsByClassName('modal-dialog')[0];

        var _this = this;

        this.closeButton = null;

        this.show = function (callback, env) {
            _this.onshow();
            if (callback) callback.apply(env);
            modal_fade.classList.add('fade-in');
            modal_fade.style['bottom'] = '0';
            hideScrollBar();

            /*Config*/
            if (conf.dissmiss === true) modal_fade.onclick = function (e) { if (e.target === this) _this.hide(); };
        };

        this.hide = function (callback, env) {
            _this.onhide();
            if (callback) callback.apply(env);
            modal_fade.classList.remove('fade-in');
            setTimeout(function () {
                modal_fade.style['bottom'] = '100%';
                showScrollBar();
            }, 300);

            modal_fade.onclick = null;
        }

        this.onhide = function () { };
        this.onshow = function () { };

        /*Config*/
        if (conf.fit_to_bot === true) {
            modal_dialog.classList.add('fit-to-bot');
            var modal_heading = modal_fade.getElementsByClassName('modal-heading')[0];
            var modal_body = modal_fade.getElementsByClassName('modal-body')[0];
            var modal_footer = modal_fade.getElementsByClassName('modal-footer')[0];

            var offset = 0;

            if (modal_heading) offset += modal_heading.offsetHeight;
            if (modal_footer) offset += modal_footer.offsetHeight;

            var modal_body_padding = Number(window.getComputedStyle(modal_body, null).getPropertyValue('margin-top').slice(0, -2))
                + Number(window.getComputedStyle(modal_body, null).getPropertyValue('margin-bottom').slice(0, -2))
                + Number(window.getComputedStyle(modal_body, null).getPropertyValue('padding-top').slice(0, -2))
                + Number(window.getComputedStyle(modal_body, null).getPropertyValue('padding-bottom').slice(0, -2));

            modal_body.style['height'] = 'calc(100% - ' + (offset + modal_body_padding) + 'px)';
            modal_body.style['overflow'] = 'auto';
        }
        if (conf.size) modal_dialog.classList.add('dialog-' + conf.size);
        if (conf.close_button === true) {
            var close_div = document.createElement('div');
            close_div.className = 'modal-close';
            close_div.innerHTML = '<i class="fa fa-times" aria-hidden="true"></i>';

            close_div.onclick = function () { _this.hide(); };

            modal_dialog.appendChild(close_div);

            this.closeButton = close_div;
        }
        if (conf.animation === false) { modal_dialog.style['transition'] = 'none'; modal_fade.style['transition'] = 'none'; }
    };

    smartDesign.TrackBar = function (conf) {
        var value, min, max, thumb_line_length, _this = this;
        var track_bar_toggle_button = document.getElementById(conf.id);

        var thumb = track_bar_toggle_button.getElementsByClassName('thumb')[0];

        var toggle = function (e) {

            if (e.target.classList[0] !== 'track' &&
                e.target.className !== 'thumb-line' &&
                e.target.className !== 'thumb') {
                this.getElementsByClassName('track')[0].classList.toggle('show');
                thumb_line_length = thumb.parentElement.clientHeight - thumb.clientHeight;
                move_to(value);
            }
        };

        var move_begin = function (e) {

            this.mouse_down_coord_Y = e.clientY;

            this.current_top = this.offsetTop;

            this.parentElement.parentElement.onmousemove = move_thumb;
            this.parentElement.parentElement.onmouseleave = move_end;
            this.parentElement.parentElement.onmouseup = move_end;

        };

        var move_end = function (e) {

            this.onmousemove = null;
        };

        var move_thumb = function (e) {
            var deltaY = e.clientY - thumb.mouse_down_coord_Y;

            thumb.style['top'] = (thumb.current_top + deltaY) + 'px';


            if (thumb.offsetTop > thumb_line_length) thumb.style['top'] = 'calc(100% - ' + thumb.clientHeight + 'px)';
            if (thumb.offsetTop < 1) thumb.style['top'] = '0px';

            _this.setValue((min - 0) + ((thumb_line_length - thumb.offsetTop) / thumb_line_length) * (max - min));

            if (conf.callback) {
                conf.callback.apply();
            }
        };

        var move_to = function (val) {
            var ratio = (val - min) / (max - min);

            var track_offset = thumb_line_length * ratio;

            thumb.style['top'] = (thumb_line_length - track_offset) + 'px';

            if (conf.callback) {
                conf.callback.apply();
            }
        };

        var thumb_line_click = function (e) {
            if (e.target.className === 'thumb-line') {
                var pos_y = event.offsetY ? (event.offsetY) : event.pageY - this.offsetTop;

                _this.setValue((min - 0) + ((thumb_line_length - pos_y) / thumb_line_length) * (max - min));
            }
        };

        this.init = function () {
            track_bar_toggle_button.onclick = toggle;
            var thumb_line = thumb.parentElement;

            min = track_bar_toggle_button.attributes['min'] ? track_bar_toggle_button.attributes['min'].value : 0;
            max = track_bar_toggle_button.attributes['max'] ? track_bar_toggle_button.attributes['max'].value : 100;
            value = 0;
            range = max - min;

            thumb.onmousedown = move_begin;

            if (conf.default) { this.setValue(conf.default); }
            else this.setValue((max - min) / 2);

            thumb_line.onclick = thumb_line_click;

        };

        this.getValue = function () {
            return value;
        };

        this.setValue = function (val) {
            value = val < min ? min : val > max ? max : val;
            value = Math.ceil(value);
            move_to(value);
        };
    };

    smartDesign.ImageViewer = (function () {
        var imageViewer = {};

        /*Privates*/

        var selected_index, image_view, image_list, image_title, track_zoom, viewer, viewer_resize_interval, prev_height = 0, prev_width = 0, err;

        var change_image = function () {

            imageViewer.onimagechange();

            image_view.src = this.src;
            selected_index = this.index;
            if (this.attributes['title-text']) {
                image_title.getElementsByTagName('p')[0].innerHTML = this.attributes['title-text'].value;
                image_title.classList.add('show');
            } else {
                image_title.getElementsByTagName('p')[0].innerHTML = '';
                image_title.classList.remove('show');
            }

            fit();
            mark_and_center_selected(this);

        };

        var mark_and_center_selected = function (item) {
            var siblings = item.parentElement.children;

            for (var i = 0; i < siblings.length; i++) {
                siblings[i].classList.remove('selected');
            }

            item.classList.add('selected');

            //var offset = Math.floor(item.parentElement.parentElement.clientWidth / 2 - item.offsetLeft - item.clientWidth / 2 - 10);

            //if (item.parentElement.parentElement.clientWidth < item.parentElement.clientWidth) {
            //    offset = offset > 0 ? 0 : offset;

            //    var diff = item.parentElement.parentElement.clientWidth - item.parentElement.clientWidth;

            //    offset = offset < diff ? diff : offset;
            //}

            //item.parentElement.style['left'] = offset * 100 / item.parentElement.parentElement.clientWidth + '%';
            //item.parentElement.style['right'] = -1 * offset * 100 / item.parentElement.parentElement.clientWidth + '%';
        };

        var zoom = function (zoom_val) {
            image_view.style['height'] = zoom_val + '%';

            var wrapper = image_view.parentElement;

            var delta_width = image_view.clientWidth - prev_width;
            var delta_height = image_view.clientHeight - prev_height;

            wrapper.scrollLeft += delta_width / 2;
            wrapper.scrollTop += delta_height / 2;

            prev_height = image_view.clientHeight;
            prev_width = image_view.clientWidth;
        };

        var fit = function () {
            track_zoom.setValue(99);

            //var mod = image_view.rotationAngle % 360;

            //console.log(mod);

            //if (mod > -180) image_view.rotationAngle -= mod;
            //else image_view.rotationAngle -= (360 + mod);

            image_view.rotationAngle = 90; rotate();


        };

        var rotate = function () {
            image_view.rotationAngle -= 90;
            //console.log(image_view.rotationAngle);
            image_view.style['transform'] = 'rotate(' + image_view.rotationAngle % 360 + 'deg)';
        };

        var drag_start = function (e) {
            if (e.buttons === 1) {
                this.mouse_down_coord_x = e.clientX;
                this.mouse_down_coord_y = e.clientY;

                this.currScrollTop = this.scrollTop;
                this.currScrollLeft = this.scrollLeft;

                this.onmousemove = drag;
            }
        };

        var drag = function (e) {
            var deltaX = e.clientX - this.mouse_down_coord_x;
            var deltaY = e.clientY - this.mouse_down_coord_y;

            this.scrollTop = -1 * deltaY + this.currScrollTop;
            this.scrollLeft = -1 * deltaX + this.currScrollLeft;
        };

        var drag_end = function (e) {
            this.onmousemove = null;
        };

        /*********/

        /*Publics*/
        imageViewer.init = function () {

            var doc_head = document.getElementsByTagName('head')[0];
            var image_viewer_scroll_style = document.createElement('style');

            image_viewer_scroll_style.type = 'text/css';
            image_viewer_scroll_style.id = 'image-view-scroll';

            doc_head.appendChild(image_viewer_scroll_style);

            viewer = document.createElement('div');
            viewer.id = 'smrt-dsgn-img-viewer';
            viewer.className = 'smart img-viewer-fade';

            var toolbar = document.createElement('div');
            toolbar.className = 'toolbar';

            var fit_tool = document.createElement('button');
            fit_tool.onclick = fit;
            fit_tool.innerHTML = '<i class="fa fa-expand" aria-hidden="true"></i>';

            var rotate_tool = document.createElement('button');
            rotate_tool.onclick = rotate;
            rotate_tool.innerHTML = '<i class="fa fa-undo" aria-hidden="true"></i>';

            var zoom_tool = document.createElement('button');
            zoom_tool.className = 'smart track-bar';
            zoom_tool.id = 'smart-img-viewer-zoom-track';
            zoom_tool.setAttribute('min', 75);
            zoom_tool.setAttribute('max', 250);
            zoom_tool.innerHTML = '<i class="fa fa-search" aria-hidden="true"></i>';

            var track = document.createElement('div');
            track.className = 'track top-right';

            var thumb_line = document.createElement('div');
            thumb_line.className = 'thumb-line';

            var thumb = document.createElement('div');
            thumb.className = 'thumb';

            var close_tool = document.createElement('button');
            close_tool.onclick = this.hide;
            close_tool.innerHTML = '<i class="fa fa-times" aria-hidden="true"></i>';

            var spacer_tool = document.createElement('div');
            spacer_tool.style = 'width: 2.5em; height: 2.5em;';

            var image_view_container = document.createElement('div');
            image_view_container.className = 'img-view-container';

            image_title = document.createElement('div');
            image_title.className = 'img-title';

            var image_title_text = document.createElement('p');

            var image_title_close = document.createElement('div');
            image_title_close.innerHTML = '<i class="fa fa-times" aria-hidden="true"></i>';

            image_title_close.onclick = function () { image_title.classList.remove('show'); };

            var image_wrapper = document.createElement('div');
            image_wrapper.className = 'img-view-wrapper';

            image_wrapper.onmousedown = drag_start;
            image_wrapper.onmouseup = drag_end;

            image_view = document.createElement('img');
            image_view.className = 'img-view';
            image_view.ondragstart = function () { return false; };
            image_view.rotationAngle = 0;

            var image_list_container = document.createElement('div');
            image_list_container.className = 'img-list-container';

            image_list = document.createElement('div');
            image_list.className = 'item-list';

            image_list.onmousedown = drag_start;
            image_list.onmouseup = drag_end;

            err = document.createElement('h1');
            err.style = 'align-self: center; margin: auto; color: rgba(255, 255, 255, .75); display: none';
            // append elements to dom.

            zoom_tool.appendChild(track);
            track.appendChild(thumb_line);
            thumb_line.appendChild(thumb);

            toolbar.appendChild(fit_tool);
            toolbar.appendChild(rotate_tool);
            toolbar.appendChild(zoom_tool);
            toolbar.appendChild(spacer_tool);
            toolbar.appendChild(close_tool);

            viewer.appendChild(toolbar);

            image_view_container.appendChild(image_wrapper);
            image_view_container.appendChild(image_title);
            image_wrapper.appendChild(err);
            image_wrapper.appendChild(image_view);
            image_title.appendChild(image_title_text);
            image_title.appendChild(image_title_close);

            viewer.appendChild(image_view_container);

            image_list_container.appendChild(image_list);

            viewer.appendChild(image_list_container);

            document.body.appendChild(viewer);

            track_zoom = new smartDesign.TrackBar({
                id: 'smart-img-viewer-zoom-track',
                callback: function () {
                    zoom(track_zoom.getValue());
                    //console.log(track_zoom.getValue());
                }
            });

            track_zoom.init();
        };
        imageViewer.dispose = function () {
            if (viewer) {
                imageViewer.ondispose();
                viewer.remove();
                document.getElementById('image-view-scroll').remove();
                console.log('Smart Image Viewer Disposed!');
            } else {
                console.log('Smart Image Viewer Not Found!')
            }
        };
        imageViewer.show = function (img_index) {
            imageViewer.onshow();
            if (document.getElementById('smrt-dsgn-img-viewer')) {
                viewer.classList.add('fade-in');
                document.getElementById('image-view-scroll').innerHTML = '::-webkit-scrollbar {width: 2px;height: 2px;}::-webkit-scrollbar-track {background-color: rgba(115, 131, 191, 0.2);}::-webkit-scrollbar-thumb {background: rgba(255, 255, 255, 0.2);}::-webkit-scrollbar-thumb:window-inactive {background: rgba(255, 255, 255, 0.10);}';

                if (image_list.children.length > 0) {
                    if (img_index) image_list.children[img_index - 1].click();
                    else image_list.children[0].click();
                }

                document.body.parentElement.style['overflow'] = 'hidden';
            } else console.log('The "init()" function should be called first!.');
        };
        imageViewer.hide = function () {
            imageViewer.onhide();
            viewer.classList.remove('fade-in');
            document.getElementById('image-view-scroll').innerHTML = '';
            document.body.parentElement.style['overflow'] = 'initial';
        };
        imageViewer.setAlbum = function (img_list) {
            imageViewer.onalbumchange();
            if (img_list.length > 0) {

                image_list.innerHTML = '';
                for (var i = 0; i < img_list.length; i++) {
                    if (img_list[i].src) {

                        var img = document.createElement('img');
                        img.src = img_list[i].src;
                        if (img_list[i].title) img.setAttribute('title-text', img_list[i].title);
                        img.index = i;

                        img.className = 'img-item';
                        img.onclick = change_image;
                        img.ondragstart = function () { return false; };

                        image_list.appendChild(img);

                    }
                }

                if (img_list.length === 1) {
                    image_list.parentElement.style['display'] = 'none';
                    image_view.parentElement.parentElement.style['height'] = 'calc(100vh - 1em)';
                }
            }
            else {
                console.log('hsfdkjghdskjhgfkjdshfkjdshgkjdhskjfhds')
                image_list.parentElement.style['display'] = 'none';
                image_view.parentElement.parentElement.style['height'] = 'calc(100vh - 1em)';
                err.innerHTML = 'Empty';
                err.style['display'] = 'flex';
                err.style['font-size'] = '25vmin';
            }
        };
        imageViewer.configViewer = function (conf) {
            if (conf.theme) viewer.classList.add('theme-' + conf.theme);
        };

        /*EVENT HANDLING*/
        imageViewer.ondispose = function () { };
        imageViewer.onshow = function () { };
        imageViewer.onhide = function () { };
        imageViewer.onalbumchange = function () { };
        imageViewer.onimagechange = function () { };
        /*********/

        return imageViewer;
    })();

    smartDesign.Accrodion = (function () {
        var acc = {};

        acc.init = function () {
            var accordions = document.getElementsByClassName('accordion');

            for (var i = 0; i < accordions.length; i++) {
                var toggle = accordions[i].getElementsByClassName('accordion-toggle')[0];

                toggle.onclick = function () {
                    var panel = this.parentElement.getElementsByClassName('accordion-content-wrapper')[0];

                    panel.classList.toggle('expand');
                };

                if (accordions[i].dataset.initialstate === 'expand') {
                    setTimeout(accordions[i].getElementsByClassName('accordion-content-wrapper')[0].classList.add('expand'), 100 + i * 20);
                }
            }
        };

        acc.fetchById = function (acc_id) {

            function AccInstance(id) {

                var accordion_toggle_element = document.getElementById(id).getElementsByClassName('accordion-toggle')[0];
                var accordion_content_panel = accordion_toggle_element.parentElement.getElementsByClassName('accordion-content-wrapper')[0];

                AccInstance.prototype.onexpand = function () { };
                AccInstance.prototype.oncollapse = function () { };

                this.expand = function () {
                    this.onexpand();
                    accordion_content_panel.style.maxHeight = (accordion_content_panel.scrollHeight + 25) + 'px';

                    setTimeout(function () {
                        accordion_content_panel.style.maxHeight = 'none';
                    }, 300);
                }

                this.collapse = function () {
                    this.oncollapse();
                    accordion_content_panel.style.maxHeight = null;
                }

                var _this = this;

                accordion_toggle_element.onclick = function () {

                    accordion_content_panel.classList.toggle('expand');

                    if (accordion_content_panel.style.maxHeight) {
                        _this.collapse();
                    } else {
                        _this.expand();
                    }

                }
            }

            return new AccInstance(acc_id);
        }

        return acc;
    })();

    smartDesign.DropDownList = (function () {
        var dropdown = {};

        var collapse = function () {
            this.parentElement.parentElement.blur();
        }

        /** Publics */
        dropdown.init = function () {
            var dropdowns = document.getElementsByClassName('smart dropdown');

            for (var i = 0; i < dropdowns.length; i++) {
                dropdowns[i].getElementsByClassName('dropdown-list')[0].onclick = collapse;
            }

        };

        dropdown.fetchById = function (dropdown_id, conf) {
            function DropdownInstance(id) {
                var dropdown_element = document.getElementById(id);
                var dropdown_heading = dropdown_element.getElementsByClassName('dropdown-heading')[0];
                var item_list = dropdown_element.getElementsByClassName('dropdown-list')[0];
                var toggle_icon = dropdown_element.getElementsByTagName('i')[0];
                var selected_item = null;
                var _this = this;
                var toggle_flag = false;
                var placeholder = dropdown_heading.innerHTML;

                /** Privates */
                var toggle = function (e) {

                    if (toggle_flag === true) {

                        _this.collapse();

                    }
                    else {

                        _this.expand();

                    }
                };

                var toggle_caret = function () {
                    if (toggle_icon && toggle_icon.attributes['toggle-classes']) {
                        var toggle_classes = toggle_icon.attributes['toggle-classes'].value.split(' ');
                        toggle_icon.classList.toggle(toggle_classes[0]);
                        toggle_icon.classList.toggle(toggle_classes[1]);
                    }
                }

                item_list.onclick = null;

                var select = function () {

                    if (selected_item === null) selected_item = {};

                    if (this.attributes['item-value']) selected_item.value = this.attributes['item-value'].value;
                    selected_item.content = this.innerHTML;

                    for (var i = 0; i < item_list.children.length; i++) {
                        item_list.children[i].classList.remove('selected');
                    }

                    this.classList.add('selected');

                    if (conf.show_selected === true) dropdown_heading.innerHTML = this.innerHTML;

                    _this.onSelectedItemChanged();

                }

                /* Initialize items */
                for (var i = 0; i < item_list.children.length; i++) {
                    item_list.children[i].onclick = select;
                }


                /** Publics */
                this.expand = function (e) {
                    if (toggle_flag == false) {
                        _this.onexpand();

                        if (conf.toggle === true)
                            dropdown_element.classList.add('expand');
                        else
                            dropdown_element.focus();

                        var list_container = item_list.parentElement;

                        var rect = list_container.getBoundingClientRect();

                        if (rect.top + list_container.clientHeight + 16 >= window.innerHeight) {
                            list_container.classList.add('reverse');
                        }

                        toggle_flag = true;
                        toggle_caret();
                    }
                };

                this.collapse = function (e) {
                    if (toggle_flag == true) {
                        _this.oncollapse();

                        if (conf.toggle === true)
                            dropdown_element.classList.remove('expand');
                        else
                            dropdown_element.blur();

                        var list_container = item_list.parentElement;
                        list_container.classList.remove('reverse');

                        toggle_flag = false;
                        toggle_caret();
                    }
                };

                this.setItemList = function (list) {
                    item_list.innerHTML = '';
                    for (var i = 0; i < list.length; i++) {
                        var list_item = document.createElement('li');

                        list_item.setAttribute('item-value', list[i].value);

                        list_item.innerHTML = list[i].content;

                        list_item.onclick = select;

                        item_list.appendChild(list_item);
                    }
                }

                this.resetPlaceHolder = function () {
                    selected_item = null;
                    dropdown_heading.innerHTML = placeholder;
                }

                this.getSelectedItem = function () {
                    return selected_item;
                };

                this.selectItemByIndex = function (index) {
                    item_list.children[index].click();
                };

                if (conf.toggle === true) {

                    dropdown_element.classList.add('toggle');

                    dropdown_element.onclick = toggle;

                    dropdown_element.onblur = _this.collapse;
                }
                else {
                    dropdown_element.onfocus = this.expand;
                    dropdown_element.onblur = this.collapse;
                }

                /** Events */
                DropdownInstance.prototype.onSelectedItemChanged = function () { };
                DropdownInstance.prototype.onexpand = function () { };
                DropdownInstance.prototype.oncollapse = function () { };
            }

            return new DropdownInstance(dropdown_id);
        };

        return dropdown;
    })();

    smartDesign.TabPanel = (function (conf) {
        var tabpanel = {};

        var tabclick = function () {
            var tabs = this.parentElement.children;
            var panels = this.parentElement.parentElement.getElementsByClassName('panel-container')[0].children;

            for (var i = 0; i < tabs.length; i++) {
                tabs[i].classList.remove('focus');
            }

            this.classList.add('focus');

            for (i = 0; i < panels.length; i++) {
                panels[i].classList.add('hide');
            }

            document.getElementById(this.dataset.target).classList.remove('hide');
        };

        tabpanel.init = function () {
            var tabpanels = document.getElementsByClassName('tab-panel');

            for (var i = 0; i < tabpanels.length; i++) {
                var tabs = tabpanels[i].getElementsByClassName('tab-container')[0].children;
                for (var j = 0; j < tabs.length; j++) {
                    tabs[j].onclick = tabclick;
                }

                tabs[0].click();
            }

        };

        tabpanel.fetchById = function (tabpanel_id) {

            function TabPanelInstance(id) {
                /** Privates */
                var _this = this;
                var tabpanel_element = document.getElementById(id);
                var tabs = tabpanel_element.getElementsByClassName('tab-container')[0].children;
                var panels = tabpanel_element.getElementsByClassName('panel-container')[0].children;

                var change_panel = function () {

                    /** Change Panel */
                    for (i = 0; i < panels.length; i++) {
                        panels[i].classList.add('hide');
                    }

                    focus_on(this);
                    document.getElementById(this.dataset.target).classList.remove('hide');

                    this.activeTabIndex = 0;

                    for (i = 0; i < tabs.length; i++) {
                        if (tabs[i].className === this.className) {
                            this.activeTabIndex = i;
                            break;
                        }
                    }

                    _this.activeTab = this;

                    _this.onActiveTabChanged();

                };

                var focus_on = function (item) {
                    var siblings = item.parentElement.children;

                    for (var i = 0; i < siblings.length; i++) {
                        siblings[i].classList.remove('focus');
                    }

                    item.classList.add('focus');
                };

                for (var i = 0; i < tabs.length; i++) {
                    tabs[i].onclick = change_panel;
                }

                /** Publics */
                this.activeTabIndex = 0; // default..
                this.activeTab = null;
                this.selectTab = function (idx) {

                    idx = idx >= tabs.length ? 0 : tabs < 0 ? 0 : idx;

                    if (tabs.length > 0) tabs[idx].click();
                };

                TabPanelInstance.prototype.onActiveTabChanged = function () { };
            }

            return new TabPanelInstance(tabpanel_id);
        };

        return tabpanel;
    })();

    return smartDesign;
}();