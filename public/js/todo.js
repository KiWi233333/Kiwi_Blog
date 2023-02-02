$(function () {

    // 初始化 
    let todoListData = []; // 列表数据
    colorArr = ["#e49775", "#cedd87", "#ecc178", "#d0eb8e", "#ead3d4", "#dde495",]
    let input = $('.top .input'); // 输入框dom
    let currentIndex = -1;// 当前元素下标
    let alertTimer = "";// 提醒框定时器

    initTodoData();

    /**
     * @按钮事件
     * **/
    // 添加按钮事件
    $('.top .submit').click(function () {
        clearInterval(alertTimer)
        if (input.val().trim() !== "") {
            addTodoData(input.val().trim(), false);
            input.val("");
        } else {
            alertMessage("内容不能为空！");
        }
    })

    // 添加enter键盘事件
    $('.top .input').keyup(function (e) {
        if (e.keyCode === 13 && input.val().trim() !== "") {
            addTodoData(input.val().trim(), false);
            input.val("");
        } else if (e.keyCode === 13 && input.val().trim() === "") {
            alertMessage("内容不能为空！");
        }
    })

    // 清空按钮事件
    $('.top .clear').click(function (e) {
        input.val("")
    });




    // 1、保存数据
    function saveTodoData() {
        localStorage.setItem("kiwiTodo", JSON.stringify(todoListData))
    }

    // 2、添加新的事项
    function addTodoData(content, done = false) {
        // 随机颜色
        let color = colorArr[Math.floor(Math.random() * colorArr.length)]
        // 添加 节点
        todoListData.push({ content, done, color });
        $(getAddDomStr(content, done, todoListData.length - 1, color)).appendTo(".undoneTodo");
        saveTodoData();// 保存
        putEvent();
    }

    // 3、刷新数据
    function refreshTodoData() {
        // 1) 添加Dom
        $('.doneTodo').html("")
        $('.undoneTodo').html("")
        $.each(todoListData, function (i, p) {
            if (p?.color && p?.content) {
                if (p.done && p.content) {
                    $('.doneTodo').append(getAddDomStr(p.content, p.done, i, p.color))
                } else {
                    $('.undoneTodo').append(getAddDomStr(p.content, p.done, i, p.color))
                }
            }
        })
        // 2) 添加事件
        putEvent();
        // 3) 添加悬浮提示title
        initTitle();
    }

    // 添加悬浮提示title
    function initTitle() {
        let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl)
        })
    }


    /**
     * 初始化数据
     * **/
    function initTodoData() {
        todoListData = localStorage.getItem("kiwiTodo") ? JSON.parse(localStorage.getItem("kiwiTodo")) : []
        // 清空为空的
        for (let i = 0; i < todoListData.length; i++) {
            if (todoListData[i].content == undefined) {
                todoListData.splice(i, 1)
            }
        }
        localStorage.setItem("kiwiTodo", JSON.stringify(todoListData))
        if (todoListData === true) return;
        refreshTodoData(); // 刷新
    }

    // 添加事件
    function putEvent() {
        $('.done').unbind('click');
        $('.edit').unbind('click');
        $('.delete').unbind('click');
        $('.backout').unbind('click');

        let timer = ""// 定时器节流
        let editTextFlag = true;
        // a、完成按钮
        $(".done").click(function (e) {
            // 对应项获取索引
            const current = +$(this).parents(".item").attr("data-index");
            e.stopPropagation();
            todoListData[current].done = true;
            saveTodoData();// 保存
            $(this).parents(".item").fadeOut(500, function () {
                // if (todoListData[current].done) {
                $(this).find(".done").css("opacity", "0.5")
                $(this).find(".edit").css("display", "none")
                $(this).find(".backout").css("display", "inline-flex")
                $(this).clone(true).fadeIn().appendTo('.doneTodo')
                // } else {
                //     $(this).find(".done").css("opacity", "1")
                //     $(this).find(".edit").css("display", "inline-flex")
                //     $(this).find(".backout").css("display", "none")
                //     $(this).clone(true).fadeIn().appendTo('.undoneTodo');
                // }
                $(this).remove();// 清除原来的
            });
        })

        // b、编辑按钮 
        $(".edit").click(function () {
            const current = +$(this).parents(".item").attr("data-index");
            const eT = $(this).parents('.item').find('.editText')
            const pos = todoListData[current].content.length
            eT.attr("disabled", false)
            eT.focus()
            eT[0].setSelectionRange(pos, pos);
        })
        // c、删除按钮
        let deleteFlag = false;
        $('.delete').click(function (e) {
            if (!deleteFlag) {
                const current = +$(this).parents(".item").attr("data-index");
                deleteFlag = true;// 防抖
                e.stopPropagation();
                console.log(current);
                // todoListData.splice(current, 1);
                todoListData[current] = {};
                saveTodoData();// 保存
                $(this).parents(".item").fadeOut(200, () => {
                    $(".tooltip").remove()
                    $(this).remove();
                    deleteFlag = false;
                })
            };
        })
        // d、撤销按钮
        $(".backout").click(function (e) {
            // 对应项获取索引
            const current = +$(this).parents(".item").attr("data-index");
            console.log(1);
            e.stopPropagation();
            todoListData[current].done = false;
            $(this).parents(".item").fadeOut(500, function () {
                $(this).find(".done").css("opacity", "1")
                $(this).find(".edit").css("display", "inline-flex")
                $(this).find(".backout").css("display", "none")
                $(this).clone(true).fadeIn().appendTo('.undoneTodo');
                initTitle();// 小提示框
                $(".tooltip").remove()
                $(this).remove();// 清除原来的
                putEvent();
            });
            saveTodoData();//保存
        })

        // f、失去焦点
        $(".editText").blur(function (e) {
            const current = +$(this).parents(".item").attr("data-index");
            const text = $(this).val().trim()
            if (text !== "") {
                todoListData[current].content = text
                $(this).attr("disabled", true);
                saveTodoData();
            } else {
                $(this).val(todoListData[current].content)
            }

        });

    }

    /**
     * 获得卡片节点
     * @content 内容
     * @done 是否完成
     * @return DomStr
     * **/
    function getAddDomStr(content = "", done = false, index, color) {
        return `<div class="col-6 col-md-4 col-lg-3 p-0 item" data-index="${index}">
                    <div class="p-3 m-2 m-md-2 m-lg-2 card cards" 
                    style="background-color: ${color};">
                        <textarea class="editText" maxlength="70" rows="5" required disabled="true">${content}</textarea>
                        <div class="control d-felx mt-2">
                            <span class="done" style="opacity:${done ? "0.5" : "1"};pointer-events:${done ? "none" : "all"};">
                                <svg t="1670506302206" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                    xmlns="http://www.w3.org/2000/svg" p-id="6882" width="16" height="16">
                                    <path
                                        d="M896 256c17.1 0 33.2 6.7 45.3 18.7 12.1 12.1 18.7 28.2 18.7 45.3 0 17.1-6.7 33.2-18.7 45.3L454.1 852.4c-12.1 12.1-28.2 18.7-45.3 18.7s-33.2-6.7-45.3-18.7L82.7 571.5C70.7 559.4 64 543.3 64 526.2s6.7-33.2 18.7-45.3C94.8 468.9 110.9 462.2 128 462.2c17.1 0 33.2 6.7 45.3 18.7l190.4 190.4 45.3 45.3 45.3-45.3 396.6-396.6C862.8 262.6 878.9 256 896 256M896 192c-32.8 0-65.5 12.5-90.5 37.5L408.9 626.1 218.5 435.7C193.5 410.7 160.8 398.2 128 398.2s-65.5 12.5-90.5 37.5c-50 50-50 131 0 181l280.9 280.9c25 25 57.8 37.5 90.5 37.5 32.8 0 65.5-12.5 90.5-37.5l487.1-487.1c50-50 50-131 0-181C961.5 204.5 928.8 192 896 192L896 192z"
                                        p-id="6883"></path>
                                </svg>
                            </span>
                            <div>
                            <span class="edit" style="display:${done ? "none" : "inline-flex"};" 
                            data-bs-toggle="tooltip" data-bs-placement="bottom" title="编辑">
                                <svg t="1670506075386" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                    xmlns="http://www.w3.org/2000/svg" p-id="5849" width="16" height="16">
                                    <path
                                        d="M631.5 215.8L213.9 633.4c-12.1 12.1-12.1 31.8 0 44l131.9 131.9c12.1 12.1 31.8 12.1 44 0l417.6-417.6c12.1-12.1 12.1-31.8 0-44L675.5 215.8c-12.2-12.1-31.8-12.1-44 0z m153.9-109.9l131.9 131.9c12.1 12.1 12.1 31.8 0 44l-44 44c-12.1 12.1-31.8 12.1-44 0l-131.8-132c-12.1-12.1-12.1-31.8 0-44l44-44c12-12 31.7-12 43.9 0.1zM194.6 688.1L335 828.6c8.1 8.1 4.9 22-6 25.7L116.9 926c-12.2 4.1-23.8-7.5-19.7-19.7l71.7-212.1c3.6-11 17.5-14.2 25.7-6.1z"
                                        p-id="5850"></path>
                                </svg>
                            </span>
                            <span class="backout" data-bs-toggle="tooltip" style="display:${!done ? "none" : "inline-flex"};"
                            data-bs-placement="bottom" title="撤销">
                                <svg t="1670509966358" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                    xmlns="http://www.w3.org/2000/svg" p-id="7875" width="16" height="16">
                                    <path
                                        d="M726.31616669 553.08337403c0 65.77789307-25.36193848 127.55126953-71.41387939 174.04815673a240.49346924 240.49346924 0 0 1-172.3425293 72.15545655 240.49346924 240.49346924 0 0 1-172.26837158-72.15545655 245.83282471 245.83282471 0 0 1-71.41387939-174.04815673c0-65.70373536 25.36193848-127.55126953 71.41387939-174.04815674a240.7901001 240.7901001 0 0 1 172.26837158-72.15545655c0.29663086 0-52.50366211 70.15319825-52.50366211 70.15319824a30.77545166 30.77545166 0 0 0 24.10125732 49.24072266 30.25634766 30.25634766 0 0 0 24.10125732-12.01354981l95.44097901-125.77148436a30.77545166 30.77545166 0 0 0-5.63598633-43.01147462L441.55054169 147.58898925a30.10803223 30.10803223 0 0 0-42.49237061 5.63598634 30.77545166 30.77545166 0 0 0 5.63598633 43.01147461l64.07226563 49.61151123c-36.18896484 1.55731201-71.33972168 9.56634521-104.56237793 23.87878417A306.19720459 306.19720459 0 0 0 202.24359588 433.31866455 307.75451661 307.75451661 0 0 0 178.29065399 553.00921631a307.75451661 307.75451661 0 0 0 185.83923341 283.2824707 299.2263794 299.2263794 0 0 0 118.50402831 24.24957276c41.08337403 0 80.98022461-8.15734864 118.50402833-24.17541505A306.19720459 306.19720459 0 0 0 762.95007782 672.92224122a307.75451661 307.75451661 0 0 0 24.0270996-119.76470948 30.55297852 30.55297852 0 0 0-30.33050537-30.77545166 30.55297852 30.55297852 0 0 0-30.40466308 30.70129395z"
                                        p-id="7876"></path>
                                </svg>
                            </span>
                            <span class="delete" data-bs-toggle="tooltip" data-bs-placement="bottom" title="删除">
                                <svg t="1670504287861" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                    xmlns="http://www.w3.org/2000/svg" p-id="3647" width="16" height="16">
                                    <path
                                        d="M909.3 192.2H767.5c-0.8-5.4-2.5-10.8-5.1-16.1l-34.9-71.7c-11.8-24.3-40-40.1-71.3-40.1h-288c-31.3 0-59.5 15.8-71.3 40.1l-35 71.7c-2.6 5.4-4.3 10.8-5.2 16.1H113.3c-27.5 0-50 22.5-50 50v27.6c0 27.5 22.5 50 50 50h77.8v589.8c0 27.5 22.5 50 50 50h539.6c27.5 0 50-22.5 50-50V319.7h78.7c27.5 0 50-22.5 50-50v-27.6c-0.1-27.4-22.6-49.9-50.1-49.9zM386 799.2c0 17.9-14.6 32.5-32.5 32.5S321 817.1 321 799.2V416.3c0-17.9 14.6-32.5 32.5-32.5s32.5 14.6 32.5 32.5v382.9z m160.9 0c0 17.9-14.6 32.5-32.5 32.5s-32.5-14.6-32.5-32.5V416.3c0-17.9 14.6-32.5 32.5-32.5s32.5 14.6 32.5 32.5v382.9z m160.2 0c0 17.9-14.6 32.5-32.5 32.5s-32.5-14.6-32.5-32.5V416.3c0-17.9 14.6-32.5 32.5-32.5s32.5 14.6 32.5 32.5v382.9z"
                                        p-id="3648"></path>
                                </svg>
                            </span>
                        </div>
                    </div>
                </div>
            </div>`
    }


    /**
     * @params 提醒错误文字
     * **/
    function alertMessage(text, startAnimate = "animate__fadeInDown", endAnimate = "animate__fadeOutRight") {
        if (alertTimer === "") {
            new Promise((res) => {
                $('.alertTop').append(
                    `<div class="alert ${startAnimate} alert-danger alert-dismissible fade show">
                                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                                <strong class="p-2 pb-0 pt-0">${text}</strong>
                            </div>`
                );
                alertTimer = true
                res(alertTimer)
            }).then((res) => {
                setTimeout(() => {
                    $('.alertTop .alert').addClass(endAnimate)
                    alertTimer = res
                    return res
                }, 1500)
            }).then((res) => {
                setTimeout(() => {
                    $('.alertTop .alert').remove()
                    clearTimeout(alertTimer)
                    alertTimer = ""
                    return res
                }, 2500)
            })
        }
    }

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
})

