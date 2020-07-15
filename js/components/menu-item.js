export class MenuItem {
  constructor(parent, id, icon) {
    this.parent = parent;
    this.element = document.createElement('button');
    this.element.setAttribute('id', id);
    this.element.setAttribute('name', id);
    this.element.classList.add('menu-item');
    this.icon = document.createElement('i');
    this.icon.classList.add('fas', icon);
    this.element.appendChild(this.icon);

    if(id === 'download') {
      this.link = document.createElement('a');
      this.link.setAttribute('download', `${this.parent.parent.imageName}.png`);
      this.link.appendChild(this.element);
      parent.element.appendChild(this.link);
    } else if(id === 'upload') {
      this.input = document.createElement('input');
      this.input.setAttribute('id', 'uploadInput');
      this.input.setAttribute('type', 'file');
      this.input.setAttribute('accept', 'image/*');
      this.input.setAttribute('hidden', 'true');
      this.input.addEventListener('change', (event) => this.parent.parent.processImage(event));
      parent.element.appendChild(this.input);
      parent.element.appendChild(this.element);
    } else {
      parent.element.appendChild(this.element);
    }

    this.element.addEventListener('click', (event) => this.click(this));
  }

  click(item) {
    this.parent.clickMenuItem(item);
  }
}
