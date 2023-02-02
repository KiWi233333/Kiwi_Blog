const rows = 18
const cols = 18
let speed = 180;// ms
const mf = document.querySelector('.mf')
const result = []
let resultLenght = 0;
let resLong = 0;
const player = [
    [1, 1]
]
let bodys = document.querySelector('body');
if (bodys.clientWidth > 0 && bodys.clientWidth < 500) {
    speed = 260;// ms
}
// 更新蛇
const updatePlayer = () => {
    document.querySelectorAll('.player').forEach(v => v.classList.remove('player'))
    player.forEach(v => {
        document.querySelector(`[data-v="${v.join('-')}"]`).classList.add('player')
    })
}
// 当前按键
let key = ''
// 添加可吃的对象
for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        const isEat = Math.random() > 0.93
        if (isEat) {
            resLong++
            resultLenght = resLong
        }
        result.push(`<div data-v="${i}-${j}" class="items ${isEat ? 'eat' : ''}"></div>`)
    }
}
mf.innerHTML = result.join('')
$(mf).css({

    "grid-template-columns": `repeat(${cols}, 1fr)`,
    "grid-template-rows": `repeat(${rows}, 1fr)`
})
document.addEventListener('keydown', e => {
    if (e.key.match(/^w|a|s|d$/)) {
        if (e.key === "w" && key !== "s") {
            key = "w"
        } else if (e.key === "s" && key !== "w") {
            key = "s"
        } else if (e.key === "a" && key !== "d") {
            key = "a"
        } else if (e.key === "d" && key !== "a") {
            key = "d"
        } else {
            key = key;
        }
    }
})
document.querySelector(".moveW").onclick = function () {
    if (key !== "s") {
        key = "w"
    }
}
document.querySelector(".moveS").onclick = function () {
    if (key !== "w") {
        key = "s"
    }
}
document.querySelector(".moveA").onclick = function () {
    if (key !== "d") {
        key = "a"
    }
}
document.querySelector(".moveD").onclick = function () {
    if (key !== "a") {
        key = "d"
    }
}
// 定时运动
const intervalId = setInterval(() => {
    if (key) {
        const needPos = JSON.parse(JSON.stringify(player.slice(0, player.length - 1)))
        switch (key) {
            case 'w':
                player[0][0] -= 1
                break;
            case 'a':
                player[0][1] -= 1
                break;
            case 's':
                player[0][0] += 1
                break;
            case 'd':
                player[0][1] += 1
                break;
        }
        const el = document.querySelector(`[data-v="${player[0].join('-')}"]`)
        if (!el) {
            clearInterval(intervalId)
            alertToastRes("撞墙了😫")
        } else {
            for (let i = 1; i < player.length; i++) {
                player[i] = needPos[i - 1]
            }
            if (el.className.indexOf('eat') >= 0) {
                el.classList.remove('eat')
                resLong--;
                player.push([...player[0]]);
                if (resLong === 0) {
                    clearInterval(intervalId)
                    alertToastRes(`你赢了,得分：${resultLenght}🎉`)
                }
            }
            updatePlayer();
        }
    }
}, speed)
updatePlayer();

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

// 刷新页面重新开始
function reStart() {
    location.reload();
}

// 打开弹窗
function alertToastRes(result) {
    $('.alertCheck .result').html(result)
    $('.alertCheck').fadeIn(600, function () {
        $('.alertCheck .btns .btn-restart').click(function () {
            $('.alertCheck').fadeOut(600, () => {
                reStart();
            })
        })
    })
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