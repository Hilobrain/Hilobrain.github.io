 class Tools {
  constructor(parent) {
    this.parent = parent ; 
    this.element = document.createElement('aside') ; 
    this.element.setAttribute('id', 'tools') ; 
    parent.element.appendChild(this.element) ; 
  }

  set tool(tool) {
    this.parent.tool = tool ; 
  }
}

 class Canvas {
  constructor(parent, height = 1000, width = 1000) {
    this.parent = parent ; 
    this.parent.parent.canvas = this ; 
    this.element = document.createElement('canvas') ; 
    this.element.setAttribute('id', 'canvas') ; 
    this.context = this.element.getContext('2d') ; 
    this.element.setAttribute('height', height) ; 
    this.element.setAttribute('width', width) ; 
    this.element.addEventListener('mousedown', (event) => this.mouseDown = true) ; 
    window.addEventListener('mouseup', (event) => this.mouseUp(event)) ; 
    this.element.addEventListener('click', (event) => this.click(event)) ; 
    this.element.addEventListener('mousemove', (event) => this.click(event)) ; 
    parent.element.appendChild(this.element) ; 
  }

  get color() {
    return this.parent.color ; 
  }

  set color(color) {
    this.parent.color = color ; 
  }

  get cursor() {
    return this.parent.cursor ; 
  }

  set cursor(cursor) {
    this.parent.cursor = cursor ; 
  }

  get height() {
    return this.element.height ; 
  }

  set height(height) {
    this.element.setAttribute('height', height) ; 
  }

  get width() {
    return this.element.width ; 
  }

  set width(width) {
    this.element.setAttribute('width', width) ; 
  }

  get left() {
    return this.element.getBoundingClientRect().left ; 
  }

  set left(left) {
    this.element.style.left = left + 'px' ; 
  }

  set memory(memory) {
    this.parent.memory = memory ; 
  }

  get top() {
    return this.element.getBoundingClientRect().top ; 
  }

  set top(top) {
    this.element.style.top = top + 'px' ; 
  }

  get zoom() {
    return this.zoomLevel ; 
  }

  set zoom(zoom) {
    this.element.style.height = this.height * zoom + 'px' ; 
    this.element.style.width = this.width * zoom + 'px' ; 
    this.zoomLevel = zoom ; 
  }

  sameColor(color1, color2) {
    if (
      color1[0] == color2[0] &&
      color1[1] == color2[1] &&
      color1[2] == color2[2] &&
      color1[3] == color2[3]
    ) {
      return true ; 
    } else {
      return false ; 
    }
  }

  paint(x, y, color = this.parent.parent.currentColor) {
    const pixel = this.context.createImageData(1, 1) ; 
    for (let i = 0 ;  i < pixel.height * pixel.width ;  i++) {
      pixel.data[i * 4] = color[0] ;      //R
      pixel.data[i * 4 + 1] = color[1] ;  //G
      pixel.data[i * 4 + 2] = color[2] ;  //B
      pixel.data[i * 4 + 3] = color[3] ;  //A
    }
    const oldColor = this.sample(x, y) ; 
    if(!this.sameColor(color, oldColor)) {
      this.memory = [pixel, x, y, oldColor] ; 
      pixelAmount += 1  ;  
      console.log("Pixels drawn: " + pixelAmount)  ; 
      pixels_x.push(x) ; 
      pixels_y.push(y) ; 
      pixels_colors.push(rgbToHex(color[0], color[1], color[2])) ;  
    }
    this.context.putImageData(pixel, x, y) ; 
  }

  sample(x, y) {
    const pixel = this.context.getImageData(x, y, 1, 1).data ; 
    const color = [pixel[0], pixel[1], pixel[2], pixel[3]] ; 
    return color ; 
  }

  click(event) {
    if(
      this.parent.parent.currentTool === 'pencil' &&
      (
        event.type === 'click' ||
        event.type === 'mousemove' && this.mouseDown
      )
    ) {
      const zoom = this.zoom ; 
      const x = Math.floor(event.layerX / zoom) ; 
      const y = Math.floor(event.layerY / zoom) ; 
      this.paint(x, y) ; 
    } else if(
      this.parent.parent.currentTool === 'dropper' &&
      event.type === 'click'
    ) {
      const zoom = this.zoom ; 
      const x = Math.floor(event.layerX / zoom) ; 
      const y = Math.floor(event.layerY / zoom) ; 
      this.color = this.sample(x, y) ; 
      this.parent.parent.tool = 'pencil' ; 
    } else if(
      this.parent.parent.currentTool === 'zoom-in' &&
      event.type === 'click'
    ) {
      this.zoom += 1 ; 
    } else if(
      this.parent.parent.currentTool === 'zoom-out' &&
      event.type === 'click' &&
      this.zoom > 1
    ) {
      this.zoom -= 1 ; 
    } else if(
      this.parent.parent.currentTool === 'pan' &&
      event.type === 'mousemove' && this.mouseDown
    ) {
      this.cursor = 'grabbing' ; 
      const top = this.top ; 
      const left = this.left
      this.top = top + event.movementY ; 
      this.left = left + event.movementX ; 
    }
  }

  mouseUp(event) {
    this.mouseDown = false ; 

    if(this.parent.parent.currentTool === 'pan') {
      this.cursor = 'grab' ; 
    }
  }
}

 class Menu {
  constructor(parent) {
    this.parent = parent ; 
    this.element = document.createElement('nav') ; 
    this.element.setAttribute('id', 'menu') ; 
    document.body.appendChild(this.element) ; 
  }

  clickMenuItem(item) {
    this.parent.clickMenuItem(item) ; 
  }
}

 class MenuItem {
  constructor(parent, id, icon) {
    this.parent = parent ; 
    this.element = document.createElement('button') ; 
    this.element.setAttribute('id', id) ; 
    this.element.setAttribute('name', id) ; 
    this.element.classList.add('menu-item') ; 
    this.icon = document.createElement('i') ; 
    this.icon.classList.add('fas', icon) ; 
    this.element.appendChild(this.icon) ; 

    if(id === 'download') {
      this.link = document.createElement('a') ; 
      this.link.setAttribute('download', `${this.parent.parent.imageName}.png`) ; 
      this.link.appendChild(this.element) ; 
      parent.element.appendChild(this.link) ; 
    } else if(id === 'upload') {
      this.input = document.createElement('input') ; 
      this.input.setAttribute('id', 'uploadInput') ; 
      this.input.setAttribute('type', 'file') ; 
      this.input.setAttribute('accept', 'image/*') ; 
      this.input.setAttribute('hidden', 'true') ; 
      this.input.addEventListener('change', (event) => this.parent.parent.processImage(event)) ; 
      parent.element.appendChild(this.input) ; 
      parent.element.appendChild(this.element) ; 
    } else {
      parent.element.appendChild(this.element) ; 
    }

    this.element.addEventListener('click', (event) => this.click(this)) ; 
  }

  click(item) {
    this.parent.clickMenuItem(item) ; 
  }
}

 class Main {
  constructor(parent) {
    this.parent = parent ; 
    this.element = document.createElement('main') ; 
    this.element.setAttribute('id', 'main') ; 
    parent.element.appendChild(this.element) ; 
  }

  get color() {
    return this.parent.color ; 
  }

  set color(color) {
    this.parent.color = color ; 
  }

  get cursor() {
    return this.parent.cursor ; 
  }

  set cursor(cursor) {
    this.parent.cursor = cursor ; 
  }

  set memory(memory) {
    this.parent.memory = memory ; 
  }
}


 class Color {
  constructor(parent, palette, index) {
    this.parent = parent ; 
    this.element = document.createElement('button') ; 
    this.element.setAttribute('id', `${palette}-${index}`) ; 
    this.element.setAttribute('name', palette) ; 
    this.element.setAttribute('value', index) ; 
    this.element.classList.add('color') ; 

    this.element.addEventListener('click', (event) => this.click(event)) ; 
    this.element.style.backgroundColor = palette[index] ; 

    parent.element.appendChild(this.element) ; 
  }

  get color() {
    const color = this.element.style.backgroundColor.replace(/[^\d,]/g, '').split(',') ; 
    color.push(255) ; 
    return color ; 
  }

  click() {
    this.parent.color = this.color ; 
    this.parent.tool = 'pencil' ; 
  }
}

