const upload = document.getElementById("upload");
const uploadedImage = document.getElementById("uploaded-image");
const iconContainer = document.getElementById("icon-container");
const sizeRadios = document.querySelectorAll('input[name="size"]');
const stars = document.getElementById("stars");
const rank = document.getElementById("rank");

let isDragging = false;
let startX, startY, initialX, initialY;

sizeRadios.forEach((radio) => {
  radio.addEventListener("change", (e) => {
    if (e.target.value === "huge") {
      stars.src = "gold_star_full.png";
      rank.src = "huge_rank.png";
      stars.classList.remove("titanic");
      stars.classList.add("huge");
      rank.classList.remove("titanic");
      rank.classList.add("huge");
    } else {
      stars.src = "titanic_crown.png";
      rank.src = "titanic_rank.png";
      stars.classList.remove("huge");
      stars.classList.add("titanic");
      rank.classList.remove("huge");
      rank.classList.add("titanic");
    }
  });
});

const loadImage = (file) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    uploadedImage.src = event.target.result;
    uploadedImage.style.display = "block";
    uploadedImage.style.width = "";
    uploadedImage.style.height = "";
  };
  reader.readAsDataURL(file);
};

upload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    loadImage(file);
  }
});

document.addEventListener("dragover", (e) => {
  e.preventDefault();
});

document.addEventListener("drop", (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (file) {
    loadImage(file);
  }
});

// Dragging for mouse events
uploadedImage.addEventListener("mousedown", (e) => {
  e.preventDefault(); // Prevent default drag behavior
  isDragging = true;
  startX = e.clientX - uploadedImage.offsetLeft;
  startY = e.clientY - uploadedImage.offsetTop;
  document.body.style.cursor = "grabbing";
  uploadedImage.style.cursor = "grabbing";
});

window.addEventListener("mouseup", () => {
  isDragging = false;
  document.body.style.cursor = "default";
  uploadedImage.style.cursor = "grab";
});

window.addEventListener("mousemove", (e) => {
  if (isDragging) {
    let x = e.clientX - startX;
    let y = e.clientY - startY;
    uploadedImage.style.left = `${x}px`;
    uploadedImage.style.top = `${y}px`;
  }
});

// Touch events for mobile
uploadedImage.addEventListener("touchstart", (e) => {
  e.preventDefault();
  isDragging = true;
  const touch = e.touches[0];
  startX = touch.clientX - uploadedImage.offsetLeft;
  startY = touch.clientY - uploadedImage.offsetTop;
  initialX = uploadedImage.offsetLeft;
  initialY = uploadedImage.offsetTop;
});

uploadedImage.addEventListener("touchmove", (e) => {
  if (isDragging) {
    const touch = e.touches[0];
    let x = touch.clientX - startX;
    let y = touch.clientY - startY;
    uploadedImage.style.left = `${x}px`;
    uploadedImage.style.top = `${y}px`;
  }
});

uploadedImage.addEventListener("touchend", () => {
  isDragging = false;
});

// Scaling for both mouse and touch events
iconContainer.addEventListener("wheel", (e) => {
  e.preventDefault();
  let scale = 1 - e.deltaY * 0.005; // Slower scaling
  let width = uploadedImage.offsetWidth * scale;
  let height = uploadedImage.offsetHeight * scale;
  if (width > 50 && height > 50) {
    // Prevent the image from getting too small
    uploadedImage.style.width = `${width}px`;
    uploadedImage.style.height = `${height}px`;
  }
});

let initialDistance = null;

iconContainer.addEventListener("touchmove", (e) => {
  if (e.touches.length == 2) {
    e.preventDefault();
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];

    const currentDistance = Math.hypot(
      touch1.clientX - touch2.clientX,
      touch1.clientY - touch2.clientY
    );

    if (initialDistance == null) {
      initialDistance = currentDistance;
    }

    const scale = currentDistance / initialDistance;

    let width = uploadedImage.offsetWidth * scale;
    let height = uploadedImage.offsetHeight * scale;

    if (width > 50 && height > 50) {
      uploadedImage.style.width = `${width}px`;
      uploadedImage.style.height = `${height}px`;
    }

    initialDistance = currentDistance;
  }
});

iconContainer.addEventListener("touchend", (e) => {
  if (e.touches.length < 2) {
    initialDistance = null;
  }
});

// Prevent default drag behavior on the image
uploadedImage.addEventListener("dragstart", (e) => {
  e.preventDefault();
});

// Download Function
function downloadIcon() {
  // Create a canvas
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const outerContainer = document.getElementById("canvas-container");

  // Set canvas dimensions to match outer-container
  canvas.width = outerContainer.offsetWidth;
  canvas.height = outerContainer.offsetHeight;

  // Use html2canvas to capture the container's contents
  html2canvas(outerContainer).then((canvas) => {
    // Create a link element for download
    const link = document.createElement("a");
    link.download = "icon-creator.png";
    link.href = canvas.toDataURL();
    link.click(); // Trigger download
  });
}

// Add a download button
const downloadButton = document.getElementById("download-button");
downloadButton.addEventListener("click", downloadIcon);
document.body.appendChild(downloadButton);
