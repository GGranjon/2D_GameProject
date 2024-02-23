const canvas = document.querySelector('canvas')
canvas.width  = 1224
canvas.height = 620

const c = canvas.getContext('2d')

const image = new Image()
const playerImg = new Image()
playerImg.src = './img/playerDown.png'
image.src = './img/LimSizeMapC3.png'

const keys = {
    z: {pressed : false},
    q: {pressed : false},
    s: {pressed : false},
    d: {pressed : false}
}

const offset = {
    x : -1600,
    y : - 1500
}

let last = ''

const collisionsMap = []
const boundaries = []

collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol == 55793){
            boundaries.push(
                new Boundary({position:{x: j*Boundary.width + offset.x + 37, y: i*Boundary.height + offset.y + 35}})
            )
        }
    })
})

for (let i = 0; i <collisions.length;  i+= 180){
    collisionsMap.push(collisions.slice(i, 180+i))
}

const movables = [background, ...boundaries]     // place chaque elt de boundaries dans la liste

class Boundary{
    static width = 44
    static height = 44
    constructor({position}){
        this.position = position
        this.width = 44
        this.height = 44
    }
    draw(){
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}
class Sprite{
    constructor({position, image, frames = {max : 1}}){
        this.position = position
        this.image = image
        this.frames = frames
        this.image.onload = () => {
            this.width = this.image.width/this.frames.max
            this.height = this.image.height 
        }
    }

    draw(){
        c.drawImage(this.image, 0,0,this.image.width/this.frames.max, this.image.height, this.position.x, this.position.y,this.image.width/this.frames.max, this.image.height)
    }
}


const background = new Sprite({position: {x: offset.x, y: offset.y}, image })
const player = new Sprite({position: {x: canvas.width/2 - 192/8, y: canvas.height/2 - 68/8}, image: playerImg, frames:{max:4}})

function TestCollision({o1, o2}){
    return (o1.position.x + o1.width >= o2.position.x &&    //coté gauche
        o1.position.x <= o2.position.x + o2.width &&    //coté droit
        o1.position.y <= o2.position.y + o2.height &&   //dessus
        o1.position.y + o1.height >= o2.position.y      //dessous
    )
}

function animate(){  
    window.requestAnimationFrame(animate)
    background.draw()
    player.draw()
    boundaries.forEach(boundary => {
        boundary.draw()
    })
    if (keys.z.pressed && last == 'z'){
        for (let i = 0; i < boundaries.length; i++){
            const boundary = boundaries[i]
            if (TestCollision({o1 : player, o2 : {...boundary}}))
        }
    }
    else if (keys.q.pressed && last == 'q') background.position.x+= 4
    else if (keys.s.pressed && last == 's') background.position.y -= 4
    else if (keys.d.pressed && last == 'd') background.position.x -= 4
}
animate()


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