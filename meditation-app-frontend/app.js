const app = () => {
// CONSTs
const trackPicker = document.querySelector('.track-picker');
const trackPlayerPanel = document.querySelector('.track-player-panel');
let http = import('http');
let url = import('url');
let fs = import('fs');
const arr = [];
let bufferString;

const csvHandler = (req, res) => { 
    fs.readFile('./tracks/Tracklist.csv', function(err, data){
        if (err){
            return console.log(err);
        }
        bufferString = data.toString();

        arr = bufferString.split('\n');
        console.log(arr);

        let jsonObject = [];
        let headers = arr[0].split(',');
        for(let i = 1; i < arr.length; i++){
            let data = arr[i].split(',')
            let obj = {};
            for(let j = 0; j < data.length; j++){
                obj[headers[j].trim()] = data[j].trim();
            }
            jsonObject.push(obj);
        }
        JSON.stringify(jsonObject);

        // for(i = 0; i < arr.length; i++){
        //     JSON.stringify(arr[i]);
        // }
        // JSON.parse(arr)
        // res.send(arr)
    })
}





//FUNCTIONs
const init = () => {
    renderTracks();
    csvHandler();
}

const renderTracks = () => {
    fs.forEach(csv => trackCards(csv))
}

const trackCards = (csv) => {
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


}


app();