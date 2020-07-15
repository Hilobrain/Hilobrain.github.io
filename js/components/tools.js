export class Tools {
  constructor(parent) {
    this.parent = parent;
    this.element = document.createElement('aside');
    this.element.setAttribute('id', 'tools');
    parent.element.appendChild(this.element);
  }

  set tool(tool) {
    this.parent.tool = tool;
  }
}
