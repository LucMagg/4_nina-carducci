const packageLocation = "./js-packages/carousel";
const interval = 5000;
const slidingTime = 600;

let carousel = null;
let container = null;
let slides = null;
let leftAndRightButtons = [];
let bottomButtons = null;
let activeSlide = 0;
let isNotSliding = true;
let retardedAutoSliding = null;
let autoSlidingInterval = null;


function setCarousel(param) {
    loadCSS();
    carousel = param;
    carousel.classList.add("carousel");
    let children = [].slice.call(carousel.children);
    setContainer();
    setSlides(children);
    setButtons();
    setBottomButtons(children);
    setButtonsListeners();
    setRetardedAutoSliding();
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
        return slide;
    });
    container.appendChild(slides[0]);
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

function setBottomButtons(children) {
    let carouselBottomButtons = document.createElement("div");
    carouselBottomButtons.className = "carousel-bottom-container";
    carousel.appendChild(carouselBottomButtons);
    bottomButtons = children.map((child) => {
        let button = document.createElement("button");
        button.type = "button";
        button.ariaLabel = `Slide ${children.indexOf(child)+1}`;
        button.className = "carousel-bottom-button";
        carouselBottomButtons.appendChild(button);
        return button;
    });
    bottomButtons[0].classList.add("carousel-bottom-button-active");
}

function setButtonsListeners() {
    for (let i = 0; i < 2; i++){
        if (i === 0) {
            leftAndRightButtons[i].addEventListener('click', () => slide("slide-to-left",1));
        } else {
            leftAndRightButtons[i].addEventListener('click', () => slide("slide-to-right",1));
        }
    }
    
    for (let i = 0; i < bottomButtons.length; i++) {
        bottomButtons[i].addEventListener("click", () => {moveToSlide(i)});
    }
}

function targetSlide(offset) {
    let target = activeSlide + offset;
    if (target < 0) {
        target = slides.length + offset;
    } else if (target >= slides.length) {
        target = 0;
    }
    return target;
}

function slide(className, offset) {
    if (isNotSliding) {
        isNotSliding = false;
        clearTimeout(retardedAutoSliding);
        clearInterval(autoSlidingInterval);
        container.style.width = "200%";
        let newSlide = 0;
        if (className === "slide-to-left") {
            newSlide = targetSlide(-1);
            container.insertBefore(slides[newSlide], container.firstChild);
            container.style.marginLeft = "-100%";
        } else {
            newSlide = targetSlide(1);
            container.appendChild(slides[newSlide]);
        }
        container.classList.add(className);
        container.style.transition = `transform ${slidingTime}ms ease-in-out`;

        bottomButtons[activeSlide].classList.remove("carousel-bottom-button-active");
        bottomButtons[newSlide].classList.add("carousel-bottom-button-active");

        container.addEventListener("transitionend", function whenTransitionHasEnded() {
            container.removeEventListener("transitionend",whenTransitionHasEnded);
            slides[activeSlide].remove();
            container.removeAttribute("style");
            container.classList.remove(className);
            activeSlide = newSlide;
            isNotSliding = true;
            offset = offset - 1;
            console.log(`${Date.now()} : transition terminée`);
            if (offset !== 0) {
                setTimeout(() => {
                    slide(className, offset);
                }, 0);
            } else {
                setRetardedAutoSliding();
            }
        });
    }
}

function moveToSlide(slideIndex) {
    let delta = slideIndex - activeSlide;
    let className = "";
    if (delta === 0) {
        return;
    } else {
        if (delta > 0) {
            className = "slide-to-right";
        } else {
            className = "slide-to-left";
        }
            slide(className, Math.abs(delta));
    }
}


function setRetardedAutoSliding() {
    retardedAutoSliding = setTimeout(setAutoSlidingInterval,interval);
}

function setAutoSlidingInterval(){
    autoSlidingInterval = setInterval(slide("slide-to-right",1),interval);
}



export { setCarousel };