let word;
let desc = "no description available";
let number_of_tries = 0;
let word_found = false;
const lim_of_tries = 8;
setTimeout(function() {
    playSongs(0, minigame_songs); // Start playing from the first song
}, 500); // Adjust the delay time as needed (in milliseconds)

const params = new URLSearchParams(window.location.search);

// Get the values of specific query parameters
const xp = params.get('xp');
const money = params.get('money');
const x = params.get('x');
const current_place = params.get('place');
const y = params.get('y');
const last_posx = params.get('last_posx');
const last_posy = params.get('last_posy');
console.log(xp, money, x, y, current_place)
function choseAword(){
    const number_of_words = dictionary2.length
    const nbr = Math.floor(Math.random() * number_of_words)
    word = dictionary2[nbr].toUpperCase()
    //research of a description
    let ind = 0
    while ((word != dictionary[ind][0].toUpperCase()) && (ind < dictionary.length - 1)){
        ind += 1
    }
    if (word == dictionary[ind][0].toUpperCase()){
        desc = dictionary[ind][1]
    }
    console.log(word, desc)
}
choseAword()
console.log(window.myVariable)
let current_try = 0;

function createAWordLine(){
    current_try++
    const numberOfInputs = word.length
    const wordContainer = document.getElementById("wordContainer")

    const word_bloc = document.createElement("div")
    word_bloc.className = "word_line"
    word_bloc.id = `word_bloc${current_try}`
    wordContainer.appendChild(word_bloc)
    const inputContainer = document.getElementById("wordContainer")
    for (let i = 1; i <= numberOfInputs; i++) {
        const input = document.createElement("input")
        input.type = "text"
        input.className = "inputs"
        input.tabIndex = -1
        input.id = `input${current_try}_${i}`
        input.maxLength = 1
        inputContainer.appendChild(input)
    }
}
createAWordLine()


function checkIfFull(){
    return (document.getElementById(`input${current_try}_${word.length}`).value != "")
}

let pointer = 1;
function addLetter(letter){
    if (!checkIfFull()){
        document.getElementById(`input${current_try}_${pointer}`).value = letter.toUpperCase()
        pointer += 1
    }
}

function checkIfCorrect(){
    let word_tried = "";
    for (let i = 1; i <= word.length; i++) {
        word_tried += document.getElementById(`input${current_try}_${i}`).value
    }
    return (word_tried == word)
}

let letter_used = []
for (let i = 0; i < word.length; i++){
    letter_used.push({key: word[i], value:0, last_yellow: -1})
}

function show_result(){
    result_box = document.getElementById("result_box")
    result_box.removeChild(result_box.firstElementChild)
    const res = document.createElement("p")
    const word_text = document.createElement("p")
    const word_desc = document.createElement("p")
    res.className = "result"
    word_text.className = "result"
    word_desc.className = "result"
    if (word_found){ 
        if (number_of_tries == 1){
            res.innerHTML = `YOU'VE WON ! It only took you ${number_of_tries} try !`
        }
        else{
            res.innerHTML = `YOU'VE WON ! It took you ${number_of_tries} tries`
        }
        word_text.innerHTML = `The word was indeed ${word}`
        
    }
    else{
        res.innerHTML = `YOU'VE LOST... :(`
        word_text.innerHTML = `The word was ${word}`
    }
    word_desc.innerHTML = `${word} : ${desc}`
    result_box.appendChild(res)
    result_box.appendChild(word_text)
    result_box.appendChild(word_desc)
}

function wordExists(){
    //get the word entered by the user
    let word_tried = "";
    for (let i = 1; i <= word.length; i++) {
        word_tried += document.getElementById(`input${current_try}_${i}`).value
    }
    let ind = 0
    while ((word_tried != dictionary2[ind].toUpperCase()) && (ind < dictionary2.length - 1)){
        ind += 1
    }
    return (word_tried == dictionary2[ind].toUpperCase())
}

function guessTheWord(){
    if (!wordExists()){
        const existence = document.getElementById("nonExistent").style.visibility = "visible"
    }
    else if (pointer == word.length + 1){
        const existence = document.getElementById("nonExistent").style.visibility = "hidden"
        for (let i = 0; i < word.length; i++){
            let input = document.getElementById(`input${current_try}_${i+1}`)
            switch (input.value == word[i]){
                case true:
                    if (letter_used[i].value == 1){   //was used to make a yellow
                        input_temp = document.getElementById(`input${current_try}_${letter_used[i].last_yellow}`)
                        let found = false
                        if (i!=word.length-1){  //we're gonna search if the same letter is available further to make it yellow
                            for (let k = i+1; k<word.length; k++){
                                if (letter_used[k].key == input_temp.value && letter_used[k].value == 0){
                                    letter_used[k].value++
                                    letter_used[k].last_yellow = letter_used[i].last_yellow
                                    found = true
                                    break
                                } 
                            }
                        }
                        if (!found){
                            input_temp.style.backgroundColor = "rgb(202,45,45)"
                        }
                    }
                    else{
                        letter_used[i].value = 1
                    }
                    input.style.backgroundColor = "green"
                    break
                case false:
                    if (word.includes(input.value)){
                        for (let j = 0; j<letter_used.length; j++){
                            if (letter_used[j].key == input.value && letter_used[j].value == 0){
                                input.style.backgroundColor = 'rgb(255, 215, 0)'
                                letter_used[j].value = 1
                                letter_used[j].last_yellow = i+1
                                break
                            }
                        }
                        if (input.style.backgroundColor != 'rgb(255, 215, 0)'){
                            input.style.backgroundColor = "rgb(202,45,45)"
                        }
                    }
                    else{
                        input.style.backgroundColor = "rgb(202,45,45)"
                    }
                    break
            }
        }
        number_of_tries += 1
        if (!checkIfCorrect()){
            if (number_of_tries == lim_of_tries){
                show_result()
            }
            else{
                createAWordLine()
                pointer = 1
                for (let j = 0; j<letter_used.length; j++){
                    letter_used[j].value = 0
                }
            }
        }
        else{
            word_found = true
            show_result()
        }
    }
}

const specialKeys = ["Enter", " ", "Backspace", "Shift", "Tab", "CapsLock", "Control", "Alt", "AltGraph", "Meta", "1", "2", "3","4", "5", "6", "7", "8", "9", "0", "*", ".", ",", "-", "+", "/", "é", "è", "à", "ù", "ç", "%", "$", "^", "@", "_", "\\"]
window.addEventListener('keydown', (e) => {
    if (!specialKeys.includes(e.key)){
        addLetter(e.key)
    }

    else if (e.key == "Enter"){
        guessTheWord()
    }
    else if (e.key == "Backspace"){
        if (pointer == 1){
            document.getElementById(`input${current_try}_${pointer}`).value = ""
        }
        else{
            pointer --
            document.getElementById(`input${current_try}_${pointer}`).value = ""
        }     
    }
}
)

const button = document.getElementById('backButton');  
button.addEventListener('click', function() { 
  console.log("hello there")
  window.location.href = `./main.html?money=${money}&xp=${xp}&place=${current_place}&x=${x}&y=${y}&last_posx=${last_posx}&last_posy=${last_posy}`
}); 