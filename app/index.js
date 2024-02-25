const canvas = document.querySelector('canvas')
canvas.width  = window.innerWidth
canvas.height = window.innerHeight

const c = canvas.getContext('2d')

const backgroundImg = new Image()
const foregroundImg = new Image()
const playerDown = new Image()
const playerUp = new Image()
const playerLeft = new Image()
const playerRight = new Image()

playerDown.src = './img/playerDown.png'
playerUp.src = './img/playerUp.png'
playerLeft.src = './img/playerLeft.png'
playerRight.src = './img/playerRight.png'
backgroundImg.src = './img/LimSizeMapC3.png'
foregroundImg.src = './img/foreground.png'

// Array of audio elements
var songs = [
    document.getElementById("song1"),
    document.getElementById("song2")
];
var audio
// Function to play songs sequentially
function playSongs(index) {
    if (index < songs.length) {audio = songs[index];}
    else{audio = songs[0]}

    audio.play()
    audio.onended = function() {
        playSongs(index + 1);
    };
}

function initializeGame() {
    setTimeout(function() {
        playSongs(0); // Start playing from the first song
    }, 3000); // Adjust the delay time as needed (in milliseconds)
}
// Call the function to initialize the game when the document is fully loaded
document.addEventListener("DOMContentLoaded", initializeGame);


const keys = {
    z: {pressed : false},
    q: {pressed : false},
    s: {pressed : false},
    d: {pressed : false}
}

const zoom = 1.4

const offset = {
    x : -1600,
    y : -1500
}

let last = ''

class Boundary{
    static width = 32*zoom
    static height = 32*zoom  //image zoomé 140%
    constructor({position}){
        this.position = position
        this.width = 32*zoom
        this.height = 32*zoom
    }

    draw(){
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    updatePosition(dx, dy){
        this.position = {x: this.position.x + dx, y: this.position.y + dy}
    }
}
class Sprite{
    constructor({position, image, velocity, frames = {max : 1}, sprites}){
        this.position = position
        this.image = image
        this.frames = { ...frames, val : 0, ticks: 0}
        this.velocity = velocity
        this.moving = false
        this.sprites = sprites
        this.image.onload = () => {
            this.width = this.image.width/this.frames.max
            this.height = this.image.height 
        }
    }

    draw(){
        c.drawImage(this.image, this.frames.val*this.width,0,this.image.width/this.frames.max, this.image.height, this.position.x, this.position.y,this.image.width/this.frames.max, this.image.height)

        if (!this.moving) return

        //to animate a changement in frame every 10 moving ticks
        this.frames.ticks++
        if (this.frames.ticks%10 == 0){
            if (this.frames.val < this.frames.max-1) this.frames.val++
            else this.frames.val = 0
        }
    }

    updatePosition(dx, dy){
        this.position = {x: this.position.x + dx, y: this.position.y + dy}
    }
}

const collisionsMap = []
const boundaries = []

for (let i = 0; i <collisions.length;  i+= 180){
    collisionsMap.push(collisions.slice(i, 180+i))
}

collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol == 55793){
            boundaries.push(
                new Boundary({position:{x: j*Boundary.width + offset.x, y: i*Boundary.height + offset.y}})
            )
        }
    })
})

const background = new Sprite({position: {x: offset.x, y: offset.y}, image : backgroundImg })
const foreground = new Sprite({position:{x: offset.x, y: offset.y}, image : foregroundImg})
const player = new Sprite({position: {x: canvas.width/2 - 192/8, y: canvas.height/2 - 68/8}, velocity : 5, image: playerDown, frames:{max:4}, sprites: {up : playerUp, down: playerDown, left : playerLeft, right : playerRight}})
const movables = [background, ...boundaries, foreground]     // place chaque elt de boundaries dans la liste

function TestCollision({o1, o2}){
    return (o1.position.x + o1.width >= o2.position.x &&    //coté gauche
        o1.position.x <= o2.position.x + o2.width &&    //coté droit
        o1.position.y <= o2.position.y  &&   //dessus
        o1.position.y + o1.height >= o2.position.y      //dessous
    )
}
function show_boundaries(){
    boundaries.forEach(boundary => {
        boundary.draw()
    })
}

