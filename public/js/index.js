$(function () {
    initTheme();// 主题 初始化 
    initLoginState();// 初始化登录状态
    changeNacStyle();// nav顶部导航栏跳转动画
    scrollStyle();// 视图滚动组件的动画
    initSwiper("", 3000, 400);// ct2初始化轮播图
    toDetailPage();// 点击跳转详情页
    initClockTime(); // 时钟初始化

    // 点击跳转详情页
    function toDetailPage() {
        $('.letters .cols img').click(function () {
            let i = $(this).parents(".cols").attr("data-index")
            location.href = `./src/aticledetail${parseInt(i) + 1}.html`
        })
    }

    /**
     *  ct2初始化轮播图
     * @dataList 轮播图数据[{articleId,title,imgUrl,msg}]
     * @delay 自动播放延迟
     * @sliceDelay 单词滑动动画时间/ms
     * **/
    function initSwiper(dataList, delay = 3000, sliceDelay = 500) {
        let currentInde = 0;
        const letters = $('.content2 .letters');
        const dots = $('.content2 .dots');
        let timer = "";
        let animteTimer = "";
        let data = [
            {
                articleId: 0,
                title: "Javascript",
                imgUrl: "./public/image/img/article/javascript.png",
                msg: "JavaScript 是属于 HTML 和 Web 的编程语言，涵盖 JavaScript 基础和高级教程。"
            },
            {
                articleId: 1,
                title: "Axios 学习",
                imgUrl: "./public/image/img/article//axios.png",
                msg: "Axios 是一个基于 promise 的网络请求库，可以用于浏览器和 node.js"
            },
            {
                articleId: 2,
                title: "Vue3.0 学习",
                imgUrl: "./public/image/img/article/vue3.png",
                msg: "易学易用，性能出色，通过尽可能简单的 API 实现响应的数据绑定和组合的视图组件。"
            },
            {
                articleId: 3,
                title: "nodejs 学习",
                imgUrl: "./public/image/img/article/nodejs.png",
                msg: "Node.js 是一个基于 Chrome JavaScript 运行时建立的一个平台。"
            }
        ]
        data = dataList || data
        $(data).each((i, p) => {

            letters.append(`
                <div data-index="${p.articleId}" class="col-12 col-sm-6 col-lg-4 p-5 p-sm-3 p-md-3 cols">
                    <div class="cards">
                        <div class="imgbox"><img  draggable="false" class="w-100" src="${p.imgUrl}" alt="">
                        </div>
                        <div class="pt-1 pb-0 px-3">
                            <h3 class="title">${p.title}</h3>
                            <p class="msg">${p.msg}</p>
                        </div>
                    </div>
                </div>
            `)
            const dot = $(`<span class="dot" data-index="${i}"></span>`).click(function (params) {
                currentInde = i;// 
                sliceToItemByIndex(i);
                autoLoop();// 循环播放
            })
            dots.append(dot);
        });
        $(".letters .cols").eq(0).clone().appendTo(letters)
        $(".letters .cols").eq(1).clone().appendTo(letters)
        $(".letters .cols").eq(2).clone().appendTo(letters)
        $(".dots .dot").eq(0).click();// 初始位置
        $(window).resize(function () {
            autoLoop();
            sliceToItemByIndex(currentInde);
        });

        // 拖拽
        grapOrTouchSwiper()
        function grapOrTouchSwiper() {
            let startX = 0;
            let endX = 0;
            // pc端
            $(letters).mousedown(function (e) {
                startX = e.clientX
            })
            $(letters).mouseup(function (e) {
                endX = e.clientX;
                if (startX - endX > 50) {
                    if (currentInde < data.length - 1) {
                        currentInde++
                    }
                    sliceToItemByIndex(currentInde)
                }
                if (startX - endX < -50) {
                    if (currentInde > 0) {
                        currentInde--
                    }
                    sliceToItemByIndex(currentInde)
                }
                endX = startX = 0;
                letters.css({ transition: sliceDelay + "ms" })
                autoLoop();// 重新自动播放
            })

            // 移动端
            $(letters).on('touchstart', function (e) {
                startX = e.changedTouches[0].clientX
            })
            $(letters).on('touchend', function (e) {
                endX = e.changedTouches[0].clientX;
                if (startX - endX > 30) {
                    if (currentInde < data.length - 1) {
                        currentInde++
                    }
                    sliceToItemByIndex(currentInde)
                }
                if (startX - endX < -30) {
                    if (currentInde > 0) {
                        currentInde--
                    }
                    sliceToItemByIndex(currentInde)
                }
                endX = startX = 0;
                letters.css({ transition: sliceDelay + "ms" })
                autoLoop();// 重新自动播放
            })
        }

        // 滚动到对应位置
        function sliceToItemByIndex(i) {
            $(".dots .dot").eq(i).addClass('active').siblings().removeClass("active")

            let size = +$(".letters .cols").eq(0).css("width").replace("px", "")
            letters.css("right", size * (i) + "px");
        }
        autoLoop();// 开启自动播放
        function autoLoop() {
            clearInterval(timer);
            clearTimeout(animteTimer);
            timer = setInterval(() => {
                if (currentInde < data.length) {
                    currentInde++
                }
                sliceToItemByIndex(currentInde);
                if (currentInde === data.length) {
                    currentInde = 0;
                    $(".dots .dot").eq(currentInde).addClass('active').siblings().removeClass("active")
                    animteTimer = setTimeout(() => {
                        letters.css({
                            transition: "none",
                            right: "0px"
                        })
                        animteTimer = ""
                    }, sliceDelay)
                } else {
                    letters.css('transition', sliceDelay + "ms")
                }
            }, delay)
        }

    }

    // nav顶部导航栏的点击事件
    function changeNacStyle() {
        $('.navbar .item a').click(function (e) {
            $('.navbar .item a').removeClass("active")
            $(this).addClass("active");
        })
    }

    // 读取用户登录信息
    function initLoginState() {
        let data = window.location.href
        if (data.indexOf("?username") === -1) return
        let start = data.indexOf("?") + 1;
        let end = data.indexOf("#") === -1 ? undefined : data.indexOf("#");
        data = data.substring(start, end).split("=")[1]
        $('.navbar-nav .login span').html(data);
    }

    // 视图滚动组件的动画
    function scrollStyle() {
        $(window).scroll(function () {
            if ($(document).scrollTop() < 100) {
                $(".backTopBtn").css({
                    opacity: "0",
                    transform: "scale(0)"
                });
                $(".scrollTip").css({
                    opacity: "1",
                    transform: "scale(1)"
                });
            } else {
                $(".backTopBtn").css({
                    opacity: "1",
                    transform: "scale(1)"
                });
                $(".scrollTip").css({
                    opacity: "0",
                    transform: "scale(0)"
                });
            }
        });
    }

    // 初始化主题
    function initTheme() {
        let state = JSON.parse(localStorage.getItem('themeSetting')) || false
        if (state) {
            // 黑夜
            $(":root").css({
                "--theme-color": "#1d1d1d",
                "--theme-color2": "#fff",
                "--text-mark-color": "#8acc1c",
            });
            $(".change-switch").click()
        } else {
            // 白天
            $(":root").css({
                "--theme-color": "#fff",
                "--theme-color2": "#1d1d1d",
                "--text-mark-color": "#73FFA0",
            });
        }
    }
    // 主题切换按钮
    changeTheme()
    function changeTheme() {
        $(".change-switch").change(function () {
            let changeTheme = JSON.parse(localStorage.getItem('themeSetting')) || false
            changeTheme = !changeTheme
            if (changeTheme) {
                // 黑夜
                $(":root").css({
                    "--theme-color": "#1d1d1d",
                    "--theme-color2": "#fff",
                    "--text-mark-color": "#8acc1c",
                });
            } else {
                // 白天
                $(":root").css({
                    "--theme-color": "#fff",
                    "--theme-color2": "#1d1d1d",
                    "--text-mark-color": "#73FFA0",
                });
            }
            localStorage.setItem('themeSetting', JSON.stringify(changeTheme))
        })
    }

    // 时钟初始化时间
    function initClockTime() {
        let clock = $('.clock .time');
        let date, hours, minu, second,
            time = "00:00:00";
        getFormatTime();
        setInterval(getFormatTime, 999)

        function getFormatTime() {
            date = new Date()
            hours = date.getHours();
            minu = date.getMinutes();
            second = date.getSeconds();
            hours = hours >= 10 ? hours : "0" + hours
            minu = minu >= 10 ? minu : "0" + minu
            second = second >= 10 ? second : "0" + second
            time = hours + ":" + minu + ":" + second
            clock.html(time)
        }
    }

    // content3 切换图片
    changeCt3Img()
    function changeCt3Img() {
        $('.li-cards .cards1').mouseenter(function () {
            $(".ct3-left img").fadeOut(300, function (params) {
                $(this).attr('src', './public/image/img/todo.png').fadeIn(300)
            })
        })

        $('.li-cards .cards2').mouseenter(function () {
            $(".ct3-left img").fadeOut(300, function (params) {
                $(this).attr('src', './public/image/img/ticktacktoe.png').fadeIn(300)
            })
        })
        $('.li-cards .cards3').mouseenter(function () {
            $(".ct3-left img").fadeOut(300, function (params) {
                $(this).attr('src', './public/image/img/snake.png').fadeIn(300)
            })
        })
    }
})