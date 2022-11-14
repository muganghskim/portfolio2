const gnbWrap = document.querySelector(".gnbWrap");
const depthbg = document.querySelector(".depthbg")
const depths = document.querySelectorAll(".depth");

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