class Tool {
  constructor(parent, id, icon) {
    this.parent = parent ; 
    this.element = document.createElement('button') ; 
    this.element.setAttribute('id', id) ; 
    this.element.setAttribute('name', id) ; 
    this.element.classList.add('tool') ; 

    this.icon = document.createElement('i') ; 
    this.icon.classList.add('fas', icon) ; 
    this.element.appendChild(this.icon) ; 
    parent.element.appendChild(this.element) ; 

    this.element.addEventListener('click', (event) => this.parent.tool = this.element.id) ; 
  }
}

class Palette {
  constructor(parent) {
    this.parent = parent ; 
    this.parent.palette = this ; 
    this.element = document.createElement('aside') ; 
    this.element.setAttribute('id', 'palette') ; 
    parent.element.appendChild(this.element) ; 
  }

  get current() {
    return this.currentPalette ; 
  }

  set current(paletteIndex) {
    this.currentPalette = paletteIndex ; 
    for(let colorIndex = 0 ;  colorIndex < palettes[paletteIndex].colors.length ;  colorIndex++) {
      this['color' + colorIndex] = new Color(this, palettes[paletteIndex].colors, colorIndex) ; 
      this.element.appendChild(this['color' + colorIndex]['element']) ; 
      this.color = palettes[paletteIndex].colors[colorIndex].replace(/[^\d,]/g, '').split(',') ; 
    }
  }

