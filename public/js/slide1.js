const swiper = new Swiper('.slideWrap', {
    // Optional parameters
    direction: 'horizontal',
    loop: true,
    effect:"slide",
    speed: 1000,
    
    //자동재생구간
    autoplay: {
        delay: 4000,
        disableOnInteraction: false,
    },

    // If we need pagination
    pagination: {
        el: '.circleBtn',
        clickable:true,
    },

    // Navigation arrows
    navigation: {
        nextEl: '.nextBtn',
        prevEl: '.prevBtn',
    },
});