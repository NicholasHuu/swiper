var imageIndex=0;
var isKeyDown=false;
var scale=1;
var PlayerHelp = {
    MouseDownPos: null,
    touchDownPos:null,
    isKeyDown: false,
    DownFun: function(ev) {
        ev = ev || window.event;
        if (ev.button != 2) {
            PlayerHelp.MouseDownPos = PlayerHelp.mousePosition(ev);
            isKeyDown = true;
            Player.playCount = 0;
            Player.Stop();
            if (Player.isShowBig) {
                Player.ShowBig();
            }

            if (Player.isLoopPlayer) {
               
                Player.loopPlayOne();
            }

            Player.PlayX = $("#aa").position().left;
            Player.PlayY = $("#aa").position().top;

        }
        document.getElementById("tip").style.display = "none";
    },
    mousePosition: function(ev) {
    if (ev.pageX || ev.pageY) {
        return { x: ev.pageX - $("#Stage").position().left, y: ev.pageY - $("#Stage").position().top };
        }
        return { x: ev.clientX - Player.StagePos.left, y: ev.clientY - Player.StagePos.top };
    }
}
var Player = {
    config: null,
    LoadedCount: 0,
    FrameCount: 0,
    imageList: new Array(),
    ResPath: "Res",
    Timer: null,
    StagePos: { left: null, top: null },
    isPlay: null,
    dragSpan: 15,
    PcDragSpan: 5,
    playSpan: 100,
    muTime: 0,
    direction: true,
    playCount: 0,
    InitValue: 0,
    step: 0,
    timeSp: 0,
    t: 0,
    isFirstMouseUp: false,
    isLoopPlayer: false,
    isFull: false,
    isKeyFullChange: false,
    safari: false,
    zoomCount: 0,
    BigImageList: new Array(),
    zoomlv: 1,
    imageWidth: 0,
    imageHeight: 0,
    PlayerWidth: 0,
    PlayerHeight: 0,
    LoadBigCom: false,
    isShowBig: false,
    MaxWidth: 0,
    MaxHeight: 0,
    ZoomIn: 0.8,
    ZoomOut: 1.2,
    loadImageIndex: 0,
    PlayX: 0,
    PlayY: 0,
    currentWidth: 0,
    currentHeight: 0,
    righePlayCount: 0,
    Span: false,
    leftPlayCount: 0,
    IsZoom: false,
    isMove: false,
    isAdjust: false,
    isLoop: false,

    BuilderPlayerTheme: function() {

        this.StagePos = $("#Stage").offset();

        this.imageWidth = Config.width;
        this.imageHeight = Config.height;
        this.MaxWidth = Config.maxwidth;

        this.FrameCount = Config.frameCount;
        this.PlayerWidth = Config.width;
        this.PlayerHeight = Config.height;
        this.MaxHeight = Config.maxheight;


        if (/(iPhone|iPad|iPod)/i.test(navigator.userAgent)) {
            if (/(iPhone)/i.test(navigator.userAgent)) {
                scale = 0.5;
            }
            $("body").height(document.documentElement.clientHeight);
            //this.BuildIosBtn("left", "LeftBtn", "Player.leftPlayOne()");
            this.BuildIosBtn("right", "qrcode", "Player.showewm()");
            this.BuildIosBtn("loopPlayOne", "BeginLoopPlay", "Player.loopPlayOne()");
            this.BuildIosBtn("stopLoop", "StopLoopPlay", "Player.loopPlayOne()");
            this.BuildIosBtn("GlobalOut", "ZoomOut", "Player.ZoomOutOrIn(1)");
            this.BuildIosBtn("GlobalIn", "ZoomIn", "Player.ZoomOutOrIn(-1)");
            this.BuildIosBtn("zoom", "Zoom", "Player.changeIsMove(event)");
            this.BuildIosBtn("spin", "Spin", "Player.changeIsMove(event)");
            speedAdjust.BuildIosSpeedAdjust(550, 350);
            document.body.onorientationchange = Player.OrientChange;
            document.body.ontouchmove = Player.iosMove;
            document.body.ontouchstart = Player.touchDown;
            document.body.ontouchend = Player.touchCancel;
            document.getElementById("tip").style.display = "none";
            document.body.ongesturestart = Player.recoredSize;
            document.body.ongesturechange = Player.zoom;
            document.getElementById("AdjustPoint").ontouchstart = speedAdjust.ss;
            document.getElementById("AdjustPoint").ontouchmove = speedAdjust.touchMove;
            document.getElementById("AdjustBack").ontouchstart = speedAdjust.touchSetPosition;
            document.getElementById("AdjustBack").ontouchend = speedAdjust.canceltouch;
            document.getElementById("AdjustPoint").ontouchend = speedAdjust.canceltouch;
            document.getElementById("loopPlayOne").ontouchend = function() { Player.isLoop = false };
            Player.changeBtnPos();
            $("#Stage").height(document.documentElement.clientHeight);
            $("#Stage").width(document.documentElement.clientWidth);
            speedAdjust.touchSetValue(Config.speed);

        }
        else {
            document.getElementById("tip").style.display = "none";
            var locationHeight = document.documentElement.clientHeight - window.screen.height / 11;
            //  this.BuildDiv("left", "LeftBtn", 250, locationHeight, "Player.leftPlayOne(event)");
             this.BuildDiv("right", "qrcode", 350, locationHeight, "Player.showewm(event)");
            this.BuildDiv("loopPlayOne", "BeginLoopPlay", 400, locationHeight, "Player.loopPlayOne(event)");
            this.BuildDiv("stopLoop", "StopLoopPlay", 400, locationHeight, "Player.loopPlayOne(event)");
            this.BuildDiv("GlobalOut", "ZoomOut", 450, locationHeight, "Player.ZoomOutOrIn(1)");
            this.BuildDiv("GlobalIn", "ZoomIn", 500, locationHeight, "Player.ZoomOutOrIn(-1)");
            this.BuildDiv("zoom", "Zoom", 550, locationHeight, "Player.changeIsMove(event)");
            this.BuildDiv("spin", "Spin", 550, locationHeight, "Player.changeIsMove(event)");
            speedAdjust.BuildIosSpeedAdjust(550, 350);
            document.getElementById("Stage").onmousedown = PlayerHelp.DownFun;
            document.getElementById("Stage").onmousemove = this.Move;
            document.getElementById("Stage").onmouseup = this.MouseUp;
            document.getElementById("Stage").onclick = Player.Stop;
            document.getElementById("speedAdjust").onmousemove = speedAdjust.Move;
            document.getElementById("speedAdjust").onmouseup = speedAdjust.MouseUp;
            Player.changePcBtnPos();
            $("#Stage").height(document.documentElement.clientHeight);
            $("#Stage").width(document.documentElement.clientWidth);
            document.getElementById("AdjustPoint").onmousedown = speedAdjust.SlidePointDown;
            document.getElementById("speedAdjust").onmousemove = speedAdjust.Move;
            document.getElementById("speedAdjust").onmouseup = speedAdjust.MouseUp;
            document.getElementById("AdjustBack").onclick = speedAdjust.SetPosition;
            document.getElementById("AdjustBack").style.cursor = "pointer";
            //speedAdjust.setValue(Config.speed);
        }

        document.getElementById("stopLoop").style.display = "none";
        document.getElementById("spin").style.display = "none";
        document.getElementById("aa").style.left = $("#Stage").width() / 2 - this.imageWidth / 2 + "px";
        document.getElementById("aa").style.top = $("#Stage").height() / 2 - this.imageHeight / 2 + "px";
        document.getElementById("load").style.left = $("#Stage").width() / 2 - 32 / 2 + "px";
        document.getElementById("load").style.top = $("#Stage").height() / 2 - 32 / 2 + "px";
        this.BuildWaterMask();


    },
    BuildWaterMask: function() {
        if (Config.watermask.src != "") {
            var top = Config.watermask.Y + $("#aa").position().top;
            var left = Config.watermask.X + $("#aa").position().left;
            var water = "<div id='mask' style='top:" + top + "px;left:" + left + "px;position:absolute;z-index:3'><img src='" + Config.watermask.src + "'/></div>";
            $("#Stage").append(water);
        }
    },
    changeIsMove: function() {
        if (Player.isMove) {
            Player.isMove = false;
            document.getElementById("zoom").style.display = "block";
            document.getElementById("spin").style.display = "none";
        }
        else {
            Player.isMove = true;
            document.getElementById("zoom").style.display = "none";
            document.getElementById("spin").style.display = "block";
        }
    },
    BuildIosBtn: function(id, imagePath, touchHandle) {
        var DivString = "<div id='" + id + "'style='left:0px;top:0px;position:absolute;cursor:pointer' ontouchstart='" + touchHandle + "' ><img id='loopImg' width='50' height='50' src='Res/Pic/" + imagePath + ".png' /></div>";
        $(".gjt").append(DivString);
    },
    OrientChange: function() {

        $("#Stage").height(document.documentElement.clientHeight);
        $("#Stage").width(document.documentElement.clientWidth);
        Player.changeBtnPos();
		Player.changePcBtnPos();
        document.getElementById("aa").style.left = $("#Stage").width() / 2 - $("#aa").width() / 2 + "px";
        document.getElementById("aa").style.top = $("#Stage").height() / 2 - $("#aa").height() / 2 + "px";
        Player.reSetWaterMask();
    },
    changeBtnPos: function() {
        //Player.setPos("left", 1, 7);
        Player.setPos("right", 5, 5);
        Player.setPos("loopPlayOne", 1, 5);
        Player.setPos("stopLoop", 1, 5);
        Player.setPos("GlobalOut", 2, 5);
        Player.setPos("GlobalIn", 3, 5);
        // Player.setPos("speedAdjust", 6, 7);
        Player.setPos("zoom", 4, 5);
        Player.setPos("spin", 4, 5);
        document.getElementById("speedAdjust").style.top = document.documentElement.clientHeight / 2 - $("#speedAdjust").height() / 2 + "px";
        if (Math.abs(window.orientation) == 90) {
            document.getElementById("speedAdjust").style.left = window.screen.height - $("#speedAdjust").width() - 5 + "px"
        }
        else {
            document.getElementById("speedAdjust").style.left = window.screen.width - $("#speedAdjust").width() + "px"
        }

    },
    changePcBtnPos: function() {
		Player.setPcPos("right", 5, 5);
        Player.setPcPos("loopPlayOne", 1, 5);
        Player.setPcPos("stopLoop", 1, 5);
        Player.setPcPos("GlobalIn", 2, 5);
        Player.setPcPos("GlobalOut", 3, 5);
        Player.setPcPos("zoom", 4, 5);
        Player.setPcPos("spin", 4, 5);
        document.getElementById("speedAdjust").style.top = document.documentElement.clientHeight / 2 - $("#speedAdjust").height() / 2 + "px";
        document.getElementById("speedAdjust").style.left = document.documentElement.clientWidth - $("#speedAdjust").width() - 10 + "px"
    },
    setPcPos: function(id, index, totalBtn) {
        var locationHeight = document.documentElement.clientHeight - window.screen.height / 14;
        var centerPos = document.documentElement.clientWidth / 2;
        var totalWidth = totalBtn * 50 + (totalBtn - 1) * 50;
        document.getElementById(id + "").style.left = centerPos - (totalWidth / 2) + (index - 1) * 50 + (50 * (index - 1)) + "px";
    },
    setPos: function(id, index, totalBtn) {

        var locationHeight = document.documentElement.clientHeight - window.screen.height / 14;
        var centerPos = 0;
        if (Math.abs(window.orientation) == 90) {
            centerPos = window.screen.height / 2;
        }
        else {
            centerPos = window.screen.width / 2;
        }
        if (id == "speedAdjust") {
            document.getElementById(id + "").style.top = document.documentElement.clientHeight / 2 - $("#speedAdjust").height() / 2 + "px";
            document.getElementById(id + "").style.left = document.documentElement.clientWidth - $("#speedAdjust").width() + "px"
        }
        else {
            document.getElementById(id + "").style.top = locationHeight + "px";
        }
        var totalWidth = totalBtn * 50 + (totalBtn - 1) * 50 * scale;
        document.getElementById(id + "").style.left = centerPos - (totalWidth / 2) + (index - 1) * 50 + (50 * scale * (index - 1)) + "px";
    },
    ZoomOutOrIn: function(param) {
        var i = 0;
        Player.Stop();
        if (Player.isLoopPlayer) {
            Player.loopPlayOne();

        }
        Player.zoomlv = 1;
        if (param > 0) {
            Player.zoomCount++;
            Player.isShowBig = true;
        }
        else {
            Player.zoomCount--
        }
        if (Player.zoomCount < 0) {
            Player.zoomCount = 0;
            Player.isShowBig = false;
            Player.zoomlv = 1;
        }

        for (var i = 0; i < Player.zoomCount; i++) {
            Player.zoomlv = Player.zoomlv * Player.ZoomOut;
        }
        //计算缩小


        var imageWidth = Player.zoomlv * Player.imageWidth;
        var imageHeight = Player.zoomlv * Player.imageHeight;

        var ImageX = (Player.PlayerWidth - imageWidth) / 2;

        var ImageY = (Player.PlayerHeight - imageHeight) / 2;

        if (imageWidth > Player.MaxWidth) {
            $("#aa").height(Player.imageHeight * 3);
            $("#aa").width(Player.imageWidth * 3);
            Player.playCount--;

        }
        else {
            if (Player.zoomCount == 0 || Player.isLoopPlayer) {

                Player.ShowSmall();
            }
            else {
                Player.ShowBig();
            }

            $("#aa").height(imageHeight * scale);
            $("#aa").width(imageWidth * scale);
            document.getElementById("aa").style.top = $("#Stage").height() / 2 - $("#aa").height() / 2 + "px";
            document.getElementById("aa").style.left = $("#Stage").width() / 2 - $("#aa").width() / 2 + "px";
        }
        Player.reSetWaterMask();
    },

    ShowBig: function() {
        if (Player.BigImageList[imageIndex + ""] == null) {
            if (!Player.LoadBigCom) {
                Player.LoadBigCom = true;
                var big = new Image()
                big.src = Player.ResPath + "/Big/" + imageIndex + ".jpg";
                Player.loadImageIndex = imageIndex;
                big.onload = function(ev, imageIndex) {
                    $("#aa").attr("src", Player.ResPath + "/Big/" + Player.loadImageIndex + ".jpg");
                    Player.LoadBigCom = false;

                };
                this.BigImageList.push(big);
            }
        }
        else {

            $("#aa").attr("src", Player.ResPath + "/Big/" + imageIndex + ".jpg");
        }
    },
    ShowSmall: function() {
        $("#aa").attr("src", Player.ResPath + "/Small/" + imageIndex + ".jpg");
    },
    OverChangeImg: function(ev, out) {
        ev = ev || window.event;
        ev.srcElement.src = "Res/Pic/" + out + "Near.png";
    },
    KeyChangeFull: function(ev) {

        if (this.safari) {
            //alert(Player.isFull);
            $("#back").height(100);
            $("#back").width(500);
            document.getElementById("Exit").style.display = "none";
            document.getElementById("Full").style.display = "block";

            $("#Stage").height(600);
            $("#Stage").width(800);
            document.getElementById("Stage").style.left = document.documentElement.clientWidth / 2 - 800 / 2 + "px";
            document.getElementById("Stage").style.top = document.documentElement.clientHeight / 2 - 600 / 2 + "px";
            document.getElementById("aa").style.top = ($("#Stage").height() - $("#aa").height()) / 2 + "px";
            document.getElementById("aa").style.left = ($("#Stage").width() - $("#aa").width()) / 2 + "px";
            this.safari = false;
        }
        else {
            this.safari = true;
        }

    },
    ChangeFull: function(ev) {
    },
    BuildToolTip: function() {

    },
    OutChangeImg: function(ev, out) {
        ev = ev || window.event;
        ev.srcElement.src = "Res/Pic/" + out + ".png";
    },

   //IOS事件
    recoredSize: function(ev) {
        Player.IsZoom = true;
        Player.currentHeight = $("#aa").height();
        Player.currentWidth = $("#aa").width();
    },

    cancelZoom: function(ev) {
        Player.IsZoom = false;
    },
    zoom: function(ev) {
        if (Player.IsZoom) {
            $("#aa").height(Player.currentHeight * ev.scale);
            $("#aa").width(Player.currentWidth * ev.scale);

            document.getElementById("aa").style.left = $("#Stage").width() / 2 - $("#aa").width() / 2 + "px";
            document.getElementById("aa").style.top = $("#Stage").height() / 2 - $("#aa").height() / 2 + "px";
            Player.isShowBig = true;
            Player.ShowBig();
            if ($("#aa").width() < Player.imageWidth * scale) {
                $("#aa").width(Player.imageWidth * scale);
                $("#aa").height(Player.imageHeight * scale);

                Player.ShowSmall();
                document.getElementById("aa").style.left = $("#Stage").width() / 2 - $("#aa").width() / 2 + "px";
                document.getElementById("aa").style.top = $("#Stage").height() / 2 - $("#aa").height() / 2 + "px";
                Player.isShowBig = false;
            }
            if ($("#aa").width() > Player.MaxWidth * scale) {
                $("#aa").width(Player.MaxWidth * scale);
                $("#aa").height(Player.MaxHeight * scale);

                document.getElementById("aa").style.left = $("#Stage").width() / 2 - $("#aa").width() / 2 + "px";
                document.getElementById("aa").style.top = $("#Stage").height() / 2 - $("#aa").height() / 2 + "px";
            }
            Player.reSetWaterMask();
        }
        ev.preventDefault();
    },

    reSetWaterMask: function() {
        var top = $("#aa").position().top + Config.watermask.Y < 0 ? 0 : $("#aa").position().top + Config.watermask.Y;
        var left = $("#aa").position().left + Config.watermask.X < 0 ? 0 : $("#aa").position().left + Config.watermask.X;
        document.getElementById("mask").style.top = top + "px";
        document.getElementById("mask").style.left = left + "px";
    },

    iosMove: function(ev) {
        ev.preventDefault();
        if (Player.isAdjust) {
            return;
        }
        if (Player.Span) {

            if (ev.touches.length == 1) {
                var pos = Player.touchPosition(ev);
                if (!Player.isMove) {

                    if ((pos.x - PlayerHelp.touchDownPos.x) > Player.dragSpan) {
                        var spanCount = Math.floor((pos.x - PlayerHelp.touchDownPos.x) / Player.dragSpan);
                        if (spanCount > 10) {
                            spanCount = 10;
                        }
                        for (var i = 0; i < spanCount; i++) {
                            Player.playCount++;
                            imageIndex--;
                            Player.muTime = (new Date()).getTime();
                            if (imageIndex < 0) {
                                imageIndex = Player.FrameCount - 1;
                            }
                            Player.Play();
                        }
                        PlayerHelp.touchDownPos.x = pos.x;

                        Player.direction = true;
                    }
                    if ((pos.x + Player.dragSpan) < PlayerHelp.touchDownPos.x) {
                        var spanCount = Math.floor((PlayerHelp.touchDownPos.x - pos.x) / Player.dragSpan);
                        if (spanCount > 10) {
                            spanCount = 10;
                        }
                        for (var i = 0; i < spanCount; i++) {
                            Player.playCount++;
                            imageIndex++;
                            Player.muTime = new Date().getTime();
                            if (imageIndex > Player.FrameCount - 1) {
                                imageIndex = 0
                            }
                            Player.Play()
                        }
                        PlayerHelp.touchDownPos.x = pos.x;

                        Player.direction = false;
                    }
                }
                else {
                    var x = pos.x - PlayerHelp.touchDownPos.x + Player.PlayX;
                    var y = pos.y - PlayerHelp.touchDownPos.y + Player.PlayY;
                    document.getElementById("aa").style.top = y + "px";
                    document.getElementById("aa").style.left = x + "px";
                    Player.reSetWaterMask();
                }
            }
        }
    },
    touchPosition: function(ev) {
        var touch = ev.touches[0]; // Get the information for finger #1
        return { x: touch.screenX, y: touch.screenY };
    },
    touchDown: function(ev) {

        if (Player.isAdjust) {
            return;
        }
        if (Player.isLoop) {
            return;
        }

        PlayerHelp.touchDownPos = Player.touchPosition(ev);
        Player.Stop();
        if (Player.isLoopPlayer) {
            document.getElementById("loopPlayOne").style.display = "block";
            document.getElementById("stopLoop").style.display = "none";
            Player.isLoopPlayer = false;
        }
        Player.Span = true;
        if (Player.isShowBig) {
            Player.ShowBig();
        }
        if (Player.isMove) {
            Player.PlayX = $("#aa").position().left;
            Player.PlayY = $("#aa").position().top;
        }
    },
    touchCancel: function(ev) {

        Player.t = 0;
        // speedAdjust.MouseUp();
        var time = (new Date()).getTime() - Player.muTime;
        var FrameSpeed = Player.playCount / time > 20 ? 19 : (Player.playCount / time);
        Player.InitValue = 20 - FrameSpeed;

        Player.timeSp = 100 - Player.InitValue;
        Player.step = 0;
        if (Math.abs(time) < 100 && Player.muTime != 0) {

            Player.step = Player.timeSp / 3;
            if (Player.direction) {

                Player.startRightPlay(Player.easeOut(0, Player.InitValue, Player.timeSp, Player.step));

            }
            else {

                Player.startleftPlay(Player.easeOut(0, Player.InitValue, Player.timeSp, Player.step));
            }
        }
        else {
            if (Player.isShowBig) {
                Player.ShowBig();
            }
        }
        Player.Span = false;
    },



    //结束IOS事件



    Move: function(ev) {
		
        ev = ev || window.event;
        Player.isFirstMouseUp = true;
        var pos = PlayerHelp.mousePosition(ev);
        if (isKeyDown) {
            if (!Player.isMove) {
                ev = ev || window.event;
                if (pos.x > PlayerHelp.MouseDownPos.x + 10) {
                    var speedValue = Math.floor(pos.x - PlayerHelp.MouseDownPos.x) / 10;
                    if (speedValue > 10) {
                        speedValue = 10;
                    }
                    for (var i = 0; i < parseInt(speedValue); i++) {
                        Player.playCount++;
                        imageIndex--;
                        Player.direction = true;
                        Player.muTime = (new Date()).getTime();
                        if (imageIndex < 0) {
                            imageIndex = Player.FrameCount - 1;
                        }
                        Player.Play();
                    }
                    PlayerHelp.MouseDownPos.x = pos.x;
                }
                if (pos.x < PlayerHelp.MouseDownPos.x - 10) {
                    var speedValue = Math.floor(PlayerHelp.MouseDownPos.x - pos.x) / 10;
                    for (var i = 0; i < parseInt(speedValue); i++) {
                        Player.playCount++;
                        imageIndex++;
                        Player.muTime = new Date().getTime();
                        Player.direction = false;
                        if (imageIndex > Player.FrameCount - 1) {
                            imageIndex = 0
                        }
                        Player.Play()
                    }
                    PlayerHelp.MouseDownPos.x = pos.x;
                }
            }
            else {

                var x = pos.x - PlayerHelp.MouseDownPos.x + Player.PlayX;
                var y = pos.y - PlayerHelp.MouseDownPos.y + Player.PlayY;

                // var w = Player.imageWidth;
                // var h = Player.imageHeight;

                document.getElementById("aa").style.top = y + "px";
                document.getElementById("aa").style.left = x + "px";
                Player.reSetWaterMask();


            }
        }
        ev = ev || window.event;
        var mPos = PlayerHelp.mousePosition(ev);

        speedAdjust.Move(ev);
        if (mPos.y < 0 || mPos.x < 0 || mPos.y > $("#Stage").height() || mPos.x > $("#Stage").width()) {
            return;
        }
        if (window.navigator.userAgent.indexOf("MSIE") != -1) {
            document.getElementById("tip").style.top = mPos.y - 80 + "px";
        }
        else {
            document.getElementById("tip").style.top = mPos.y - 80 + "px";
        }
        document.getElementById("tip").style.left = mPos.x - 10 + "px";

    },

    MouseUp: function(ev) {


        Player.t = 0;
        speedAdjust.isSlidePress = false;

        isKeyDown = false;
        speedAdjust.MouseUp();
        var time = (new Date()).getTime() - Player.muTime;
        var FrameSpeed = Player.playCount / time > 20 ? 19 : (Player.playCount / time);
        Player.InitValue = 20 - FrameSpeed;

        Player.timeSp = 100 - Player.InitValue;
        Player.step = 0;



        if (Math.abs(time) < 100 && Player.muTime != 0) {

            Player.step = Player.timeSp / 3;
            if (Player.direction) {

                Player.startRightPlay(Player.easeOut(0, Player.InitValue, Player.timeSp, Player.step));

            }
            else {

                Player.startleftPlay(Player.easeOut(0, Player.InitValue, Player.timeSp, Player.step));
            }
        } else {
            if (Player.isShowBig) {
                Player.ShowBig();
            }
        }

    },
    startRightPlay: function(timeSpan) {

        if (imageIndex > 1) {
            imageIndex--;
        } else {
            imageIndex = Player.FrameCount - 1;
        }
        Player.Play();
        var span = Player.easeOut(Player.t++, Player.InitValue, Player.timeSp, Player.step)

        if (Player.t > Player.step) {
            if (Player.isShowBig) {
                Player.ShowBig();
            }
            return;
        }
        Player.Timer = setTimeout("Player.startRightPlay(" + span + ")", span);

    },
    startleftPlay: function(timeSpan) {
        if (imageIndex < Player.FrameCount - 1) {
            imageIndex++;
        } else {
            imageIndex = 0;
        }
        Player.Play();
        var span = Player.easeOut(Player.t++, Player.InitValue, Player.timeSp, Player.step)
        Player.t++;
        if (Player.t > Player.step) {
            if (Player.isShowBig) {
                Player.ShowBig();
            }
            return;
        }
        Player.Timer = setTimeout("Player.startleftPlay(" + span + ")", span);
    },
    easeOut: function(t, b, c, d) {
        return c * (t /= d) * t + b;
    },
    BuildDiv: function(id, imagePath, left, top, clickHandle, over) {
        left = this.StagePos.left + left;
        var DivString = "<div id='" + id + "'style='left:" + left + "px;top:" + top + "px;position:absolute;cursor:pointer' onclick='" + clickHandle + "'><img id='loopImg' width='50' height='50' src='Res/Pic/" + imagePath + ".png'/></div>";
       // $("#web").append(DivString);
	   $(".gjt").append(DivString);
    },
    SetPlayerSize: function() {
        $("#MainPlayer").width(config.player.width);
        $("#MainPlayer").height(config.player.height);
    },
    preLoadImage: function() {
        $("#Stage").bind("click", this.Stop);
        for (var i = 0; i < this.FrameCount; i++) {
            var image = new Image();
            image.src = this.ResPath + "/Small/" + i + ".jpg";
            image.onload = function(i, ii) {
                Player.LoadedCount = Player.LoadedCount + 1;
                $("#te").html(Player.LoadedCount + "");
                if (Player.LoadedCount == Player.FrameCount) {
                    if (Config.loop) {
                        Player.loopPlayOne();
                        Player.isLoop = false;
                    }
                    else {
                        Player.rightPlayOne();
                    }
                    document.getElementById("load").style.display = "none";
                    speedAdjust.setValue(Config.speed);
                }
            }
            this.imageList.push(image);
        }
    },
    Start: function() {
        isPlay = true;
        this.Timer = setInterval("Player.leftPlay()", this.playSpan)
    },
    Play: function() {
        $("#aa").attr("src", this.ResPath + "/Small/" + imageIndex + ".jpg")
        if (!Player.isShowBig) {
            $("#aa").height(Player.imageHeight * scale);
            $("#aa").width(Player.imageWidth * scale);
            document.getElementById("aa").style.top = $("#Stage").height() / 2 - $("#aa").height() / 2 + "px";
            document.getElementById("aa").style.left = $("#Stage").width() / 2 - $("#aa").width() / 2 + "px";
        }
    },
    leftPlay: function() {
        imageIndex--;
        if (imageIndex < 0) {
            imageIndex = Player.FrameCount - 1;
        }
        if (imageIndex == 0) {
            this.Stop();
            this.Play();
            return;
        }
        this.Play();
        Player.Timer = setTimeout("Player.leftPlay()", Player.playSpan);
    },
    rightPlay: function() {
        imageIndex++;
        if (imageIndex > Player.FrameCount - 1) {
            imageIndex = 0
        }
        this.Play();
        if (imageIndex == 0) {
            this.Stop();
            return;
        }
        Player.Timer = setTimeout("Player.rightPlay()", Player.playSpan);
    },
    Stop: function() {
        if (this.Timer != 0) {
            clearInterval(this.Timer);
            this.Timer = 0;
        }
    },
    loopPlay: function() {
        imageIndex++;
        if (imageIndex > Player.FrameCount-1) {
            imageIndex = 0;
        }

        this.Play();

        Player.Timer = setTimeout("Player.loopPlay()", Player.playSpan);
    },
    leftPlayOne: function() {
        Player.Stop();
        Player.leftPlay()
    },
    rightPlayOne: function() {
        Player.Stop();
        Player.rightPlay();
    },
	showewm:function(){
		if($("#erwmimg").hasClass("showout"))
			{$("#erwmimg").removeClass("showout").hide();$(".erwm").hide()}
		else
			{$("#erwmimg").addClass("showout").show();$(".erwm").show()}
	},
    loopPlayOne: function() {
        if (Player.isLoopPlayer) {
            Player.Stop();
            Player.isLoopPlayer = false;
            document.getElementById("loopPlayOne").style.display = "block";
            document.getElementById("stopLoop").style.display = "none";
            if (Player.isShowBig) {
                Player.ShowBig();
            }
        } else {
            Player.isLoop = true;
            Player.Stop();
            Player.loopPlay();
            Player.isLoopPlayer = true;
            document.getElementById("loopPlayOne").style.display = "none";
            document.getElementById("stopLoop").style.display = "block";

        }
    },

    changeLoopPlayImg: function() {

    }
}


