/* PAGE FULLSCREEN FUNCTION */
function SwitchScreen(sender) {
    var el, rfs;
    switch (sender.dataset.state) {
        case "off":
            el = document.documentElement, rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
            sender.dataset.state = "on";
            break;
        case "on":
            el = document, rfs = el.exitFullscreen || el.webkitExitFullscreen || el.mozCancelFullScreen || el.msExitFullscreen;
            sender.dataset.state = "off";
            break;
    }
    sender.classList.toggle('focus-bg');
    window.localStorage.setItem('screen-state', sender.dataset.state);
    rfs.call(el);
}


/*
* CANVAS TOOLBAR OBJECT
*
*/
function Toolbar(bar_id) {
    var toolbar = document.getElementById(bar_id);
    var tool_list = toolbar.getElementsByClassName('tool-list')[0];

    tool_list.onclick = function (e) {

        var target_tool = e.target.tagName === 'I' ? e.target.parentElement : e.target.tagName === 'LI' ? e.target : null;
        if (target_tool) {
            for (var idx in tool_list.children) {
                if (tool_list.children[idx].tagName === 'LI') tool_list.children[idx].classList.remove('selected');
            }
            target_tool.classList.add('selected');
        }
    };

    tool_list.children[0].click();

    for (var idx in tool_list.children) {
        if (tool_list.children[idx].tagName === 'LI')
            tool_list.children[idx].toolType = tool_list.children[idx].attributes['tool-type'].value;
    }

    this.setToolFunction = function (tool_type, tool_function) {

        if (tool_type === 'all') {
            for (var idx in tool_list.children) {
                if (tool_list.children[idx].tagName === 'LI')
                    tool_list.children[idx].onclick = tool_function;
            }
        } else {
            for (idx in tool_list.children) {

                if (tool_list.children[idx].toolType === tool_type) {
                    tool_list.children[idx].onclick = tool_function;
                    break;
                }
            }
        }

    }
}

/*
* WINDOW
*
*/
function Window(window_id) {
    var window_element = document.getElementById(window_id);
    var window_close = window_element.getElementsByClassName('window-close')[0];
    var _this = this;

    this.width = window_element.clientWidth;
    this.height = window_element.clientHeight;

    window_close.onclick = function () {
        window_element.style['top'] = 'unset';
        window_element.style['left'] = '101%';
    }

    var calcPosition = function (pos_x, pos_y) {
        var position = { top: '', left: '' };

        var container = window_element.parentElement;

        pos_y -= container.offsetTop;
        pos_x -= container.offsetLeft;

        position.top = (pos_y < _this.height + 32) ? pos_y + 16 : pos_y - _this.height - 16;

        position.left = (pos_x < _this.width + 32) ? pos_x + 16 : pos_x - _this.width - 16;

        return position;
    }


    this.show = function (e) {

        setTimeout(function () {
            var container = window_element.parentElement;

            if (container.clientWidth < 768) {

                window_element.style['top'] = 'calc(50% - ' + window_element.clientHeight / 2 + 'px)';
                window_element.style['left'] = '5%';
                window_element.style['right'] = '5%';
            } else {

                var position = calcPosition(e.clientX, e.clientY);

                window_element.style['top'] = position.top + 'px';
                window_element.style['left'] = position.left + 'px';
                window_element.style['right'] = 'unset';
            }
        }, 500)
    }

    this.hide = function () {
        window_close.click();
    }
}

/**
* LOADGIN BAR
*
*/
function LoadingBar(bar_id) {
    this.track = document.getElementById(bar_id).getElementsByClassName('track')[0];

    LoadingBar.prototype.setValue = function (val) {
        val = val < 0 ? 0 : val > 100 ? 100 : val;

        this.track.style['width'] = val + '%';
    }

    LoadingBar.prototype.init = function () {

        this.track.style['width'] = '0%';
        this.show();
    }

    LoadingBar.prototype.show = function () {
        this.track.parentElement.parentElement.style['display'] = 'initial';
    }
    LoadingBar.prototype.hide = function () {
        this.track.parentElement.parentElement.style['display'] = 'none';
    }
}
