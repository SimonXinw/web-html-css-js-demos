var oLis = document.querySelectorAll('.btn li');
var oImgs = document.querySelectorAll('.bannerBox img');
var oBtnL = document.querySelector('.btn_l');
var oBtnR = document.querySelector('.btn_r');
var num = 0;
var timer;
jsq();

function jsq() {   //计时器
    timer = setInterval(function () {
        num++; //确定效果数字
        // 清除效果
        qingchu();
        // 判断循环条件
        if (num > 4) {
            num = 0;
        }
        jihuo(num);
        // console.log(oLis);

    }, 2000)
}
function qingchu() { //清除效果
    for (var i = 0; i < oImgs.length; i++) {
        // oLis[i].classList.remove('active');
        oImgs[i].classList.remove('active');
    }
}
function jihuo(index) { // 开启激活

    // oLis[index].classList.add('active');
    oImgs[index].classList.add('active');
}

oBtnL.onclick = function () {
    clearInterval(timer);
    qingchu();
    if (num == 0){
        num = 4;
    }
    num--
    jihuo(num);
    jsq();
}

oBtnR.onclick = function () {
    clearInterval(timer);
    qingchu();
    if (num == 4){
        num = 0;
    }
    num++
    jihuo(num);
    jsq();
}





// // 循环绑定
// for (var i = 0; i < oImgs.length; i++) {
//     oImgs[i].index = i;
//     oBtnL[i].onmouseenter = function () {
//         // console.log(666);
//         clearInterval(timer);
//         qingchu();
//         jihuo(this.index)
//     }
//     oImgs[i].onmouseleave = function () {
//         // console.log(666);
//         jsq();
//     }
// }