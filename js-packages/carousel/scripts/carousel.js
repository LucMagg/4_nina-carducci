const packageLocation = "./js-packages/carousel";

let carousel = null;
let container = null;
let slides = null;
let leftAndRightButtons = [];
let bottomButtonList = [];
let activeSlide = 0;
let autoSliding = 0;


function setCarousel(param) {
    loadCSS();
    carousel = param;
    carousel.classList.add("carousel");
    let children = [].slice.call(carousel.children);
    setContainer();
    setSlides(children);
    setButtons();
    setBottomButtons();
    autoSliding = new interval(() => {moveToSlide(activeSlide + 1)}, 4000);
    moveToSlide(0);
    setButtonsListeners();
}

function loadCSS(){
    if (!document.getElementById("carouselCSS")) {
        let link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = `${packageLocation}/styles/carousel-style.css`;
        link.type = "text/css";
        link.id = "carouselCSS";
        document.head.appendChild(link);
    }
}

function setContainer() {
    container = document.createElement("div");
    container.className = "carousel-container";
    carousel.appendChild(container);
}

function setSlides(children) {
    slides = children.map((child) => {
        let slide = document.createElement("div");
        slide.className = "carousel-slide";
        slide.appendChild(child);
        container.appendChild(slide)
        return slide;
    });
    container.style.width = (slides.length * 100) + "%";
}

function setButtons() {
    for (let i = 0; i < 2; i++) {
        let button = document.createElement("button");
        button.className = "carousel-button";
        button.type = "button";
        let icon = document.createElement("span");
        icon.setAttribute("aria-hidden","true");
        if (i === 0) {
            button.classList.add("carousel-left-button");
            button.ariaLabel = "Précédent";
            icon.className = "carousel-left-icon";   
        } else {
            button.classList.add("carousel-right-button");
            button.ariaLabel = "Suivant";
            icon.className = "carousel-right-icon";
        }
        carousel.appendChild(button);
        button.appendChild(icon);
        leftAndRightButtons.push(button);
    }
}

function setBottomButtons() {
    let carouselBottomButtons = document.createElement("div");
    carouselBottomButtons.className = "carousel-bottom-container";
    carousel.appendChild(carouselBottomButtons);
    for (let i = 0; i < slides.length; i++) {
        let button = document.createElement("button");
        button.type = "button";
        button.ariaLabel = `Slide ${i+1}`;
        button.className = "carousel-bottom-button";
        carouselBottomButtons.appendChild(button);
        bottomButtonList.push(button);
    }
}

function setButtonsListeners() {
    for (let i = 0; i < 2; i++){
        if (i === 0) {
            leftAndRightButtons[i].addEventListener('click', () => moveToSlide(activeSlide - 1));
        } else {
            leftAndRightButtons[i].addEventListener('click', () => moveToSlide(activeSlide + 1));
        }
    }
    
    for (let i = 0; i < bottomButtonList.length; i++) {
        bottomButtonList[i].addEventListener("click", () => {moveToSlide(i)});
    }
}

function moveToSlide(slideIndex) {
    if (slideIndex < 0) {
        slideIndex = slides.length - 1;
    } else if (slideIndex >= slides.length) {
        slideIndex = 0;
    }
    container.style.transform = `translateX(-${slideIndex * (100/slides.length)}%)`;
    activeSlide = slideIndex;
    for (let i = 0; i < bottomButtonList.length; i++) {
        if (i === activeSlide) {
            bottomButtonList[i].classList.add("carousel-bottom-button-active");
        } else {
            bottomButtonList[i].classList.remove("carousel-bottom-button-active");
        }
    }
    autoSliding.reset();
}

function interval(func, ms) {
    let timerObj = setInterval(func, ms);

    this.stop = function() {
        if (timerObj) {
            clearInterval(timerObj);
            timerObj = null;
        }
        return this;
    }

    this.start = function() {
        if (!timerObj) {
            this.stop();
            timerObj = setInterval(func, ms);
        }
        return this;
    }

    this.reset = function() {
        return this.stop().start();
    }
}



export { setCarousel };