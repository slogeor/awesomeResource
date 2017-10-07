!(function(win) {
    var doc = win.document;
    var docEle = doc.documentElement,
        metaEle = doc.querySelector('meta[name="viewport"]'),
        dpr = 0,
        scale = 0;

    if (metaEle) {
        //根据已有的meta标签设置缩放比例
        var match = metaEle.getAttribute('content').match(/initial\-sale([\d\.+])/);

        if (match) {
            scale = parseFloat(match[1]);
            dpr = parseInt(1 / scale, 10);
        }
    }

    if (!dpr && !scale) {

        var appVersion = win.navigator.appVersion;

        var isAndroid = appVersion.match(/android/gi);
        var isIPhone = appVersion.match(/iphone/gi);

        var devicePixelRatio = win.devicePixelRatio;
        
        if (isIPhone) {
            // iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
            if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {
                dpr = 3;
            } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)) {
                dpr = 2;
            } else {
                dpr = 1;
            }
        } else {
            // 其他设备下，仍旧使用1倍的方案
            dpr = 1;
        }
        scale = 1 / dpr;
    }

    if (!metaEle) {
        metaEle = doc.createElement('meta');
        metaEle.setAttribute('name', 'viewport');
        metaEle.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
        if (docEle.firstElementChild) {
            docEle.firstElementChild.appendChild(metaEle);
        } else {
            var wrap = doc.createElement('div');
            wrap.appendChild(metaEle);
            doc.write(wrap.innerHTML);
        }
    }
})(window);