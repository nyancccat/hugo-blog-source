/* 站点运行时间 */

function runtime() {
    window.setTimeout(runtime, 1000);

    /* 请修改这里的起始时间 */
    let startTime = new Date('07/27/2009 20:49:04');
    let endTime = new Date();
    let usedTime = endTime - startTime;
    let days = Math.floor(usedTime / (24 * 3600 * 1000));
    let leavel = usedTime % (24 * 3600 * 1000);
    let hours = Math.floor(leavel / (3600 * 1000));
    let leavel2 = leavel % (3600 * 1000);
    let minutes = Math.floor(leavel2 / (60 * 1000));
    let leavel3 = leavel2 % (60 * 1000);
    let seconds = Math.floor(leavel3 / (1000));
    let runbox = document.getElementById('run-time');
    runbox.innerHTML = '<i class="far fa-clock fa-fw"></i> 本站已运行了 '
        + ((days < 10) ? '0' : '') + days + ' 天 '
        + ((hours < 10) ? '0' : '') + hours + ' 时 '
        + ((minutes < 10) ? '0' : '') + minutes + ' 分 '
        + ((seconds < 10) ? '0' : '') + seconds + ' 秒 ';
}
runtime();



/**
 * Ribbons Class File.
 * Creates low-poly ribbons background effect inside a target container.
 */

