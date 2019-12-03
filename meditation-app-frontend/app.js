const app = () => {
// CONSTs
const TRACKS_URL = 'http://localhost:3000/tracks';
const trackPicker = document.querySelector('.track-picker');
const trackPlayerPanel = document.querySelector('.track-player-panel');

//FUNCTIONs
const init = () => {
    fetchTracks();
}
const fetchTracks = () => {
    fetch(TRACKS_URL)
    .then(res => res.json())
    .then(data => renderTracks(data))
}
const renderTracks = data => {
    data.forEach(track => trackCards(track))
}
const trackCards = track => {
    //at some point display the track cards with images.
    const card = document.createElement('div')
    card.className = "card"
    const title = document.createElement('h2')
    title.innerText = track.title
    title.style.color = "white"
    const likeBtn = document.createElement('button')
    likeBtn.innerText = "♡"
    const viewBtn = document.createElement('button')
    viewBtn.innerText = "View"
    const br = document.createElement('br')

    trackPicker.append(card, br)
    card.append(title, viewBtn, likeBtn)

    viewBtn.addEventListener('click', e => {
        viewTrack(track)
    })
    //when user clicks on track need to show the selected track details with the player feature
}

const viewTrack = track => {
    trackPlayerPanel.innerHTML = ""

    const h1 = document.createElement('h1')
    h1.innerText = track.title
    const h2 = document.createElement('h2')
    h2.innerText = `${Math.floor(track.length_in_seconds / 60)} min ` + `${track.length_in_seconds % 60} secs`
    h2.style.color = "white"

    const audio = document.createElement('audio')
    audio.src = track.filepath
    const play = document.querySelector('.play');
    const replay = document.querySelector('replay');
    const outline = document.querySelector('.moving-outline circle');

    const timeDisplay = document.createElement('h1')
    timeDisplay.className = "time-display"
    timeDisplay.innerText = "0:00"

    trackPlayerPanel.append(h1, h2, audio, timeDisplay)
}


init();

// In the trackPlayerPanel section we need to display the selected track details:
// track title - track length - track timer - favorite button


}


app();