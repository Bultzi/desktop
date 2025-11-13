/**
 * Whiteboard App JavaScript - Vollständige Funktionalität
 */

let whiteboardState = {
  currentTool: "freehand",
  currentColor: "#000000",
  canvas: null,
  ctx: null,
  isDrawing: false,
  startX: 0,
  startY: 0,
  imageData: null,
  appIconCounter: 0,
  draggedIcon: null,
  iconOffset: { x: 0, y: 0 },
};

let draggedText = null;
let textDragOffset = { x: 0, y: 0 };
let isDraggingText = false;

function initWhiteboardApp(windowId) {
  setTimeout(() => {
    const container = document.querySelector("#canvas-container");
    const canvas = document.querySelector("#whiteboard-canvas");
    if (!canvas || !container) {
      console.error("Canvas or container not found");
      return;
    }

    const setupCanvasSize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      // Set CSS size
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
      // Set internal pixel size
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      whiteboardState.ctx = canvas.getContext("2d");
      whiteboardState.ctx.setTransform(1, 0, 0, 1, 0, 0);
      whiteboardState.ctx.scale(dpr, dpr);
      whiteboardState.ctx.lineWidth = 3;
      whiteboardState.ctx.strokeStyle = whiteboardState.currentColor;
      whiteboardState.ctx.fillStyle = whiteboardState.currentColor;
      whiteboardState.ctx.lineCap = "round";
      whiteboardState.ctx.lineJoin = "round";
    };

    whiteboardState.canvas = canvas;
    whiteboardState.ctx = canvas.getContext("2d");
    setupCanvasSize();

    // Remove any existing listeners to prevent duplicates
    canvas.removeEventListener("mousedown", startWhiteboardDraw);
    canvas.removeEventListener("mousemove", whiteboardDraw);
    canvas.removeEventListener("mouseup", endWhiteboardDraw);
    canvas.removeEventListener("mouseleave", endWhiteboardDraw);

    // Add event listeners
    canvas.addEventListener("mousedown", startWhiteboardDraw);
    canvas.addEventListener("mousemove", whiteboardDraw);
    canvas.addEventListener("mouseup", endWhiteboardDraw);
    canvas.addEventListener("mouseleave", endWhiteboardDraw);

    // Handle window/container resize
    const resizeObserver = new ResizeObserver(() => {
      // Preserve current drawing when resizing
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      const snapshot = whiteboardState.ctx.getImageData(
        0,
        0,
        Math.floor(rect.width * dpr),
        Math.floor(rect.height * dpr)
      );
      setupCanvasSize();
      try {
        whiteboardState.ctx.putImageData(snapshot, 0, 0);
      } catch (e) {
        // Ignore if sizes mismatch (small -> big). We'll skip restoring to avoid errors.
      }
    });
    resizeObserver.observe(container);

    console.log("Whiteboard initialized:", canvas.width, "x", canvas.height);
  }, 150);
}

function selectTool(tool) {
  whiteboardState.currentTool = tool;
  document.querySelectorAll(".tool-btn[data-tool]").forEach((btn) => {
    btn.classList.remove("active");
    if (btn.dataset.tool === tool) {
      btn.classList.add("active");
    }
  });

  // Change cursor for text tool
  if (whiteboardState.canvas) {
    whiteboardState.canvas.style.cursor =
      tool === "text" ? "text" : "crosshair";
  }
}

function selectColor(color) {
  whiteboardState.currentColor = color;
  if (whiteboardState.ctx) {
    whiteboardState.ctx.strokeStyle = color;
    whiteboardState.ctx.fillStyle = color;
  }

  document.querySelectorAll(".color-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  if (event && event.currentTarget) {
    event.currentTarget.classList.add("active");
  }
}

function toggleIconDropdown() {
  const dropdown = document.getElementById("icon-dropdown");
  if (!dropdown) return;

  const isVisible = dropdown.style.display !== "none";
  dropdown.style.display = isVisible ? "none" : "block";

  if (!isVisible) {
    // Close dropdown when clicking outside
    setTimeout(() => {
      document.addEventListener("click", closeIconDropdown);
    }, 10);
  }
}

function closeIconDropdown(e) {
  const dropdown = document.getElementById("icon-dropdown");
  const btn = document.getElementById("icon-dropdown-btn");

  if (
    dropdown &&
    btn &&
    !dropdown.contains(e.target) &&
    !btn.contains(e.target)
  ) {
    dropdown.style.display = "none";
    document.removeEventListener("click", closeIconDropdown);
  }
}