(function (name, factory) {
    if (typeof window === "object") {
        window[name] = factory();
    }
})
    ("Ribbons", function () {
        var _w = window, _b = document.body, _d = document.documentElement;

        //随机函数
        var random = function () {
            if (arguments.length === 1) {
                if (Array.isArray(arguments[0])) {
                    var index = Math.round(random(0, arguments[0].length - 1));
                    return arguments[0][index];
                }
                return random(0, arguments[0]);
            } else
                if (arguments.length === 2) {
                    return Math.random() * (arguments[1] - arguments[0]) + arguments[0];
                }
            return 0;
        };

        //屏幕信息
        var screenInfo = function (e) {
            var width = Math.max(0, _w.innerWidth || _d.clientWidth || _b.clientWidth || 0),
                height = Math.max(0, _w.innerHeight || _d.clientHeight || _b.clientHeight || 0),
                scrollx = Math.max(0, _w.pageXOffset || _d.scrollLeft || _b.scrollLeft || 0) - (_d.clientLeft || 0),
                scrolly = Math.max(0, _w.pageYOffset || _d.scrollTop || _b.scrollTop || 0) - (_d.clientTop || 0);
            return {
                width: width,
                height: height,
                ratio: width / height,
                centerx: width / 2,
                centery: height / 2,
                scrollx: scrollx,
                scrolly: scrolly
            };
        };

        var mouseInfo = function (e) {
            var screen = screenInfo(e),
                mousex = e ? Math.max(0, e.pageX || e.clientX || 0) : 0,
                mousey = e ? Math.max(0, e.pageY || e.clientY || 0) : 0;

            return {
                mousex: mousex,
                mousey: mousey,
                centerx: mousex - screen.width / 2,
                centery: mousey - screen.height / 2
            };
        };

        //点
        var Point = function (x, y) {
            this.x = 0;
            this.y = 0;
            this.set(x, y);
        };
        //点运算
        Point.prototype = {
            constructor: Point,
            set: function (x, y) {
                this.x = x || 0; this.y = y || 0;
            },
            copy: function (point) {
                this.x = point.x || 0; this.y = point.y || 0; return this;
            },
            multiply: function (x, y) {
                this.x *= x || 1; this.y *= y || 1; return this;
            },
            divide: function (x, y) {
                this.x /= x || 1; this.y /= y || 1; return this;
            },
            add: function (x, y) {
                this.x += x || 0; this.y += y || 0; return this;
            },
            subtract: function (x, y) {
                this.x -= x || 0; this.y -= y || 0; return this;
            },
            clampX: function (min, max) {
                this.x = Math.max(min, Math.min(this.x, max)); return this;
            },
            clampY: function (min, max) {
                this.y = Math.max(min, Math.min(this.y, max)); return this;
            },
            flipX: function () {
                this.x *= -1; return this;
            },
            flipY: function () {
                this.y *= -1; return this;
            }
        };

        //丝带画板
        var Factory = function (options) {
            this._canvas = null;
            this._context = null;
            this._sto = null;
            this._width = 0;
            this._height = 0;
            this._scroll = 0;
            this._ribbons = [];
            this._options = {
                id: "bgCanvas",//画板Id
                // backgroundColor: "#1f1f1f",//画板背景
                colorSaturation: "70%",//纯度
                colorBrightness: "60%",//亮度
                colorAlpha: 0.6,//透明度
                colorCycleSpeed: 6,//丝带不同块之间的色彩变化量
                verticalPosition: "center",//丝带相对于屏幕的初始位置：top/min 屏幕最上方，middle|center 中间，bottom|max 屏幕最下面
                horizontalSpeed: 200,//丝带水平方向移动速度参数（会乘以一个随机值）
                ribbonCount: 3,//同一时间丝带总条数
                strokeSize: 0,//公共边路径样式
                parallaxAmount: -0.5,//滚动偏移参数，-1表示不偏移，0表示基于丝带只出现在页面最上面
                animateSections: true//丝带块是否偏移，显得有动感
            };
            this._onDraw = this._onDraw.bind(this);
            this._onResize = this._onResize.bind(this);
            this._onScroll = this._onScroll.bind(this);
            this.setOptions(options);
            this.init();
        };
        Factory.prototype = {
            constructor: Factory,
            setOptions: function (options) {
                if (typeof options === "object") {
                    for (var key in options) {
                        if (options.hasOwnProperty(key)) {
                            this._options[key] = options[key];
                        }
                    }
                }
            },
            //初始化
            init: function () {
                //初始化画板
                try {
                    this._canvas = document.createElement("canvas");
                    this._canvas.style["display"] = "block";
                    this._canvas.style["position"] = "fixed";
                    this._canvas.style["margin"] = "0";
                    this._canvas.style["padding"] = "0";
                    this._canvas.style["border"] = "0";
                    this._canvas.style["outline"] = "0";
                    this._canvas.style["left"] = "0";
                    this._canvas.style["top"] = "0";
                    this._canvas.style["width"] = "100%";
                    this._canvas.style["height"] = "100%";
                    this._canvas.style["z-index"] = "-1";
                    this._canvas.style["background-color"] = this._options.backgroundColor;
                    this._canvas.id = this._options.id;
                    this._onResize();
                    this._context = this._canvas.getContext("2d");
                    this._context.clearRect(0, 0, this._width, this._height);
                    this._context.globalAlpha = this._options.colorAlpha;
                    window.addEventListener("resize", this._onResize);
                    window.addEventListener("scroll", this._onScroll);
                    document.body.appendChild(this._canvas);
                }
                catch (e) {
                    console.warn("Canvas Context Error: " + e.toString());
                    return;
                }
                //开始绘画
                this._onDraw();
            },
            //生成一条丝带
            addRibbon: function () {
                var dir = Math.round(random(1, 9)) > 5 ? "right" : "left",//丝带延伸方向
                    stop = 1000,
                    hide = 200,
                    min = 0 - hide,
                    max = this._width + hide,
                    movex = 0,
                    movey = 0,
                    startx = dir === "right" ? min : max,//起始点x左边
                    starty = Math.round(random(0, this._height));//起始点y左边

                //丝带生成的位置
                if (/^(top|min)$/i.test(this._options.verticalPosition)) {//最上方
                    starty = 0 + hide;
                } else if (/^(middle|center)$/i.test(this._options.verticalPosition)) {//中间
                    starty = this._height / 2;
                } else if (/^(bottom|max)$/i.test(this._options.verticalPosition)) {//最下方
                    starty = this._height - hide;
                }

                if (this._options.parallaxAmount !== 0) {
                    starty += this._scroll;//加上滚动
                }

                var ribbon = [],
                    point1 = new Point(startx, starty),
                    point2 = new Point(startx, starty),
                    point3 = null,
                    color = Math.round(random(0, 360)),
                    delay = 0;

                //从起始位置开始生成一条丝带
                //丝带每个分部都是一个三角形，三点确定一个三角形，相邻三角形有一条公共边
                while (true) {
                    if (stop <= 0) break;
                    stop--;
                    movex = Math.round((Math.random() * 1 - 0.2) * this._options.horizontalSpeed);
                    movey = Math.round((Math.random() * 1 - 0.5) * (this._height * 0.25));
                    point3 = new Point();
                    point3.copy(point2);
                    if (dir === "right") {
                        point3.add(movex, movey);
                        if (point2.x >= max) break;
                    } else if (dir === "left") {
                        point3.subtract(movex, movey);
                        if (point2.x <= min) break;
                    }
                    ribbon.push({
                        //三点
                        point1: new Point(point1.x, point1.y),
                        point2: new Point(point2.x, point2.y),
                        point3: point3,
                        color: color,//丝带颜色
                        delay: delay,//延迟消失
                        dir: dir,//方向
                        alpha: 0,//透明度
                        phase: 0 //随机位移有关参数
                    });
                    //公共边
                    point1.copy(point2);
                    point2.copy(point3);
                    delay += 4;
                    color += this._options.colorCycleSpeed;
                }
                this._ribbons.push(ribbon);
            },
            //绘制一个三角形方块
            _drawRibbonSection: function (section) {
                if (section) {
                    if (section.phase >= 1 && section.alpha <= 0) {
                        return true;
                    }
                    if (section.delay <= 0) {
                        section.phase += 0.02;
                        section.alpha = Math.sin(section.phase) * 1;
                        section.alpha = section.alpha <= 0 ? 0 : section.alpha;
                        section.alpha = section.alpha >= 1 ? 1 : section.alpha;
                        if (this._options.animateSections) {
                            var mod = Math.sin(1 + section.phase * Math.PI / 2) * 0.1;
                            if (section.dir === "right") {
                                section.point1.add(mod, 0);
                                section.point2.add(mod, 0);
                                section.point3.add(mod, 0);
                            } else {
                                section.point1.subtract(mod, 0);
                                section.point2.subtract(mod, 0);
                                section.point3.subtract(mod, 0);
                            }
                            section.point1.add(0, mod);
                            section.point2.add(0, mod);
                            section.point3.add(0, mod);
                        }
                    } else {
                        section.delay -= 0.5;
                    }
                    var s = this._options.colorSaturation,
                        l = this._options.colorBrightness,
                        c = "hsla(" + section.color + ", " + s + ", " + l + ", " + section.alpha + " )";

                    //绘制一个方块
                    this._context.save();
                    if (this._options.parallaxAmount !== 0) {
                        this._context.translate(0, this._scroll * this._options.parallaxAmount);
                    }
                    this._context.beginPath();
                    this._context.moveTo(section.point1.x, section.point1.y);
                    this._context.lineTo(section.point2.x, section.point2.y);
                    this._context.lineTo(section.point3.x, section.point3.y);
                    this._context.fillStyle = c;
                    this._context.fill();
                    if (this._options.strokeSize > 0) {
                        this._context.lineWidth = this._options.strokeSize;
                        this._context.strokeStyle = c;
                        this._context.lineCap = "round";
                        this._context.stroke();
                    }
                    this._context.restore();
                }
                return false;
            },
            //绘制丝带
            _onDraw: function () {
                //清空已经绘制过的丝带
                for (var i = 0, t = this._ribbons.length; i < t; ++i) {
                    if (!this._ribbons[i]) {
                        this._ribbons.splice(i, 1);
                    }
                }
                this._context.clearRect(0, 0, this._width, this._height);//清空画板
                for (var a = 0; a < this._ribbons.length; ++a) {
                    var ribbon = this._ribbons[a],
                        numSections = ribbon ? ribbon.length : 0,
                        numDone = 0;

                    //绘制整条丝带
                    for (var b = 0; b < numSections; ++b) {
                        if (this._drawRibbonSection(ribbon[b])) {
                            numDone++;
                        }
                    }
                    //丝带已经全部飘过屏幕，设置为null,函数前面会自动清理
                    if (numDone >= numSections) {
                        this._ribbons[a] = null;
                    }
                }
                //随机生成一条丝带
                if (this._ribbons.length < this._options.ribbonCount && Math.random() > 0.99) {
                    this.addRibbon();
                }

                //调度交给系统，当需要刷新画板时调用指定的回调函数，用于提高性能
                requestAnimationFrame(this._onDraw);
            },
            //重新设置窗体大小时需要获取窗体大小
            _onResize: function (e) {
                var screen = screenInfo(e);
                this._width = screen.width;
                this._height = screen.height;
                if (this._canvas) {
                    this._canvas.width = this._width;
                    this._canvas.height = this._height;
                    if (this._context) {
                        this._context.globalAlpha = this._options.colorAlpha;
                    }
                }
            },
            //滚动时获取滚动距离
            _onScroll: function (e) {
                var screen = screenInfo(e);
                this._scroll = screen.scrolly;
            }
        }; return Factory;
    });

