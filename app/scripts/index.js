const canvas = document.querySelector('canvas')
canvas.width  = window.innerWidth
canvas.height = window.innerHeight

const c = canvas.getContext('2d')

const DfltSize = {x : 1920, y : 1080}
let ScreenSize = {x: canvas.width, y: canvas.height}

const diffSize = {x : DfltSize.x - ScreenSize.x, y : DfltSize.y - ScreenSize.y}

const keys = {
    z: {pressed : false},
    q: {pressed : false},
    s: {pressed : false},
    d: {pressed : false}
}

const zoom = 1.4    //image zoomé 140%

const infos = {
'town': {background: backgroundTown, foreground: foregroundTown, collisions: collisions_town, collisions_size:180, last_pos: {x:0, y:0}},
'home': {background: backgroundHome, foreground: foregroundHome, collisions: collisions_maison, collisions_size:49},
'school': {background: backgroundSchool, foreground: foregroundSchool, collisions: collisions_school, collisions_size: 47},
'company': {background: backgroundCompany, foreground: foregroundCompany, collisions: collisions_company, collisions_size: 43}
}

class Boundary{
    static width = 32*zoom
    static height = 32*zoom
    constructor({position, type}){
        this.position = position
        this.width = 32*zoom
        this.height = 32*zoom
        this.type = type
    }

    draw(){
        if (this.type == "collision"){
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)}

        else{
            c.fillStyle = 'green'
            c.fillRect(this.position.x, this.position.y, this.width, this.height) 
        }
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

let last = ''

let collisionsMap = []
let boundaries = []
let transitions = []

const map_offsets = {"home": {x: -135 - diffSize.x/2, y:-850 - diffSize.y/2}, "town": {x : -1260 - diffSize.x/2,y : -1588 - diffSize.y/2}, "school": {x: -95 - diffSize.x/2, y:-920 - diffSize.y/2}, "company": {x: -5 - diffSize.x/2, y:-1020 - diffSize.y/2}}

function createBoundaries(obj, size, name, backintown){
    collisionsMap = []
    boundaries = []
    transitions = []
    for (let i = 0; i <obj.length;  i+= size){
        collisionsMap.push(obj.slice(i, size+i))
    }
    
    collisionsMap.forEach((row, i) => {
        row.forEach((symbol, j) => {
            if (symbol == 55793){
                if (!backintown){
                boundaries.push(
                    new Boundary({position:{x: j*Boundary.width + map_offsets[name].x, y: i*Boundary.height +  map_offsets[name].y}, type:"collision"})
                )
                }
                else{
                    boundaries.push(
                        new Boundary({position:{x: j*Boundary.width + infos.town.last_pos.x, y: i*Boundary.height +  infos.town.last_pos.y}, type:"collision"})
                    )
                }
            }
            else if (symbol == 2){
                if (!backintown){
                    transitions.push(
                        new Boundary({position:{x: j*Boundary.width + map_offsets[name].x, y: i*Boundary.height +  map_offsets[name].y}, type:"hopital"})
                    )
                    }
                else{
                    transitions.push(
                        new Boundary({position:{x: j*Boundary.width + infos.town.last_pos.x, y: i*Boundary.height +  infos.town.last_pos.y}, type:"hopital"})
                    )
                }
            }
            else if (symbol == 3){
                if (!backintown){
                    transitions.push(
                        new Boundary({position:{x: j*Boundary.width + map_offsets[name].x, y: i*Boundary.height +  map_offsets[name].y}, type:"market"})
                    )
                    }
                else{
                    transitions.push(
                        new Boundary({position:{x: j*Boundary.width + infos.town.last_pos.x, y: i*Boundary.height +  infos.town.last_pos.y}, type:"market"})
                    )
                }
            }
            else if (symbol == 4){
                if (!backintown){
                    transitions.push(
                        new Boundary({position:{x: j*Boundary.width + map_offsets[name].x, y: i*Boundary.height +  map_offsets[name].y}, type:"school"})
                    )
                    }
                else{
                    transitions.push(
                        new Boundary({position:{x: j*Boundary.width + infos.town.last_pos.x, y: i*Boundary.height +  infos.town.last_pos.y}, type:"school"})
                    )
                }
            }
            else if (symbol == 5){
                if (!backintown){
                    transitions.push(
                        new Boundary({position:{x: j*Boundary.width + map_offsets[name].x, y: i*Boundary.height +  map_offsets[name].y}, type:"company"})
                    )
                    }
                else{
                    transitions.push(
                        new Boundary({position:{x: j*Boundary.width + infos.town.last_pos.x, y: i*Boundary.height +  infos.town.last_pos.y}, type:"company"})
                    )
                }
            }
            else if (symbol == 6){
                if (!backintown){
                    transitions.push(
                        new Boundary({position:{x: j*Boundary.width + map_offsets[name].x, y: i*Boundary.height +  map_offsets[name].y}, type:"home"})
                    )
                    }
                else{
                    transitions.push(
                        new Boundary({position:{x: j*Boundary.width + infos.town.last_pos.x, y: i*Boundary.height +  infos.town.last_pos.y}, type:"home"})
                    )
                }
            }
            else if (symbol == 7){
                if (!backintown){
                    transitions.push(
                        new Boundary({position:{x: j*Boundary.width + map_offsets[name].x, y: i*Boundary.height +  map_offsets[name].y}, type:"town"})
                    )
                    }
                else{
                    transitions.push(
                        new Boundary({position:{x: j*Boundary.width + infos.town.last_pos.x, y: i*Boundary.height +  infos.town.last_pos.y}, type:"town"})
                    )
                }
            }
        })
    })
}

createBoundaries(collisions_town, infos['town'].collisions_size, "town", false)
const background = new Sprite({position: {x : map_offsets.town.x, y : map_offsets.town.y}, image : backgroundTown })
const foreground = new Sprite({position:{x: map_offsets.town.x, y: map_offsets.town.y}, image : foregroundTown})
const player = new Sprite({position: {x: canvas.width/2 - 192/8, y: canvas.height/2 - 68/8}, velocity : 8, image: playerDown, frames:{max:4}, sprites: {up : playerUp, down: playerDown, left : playerLeft, right : playerRight}})
let movables = [background, ...boundaries, foreground, ...transitions]    // ce qui doit bouger quand le joueur se déplace

function TestCollision({o1, o2}){
    return (o1.position.x + o1.width >= o2.position.x &&    //coté gauche
        o1.position.x <= o2.position.x + o2.width &&    //coté droit
        o1.position.y <= o2.position.y  &&   //dessus
        o1.position.y + o1.height >= o2.position.y      //dessous
    )
}

function show_object(obj){
    obj.forEach(elt => {
        elt.draw()
    })
}

function checkCollisionLeft(obj){
    for (let i = 0; i < obj.length; i++){
        const boundary = obj[i]
        if (TestCollision({o1 : player, o2 : {...boundary, position : {x: boundary.position.x+player.velocity, y: boundary.position.y}}})){
            player.moving = false
            break
        }
    }
}

function blocSwitchScene(where){
    if (where != "town"){
        player.velocity = 5
        infos.town.last_pos.x = background.position.x
        infos.town.last_pos.y = background.position.y
        var newPosition = {x: map_offsets[where].x, y: map_offsets[where].y}
        var backintown = false  //permet de bien placer le background lorsque l'on sort d'un batiment (qu'il ne soit pas comme à la position au lancement du jeu)
    }
    else{
        player.velocity = 8
        var newPosition = {x: infos.town.last_pos.x, y: infos.town.last_pos.y}
        var backintown = true
    }
    background.image = infos[where].background
    foreground.image = infos[where].foreground
    background.position.x = newPosition.x
    background.position.y = newPosition.y
    foreground.position.x = newPosition.x
    foreground.position.y = newPosition.y
    createBoundaries(infos[where].collisions, infos[where].collisions_size, where, backintown)
    movables = [background, ...boundaries, foreground, ...transitions]  //update the movables bcs the boundaries change
}

function animate(){
    window.requestAnimationFrame(animate)
    background.draw()
    player.draw()
    //show_object(transitions)
    //show_object(boundaries)
    foreground.draw()
    player.moving = false
    if (keys.z.pressed && last == 'z'){
        player.moving = true
        player.image = player.sprites.up
        for (let i = 0; i < boundaries.length; i++){
            const boundary = boundaries[i]
            if (TestCollision({o1 : player, o2 : {...boundary, position : {x: boundary.position.x, y: boundary.position.y +player.velocity}}})){
                player.moving = false
                break
            }
        }

        for (let i = 0; i < transitions.length; i++){
            const transition = transitions[i]
            if (TestCollision({o1 : player, o2 : {...transition, position : {x: transition.position.x, y: transition.position.y + player.velocity}}})){
                player.moving = false
                blocSwitchScene(transition.type)
                break
            }
        }

        if (player.moving){
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
                player.moving = false
                break
            }
        }

        for (let i = 0; i < transitions.length; i++){
            const transition = transitions[i]
            if (TestCollision({o1 : player, o2 : {...transition, position : {x: transition.position.x + player.velocity, y: transition.position.y}}})){
                player.moving = false
                blocSwitchScene(transition.type)
                break
            }
        }
        if (player.moving){
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
            if (TestCollision({o1 : player, o2 : {...boundary, position : {x: boundary.position.x, y: boundary.position.y -player.velocity}}})){
                player.moving = false
                break
            }
        }

        for (let i = 0; i < transitions.length; i++){
            const transition = transitions[i]
            if (TestCollision({o1 : player, o2 : {...transition, position : {x: transition.position.x, y: transition.position.y - player.velocity}}})){
                player.moving = false
                blocSwitchScene(transition.type)
                break
            }
        }

        if (player.moving){
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
                player.moving = false
                break
            }
        }