  set color(color) {
    this.parent.color = color ; 
  }

  set tool(tool) {
    this.parent.tool = tool ; 
  }
}

 class App {
  constructor() {
    this.currentCursor = 'crosshair' ; 
    document.body.style.cursor = this.currentCursor ; 
    this.currentTool = 'pencil' ; 
    this.memories = [] ; 
    this.imageName = 'pixel-art.png' ; 

    this.element = document.createElement('div') ; 
    this.element.setAttribute('id', 'app') ; 
    document.body.appendChild(this.element) ; 

    window.addEventListener('keydown', (event) => this.keyDown(event)) ; 
  }

  set color(color) {
    this.currentColor = color ; 
  }

  set tool(tool) {
    this.currentTool = tool ; 
    this.updateCursor(tool) ; 
  }

  get cursor() {
    return this.currentCursor ; 
  }

  set cursor(cursor) {
    this.currentCursor = cursor ; 
    document.body.style.cursor = cursor ; 
  }

  set memory(memory) {
    this.memories.push(memory) ; 
  }

  get currentPalette() {
    return this.palette.current ; 
  }

  set currentpPlette(index) {
    this.palette.current = index ; 
  }

  clickMenuItem(item) {
    const id = item.element.id ; 
    switch (id) {
      case 'newFile':
        let { context } = this.canvas ; 
        const newImage = context.createImageData(this.canvas.width, this.canvas.height) ; 
        load_picture(init_canvas) ; 
        pixelAmount = 0 ; 
        pixels_colors = [] ; 
        pixels_x = [] ; 
        pixels_y = [] ; 
        this.memories = [] ; 
        break ; 
      case 'download':
        item.link.setAttribute('download', `${this.imageName}`)
        const image = this.canvas.element
          .toDataURL('image/png')
          .replace('image/png', 'image/octet-stream') ; 
        item.link.href = image ; 
        break ; 
      case 'upload':
        item.input.click() ; 
        break ; 
      case 'undo':
        if(this.memories.length > 0) {
          const lastMemory = this.memories.pop() ; 
          const x = lastMemory[1] ; 
          const y = lastMemory[2] ; 
          const color = lastMemory [3] ; 
          this.canvas.paint(x, y, color) ; 
          this.memories.pop() ; 
          pixelAmount -= 2 ; 
          console.log("Pixels drawn: " + pixelAmount) ;  
        }
        break ; 
      case 'redo':
        break ; 
    }
  }

  keyDown(event) {
    if(
      event.ctrlKey &&
      event.key === 'z' &&
      this.memories.length > 0
      ) {
      const lastMemory = this.memories.pop() ; 
      const x = lastMemory[1] ; 
      const y = lastMemory[2] ; 
      const color = lastMemory [3] ; 
      this.canvas.paint(x, y, color) ; 
      this.memories.pop() ;
      pixelAmount -= 2 ;
      console.log("Pixels drawn: " + pixelAmount) ;   
    }
  }

  loadImage(image, result) {
    image.src = result ; 
    image.onload = () => {
      this.canvas.context.drawImage(image, 0, 0) ; 
    }
  }

  processImage(event) {
    const { files } = event.srcElement ; 
    const file = files[0] ; 
    const { name } = file ; 
    this.imageName = name ; 
    const reader = new FileReader() ; 
    const image = new Image() ; 
    reader.onload = () => {
      this.loadImage(image, reader.result)
    } ; 
    reader.readAsDataURL(file) ; 
  }

  updateCursor(tool) {
    switch (tool) {
      case 'pencil':
        document.body.style.cursor = 'crosshair' ; 
        break ; 
      case 'dropper':
        document.body.style.cursor = 'crosshair' ; 
        break ; 
      case 'zoom-in':
        document.body.style.cursor = 'zoom-in' ; 
        break ; 
      case 'zoom-out':
        document.body.style.cursor = 'zoom-out' ; 
        break ; 
      case 'pan':
        document.body.style.cursor = 'grab' ; 
        break ; 
    }
  }
}

var init_canvas ; //base64 encoded image fetched from GitHub to prevent long loading times

