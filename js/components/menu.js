export class Menu {
  constructor(parent) {
    this.parent = parent;
    this.element = document.createElement('nav');
    this.element.setAttribute('id', 'menu');
    document.body.appendChild(this.element);
  }

  clickMenuItem(item) {
    this.parent.clickMenuItem(item);
  }
}
