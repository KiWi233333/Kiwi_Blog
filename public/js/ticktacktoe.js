$(function () {
    const p1 = `
        <svg t="1671205217801" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
            p-id="7749" width="72" height="72">
            <path
                d="M512.005117 958.708971C265.683035 958.708971 65.290005 758.316965 65.290005 511.99386c0-246.310825 200.39303-446.703855 446.715111-446.703855 246.310825 0 446.703855 200.39303 446.703855 446.703855C958.708971 758.316965 758.316965 958.708971 512.005117 958.708971zM512.005117 169.716356c-188.738595 0-342.289784 153.545048-342.289784 342.277504 0 188.738595 153.551188 342.289784 342.289784 342.289784 188.733479 0 342.278527-153.551188 342.278527-342.289784C854.283644 323.261405 700.738595 169.716356 512.005117 169.716356z"
                fill="#3f72c8" p-id="7750"></path>
        </svg>
    `
    const p2 = `
        <svg t="1671205033098" class="icon2" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                p-id="6072" width="54" height="54">
                <path
                d="M632.117978 513.833356l361.805812 361.735298a85.462608 85.462608 0 1 1-121.001515 120.789974L511.116463 634.552816 146.913186 998.756094a86.026718 86.026718 0 0 1-121.706652-121.706652L389.480325 512.775651 27.674513 150.969839A85.392095 85.392095 0 0 1 148.393973 30.250379L510.199785 392.056191l366.671258-366.671258a86.026718 86.026718 0 0 1 121.706652 121.706652z"
                p-id="6073" fill="#de1300"></path>
        </svg>
    `;// p1 X p2 O
    const winArr = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 4, 8],
        [2, 4, 6],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
    ];
    let existArr = [];
    const maps = $('.grid-container');
    let boxs = "";
    let playerType = "o";
    let resO = 0; // 
    let resX = 0; // 
    let clicks = 0;
    let winPlayer = "";
    reStart(); // 初始

    // 初始
    function initActive() {
        winPlayer = ""
        existArr = [null, null, null, null, null, null, null, null, null]
        boxs = $('.grid-container .box');
        // 存储结果的集合
        $.each(boxs, (i, item) => {
            $(item).click(function () {
                clicks++
                if ($(this).attr('playType') !== undefined) return

                if (playerType === "o") {// O 开
                    $(this).attr('playType', playerType).append(p1);
                    playerType = "x"

                } else {// X 开
                    $(this).attr('playType', playerType).append(p2);
                    playerType = "o"
                }
                checkWinner();// 判断输赢

                if (winPlayer === "o") {
                    btnReDom("⚪赢了");// O赢
                } else if (winPlayer === "x") {
                    btnReDom("❌赢了");// X赢
                } else if (clicks == 9) {
                    btnReDom("平局了😮");// 平局
                }
            })
        })
    }

    // 重新开始并
    function btnReDom(result) {
        boxs.unbind("click");
        console.log($('.alertCheck .result'));
        $('.alertCheck .result').html(result)
        $('.alertCheck').fadeIn(600, function () {
            $('.alertCheck .btns .btn-restart').click(function () {
                reStart();
                $('.alertCheck').fadeOut(600)
            })
        })
    }

    // 判断输赢
    function checkWinner() {
        $.each(boxs, (i, p) => {
            existArr[i] = $(p).attr('playType')
        })
        // 对比结果
        winArr.forEach(win => {
            $.each(win, ((i, p) => {
                if (existArr[p] === 'o') {
                    resO++
                    resX = 0
                } else if (existArr[p] === 'x') {
                    resO = 0
                    resX++
                };
                if (resO === 3) {
                    winPlayer = "o"
                    return
                } else if (resX === 3) {
                    winPlayer = "x"
                    return
                }
            }))
            resO = 0;
            resX = 0;
        });
        if (winPlayer == "") winPlayer = "p"// 平局
    }


    // 重新开始
    function reStart() {
        let box = '<div class="box"></div>';
        maps.html("");
        for (let i = 0; i < 9; i++) {
            maps.append(box)
        }
        initActive();// 
        playerType = "o";// 默认为o
        clicks = 0
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

    backOut()
    function backOut() {
        $('.backOut').click(function () {
            if (history.length > 1) history.back()
            else location.replace("../index.html")
        })
    }

})