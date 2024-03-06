const header = document.getElementById("header");
const menuButton = document.getElementById("menu-button");
const menuOpenIcon = document.getElementById("menu-open-icon");
const menuCloseIcon = document.getElementById("menu-close-icon");
const buttonCounter = document.getElementById("button-counter");
const iconCounter = document.getElementById("icon-counter");
const addToCartButton = document.getElementById("add-to-cart-button");
const cartIcon = document.getElementById("cart-icon");
const cartPreview = document.getElementById("cart-preview");
const cartContent = document.getElementById("cart-content");
const emptyMessage = document.getElementById("empty-message");
const previewAmount = document.getElementById("preview-amount");
const previewFinalPrice = document.getElementById("preview-final-price");
const removeItemButton = document.getElementById("remove-item-button");
const productPrice = document.getElementById("product-price");
const galleryMode = document.getElementById("gallery-mode");
const openGalleryButton = document.getElementById("open-gallery-button");
const thumbnailRows = document.querySelectorAll("[data-thumbnail-row]");
const imageRows = document.querySelectorAll("[data-image-row]");
const imageRow = imageRows[0];
const totalImagesNumber = imageRow.children.length;

let currentImageIndex = 0;
let timerId;

function toggleMobileMenuState(event) {
  const isOpen = header.classList.contains("menu--open");
  const isMenuButton = event.target.closest("#menu-button");
  const isMenuLink = event.target.closest("[data-menu-link]");
  const isClickedOutside = event.clientX > 250;

  if (isMenuButton && !isOpen) {
    header.classList.add("menu--open");
    document.body.classList.add("overflow-hidden");
    toggleFocusabilityBeneath("nav");
  } else if (isOpen && (isMenuButton || isMenuLink || isClickedOutside)) {
    header.classList.remove("menu--open");
    document.body.classList.remove("overflow-hidden");
    toggleFocusabilityBeneath("nav", true);
  }

  toggleMenuButtonState();
}

function toggleMenuButtonState() {
  const isOpen = header.classList.contains("menu--open");
  menuOpenIcon.classList.toggle("hidden", isOpen);
  menuCloseIcon.classList.toggle("hidden", !isOpen);
}

function handleThumbnailClick(event) {
  const thumbnailButton = event.target.closest("[data-thumbnail]");
  if (!thumbnailButton) return;

  const thumbnailRow = thumbnailButton.closest("[data-thumbnail-row]");
  currentImageIndex = Array.from(thumbnailRow.children).indexOf(
    thumbnailButton.parentNode,
  );

  updateActiveThumbnail();
  updateLargeImage();
}

function updateActiveThumbnail() {
  for (let thumbnailRow of thumbnailRows) {
    const currentActive = thumbnailRow.querySelector(".thumbnail--active");
    const newActive =
      thumbnailRow.children[currentImageIndex].firstElementChild;

    if (currentActive) {
      currentActive.classList.remove("thumbnail--active");
    }
    newActive.classList.add("thumbnail--active");
  }
}

function updateLargeImage() {
  for (let imageRow of imageRows) {
    imageRow.style.transform = `translateX(${-currentImageIndex * 100}%)`;
  }
}

function handleArrowButtonClick(event) {
  let target = event.target.closest("[data-arrow]");
  if (!target) return;

  target.dataset.arrow === "prev"
    ? setAdjacentImageIndex(true)
    : setAdjacentImageIndex();
  updateActiveThumbnail();
  updateLargeImage();
}

function handleArrowKeydown(event) {
  const isOpen = galleryMode.classList.contains("gallery--open");

  if ((event.key !== "ArrowLeft" && event.key !== "ArrowRight") || !isOpen)
    return;

  event.key === "ArrowLeft"
    ? setAdjacentImageIndex(true)
    : setAdjacentImageIndex();
  updateActiveThumbnail();
  updateLargeImage();
}

