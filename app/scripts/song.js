// Array of audio file paths
var songs = ["../data/audio/littleroot.mp3", "../data/audio/route101.mp3"];
var audio;
// Function to play songs sequentially
function playSongs(index) {
    if (index < songs.length) audio = new Audio(songs[index]);
    else audio = new Audio(songs[0]);
    audio.play();
        audio.onended = function() {
            playSongs(index + 1); // Play the next song when the current one ends
        };

}

function initializeGame() {
    setTimeout(function() {
        playSongs(0); // Start playing from the first song
    }, 500); // Adjust the delay time as needed (in milliseconds)
}
// Call the function to initialize the game when the document is fully loaded
document.addEventListener("DOMContentLoaded", initializeGame);