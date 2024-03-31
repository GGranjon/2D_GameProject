// Array of audio file paths
var main_songs = ["../data/audio/littleroot.mp3", "../data/audio/route101.mp3"];
var minigame_songs = ["../data/audio/minigame1.mp3"]
var audio;
// Function to play songs sequentially
function playSongs(index, where) {
    if (index < where.length) audio = new Audio(where[index]);
    else audio = new Audio(where[0]);
    audio.play();
        audio.onended = function() {
            playSongs(index + 1, where); // Play the next song when the current one ends
        };

}

function initializeGameSongs() {
    setTimeout(function() {
        playSongs(0, main_songs); // Start playing from the first song
    }, 500); // Adjust the delay time as needed (in milliseconds)
}
// Call the function to initialize the game when the document is fully loaded
//document.addEventListener("DOMContentLoaded", initializeGameSongs);