function setAdjacentImageIndex(prev = false) {
  if (prev) {
    currentImageIndex =
      currentImageIndex === 0
        ? totalImagesNumber - 1
        : Math.max(0, currentImageIndex - 1);
  } else {
    currentImageIndex =
      currentImageIndex === totalImagesNumber - 1
        ? 0
        : Math.min(totalImagesNumber - 1, currentImageIndex + 1);
  }
}

function handleImageSwipe(event) {
  if (document.documentElement.clientWidth >= 880) return;

  const pointerStartX = event.clientX;
  let deltaX;

  function handlePointerMove(event) {
    deltaX = event.clientX - pointerStartX;

    if (currentImageIndex === 0 && deltaX > 0) return;
    if (currentImageIndex === totalImagesNumber - 1 && deltaX < 0) return;

    const initialTranslateX = -currentImageIndex * 100;
    const additionalTranslateX = (deltaX / imageRow.offsetWidth) * 100;

    imageRow.style.transform = `translateX(${initialTranslateX + additionalTranslateX}%)`;
  }

  function handlePointerUp() {
    const threshold = imageRow.offsetWidth / 2;

    if (deltaX > threshold && currentImageIndex > 0) {
      currentImageIndex--;
    } else if (
      deltaX < -threshold &&
      currentImageIndex < imageRow.children.length - 1
    ) {
      currentImageIndex++;
    }

    updateLargeImage();

    imageRow.removeEventListener("pointermove", handlePointerMove);
    imageRow.removeEventListener("pointerup", handlePointerUp);
  }

  imageRow.addEventListener("pointermove", handlePointerMove);
  imageRow.addEventListener("pointerup", handlePointerUp);
}

function toggleGalleryMode(event) {
  if (document.documentElement.clientWidth < 880) return;
  if (event.type === "keydown" && event.key !== "Enter") return;

  const isOpen = galleryMode.classList.contains("gallery--open");
  const isOpenGalleryButton =
    event.target.closest("#open-gallery-button") || event.key === "Enter";
  const isArrowButton = event.target.closest("[data-arrow]");
  const isThumbnailButton = event.target.closest("[data-thumbnail]");
  const galleryRect = document
    .getElementById("gallery-container")
    .getBoundingClientRect();
  const isClickedOutside =
    event.clientX < galleryRect.left ||
    event.clientX > galleryRect.right ||
    event.clientY < galleryRect.top ||
    event.clientY > galleryRect.bottom;

  if (!isOpen && isOpenGalleryButton) {
    galleryMode.classList.add("gallery--open");
    toggleFocusabilityBeneath("#gallery-mode");
  } else if (
    isOpen &&
    isClickedOutside &&
    !isArrowButton &&
    !isThumbnailButton
  ) {
    galleryMode.classList.remove("gallery--open");
    toggleFocusabilityBeneath("#gallery-mode", true);
  }
}

function disableGalleryModeOnMobile() {
  if (document.documentElement.clientWidth < 880) {
    galleryMode.classList.remove("gallery--open");
    toggleFocusabilityBeneath("#gallery-mode", true);
  }
}

function toggleFocusabilityBeneath(closestSelector, enable = false) {
  const interactiveElements = document.querySelectorAll("button, input, a");

  if (enable) {
    interactiveElements.forEach((element) => {
      element.disabled = false;
      element.removeAttribute("tabindex");
    });
  } else {
    interactiveElements.forEach((element) => {
      if (!element.closest(closestSelector)) {
        element.disabled = true;
        element.setAttribute("tabindex", "-1");
      }
    });
  }
}

function handleCounterButtonClick(event) {
  const target = event.target.closest("#minus-button, #plus-button");
  if (!target) return;

  if (target.id === "minus-button" && buttonCounter.textContent > 0) {
    buttonCounter.textContent--;
  } else if (target.id === "plus-button") {
    buttonCounter.textContent++;
  }
}

function handleAddToCartButtonClick() {
  if (buttonCounter.textContent === "0") return;

  iconCounter.textContent = buttonCounter.textContent;
  iconCounter.classList.remove("opacity-0");
  iconCounter.classList.add("opacity-100");

  updateCartPreviewContent();
}

