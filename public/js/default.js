// 划线特效
// 当对象进入窗体可视范围 IntersectionObserver
let observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(item => {
        if (item.isIntersecting) {
            item.target.classList.add('animate')
            observer.unobserve(item.target)
        }
    })
})
// 观察者：组件动画
let observerAnimate = new IntersectionObserver((entries, observer) => {
    entries.forEach(item => {
        if (item.isIntersecting) {
            item.target.classList.add('animateStart')
            observer.unobserve(item.target)
        }
    })
})
setMarks(['mark1', 'mark2', 'mark3', 'mark4', 'mark5'])
// 进入视野加载动画
document.querySelectorAll('.animatejs').forEach(item => {
    observerAnimate.observe(item)
})
// 添加监测对象
function setMarks(classNames) {
    classNames.forEach(name => {
        document.querySelectorAll(name).forEach(mark => {
            observer.observe(mark)
        })
    });
} 