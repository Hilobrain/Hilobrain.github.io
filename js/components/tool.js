export class Tool {
  constructor(parent, id, icon) {
    this.parent = parent;
    this.element = document.createElement('button');
    this.element.setAttribute('id', id);
    this.element.setAttribute('name', id);
    this.element.classList.add('tool');

    this.icon = document.createElement('i');
    this.icon.classList.add('fas', icon);
    this.element.appendChild(this.icon);
    parent.element.appendChild(this.element);

    this.element.addEventListener('click', (event) => this.parent.tool = this.element.id);
  }
}
