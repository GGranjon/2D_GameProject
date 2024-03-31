
const DfltSize = {x : 1920, y : 1080}

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

const canvas = document.querySelector('canvas')
canvas.width  = window.innerWidth
canvas.height = window.innerHeight
const c = canvas.getContext('2d')
let ScreenSize = {x: canvas.width, y: canvas.height}

const diffSize = {x : DfltSize.x - ScreenSize.x, y : DfltSize.y - ScreenSize.y}
const map_offsets = {"home": {x: -135 - diffSize.x/2, y:-850 - diffSize.y/2}, "town": {x : -1260 - diffSize.x/2,y : -1588 - diffSize.y/2}, "school": {x: -95 - diffSize.x/2, y:-920 - diffSize.y/2, board:{x:-95 - diffSize.x/2,y:-110 - diffSize.y/2}}, "company": {x: -5 - diffSize.x/2, y:720 - diffSize.y/2}}