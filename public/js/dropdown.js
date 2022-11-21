const gnbWrap = document.querySelector(".gnbWrap");
const depthbg = document.querySelector(".depthbg")
const depths = document.querySelectorAll(".depth");
const depthWrap2 = document.querySelectorAll(".depthWrap2");
const depth2 = document.querySelectorAll(".depth2"); 
const hbgMenu = document.querySelector(".hbgMenu");

gnbWrap.addEventListener("mouseenter",function(){
    depthbg.style.height = "250px";
    depths.forEach(function(item,index){
        item.style.height = "250px";
    });
});

gnbWrap.addEventListener("mouseleave",function(){
    depthbg.style.height = "0px";
    depths.forEach(function(item,index){
        item.style.height = "0px";
    });
});

//hbg드롭 다운 메뉴 등장
depthWrap2.forEach(function(item,index){
    item.addEventListener("click",function(){
        if(depth2[index].classList.contains("on")){
            depth2[index].classList.remove("on");
            item.classList.remove("on");
        }
        else{
            depth2.forEach(function(item,index){
                item.classList.remove("on");
                depthWrap2[index].classList.remove("on");
            });
            depth2[index].classList.add("on");
            item.classList.add("on");
        }
    });
});

//햄버거 메뉴
const hbgBtn = document.querySelector(".hbgBtn");
const xBtn = document.querySelector(".xBtn");
const operX = document.querySelector(".operci");

hbgBtn.addEventListener("click",function(){
    hbgMenu.classList.add("on");
});
xBtn.addEventListener("click",function(){
    hbgMenu.classList.remove("on");
});
operX.addEventListener("click",function(){
    hbgMenu.classList.remove("on");
});