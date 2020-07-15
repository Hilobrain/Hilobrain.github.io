export class Color {
  constructor(parent, palette, index) {
    this.parent = parent;
    this.element = document.createElement('button');
    this.element.setAttribute('id', `${palette}-${index}`);
    this.element.setAttribute('name', palette);
    this.element.setAttribute('value', index);
    this.element.classList.add('color');

    this.element.addEventListener('click', (event) => this.click(event));
    this.element.style.backgroundColor = palette[index];

    parent.element.appendChild(this.element);
  }

  get color() {
    const color = this.element.style.backgroundColor.replace(/[^\d,]/g, '').split(',');
    color.push(255);
    return color;
  }

  click() {
    this.parent.color = this.color;
    this.parent.tool = 'pencil';
  }
}