function animate(){
    window.requestAnimationFrame(animate)
    background.draw()
    player.draw()
    show_boundaries()
    foreground.draw()
    let moving = true
    if (keys.z.pressed && last == 'z'){
        player.moving = true
        player.image = player.sprites.up
        for (let i = 0; i < boundaries.length; i++){
            const boundary = boundaries[i]
            if (TestCollision({o1 : player, o2 : {...boundary, position : {x: boundary.position.x, y: boundary.position.y +player.velocity}}})){
                moving = false
                break
            }
        }
        if (moving){
            movables.forEach(movable => {
                movable.position.y += player.velocity
            })
        }
    }
    else if (keys.q.pressed && last == 'q'){
        player.image = player.sprites.left
        player.moving = true
        for (let i = 0; i < boundaries.length; i++){
        const boundary = boundaries[i]
        if (TestCollision({o1 : player, o2 : {...boundary, position : {x: boundary.position.x+player.velocity, y: boundary.position.y}}})){
            moving = false
            break
        }
        }
        if (moving){
            movables.forEach(movable => {
                movable.position.x += player.velocity
            })
        }
    }
    else if (keys.s.pressed && last == 's'){
        player.image = player.sprites.down
        player.moving = true
        for (let i = 0; i < boundaries.length; i++){
        const boundary = boundaries[i]
        if (TestCollision({o1 : player, o2 : {...boundary, position : {x: boundary.position.x, y: boundary.position.y - player.velocity}}})){
            moving = false
            break
        }
        }
        if (moving){
            movables.forEach(movable => {
                movable.position.y -= player.velocity
            })
        }
    }
    else if (keys.d.pressed && last == 'd'){
        player.image = player.sprites.right
        player.moving = true
        for (let i = 0; i < boundaries.length; i++){
            const boundary = boundaries[i]
            if (TestCollision({o1 : player, o2 : {...boundary, position : {x: boundary.position.x - player.velocity, y: boundary.position.y}}})){
                moving = false
                break
            }
        }
        if (moving){
            movables.forEach(movable => {
                movable.position.x -= player.velocity
            })
        }
    }
    else{player.moving = false
    player.frames.val = 0}
}
animate()

//when windows is resized
function updatePosition(obj){
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight
    let oldx = player.position.x
    let oldy = player.position.y
    let newx = canvas.width/2 - 192/8
    let newy = canvas.height/2 - 68/8
    let deltax = newx - oldx
    let deltay = newy - oldy
    obj.position = {x: obj.position.x + deltax, y: obj.position.y + deltay}
}
window.addEventListener('resize', (e) => {
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight
    let oldx = player.position.x
    let oldy = player.position.y
    let newx = canvas.width/2 - 192/8
    let newy = canvas.height/2 - 68/8
    let dx = newx - oldx
    let dy = newy - oldy
    background.updatePosition(dx, dy)
    foreground.updatePosition(dx, dy)
    boundaries.forEach(boundary => {
        boundary.updatePosition(dx, dy)
    })
    player.updatePosition(dx, dy)
})

window.addEventListener('keydown', (e) => {
    switch (e.key){
        case 'z':
        case 'ArrowUp':
            keys.z.pressed = true
            last = 'z'
            break
        case 'q' :
        case 'ArrowLeft':
            keys.q.pressed = true
            last = 'q'
            break
        case 's' :
        case 'ArrowDown':
            keys.s.pressed = true
            last = 's'
            break
        case 'd' :
        case 'ArrowRight':
            keys.d.pressed = true
            last = 'd'
            break
    }
})

window.addEventListener('keyup', (e) => {
    switch (e.key){
        case 'z' :
            case 'ArrowUp':
            keys.z.pressed = false
            break
        case 'q' :
        case 'ArrowLeft':
            keys.q.pressed = false
            break
        case 's' :
        case 'ArrowDown':
            keys.s.pressed = false
            break
        case 'd' :
        case 'ArrowRight':
            keys.d.pressed = false
            break
    }
})