        for (let i = 0; i < transitions.length; i++){
            const transition = transitions[i]
            if (TestCollision({o1 : player, o2 : {...transition, position : {x: transition.position.x - player.velocity, y: transition.position.y}}})){
                player.moving = false
                blocSwitchScene(transition.type)
                break
            }
        }
        
        if (player.moving){
            movables.forEach(movable => {
                movable.position.x -= player.velocity
            })
        }
    }
    else{player.moving = false
    player.frames.val = 0}  //go back to the static player frame
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

    //update position of each elements
    background.updatePosition(dx, dy)
    foreground.updatePosition(dx, dy)
    boundaries.forEach(boundary => {
        boundary.updatePosition(dx, dy)
    })
    transitions.forEach(transition => {
        transition.updatePosition(dx, dy)
    })
    player.updatePosition(dx, dy)

    //update offsets for transitions        //CURRENT PB : WHEN A RESIZE HAPPENS IN A BUILDING (PB WHEN GOING OUTSIDE)
    DfltSize.x = ScreenSize.x
    DfltSize.y = ScreenSize.y
    ScreenSize.x = canvas.width
    ScreenSize.y = canvas.height
    diffSize.x = DfltSize.x - ScreenSize.x
    diffSize.y = DfltSize.y - ScreenSize.y
    for (elt in map_offsets){
        map_offsets[elt].x -= diffSize.x/2
        map_offsets[elt].y -= diffSize.y/2
    }

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