function clearWhiteboard() {
  if (!whiteboardState.ctx || !whiteboardState.canvas) return;

  if (confirm("Möchtest du das gesamte Whiteboard löschen?")) {
    whiteboardState.ctx.clearRect(
      0,
      0,
      whiteboardState.canvas.width,
      whiteboardState.canvas.height
    );

    // Also remove all text and icon elements
    const container = document.querySelector("#canvas-container");
    if (container) {
      container
        .querySelectorAll(".canvas-text-element, .canvas-app-icon")
        .forEach((el) => el.remove());
    }
  }
}

function startWhiteboardDraw(e) {
  e.preventDefault();

  const rect = whiteboardState.canvas.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;

  // Handle text tool
  if (whiteboardState.currentTool === "text") {
    addTextElement(clickX, clickY);
    return;
  }

  whiteboardState.isDrawing = true;
  whiteboardState.startX = clickX;
  whiteboardState.startY = clickY;

  if (whiteboardState.currentTool === "freehand") {
    whiteboardState.ctx.beginPath();
    whiteboardState.ctx.moveTo(whiteboardState.startX, whiteboardState.startY);
  } else if (whiteboardState.currentTool === "eraser") {
    whiteboardState.ctx.globalCompositeOperation = "destination-out";
    whiteboardState.ctx.beginPath();
    whiteboardState.ctx.moveTo(whiteboardState.startX, whiteboardState.startY);
  } else if (whiteboardState.currentTool === "fill") {
    floodFill(
      whiteboardState.startX,
      whiteboardState.startY,
      whiteboardState.currentColor
    );
    whiteboardState.isDrawing = false;
  } else {
    // Store the current canvas state for shape tools
    whiteboardState.imageData = whiteboardState.ctx.getImageData(
      0,
      0,
      whiteboardState.canvas.width,
      whiteboardState.canvas.height
    );
  }
}

function whiteboardDraw(e) {
  if (!whiteboardState.isDrawing) return;
  e.preventDefault();

  const rect = whiteboardState.canvas.getBoundingClientRect();
  const currentX = e.clientX - rect.left;
  const currentY = e.clientY - rect.top;

  if (whiteboardState.currentTool === "freehand") {
    whiteboardState.ctx.lineTo(currentX, currentY);
    whiteboardState.ctx.stroke();
  } else if (whiteboardState.currentTool === "eraser") {
    whiteboardState.ctx.lineTo(currentX, currentY);
    whiteboardState.ctx.lineWidth = 20;
    whiteboardState.ctx.stroke();
  } else {
    // For shape tools, restore canvas and draw preview
    whiteboardState.ctx.putImageData(whiteboardState.imageData, 0, 0);

    const ctx = whiteboardState.ctx;
    ctx.strokeStyle = whiteboardState.currentColor;
    ctx.lineWidth = 3;

    if (whiteboardState.currentTool === "circle") {
      const radius = Math.sqrt(
        Math.pow(currentX - whiteboardState.startX, 2) +
          Math.pow(currentY - whiteboardState.startY, 2)
      );
      ctx.beginPath();
      ctx.arc(
        whiteboardState.startX,
        whiteboardState.startY,
        radius,
        0,
        Math.PI * 2
      );
      ctx.stroke();
    } else if (whiteboardState.currentTool === "rectangle") {
      const width = currentX - whiteboardState.startX;
      const height = currentY - whiteboardState.startY;
      ctx.beginPath();
      ctx.rect(whiteboardState.startX, whiteboardState.startY, width, height);
      ctx.stroke();
    } else if (whiteboardState.currentTool === "arrow") {
      drawArrow(
        ctx,
        whiteboardState.startX,
        whiteboardState.startY,
        currentX,
        currentY
      );
    }
  }
}

