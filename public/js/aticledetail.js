$(function () {
    init();// 初始化
    // 初始化
    function init() {
        initTheme();// 主题 初始化
        // 返回按钮
        $('.backOut').click(function () {
            if (history.length > 1) history.back()
            else location.replace("../index.html")
        })
    }
    // 主题初始化
    function initTheme() {
        let state = JSON.parse(localStorage.getItem('themeSetting')) || false
        if (!state) return

        if (state) {
            // 黑夜
            $(":root").css({
                "--theme-color": "#1d1d1d",
                "--theme-color2": "#fff",
                "--text-mark-color": "#8acc1c",
                "--boder-color": "#555555",
                "--box-shadow-color": "#000"
            });
        } else {
            // 白天
            $(":root").css({
                "--theme-color": "#fff",
                "--theme-color2": "#1d1d1d",
                "--text-mark-color": "#73FFA0",
                "--boder-color": "#cacaca7d",
                "--box-shadow-color": "#eee"
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
                    "--boder-color": "#555555",
                    "--box-shadow-color": "#000"
                });
            } else {
                // 白天
                $(":root").css({
                    "--theme-color": "#fff",
                    "--theme-color2": "#1d1d1d",
                    "--text-mark-color": "#73FFA0",
                    "--boder-color": "#cacaca7d",
                    "--box-shadow-color": "#eee"
                });
            }
            localStorage.setItem('themeSetting', JSON.stringify(changeTheme))
        })
    }
})