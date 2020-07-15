import {palettes} from './palettes/palettes.js';
import {Color} from './color.js';

export class Palette {
  constructor(parent) {
    this.parent = parent;
    this.parent.palette = this;
    this.element = document.createElement('aside');
    this.element.setAttribute('id', 'palette');
    parent.element.appendChild(this.element);
  }

  get current() {
    return this.currentPalette;
  }

  set current(paletteIndex) {
    this.currentPalette = paletteIndex;
    for(let colorIndex = 0; colorIndex < palettes[paletteIndex].colors.length; colorIndex++) {
      this['color' + colorIndex] = new Color(this, palettes[paletteIndex].colors, colorIndex);
      this.element.appendChild(this['color' + colorIndex]['element']);
      this.color = palettes[paletteIndex].colors[colorIndex].replace(/[^\d,]/g, '').split(',');
    }
  }

  set color(color) {
    this.parent.color = color;
  }

  set tool(tool) {
    this.parent.tool = tool;
  }
}