function endWhiteboardDraw(e) {
  if (!whiteboardState.isDrawing) return;
  whiteboardState.isDrawing = false;

  if (whiteboardState.currentTool === "freehand") {
    whiteboardState.ctx.closePath();
  } else if (whiteboardState.currentTool === "eraser") {
    whiteboardState.ctx.closePath();
    whiteboardState.ctx.globalCompositeOperation = "source-over";
    whiteboardState.ctx.lineWidth = 3;
  } else {
    // For shapes, the final drawing is already done in whiteboardDraw
    const rect = whiteboardState.canvas.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    const ctx = whiteboardState.ctx;
    ctx.strokeStyle = whiteboardState.currentColor;
    ctx.lineWidth = 3;

    if (whiteboardState.currentTool === "circle") {
      const radius = Math.sqrt(
        Math.pow(endX - whiteboardState.startX, 2) +
          Math.pow(endY - whiteboardState.startY, 2)
      );
      ctx.beginPath();
      ctx.arc(
        whiteboardState.startX,
        whiteboardState.startY,
        radius,
        0,
        Math.PI * 2
      );
      ctx.stroke();
    } else if (whiteboardState.currentTool === "rectangle") {
      const width = endX - whiteboardState.startX;
      const height = endY - whiteboardState.startY;
      ctx.beginPath();
      ctx.rect(whiteboardState.startX, whiteboardState.startY, width, height);
      ctx.stroke();
    } else if (whiteboardState.currentTool === "arrow") {
      drawArrow(
        ctx,
        whiteboardState.startX,
        whiteboardState.startY,
        endX,
        endY
      );
    }
  }
}

function floodFill(startX, startY, fillColor) {
  const canvas = whiteboardState.canvas;
  const ctx = whiteboardState.ctx;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  startX = Math.floor(startX);
  startY = Math.floor(startY);

  const startPos = (startY * canvas.width + startX) * 4;
  const startR = pixels[startPos];
  const startG = pixels[startPos + 1];
  const startB = pixels[startPos + 2];
  const startA = pixels[startPos + 3];

  // Convert fill color to RGB
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");
  tempCtx.fillStyle = fillColor;
  tempCtx.fillRect(0, 0, 1, 1);
  const tempData = tempCtx.getImageData(0, 0, 1, 1).data;
  const fillR = tempData[0];
  const fillG = tempData[1];
  const fillB = tempData[2];

  // Don't fill if clicking on the same color
  if (startR === fillR && startG === fillG && startB === fillB) {
    return;
  }

  const pixelStack = [[startX, startY]];
  const width = canvas.width;
  const height = canvas.height;

  while (pixelStack.length > 0) {
    const [x, y] = pixelStack.pop();
    let currentPos = (y * width + x) * 4;

    while (
      y >= 0 &&
      matchStartColor(pixels, currentPos, startR, startG, startB, startA)
    ) {
      currentPos -= width * 4;
    }

    currentPos += width * 4;
    let reachLeft = false;
    let reachRight = false;
    let currentY = Math.floor(currentPos / 4 / width);

    while (
      currentY < height &&
      matchStartColor(pixels, currentPos, startR, startG, startB, startA)
    ) {
      pixels[currentPos] = fillR;
      pixels[currentPos + 1] = fillG;
      pixels[currentPos + 2] = fillB;
      pixels[currentPos + 3] = 255;

      const currentX = Math.floor((currentPos / 4) % width);

      if (currentX > 0) {
        if (
          matchStartColor(
            pixels,
            currentPos - 4,
            startR,
            startG,
            startB,
            startA
          )
        ) {
          if (!reachLeft) {
            pixelStack.push([currentX - 1, currentY]);
            reachLeft = true;
          }
        } else if (reachLeft) {
          reachLeft = false;
        }
      }

      if (currentX < width - 1) {
        if (
          matchStartColor(
            pixels,
            currentPos + 4,
            startR,
            startG,
            startB,
            startA
          )
        ) {
          if (!reachRight) {
            pixelStack.push([currentX + 1, currentY]);
            reachRight = true;
          }
        } else if (reachRight) {
          reachRight = false;
        }
      }

      currentPos += width * 4;
      currentY++;

      if (pixelStack.length > 50000) break; // Prevent infinite loops
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function matchStartColor(pixels, pos, r, g, b, a) {
  return (
    pixels[pos] === r &&
    pixels[pos + 1] === g &&
    pixels[pos + 2] === b &&
    pixels[pos + 3] === a
  );
}

function drawArrow(ctx, fromX, fromY, toX, toY) {
  const headLength = 20;
  const angle = Math.atan2(toY - fromY, toX - fromX);

  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - headLength * Math.cos(angle - Math.PI / 6),
    toY - headLength * Math.sin(angle - Math.PI / 6)
  );
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - headLength * Math.cos(angle + Math.PI / 6),
    toY - headLength * Math.sin(angle + Math.PI / 6)
  );
  ctx.stroke();
}

function addAppIcon(icon, name) {
  const container = document.querySelector("#canvas-container");
  if (!container) return;

  const iconDiv = document.createElement("div");
  iconDiv.className = "canvas-app-icon";
  iconDiv.innerHTML = `
        <div class="canvas-app-icon-image">${icon}</div>
        <div class="canvas-app-icon-label">${name}</div>
    `;

  const x = 100 + ((whiteboardState.appIconCounter * 30) % 400);
  const y = 100 + Math.floor(whiteboardState.appIconCounter / 10) * 100;
  iconDiv.style.left = x + "px";
  iconDiv.style.top = y + "px";

  iconDiv.addEventListener("mousedown", startIconDrag);
  container.appendChild(iconDiv);

  whiteboardState.appIconCounter++;

  // Close dropdown after selection
  const dropdown = document.getElementById("icon-dropdown");
  if (dropdown) {
    dropdown.style.display = "none";
  }
}

function addTextElement(x, y) {
  const container = document.querySelector("#canvas-container");
  if (!container) return;

  const textDiv = document.createElement("div");
  textDiv.className = "canvas-text-element";
  textDiv.contentEditable = "true";
  textDiv.style.left = x + "px";
  textDiv.style.top = y + "px";
  textDiv.style.color = whiteboardState.currentColor;
  textDiv.innerText = "Text";

  // Event handlers
  textDiv.addEventListener("mousedown", startTextDrag);
  textDiv.addEventListener("focus", () => {
    textDiv.classList.add("editing");
  });
  textDiv.addEventListener("blur", () => {
    textDiv.classList.remove("editing");
    if (textDiv.innerText.trim() === "") {
      textDiv.remove();
    }
  });

  container.appendChild(textDiv);

  // Focus and select text for immediate editing
  setTimeout(() => {
    textDiv.focus();
    const range = document.createRange();
    range.selectNodeContents(textDiv);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }, 10);
}

function startTextDrag(e) {
  // Only drag if not editing
  if (e.target.classList.contains("editing")) return;

  e.stopPropagation();
  draggedText = e.currentTarget;
  isDraggingText = true;

  const rect = draggedText.getBoundingClientRect();
  const container = document.querySelector("#canvas-container");
  const containerRect = container.getBoundingClientRect();

  textDragOffset = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };

  draggedText.style.zIndex = "1000";
  draggedText.style.userSelect = "none";
}

