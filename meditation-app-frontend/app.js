// CONSTs
const trackPicker = document.querySelector('.track-picker');
const trackPlayerPanel = document.querySelector('.track-player-panel');

//FUNCTIONs
const init = () => {
    trackCards();
}

const trackCards = () => {
    //at some point display the track cards with images.
    const card = document.createElement('div')
    card.className = "card"
    const title = document.createElement('h2')
    title.innerText = "Track Title"
    title.style.color = "white"
    const likeBtn = document.createElement('button')
    likeBtn.innerText = "♡"


    trackPicker.append(card)
    card.append(title, likeBtn)
}

// CARD HTML TEMPLATE:
//<div class="card">
//<h2>TRACK TITLE</h2>
//<img src=toy_image_url class="track-image" />
//<button class="like-btn">Like ♡</button>
//</div>


init();


// In the trackPicker section we need to display the trackCards with the track titles
//maybe inclue the track Categories?

// In the trackPlayerPanel section we need to display the selected track details:
// track title - track length - track timer - favorite button

// 