function updateCartPreviewContent() {
  const parsedPrice = productPrice.textContent.slice(1);

  previewAmount.textContent = buttonCounter.textContent;

  previewFinalPrice.textContent = `$${(
    buttonCounter.textContent * parsedPrice
  ).toFixed(2)}`;

  cartContent.classList.remove("hidden");
  emptyMessage.classList.add("hidden");
}

function handlePreviewClick(event) {
  const isHidden = cartPreview.classList.contains("opacity-0");
  const isCartIcon = event.target.closest("#cart-icon");
  const isClickedInside = event.target.closest("#cart-preview");

  if (isHidden && isCartIcon) {
    showCartPreview();
  } else if (!isHidden && (isCartIcon || !isClickedInside)) {
    hideCartPreview();
  }
}

function handlePreviewPointerenter() {
  if (document.documentElement.clientWidth < 880) return;

  showCartPreview();
}

function handlePreviewPointerleave() {
  if (document.documentElement.clientWidth < 880) return;

  timerId = setTimeout(() => {
    hideCartPreview();
  }, 300);
}

function showCartPreview() {
  if (iconCounter.textContent === "0") return;

  clearTimeout(timerId);

  positionCartPreview();

  cartPreview.classList.remove("opacity-0");
  cartPreview.classList.add("opacity-100");
  cartPreview.classList.remove("pointer-events-none");
  cartPreview.tabIndex = "";
  cartPreview.addEventListener("pointerenter", handlePreviewPointerenter);
}

function hideCartPreview() {
  cartPreview.classList.remove("opacity-100");
  cartPreview.classList.add("opacity-0");
  cartPreview.classList.add("pointer-events-none");
  cartPreview.tabIndex = "-1";
  cartPreview.removeEventListener("pointerenter", handlePreviewPointerenter);
}

function positionCartPreview() {
  const cartIconRect = cartIcon.getBoundingClientRect();

  let coordsLeft;

  if (document.documentElement.clientWidth >= 640) {
    cartPreview.classList.remove("-translate-x-1/2");

    coordsLeft = cartIconRect.left - 166;

    if (
      coordsLeft >
      document.documentElement.clientWidth - cartPreview.offsetWidth - 24
    ) {
      coordsLeft =
        document.documentElement.clientWidth - cartPreview.offsetWidth - 24;
    }

    cartPreview.style.left = `${coordsLeft}px`;
    cartPreview.style.top = `${94}px`;
  }

  if (document.documentElement.clientWidth < 880) {
    cartPreview.style.top = `${76}px`;
  }

  if (document.documentElement.clientWidth < 640) {
    cartPreview.style.left = "50%";
    cartPreview.classList.add("-translate-x-1/2");
  }
}

function handleRemoveItemButtonClick() {
  cartContent.classList.add("hidden");
  emptyMessage.classList.remove("hidden");

  iconCounter.textContent = 0;
  iconCounter.classList.remove("opacity-100");
  iconCounter.classList.add("opacity-0");
}

function init() {
  document.addEventListener("click", handleArrowButtonClick);
  document.addEventListener("keydown", handleArrowKeydown);
  document.addEventListener("click", toggleMobileMenuState);
  document.addEventListener("click", handleThumbnailClick);
  imageRow.addEventListener("pointerdown", handleImageSwipe);
  document.addEventListener("click", toggleGalleryMode);
  openGalleryButton.addEventListener("keydown", toggleGalleryMode);
  window.addEventListener("resize", disableGalleryModeOnMobile);
  document.addEventListener("click", handleCounterButtonClick);
  addToCartButton.addEventListener("click", handleAddToCartButtonClick);
  document.addEventListener("click", handlePreviewClick);
  cartIcon.addEventListener("pointerenter", handlePreviewPointerenter);
  cartIcon.addEventListener("pointerleave", handlePreviewPointerleave);
  cartPreview.addEventListener("pointerleave", handlePreviewPointerleave);
  window.addEventListener("resize", showCartPreview);
  removeItemButton.addEventListener("click", handleRemoveItemButtonClick);
  updateActiveThumbnail();
}

init();