var speedAdjust = {
    isSlidePress: false,
    BuildSpeedAdjust: function(top, left) {
        left = Player.StagePos.left + left;
        top = document.documentElement.clientHeight - window.screen.height / 11 - 65;
        var speed = "<div id='speedAdjust' style='position:absolute;height:263px;top:" + top + "px;left:0px;width:41px'><img id='adjustTip' src='Res/Pic/AdjustTip.png' style='position:absolute;top:0px;left:0px' /><img src='Res/Pic/AdjustBack.png' style='position:absolute;top:0px;left:26px;' id='AdjustBack' /><img src='Res/Pic/AdjustPoint.png' style='position:absolute;top:0px;left:22px;cursor:pointer'  id='AdjustPoint'/></div>";
        $("#web").append(speed);
    },
    BuildIosSpeedAdjust: function(top, left) {
        left = Player.StagePos.left + left;
        top = document.documentElement.clientHeight - window.screen.height / 11 - 65;
        var speed = "<div id='speedAdjust' style='position:absolute;height:263px;top:" + top + "px;left:0px;width:41px'><img id='adjustTip' src='Res/Pic/AdjustTip.png' style='position:absolute;top:0px;left:0px' /><img src='Res/Pic/AdjustBack.png' style='position:absolute;top:0px;left:26px;' id='AdjustBack' /><img src='Res/Pic/AdjustPoint.png' style='position:absolute;top:0px;left:22px;cursor:pointer'  id='AdjustPoint'/></div>";
        $("#web").append(speed);
    },
    ss: function() {
        Player.isAdjust = true;
    },
    BuildIsoSpeed: function() {

    },
    //
    touchMove: function(ev) {

        var pos = speedAdjust.touchPosition(ev);
        //if(currentPoint.top>=$(SlideFill).position.top+$(SlideFill).height()||current.)
        var value = pos.y * ((1000 - 20) / ($("#AdjustBack").height() - 19));
        if (value < 0) {
            return;
        }
        else if (value > 963) {
            return;
        }
        speedAdjust.touchSetValue(value);
    },
    touchSetValue: function(speedValue) {
        var Slide = document.getElementById("Adjustback");
        var point = document.getElementById("AdjustPoint")
        if (speedValue < 20) {
            speedValue = 20
        }
        if (speedValue > 963) {
            speedValue = 963
        }

        //alert($("#Slide_back").height());
        var height = speedValue / ((1000 - 20) / ($("#AdjustBack").height() - 19)) - 10;
       



        point.style.top = height + "px";
        
        Player.playSpan = speedValue;
    },
    touchSetPosition: function(ev) {
        var currentPoint = speedAdjust.touchPosition(ev);
        var value = currentPoint.y * ((1000 - 20) / ($("#AdjustBack").height() - 19));
        if (value < 0) {
            return;
        }
        else if (value > 900) {
            return;
        }
        speedAdjust.touchSetValue(value);
    },
    canceltouch: function(ev) {

        Player.isAdjust = false;
    },
    //
    ShowSpeedAdjust: function() {
        if (document.getElementById("Slide_back").style.display == "none") {
            document.getElementById("Slide_back").style.display = "block";
            document.getElementById("Slide").style.display = "block";
            document.getElementById("point").style.display = "block";
        } else {
            document.getElementById("Slide_back").style.display = "none";
            document.getElementById("Slide").style.display = "none";
            document.getElementById("point").style.display = "none";
        }
    },
    HideSpeedAdjust: function() {
        document.getElementById("Slide_back").style.display = "none";
        document.getElementById("Slide").style.display = "none";
        document.getElementById("point").style.display = "none";
    },
    SlidePointDown: function() {
        speedAdjust.isSlidePress = true;
    },
    ScrollPoint: function(ev) {
    },
    Move: function(ev) {
        if (speedAdjust.isSlidePress) {
            speedAdjust.SetPosition(ev);
        }
    },
    SetPosition: function(ev) {
        ev = ev || window.event;
        var Slide = document.getElementById("AdjustBack");
        var SlideFill = document.getElementById("Slide");
        var point = document.getElementById("AdjustPoint")
        var currentPoint = speedAdjust.mousePosition(ev);
        var value = currentPoint.y * ((1000 - 20) / $("#AdjustBack").height());
        if (value < 0) {
            return;
        }
        else if (value > 900) {
            return;
        }
        speedAdjust.setValue(value);
    },
    MouseUp: function() {
        speedAdjust.isSlidePress = false;
    },
    setValue: function(speedValue) {
        var Slide = document.getElementById("AdjustBack");
        var point = document.getElementById("AdjustPoint")
        if (speedValue < 20) {
            speedValue = 20
        }
        if (speedValue > 963) {
            speedValue = 963
        }
        //alert($("#Slide_back").height());
        var height = speedValue / ((1000 - 20) / $("#AdjustBack").height()) - 10;


        // SlideFill.style.top = $("#AdjustBack").height() + $("#Slide_back").position().top - $("#Slide").height() + "px";
        //alert(SlideFill.style.top)
        point.style.top = height + "px";
        Player.playSpan = speedValue;

    },
    mousePosition: function(ev) {
        ev = ev || window.event;
        if (ev.pageX || ev.pageY) {
            return { x: ev.pageX - $("#speedAdjust").offset().left, y: ev.pageY - $("#speedAdjust").offset().top };
        }
        return { x: ev.clientX - $("#speedAdjust").offset().left, y: ev.clientY - $("#speedAdjust").offset().top };
    },
    touchPosition: function(ev) {
        var touch = ev.touches[0]; // Get the information for finger #1
        return { x: touch.clientX - $("#speedAdjust").offset().left, y: touch.clientY - $("#speedAdjust").offset().top };
    }
}