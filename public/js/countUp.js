
//배열에 객체 이용 변수 선언
let countValue = [
    {
        plus:2,
        tag:".box1 .count",
        complete:1391,
        loop:10,
        tagBox:".box1"
    }
];

let test = true
window.addEventListener("scroll",function(){
    let cont5Start = document.querySelector(".donaition").offsetTop -90;
    let scTop = window.scrollY;
    if(scTop >= cont5Start){
        if(test == true){
            countValue.forEach(function(el){
                setCount(el.plus,el.tag,el.complete,el.loop);
            });
        }
    }
});

//배열 반복문을 이용하여 함수 호출

//함수 정의
function setCount(inc,sel,com,speed){//매개변수
    test = false;
    let num = 1000;
    let autoCount = setInterval(function(){
        num += inc;
        //조건문으로 자동실행 멈춤
        if(num >= com){
            clearInterval(autoCount);
            document.querySelector(sel).innerHTML = com;//마지막 도달값 넣어줌
        }
        else{
            document.querySelector(sel).innerHTML = num;//자동실행중 변화값 넣어줌
        }
    },speed);
}