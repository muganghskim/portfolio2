const tabs = document.querySelectorAll(".classify li");
const tabviews = document.querySelectorAll(".left-gallery img");
const tabinfoviews = document.querySelectorAll(".tap-info-view");
const tabbg = document.querySelector(".left-gallery");

tabinfoviews[0].classList.add("on");

tabs.forEach(function(item,index){
    item.addEventListener("click",function(){
        tabviews.forEach(function(item,index){
            item.classList.remove("on");
            tabs[index].classList.remove("on");
            tabinfoviews[index].classList.remove("on");
        });
        tabbg.style.backgroundImage = `url(img/tap${3-index}.jpg)`;
        tabviews[index].classList.add("on");
        tabinfoviews[index].classList.add("on");
        item.classList.add("on");
    });
});