$(function () {

    initTheme()
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
        $(".change-switch").click(function () {
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

    // 返回按钮
    backOut()
    function backOut() {
        $('.backOut').click(function () {
            if (history.length > 1) history.back()
            else location.replace("../index.html")
        })
    }



    // 视图滚动组件的动画
    scrollStyle()
    function scrollStyle() {
        $(window).scroll(function () {
            if ($(document).scrollTop() < 100) {
                $(".backTopBtn").css({
                    opacity: "0",
                    transform: "scale(0)"
                });
            } else {
                $(".backTopBtn").css({
                    opacity: "1",
                    transform: "scale(1)"
                });
            }
        });
    }
})