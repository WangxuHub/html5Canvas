/// <reference path="/Scripts/jquery-3.1.1.intellisense.js" />
/// <reference path="/demo.html" />

(function () {
    var canvas = document.getElementById("canvas");
    var $canvas = $(canvas);

    var canvasTemp = document.getElementById("canvasTemp");
    var $canvasTemp = $(canvasTemp);

    var $documentView = $("#documentView");
    $canvas.attr({
        width: $documentView.width(),
        height: $documentView.height()
    });
    $canvasTemp.attr({
        width: $documentView.width(),
        height: $documentView.height()
    });


    var context = canvas.getContext("2d");
    var contextTemp = canvasTemp.getContext("2d");
    ////实践表明在不设施fillStyle下的默认fillStyle=black
    //context.fillRect(0, 0, 100, 100);
    ////实践表明在不设施strokeStyle下的默认strokeStyle=black
    //context.strokeRect(120, 0, 100, 100);

    ////设置纯色
    //context.fillStyle = "red";
    //context.strokeStyle = "blue";
    //context.fillRect(0, 120, 100, 100);
    //context.strokeRect(120, 120, 100, 100);

    ////设置透明度实践证明透明度值>0,<1值越低，越透明，值>=1时为纯色，值<=0时为完全透明
    //context.fillStyle = "rgba(255,0,0,0.2)";
    //context.strokeStyle = "rgba(255,0,0,0.2)";
    //context.fillRect(240, 0, 100, 100);
    //context.strokeRect(240, 120, 100, 100);

    $("#toolContainer").on('click', '.tool-item', function () {
        $(this).addClass('checked').siblings().removeClass('checked');
    });

    $("#canvasContent").contextmenu(function () {
        $("#toolContainer .tool-item").removeClass('checked');
        return false;
    });

    $canvas.mousedown(function (e) {
        if ($("#toolContainer .tool-item.checked").length <= 0)
            return false;

        var $checkedTool = $("#toolContainer .tool-item.checked");

        var startX = e.pageX - $(this).offset().left;
        var startY = e.pageY - $(this).offset().top;
     
        $(this).attr({
            'startX': startX,
            'startY': startY,
            'endX': startX,
            'endY': startY,
            'draw-type': $checkedTool.attr('draw-type')
        });


        var drawType = $(this).attr('draw-type');
        if (drawType == 'straight-line' ||//直线
            drawType == 'stroke-frame' ||//空心框
            drawType == 'fill-frame' ||//实体框
            drawType == 'stroke-circle' ||//空心圆
            drawType == 'fill-circle'//实体圆
            )
        {
            $("#canvasTemp").show();
        }

    }).mousemove(function (e) {
        var drawType = $(this).attr('draw-type');
        var startX = $(this).attr('startX');
        var startY = $(this).attr('startY');

        var endX = e.pageX - $(this).offset().left;
        var endY = e.pageY - $(this).offset().top;

        if (drawType == 'line') {  //普通线，
            context.moveTo(startX, startY);//第一个起点
            context.lineTo(endX, endY);//第二个点
            context.lineWidth = 3;
            context.strokeStyle = 'red';
            context.stroke();

            ////开始一个新的绘制路径
            //context.beginPath();
            ////设置弧线的颜色为蓝色
            //context.strokeStyle = "blue";
            //context.fillStyle = "blue";
            ////沿着坐标点(100,100)为圆心、半径为50px的圆的顺时针方向绘制弧线
            //context.arc(endX, endY,4, 0, 2*Math.PI , false);
            ////按照指定的路径绘制弧线
            //context.stroke();
            //context.fill();
            $(this).attr({
                'startX': endX,
                'startY': endY
            });
        }
        else if (drawType == 'straight-line') { //直线
            
        }
        return false;
    }).mouseup(function (e) {
        $(this).removeAttr('draw-type');
    });


    $("#canvasTemp").mousemove(function (e) {

        clearCanvasTemp();
        var drawType = $canvas.attr('draw-type');
        var startX = $canvas.attr('startX');
        var startY = $canvas.attr('startY');

        var endX = e.pageX - $canvas.offset().left;
        var endY = e.pageY - $canvas.offset().top;

        if (drawType == 'straight-line') { //直线
            contextTemp.moveTo(startX, startY);//第一个起点
            contextTemp.lineTo(endX, endY);//第二个点
            contextTemp.lineWidth = 3;
            contextTemp.strokeStyle = 'red';
            contextTemp.stroke();
        }
        else if (drawType == 'stroke-frame')//空心框
        {
            contextTemp.strokeStyle="red";  //边框颜色
            contextTemp.linewidth = 3;  //边框宽
            var w = Math.abs(startX - endX);
            var y = Math.abs(startY - endY);
            contextTemp.strokeRect(startX, startY, w, y);  //填充边框 x y坐标 宽 高
        }
        else if (drawType == 'fill-frame')//实体框
        {
            contextTemp.fillStyle = "red";  //填充的颜色
            contextTemp.strokeStyle = "red";  //边框颜色
            contextTemp.linewidth = 3;  //边框宽
            var w = Math.abs(startX - endX);
            var y = Math.abs(startY - endY);
            contextTemp.fillRect(startX, startY, w, y);  //填充颜色 x y坐标 宽 高
            contextTemp.strokeRect(startX, startY, w, y);  //填充边框 x y坐标 宽 高
        }
        else if (drawType == 'stroke-circle')//空心圆
        {
            var w = Math.abs(startX - endX);
            var y = Math.abs(startY - endY);

            contextTemp.beginPath();
            contextTemp.fillStyle = "red";  //填充的颜色
            contextTemp.strokeStyle = "red";  //边框颜色
            contextTemp.linewidth = 3;  //边框宽
            EllipseOne(contextTemp, (parseFloat(startX) + parseFloat(endX)) / 2, (parseFloat(startY) + parseFloat(endY)) / 2, w / 2, y / 2);
            
        }
        else if (drawType == 'fill-circle')//实体圆
        {
            var w = Math.abs(startX - endX);
            var y = Math.abs(startY - endY);
            contextTemp.beginPath();
            contextTemp.fillStyle = "red";  //填充的颜色
            contextTemp.strokeStyle = "red";  //边框颜色
            contextTemp.linewidth = 3;  //边框宽
            EllipseOne(contextTemp, (parseFloat(startX) + parseFloat(endX)) / 2, (parseFloat(startY) + parseFloat(endY)) / 2, w / 2, y / 2);

            contextTemp.fill();
        }

        $canvas.attr({
            'endX': endX,
            'endY': endY
        });
        return false;
    }).mouseup(function (e) {
        var startX = $canvas.attr('startX');
        var startY = $canvas.attr('startY');
        var endX = $canvas.attr('endX');
        var endY = $canvas.attr('endY');
        var drawType = $canvas.attr('draw-type');

        if (drawType == 'straight-line') { //直线
            context.moveTo(startX, startY);//第一个起点
            context.lineTo(endX, endY);//第二个点
            context.lineWidth = 3;
            context.strokeStyle = 'red';
            context.stroke();
        }
        else if (drawType == 'stroke-frame')//空心框
        {
            context.fillStyle = "red";  //填充的颜色
            context.strokeStyle = "red";  //边框颜色
            context.linewidth = 3;  //边框宽
            var w = Math.abs(startX - endX);
            var y = Math.abs(startY - endY);
            context.strokeRect(startX, startY, w, y);  //填充边框 x y坐标 宽 高
        }
        else if (drawType == 'fill-frame')//实体框
        {
            context.fillStyle = "red";  //填充的颜色
            context.strokeStyle = "red";  //边框颜色
            context.linewidth = 3;  //边框宽
            var w = Math.abs(startX - endX);
            var y = Math.abs(startY - endY);
            context.fillRect(startX, startY, w, y);  //填充颜色 x y坐标 宽 高
            context.strokeRect(startX, startY, w, y);  //填充边框 x y坐标 宽 高
        }
        else if (drawType == 'stroke-circle')//空心圆
        {

            context.beginPath();
            context.fillStyle = "red";  //填充的颜色
            context.strokeStyle = "red";  //边框颜色
            context.linewidth = 3;  //边框宽

            var w = Math.abs(startX - endX);
            var y = Math.abs(startY - endY);
            EllipseOne(context, (parseFloat(startX) + parseFloat(endX)) / 2, (parseFloat(startY) + parseFloat(endY)) / 2, w / 2, y / 2);
        }
        else if (drawType == 'fill-circle')//实体圆
        {
            context.beginPath();
           /// context.fillStyle = "red";  //填充的颜色
            context.fillStyle = "rgba(153,153,153,0.5)";  //填充的颜色
            context.strokeStyle = "red";  //边框颜色
            context.linewidth = 3;  //边框宽

            var w = Math.abs(startX - endX);
            var y = Math.abs(startY - endY);
            EllipseOne(context, (parseFloat(startX) + parseFloat(endX)) / 2, (parseFloat(startY) + parseFloat(endY)) / 2, w / 2, y / 2);

            context.fill();
        }

        clearCanvasTemp();

        $("#canvasTemp").hide();
        $(this).removeAttr('draw-type');

    });

    //在新窗口打开图片
    $("#btnSaveImage").click(function () {
        var url = canvas.toDataURL("image/png");
        var w = window.open('about:blank', 'image from canvas');
        w.document.write("<img src='" + url + "' alt='from canvas'/>");
        return false;
    });


    //下载图片 本地
    $("#btnSaveImageTolocal").click(function () {
        var url = canvas.toDataURL("image/png");

      //  var url = url.replace("image/png", "image/octet-stream");
        //$("<a href='" + url + "' target='_blank'></a>").click();;
        saveFile(url,'asd.png');
        ;//window.open(url); // it will save locally
        return false;
    });

    //保存标注
    $("#btnSaveMark").click(function () {
        var url = canvas.toDataURL("image/png");
        $("#tempArea").val(url);
    });

    //加载标注
    $("#btnLoadMark").click(function () {
        var url = $("#tempArea").val();
        context.drawImage($("<img src='"+url+"'/>")[0],0,0);
    });

    //清空画布
    $("#btnCanvasClear").click(function () {
        context.beginPath();
        context.clearRect(0, 0, $canvas.width(), $canvas.height());
        context.beginPath();

    });
     function saveFile(data, filename) {
        var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
        save_link.href = data;
        save_link.download = filename;

        var event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        save_link.dispatchEvent(event);
    };


    function clearCanvasTemp()
    {
        contextTemp.beginPath();
        contextTemp.clearRect(0, 0, $canvasTemp.width(), $canvasTemp.height());// 清空画布
        contextTemp.beginPath();
    }

    //画椭圆
    function EllipseOne(can_context, x, y, a, b) {
        var step = (a > b) ? 1 / a : 1 / b;
        can_context.moveTo(x + a, y);
        for (var i = 0; i < 2 * Math.PI; i += step) {
            can_context.lineTo(x + a * Math.cos(i), y + b * Math.sin(i));
        }
        can_context.closePath();
        can_context.stroke();
    }

    window.a = function () {
        EllipseOne(context,200,200,100,200);
    }
})();