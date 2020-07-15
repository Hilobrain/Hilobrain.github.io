export class Canvas {
  constructor(parent, height = 16, width = 16) {
    this.parent = parent;
    this.parent.parent.canvas = this;
    this.element = document.createElement('canvas');
    this.element.setAttribute('id', 'canvas');
    this.context = this.element.getContext('2d');
    this.element.setAttribute('height', height);
    this.element.setAttribute('width', width);
    this.element.addEventListener('mousedown', (event) => this.mouseDown = true);
    window.addEventListener('mouseup', (event) => this.mouseUp(event));
    this.element.addEventListener('click', (event) => this.click(event));
    this.element.addEventListener('mousemove', (event) => this.click(event));
    parent.element.appendChild(this.element);
  }

  get color() {
    return this.parent.color;
  }

  set color(color) {
    this.parent.color = color;
  }

  get cursor() {
    return this.parent.cursor;
  }

  set cursor(cursor) {
    this.parent.cursor = cursor;
  }

  get height() {
    return this.element.height;
  }

  set height(height) {
    this.element.setAttribute('height', height);
  }

  get width() {
    return this.element.width;
  }

  set width(width) {
    this.element.setAttribute('width', width);
  }

  get left() {
    return this.element.getBoundingClientRect().left;
  }

  set left(left) {
    this.element.style.left = left + 'px';
  }

  set memory(memory) {
    this.parent.memory = memory;
  }

  get top() {
    return this.element.getBoundingClientRect().top;
  }

  set top(top) {
    this.element.style.top = top + 'px';
  }

  get zoom() {
    return this.zoomLevel;
  }

  set zoom(zoom) {
    this.element.style.height = this.height * zoom + 'px';
    this.element.style.width = this.width * zoom + 'px';
    this.zoomLevel = zoom;
  }

  sameColor(color1, color2) {
    if (
      color1[0] == color2[0] &&
      color1[1] == color2[1] &&
      color1[2] == color2[2] &&
      color1[3] == color2[3]
    ) {
      return true;
    } else {
      return false;
    }
  }

  paint(x, y, color = this.parent.parent.currentColor) {
    const pixel = this.context.createImageData(1, 1);
    for (let i = 0; i < pixel.height * pixel.width; i++) {
      pixel.data[i * 4] = color[0];
      pixel.data[i * 4 + 1] = color[1];
      pixel.data[i * 4 + 2] = color[2];
      pixel.data[i * 4 + 3] = color[3];
    }
    const oldColor = this.sample(x, y);
    if(!this.sameColor(color, oldColor)) {
      this.memory = [pixel, x, y, oldColor];
    }
    this.context.putImageData(pixel, x, y);
  }

  sample(x, y) {
    const pixel = this.context.getImageData(x, y, 1, 1).data;
    const color = [pixel[0], pixel[1], pixel[2], pixel[3]];
    return color;
  }

  click(event) {
    if(
      this.parent.parent.currentTool === 'pencil' &&
      (
        event.type === 'click' ||
        event.type === 'mousemove' && this.mouseDown
      )
    ) {
      const zoom = this.zoom;
      const x = Math.floor(event.layerX / zoom);
      const y = Math.floor(event.layerY / zoom);
      this.paint(x, y);
    } else if(
      this.parent.parent.currentTool === 'dropper' &&
      event.type === 'click'
    ) {
      const zoom = this.zoom;
      const x = Math.floor(event.layerX / zoom);
      const y = Math.floor(event.layerY / zoom);
      this.color = this.sample(x, y);
      this.parent.parent.tool = 'pencil';
    } else if(
      this.parent.parent.currentTool === 'zoom-in' &&
      event.type === 'click'
    ) {
      this.zoom += 1;
    } else if(
      this.parent.parent.currentTool === 'zoom-out' &&
      event.type === 'click' &&
      this.zoom > 1
    ) {
      this.zoom -= 1;
    } else if(
      this.parent.parent.currentTool === 'pan' &&
      event.type === 'mousemove' && this.mouseDown
    ) {
      this.cursor = 'grabbing';
      const top = this.top;
      const left = this.left
      this.top = top + event.movementY;
      this.left = left + event.movementX;
    }
  }

  mouseUp(event) {
    this.mouseDown = false;

    if(this.parent.parent.currentTool === 'pan') {
      this.cursor = 'grab';
    }
  }
}
