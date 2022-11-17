//클릭시 정렬
const btns = document.querySelectorAll(".boxBtn li");
const boxGen = document.querySelectorAll(".all");
btns.forEach(function(item,index){
    item.addEventListener("click",function(e){
        e.preventDefault();
        //버튼 활성화 비활성화
        btns.forEach(function(el,index){
            el.classList.remove("on");
        });
        item.classList.add("on");
        //li태그에 사용자 속성값을 가지고 와서 해당 클래스 이름에 div태그들만 정렬
        let data = item.getAttribute("data-btn");
        iso.arrange({
            filter: data,
            transitionDuration: "0.7s",
        })
    })
});
//기능 이니셜라이즈
let elem = document.querySelector('.grid');
let iso = new Isotope( elem, {
    // options
    itemSelector: '.all',
    layoutMode: 'masonry'
});
//박스 생성