document.addEventListener("mousemove", (e) => {
  // Handle text dragging
  if (draggedText && isDraggingText) {
    const container = document.querySelector("#canvas-container");
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    let newX = e.clientX - containerRect.left - textDragOffset.x;
    let newY = e.clientY - containerRect.top - textDragOffset.y;

    newX = Math.max(
      0,
      Math.min(newX, containerRect.width - draggedText.offsetWidth)
    );
    newY = Math.max(
      0,
      Math.min(newY, containerRect.height - draggedText.offsetHeight)
    );

    draggedText.style.left = newX + "px";
    draggedText.style.top = newY + "px";
  }

  // Handle icon dragging
  if (whiteboardState.draggedIcon) {
    const container = document.querySelector("#canvas-container");
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    let newX = e.clientX - containerRect.left - whiteboardState.iconOffset.x;
    let newY = e.clientY - containerRect.top - whiteboardState.iconOffset.y;

    newX = Math.max(
      0,
      Math.min(
        newX,
        containerRect.width - whiteboardState.draggedIcon.offsetWidth
      )
    );
    newY = Math.max(
      0,
      Math.min(
        newY,
        containerRect.height - whiteboardState.draggedIcon.offsetHeight
      )
    );

    whiteboardState.draggedIcon.style.left = newX + "px";
    whiteboardState.draggedIcon.style.top = newY + "px";
  }
});

document.addEventListener("mouseup", () => {
  if (draggedText) {
    draggedText.style.zIndex = "";
    draggedText.style.userSelect = "";
    draggedText = null;
    isDraggingText = false;
  }

  if (whiteboardState.draggedIcon) {
    whiteboardState.draggedIcon.style.zIndex = "";
    whiteboardState.draggedIcon = null;
  }
});

function startIconDrag(e) {
  e.stopPropagation();
  whiteboardState.draggedIcon = e.currentTarget;
  const rect = whiteboardState.draggedIcon.getBoundingClientRect();
  const container = document.querySelector("#canvas-container");
  const containerRect = container.getBoundingClientRect();

  whiteboardState.iconOffset = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };

  whiteboardState.draggedIcon.style.zIndex = "1000";
}

// Expose API globally so inline handlers work reliably
window.initWhiteboardApp = initWhiteboardApp;
window.selectTool = selectTool;
window.selectColor = selectColor;
window.toggleIconDropdown = toggleIconDropdown;
window.closeIconDropdown = closeIconDropdown;
window.clearWhiteboard = clearWhiteboard;
window.addAppIcon = addAppIcon;
