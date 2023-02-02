$(function () {
    let userData = JSON.parse(localStorage.getItem('userData')) || [];//用户信息
    toRegiste();// 注册功能
    toLogin();// 登录功能
    toggleSignType(); // 切换登录框和动画

    // 注册[A-Za-z]{4,12}
    let regnum = /[0-9]/
    let regPwd = /[A-Za-z]/
    function toRegiste() {
        let user = $('.from2 .user');
        let pwd = $('.from2 .pwd');
        let pwd2 = $('.from2 .pwd2');
        // 点击事件
        $('.toRegiste').click(checkRegiste);
        // 或回车
        pwd2.keyup(function (e) {
            if (e.keyCode === 13) {
                checkRegiste()
            }
        })
        // 确认框校验
        function checkRegiste() {
            const uname = user.val().trim()
            const p1 = pwd.val().trim()
            const p2 = pwd2.val().trim()

            if (!uname || !pwd) {
                alertMessage("账号或密码不能为空！")
                return
            }
            if (regnum.test(uname)) {
                alertMessage("用户名不能包括数字！")
                return
            }
            if (p1.length < 6 || p1.length > 10) {
                alertMessage("密码长度在6-10位！")
                return
            }
            if (!regPwd.test(p1)) {
                alertMessage("密码需包括大小写字母！")
                return
            }
            let countStr = 0;
            for (let i = 0; i < p1.length; i++) {
                const char = p1.charCodeAt(i)
                if (char >= 32 && char <= 47 || char >= 58 && char <= 64 || char >= 91 && char <= 96 || char >= 123 && char <= 126) {
                    countStr++
                }
            }
            if (countStr <= 0) {
                alertMessage("密码需包括特殊字符！")
                return
            }
            if (p1 !== p2) {
                alertMessage("两次密码不一致！")
                return
            }
            alertMessage("注册成功，即将返回登录！", "alert-success", undefined, undefined, () => {
                $('.show-sign-in').click();
                $('.from1 .user').val(uname);
                // 本地存储用户数据
                userData.push({ username: uname, password: p2 })
                localStorage.setItem('userData', JSON.stringify(userData));
                console.log(userData);
            });
        }
    }

    // 登录
    function toLogin() {
        let user = $('.from1 .user');
        let pwd = $('.from1 .pwd');
        $('.toLogin').click(checkLogin);

        pwd.keyup(function (e) {
            if (e.keyCode === 13) {
                checkLogin()
            }
        })
        // 确认框校验
        function checkLogin() {
            const username = user.val().trim()
            const password = pwd.val().trim()
            if (!username || !pwd) {
                alertMessage("账号或密码不能为空！")
                return
            }
            if (regnum.test(username)) {
                alertMessage("用户名不包括数字！")
                return
            }
            if (password.length < 6 || password.length > 10) {
                alertMessage("密码长度在6-10位！")
                return
            }
            if (!regPwd.test(password)) {
                alertMessage("密码需包括大小写字母！")
                return
            }
            let countStr = 0;
            for (let i = 0; i < password.length; i++) {
                const char = password.charCodeAt(i)
                if (char >= 32 && char <= 47 || char >= 58 && char <= 64 || char >= 91 && char <= 96 || char >= 123 && char <= 126) {
                    countStr++
                }
            }
            if (countStr <= 0) {
                alertMessage("密码需包括特殊字符！")
                return
            }
            let flag = false;
            userData.forEach(p => {
                flag = p.username === username && p.password === password
            });
            if (flag) {
                alertMessage("登陆成功", "alert-success", undefined, undefined, () => {
                    window.location.replace(`../index.html?username=${username}`)
                    user.val("")
                    pwd.val("")
                });
            } else {
                alertMessage("账号或密码错误！")
            }
        }
    }

    // 切换登录框和动画
    function toggleSignType() {
        let timer = "";// 防抖定时器
        let state = true;// 状态切换
        $('.show-sign-in').click(function () {

            if (timer === "") {
                if (state) {
                    $('.from1').toggleClass('animate__fadeOutRight');
                    $('.left-content').toggleClass("animate__fadeOutLeft")
                    timer = setTimeout(() => {
                        $('.from1').css({ display: "none" }).toggleClass('animate__fadeOutRight');
                        $('.from2').css({ display: "block" })
                        // 文本切换
                        $('.left-content').toggleClass("animate__fadeOutLeft")
                        $(this).html("去登录");
                        $('.left-content .title').children().html('Sign In')
                        $(this).siblings('h4').eq(0).html("已有账号？")
                        state = false; // 设false
                        clearTimeout(timer);
                        timer = "";
                    }, 1000);
                } else {
                    $('.from2').toggleClass('animate__fadeOutRight');
                    $('.left-content').toggleClass("animate__fadeOutLeft")
                    timer = setTimeout(() => {
                        $('.from1').css({ display: "block" });
                        $('.from2').css({ display: "none" }).toggleClass('animate__fadeOutRight');
                        $('.left-content').toggleClass("animate__fadeOutLeft")
                        $(this).html("去注册")
                        $('.left-content .title').children().html('Sign Out')
                        $(this).siblings('h4').eq(0).html("如果你还没有有账号？")
                        state = true; // 设false
                        clearTimeout(timer);
                        timer = "";
                    }, 1000);

                }
            }
        })
    }
    /**
     * @alertType 提醒类型alert-success、alert-danger(默)...
     * @text 提醒错误文字
     * @startAnimate 开始动画类名
     * @endAnimate 结束动画类名
     * **/
    let alertTimer = "";
    function alertMessage(text, alertType = "alert-danger", startAnimate = "animate__fadeInDown", endAnimate = "animate__fadeOutRight", callback) {

        if (alertTimer === "") {
            new Promise((res) => {
                $('.alertTop').append(`
                        <div class="alert ${startAnimate} ${alertType} alert-dismissible fade show">
                            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                            <strong class="p-2 pb-0 pt-0">${text}</strong>
                        </div>`
                );
                alertTimer = true
                res(alertTimer)
            }).then((res) => {
                setTimeout(() => {
                    $('.alertTop .alert').toggleClass(endAnimate)
                    alertTimer = res
                    return res
                }, 1500)
            }).then((res) => {
                setTimeout(() => {
                    $('.alertTop .alert').remove()
                    clearTimeout(alertTimer)
                    alertTimer = ""
                    callback && callback() // 执行回调
                    return res
                }, 2500)
            })
        }
    }

})