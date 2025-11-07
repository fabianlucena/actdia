document.body.addEventListener('mousedown', mouseDownHandler);
document.body.addEventListener('mouseup', mouseUpHandler, true);
document.body.addEventListener('mousemove', mouseMoveHandler);

let draggable = null,
  from = { x: 0, y: 0 },
  mouse = { x: 0, y: 0 },
  init = { x: 0, y: 0 };

function mouseDownHandler(evt) {
  draggable = evt.target?.closest('.draggable');
  if (!draggable)
    return;
  
  draggable.classList.add('dragging');
  from = { x: evt.clientX, y: evt.clientY };

  const rect = draggable.getBoundingClientRect();
  init = { x: rect.left, y: rect.top };
}

function mouseUpHandler(evt) {
  if (!draggable)
    return;
  
  draggable.classList.remove('dragging');
  draggable = null;
}

function mouseMoveHandler(evt) {
  if (!draggable)
    return;

  mouse = { x: evt.clientX, y: evt.clientY };

  const rect = draggable.getBoundingClientRect();
  draggable.style.left = mouse.x - from.x + init.x + 'px';
  draggable.style.top = mouse.y - from.y + init.y + 'px';
}