(function() {
  // Load the script
  var script = document.createElement("SCRIPT");
  script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';
  script.type = 'text/javascript';
  script.onload = function() {
      var $ = window.jQuery;
      $(document).ready(function() {
        var url = 'https://raw.githubusercontent.com/Hilobrain/PyGitHub/master/test_file.txt';
      
        $.get(url, function(data) { 
            $('#code').text(data);
            console.log(data) ; 
            load_picture(data) ;
            init_canvas = data ;  
          }, 'text');
           
        });
  };
  document.getElementsByTagName("head")[0].appendChild(script);
})();

function load_picture(base64_text) {
  var canvas = document.getElementById("canvas"),
  context = canvas.getContext("2d")
  base64 = base64_text ; 
  var image = new Image() ; 
  image.onload = function() {

  context.webkitImageSmoothingEnabled = false;
  context.mozImageSmoothingEnabled = false;
  context.imageSmoothingEnabled = false;

  context.drawImage(image, 0, 0, image.width * 1, image.height * 1) ; 
  } ; 
  image.src = "data:image/png;base64," + base64_text; 
  console.log("Drawn image.") ; 
}

function rgbToHex(r, g, b) {
  return ('0x' + r.toString(16) + g.toString(16) + b.toString(16)) ; 
}

function submit_pixels() {
  contract.methods.draw_pixels(pixels_x, pixels_y, pixels_colors).send({from: account, value: pixelAmount * pixel_cost_wei}) ;
  console.log(pixels_x.length, pixels_y.length, pixels_colors.length, pixelAmount) ; 
  pixels_colors.push()
  pixels_x = [] ; 
  pixels_y = [] ; 
  pixels_colors = [] ; 
  pixelAmount = 0 ;     
}

const palettes = [
  {
    name: 'DB8',
    link: 'http://pixeljoint.com/forum/forum_posts.asp?TID=26050',
    colors: [
      'rgba(84, 65, 97, 255)',
      'rgba(100, 105, 99, 255)',
      'rgba(217, 114, 83, 255)',
      'rgba(81, 140, 216, 255)',
      'rgba(100, 185, 100, 255)',
      'rgba(227, 200, 123, 255)',
      'rgba(221, 245, 255, 255)',
      'rgba(0, 0, 0, 255)'
    ],
  },
  {
    name: 'DB16',
    link: 'http://pixeljoint.com/forum/forum_posts.asp?TID=26050',
    colors: [
      'rgba(0, 0, 0, 255)',
      'rgba(84, 65, 97, 255)',
      'rgba(100, 105, 99, 255)',
      'rgba(217, 114, 83, 255)',
      'rgba(81, 140, 216, 255)',
      'rgba(227, 200, 123, 255)',
      'rgba(100, 185, 100, 255)',
      'rgba(221, 245, 255, 255)',
      'rgba(0, 0, 0, 255)',
      'rgba(84, 65, 97, 255)',
      'rgba(100, 105, 99, 255)',
      'rgba(217, 114, 83, 255)',
      'rgba(81, 140, 216, 255)',
      'rgba(227, 200, 123, 255)',
      'rgba(100, 185, 100, 255)',
      'rgba(221, 245, 255, 255)'
    ],
  }
]

const app = new App() ; 

const menu = new Menu(app) ; 
const newFile = new MenuItem(menu, 'newFile', 'fa-file') ; 
const download = new MenuItem(menu, 'download', 'fa-file-download') ; 
const upload = new MenuItem(menu, 'upload', 'fa-file-upload') ; 
const undo = new MenuItem(menu, 'undo', 'fa-undo-alt') ; 
// const redo = new MenuItem(menu, 'redo', 'fa-redo-alt') ; 
// const choosePalette = new MenuItem(menu, 'choosePalette', 'fa-palette') ; 

const main = new Main(app) ; 

const tools = new Tools(app) ; 
const pencil = new Tool(tools, 'pencil', 'fa-pencil-alt') ; 
const dropper = new Tool(tools, 'dropper', 'fa-eye-dropper') ; 
const zoomIn = new Tool(tools, 'zoom-in', 'fa-search-plus') ; 
const zoomOut = new Tool(tools, 'zoom-out', 'fa-search-minus') ; 
const pan = new Tool(tools, 'pan', 'fa-hand-paper') ; 

const canvas = new Canvas(main) ; 

const palette = new Palette(app) ; 
palette.current = 0 ; 

canvas.zoom = 0.5 ; 

const pixel_cost_ether = 0.0000001 ;  //ether
const pixel_cost_wei = pixel_cost_ether * 1000000000000000000 ;  //wei 

var pixelAmount = 0  ;
var pixels_x = [] ; 
var pixels_y = [] ; 
var pixels_colors = [] ; 