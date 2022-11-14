let scTopBtn = document.querySelector("#scTop");
let header_position = document.querySelector("#header");

scTopBtn.addEventListener("click",function(){
    let scrollMove = header_position.offsetTop;
    window.scrollTo({
        top:scrollMove,
        behavior:"smooth"
    });
});