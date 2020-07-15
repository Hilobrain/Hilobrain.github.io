export class Main {
  constructor(parent) {
    this.parent = parent;
    this.element = document.createElement('main');
    this.element.setAttribute('id', 'main');
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

  set memory(memory) {
    this.parent.memory = memory;
  }
}
