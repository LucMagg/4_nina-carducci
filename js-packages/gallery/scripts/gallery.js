const packageLocation = "./js-packages/gallery";

let gallery = null;
let galleryContainer = null;
let galleryItems = null;
let filters = new Set;
let filterItems = null;
let activeFilter = 0;
let filteredItems = [];

let modal = null;
let modalContainer = null;
let activeModalItem = 0;


function setGallery(galleryParam, modalParam) {
    loadCSS();
    /* gallery */
    gallery = galleryParam;
    gallery.classList.add("gallery");
    let children = [].slice.call(gallery.children);
    galleryContainer = setContainerElement(gallery, "gallery-container");
    setItemsAndFilters(children);
    displayFilters();
    setFilterListeners();
    setGalleryItemsListeners();

    /* modal*/
    modal = modalParam;
    modal.classList.add("modal");
    modalContainer = setContainerElement(modal, "modal-container");
    setModalButtons();
    /*setModalListeners();*/
}

function loadCSS(){
    if (!document.getElementById("galleryCSS")) {
        let link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = `${packageLocation}/styles/gallery-style.css`;
        link.type = "text/css";
        link.id = "galleryCSS";
        document.head.appendChild(link);
    }
}

/***************************************************** Gallery *****************************************************/
function setContainerElement(parent, classname) {
    let container = document.createElement("div");
    container.className = classname;
    parent.appendChild(container);
    return container;
}

function setItemsAndFilters(children) {
    filters.add("Tous");
    galleryItems = children.map((child) => {
        let galleryItem = document.createElement("div");
        galleryItem.className = "gallery-item";
        galleryItem.setAttribute("data-gallery", child.getAttribute("data-gallery"));
        filters.add(child.getAttribute("data-gallery"));
        child.removeAttribute("data-gallery");
        galleryItem.appendChild(child);
        galleryContainer.appendChild(galleryItem);
        return galleryItem;
    });
    for (let i = 0; i < galleryItems.length; i++) {
        filteredItems.push([i,galleryItems[i]])
    }
}

function displayFilters() {
    let filterContainer = document.createElement("ul");
    filterContainer.className = "filter-container";
    filters.forEach(filter => {
        let li = document.createElement("li");
        li.className = "filter-item";
        li.innerHTML = filter;
        filterContainer.appendChild(li);
    });
    gallery.insertBefore(filterContainer, gallery.firstChild);
    filterItems = filterContainer.children;
    filterItems[0].classList.add("active");
}

function setFilterListeners() {
    for (let i= 0; i < filterItems.length; i++) {
        filterItems[i].addEventListener("click", () => {
            filteredItems = [];
            for (let j = 0; j < galleryItems.length; j++) {
                if (filterItems[i].innerHTML === galleryItems[j].getAttribute("data-gallery") || filterItems[i].innerHTML === "Tous") {
                    galleryItems[j].removeAttribute("style");
                    filteredItems.push([j,galleryItems[j]]);
                } else {
                    galleryItems[j].style.display = "None";
                }
            }
            filterItems[activeFilter].classList.remove("active");
            filterItems[i].classList.add("active");
            activeFilter = i;
            console.log(filteredItems);
        })
    }
}

function setGalleryItemsListeners() {
    for (let i = 0; i < galleryItems.length; i++) {
        galleryItems[i].addEventListener("click", () => {
            displayModal(i);
        })
    }
}


/***************************************************** Modal /*****************************************************/

function setModalButtons() {
    for (let i = 0; i < 2; i++) {
        let button = document.createElement("button");
        button.className = "modal-button";
        button.type = "button";
        button.innerHTML = "^";
        if (i === 0) {
            button.classList.add("modal-left-button");
            button.ariaLabel = "Précédent";
            button.addEventListener("click", () => {changeModalPic(-1)});
        } else {
            button.classList.add("modal-right-button");
            button.ariaLabel = "Suivant";
            button.addEventListener("click", () => {changeModalPic(1)});
        }   
        modal.appendChild(button);
    }
}

function displayModal(galleryItemInModal) {
    modalContainer.innerHTML = "";
    modalContainer.appendChild(galleryItems[galleryItemInModal].firstChild.cloneNode(true));
    activeModalItem = galleryItemInModal;
    modal.showModal();
}

function changeModalPic(offset) {
    let changeIsDone = false;
    while (!changeIsDone) {
        activeModalItem = activeModalItem + offset;
        if (activeModalItem < 0) {
            activeModalItem = galleryItems.length - 1;
        }
        if (activeModalItem === galleryItems.length) {
            activeModalItem = 0;
        }
        for (let i = 0; i < filteredItems.length; i++) {
            if (filteredItems[i][0] === activeModalItem) {
                modalContainer.innerHTML = "";
                modalContainer.appendChild(galleryItems[activeModalItem].firstChild.cloneNode(true));
                changeIsDone = true;
                break;
            }
        }
    }
}

export { setGallery };