//初始化并绘制
new Ribbons({
    ribbonCount: 5,
    parallaxAmount: -0.99
});

// L2D
L2Dwidget.init({
    model: {
        scale: 1,
        hHeadPos: 0.5,
        vHeadPos: 0.618,
        jsonPath: 'https://unpkg.com/live2d-widget-model-hijiki@1.0.5/assets/hijiki.model.json',       // xxx.model.json 的路径,换人物修改这个
    },
    display: {
        superSample: 1,     // 超采样等级
        width: 180,         // canvas的宽度
        height: 390,        // canvas的高度
        position: 'left',   // 显示位置：左或右
        hOffset: 100,         // canvas水平偏移
        vOffset: -60,         // canvas垂直偏移
    },
    mobile: {
        show: false,         // 是否在移动设备上显示
        scale: 1,           // 移动设备上的缩放
        motion: true,       // 移动设备是否开启重力感应
    },
    react: {
        opacityDefault: 1,  // 默认透明度
        opacityOnHover: 1,  // 鼠标移上透明度
    },
});

// 点击特效
function clickEffect() {
    let balls = [];
    let longPressed = false;
    let longPress;
    let multiplier = 0;
    let width, height;
    let origin;
    let normal;
    let ctx;
    const colours = ["#F73859", "#14FFEC", "#00E0FF", "#FF99FE", "#FAF15D"];
    const canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    canvas.setAttribute("style", "width: 100%; height: 100%; top: 0; left: 0; z-index: 99999; position: fixed; pointer-events: none;");
    const pointer = document.createElement("span");
    pointer.classList.add("pointer");
    document.body.appendChild(pointer);

    if (canvas.getContext && window.addEventListener) {
        ctx = canvas.getContext("2d");
        updateSize();
        window.addEventListener('resize', updateSize, false);
        loop();
        window.addEventListener("mousedown", function (e) {
            pushBalls(randBetween(10, 20), e.clientX, e.clientY);
            document.body.classList.add("is-pressed");
            longPress = setTimeout(function () {
                document.body.classList.add("is-longpress");
                longPressed = true;
            }, 500);
        }, false);
        window.addEventListener("mouseup", function (e) {
            clearInterval(longPress);
            if (longPressed == true) {
                document.body.classList.remove("is-longpress");
                pushBalls(randBetween(50 + Math.ceil(multiplier), 100 + Math.ceil(multiplier)), e.clientX, e.clientY);
                longPressed = false;
            }
            document.body.classList.remove("is-pressed");
        }, false);
        window.addEventListener("mousemove", function (e) {
            let x = e.clientX;
            let y = e.clientY;
            pointer.style.top = y + "px";
            pointer.style.left = x + "px";
        }, false);
    } else {
        console.log("canvas or addEventListener is unsupported!");
    }


    function updateSize() {
        canvas.width = window.innerWidth * 2;
        canvas.height = window.innerHeight * 2;
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';
        ctx.scale(2, 2);
        width = (canvas.width = window.innerWidth);
        height = (canvas.height = window.innerHeight);
        origin = {
            x: width / 2,
            y: height / 2
        };
        normal = {
            x: width / 2,
            y: height / 2
        };
    }
    class Ball {
        constructor(x = origin.x, y = origin.y) {
            this.x = x;
            this.y = y;
            this.angle = Math.PI * 2 * Math.random();
            if (longPressed == true) {
                this.multiplier = randBetween(14 + multiplier, 15 + multiplier);
            } else {
                this.multiplier = randBetween(6, 12);
            }
            this.vx = (this.multiplier + Math.random() * 0.5) * Math.cos(this.angle);
            this.vy = (this.multiplier + Math.random() * 0.5) * Math.sin(this.angle);
            this.r = randBetween(8, 12) + 3 * Math.random();
            this.color = colours[Math.floor(Math.random() * colours.length)];
        }
        update() {
            this.x += this.vx - normal.x;
            this.y += this.vy - normal.y;
            normal.x = -2 / window.innerWidth * Math.sin(this.angle);
            normal.y = -2 / window.innerHeight * Math.cos(this.angle);
            this.r -= 0.3;
            this.vx *= 0.9;
            this.vy *= 0.9;
        }
    }

    function pushBalls(count = 1, x = origin.x, y = origin.y) {
        for (let i = 0; i < count; i++) {
            balls.push(new Ball(x, y));
        }
    }

    function randBetween(min, max) {
        return Math.floor(Math.random() * max) + min;
    }

    function loop() {
        ctx.fillStyle = "rgba(255, 255, 255, 0)";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < balls.length; i++) {
            let b = balls[i];
            if (b.r < 0) continue;
            ctx.fillStyle = b.color;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2, false);
            ctx.fill();
            b.update();
        }
        if (longPressed == true) {
            multiplier += 0.2;
        } else if (!longPressed && multiplier >= 0) {
            multiplier -= 0.4;
        }
        removeBall();
        requestAnimationFrame(loop);
    }

    function removeBall() {
        for (let i = 0; i < balls.length; i++) {
            let b = balls[i];
            if (b.x + b.r < 0 || b.x - b.r > width || b.y + b.r < 0 || b.y - b.r > height || b.r < 0) {
                balls.splice(i, 1);
            }
        }
    }
}
clickEffect();//调用特效函数
