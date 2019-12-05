// API
const apiHeader = {
  "Content-Type": "application/json",
  Accept: "application/json"
};

const get = url => {
  return fetch(url).then(resp => resp.json());
};

const post = (url, postData) => {
  return fetch(url, {
    method: "POST",
    headers: apiHeader,
    body: JSON.stringify({ username: postData })
  }).then(resp => resp.json());
};

const TRACKS_URL = "http://localhost:3000/tracks";
const USERS_URL = "http://localhost:3000/users";

const API = { get, post };

// CONSTs
const alltracksPanel = document.querySelector(".all-tracks-panel");
const trackPlayerPanel = document.querySelector(".track-player-panel");
const svgNamespace = "http://www.w3.org/2000/svg";

//FUNCTIONs
const init = () => {
  fetchTracks();
};

const userForm = document.querySelector("#sign-in");
userForm.addEventListener("submit", e => {
  submitUser(e, userForm);
});
const submitUser = (e, userForm) => {
  e.preventDefault();
  const userInputForm = userForm.querySelector("input");
  findOrCreateUser(userInputForm);
};
const findOrCreateUser = userInputForm => {
  API.post(USERS_URL, userInputForm.value)
    .then(console.log) // rendering the username to the page, loading the favorites of an existing user
    .then(() => {
      userInputForm.value = "";
    })
    .catch(error => console.log(error.message));
};

const fetchTracks = () => {
  API.get(TRACKS_URL).then(data => renderTracks(data));
};
const renderTracks = tracksData => {
  tracksData.forEach(track => renderTrackCard(track));
};
const renderTrackCard = track => {
  //at some point display the track cards with images.
  const card = document.createElement("div");
  const trackCategory = track.category.split(" ").join("-");
  card.className = `card ${trackCategory}`;

  const title = document.createElement("h2");
  title.innerText = track.title;
  title.style.color = "white";

  const likeBtn = document.createElement("button");
  likeBtn.innerText = "♡";

  const viewBtn = document.createElement("button");
  viewBtn.innerText = "View";
  // may replace br with CSS margin/padding
  const br = document.createElement("br");

  alltracksPanel.append(card, br);
  card.append(title, viewBtn, likeBtn);

  viewBtn.addEventListener("click", e => {
    viewTrack(track);
  });
};

const viewTrack = track => {
  trackPlayerPanel.innerHTML = "";

  const h1 = document.createElement("h1");
  h1.innerText = track.title;

  const h2 = document.createElement("h2");
  h2.innerText =
    `Run Time: ${Math.floor(track.length_in_seconds / 60)} min ` +
    `${track.length_in_seconds % 60} secs`;
  h2.style.color = "white";

  const audio = document.createElement("audio");
  audio.src = `./tracks/${track.filepath}`;

  const playAnimationDiv = document.createElement("div");
  playAnimationDiv.className = "play-animation";

  const playImg = document.createElement("img");
  playImg.className = "play";
  playImg.src = "./svg/play.svg";
  playImg.addEventListener("click", e => {
     checkPlaying(audio, playImg, timer, timeDisplay);
  });

  let timer = track.length_in_seconds
  const timeDisplay = document.createElement("h1");
  timeDisplay.className = "time-display";
  let mins = Math.floor(timer/ 60)
  let seconds = Math.floor(timer % 60)
  timeDisplay.textContent = `${mins}:${seconds}`

  // replay fires only after time runs down to 0:00
  // const replay = document.querySelector("replay");

  const trackOutlineSVG = document.createElementNS(svgNamespace, "svg");
  trackOutlineSVG.className = "track-outline";
  trackOutlineSVG.setAttributeNS(null, "width", "453");
  trackOutlineSVG.setAttributeNS(null, "height", "453");
  trackOutlineSVG.setAttributeNS(null, "viewbox", "0 0 453 453");
  trackOutlineSVG.setAttributeNS(null, "fill", "none");
  const circleTrackOutline = document.createElementNS(svgNamespace, "circle");
  circleTrackOutline.setAttributeNS(null, "cx", "226.5");
  circleTrackOutline.setAttributeNS(null, "cy", "226.5");
  circleTrackOutline.setAttributeNS(null, "r", "216.5");
  circleTrackOutline.setAttributeNS(null, "stroke", "white");
  circleTrackOutline.setAttributeNS(null, "stroke-width", "20");
  trackOutlineSVG.append(circleTrackOutline);

  const movingOutlineSVG = document.createElementNS(svgNamespace, "svg");
  movingOutlineSVG.className = "moving-outline";
  movingOutlineSVG.setAttributeNS(null, "width", "453");
  movingOutlineSVG.setAttributeNS(null, "height", "453");
  movingOutlineSVG.setAttributeNS(null, "viewbox", "0 0 453 453");
  movingOutlineSVG.setAttributeNS(null, "fill", "none");
  const circleMovingOutline = document.createElementNS(svgNamespace, "circle");
  circleMovingOutline.setAttributeNS(null, "cx", "226.5");
  circleMovingOutline.setAttributeNS(null, "cy", "226.5");
  circleMovingOutline.setAttributeNS(null, "r", "216.5");
  circleMovingOutline.setAttributeNS(null, "stroke", "#018EBA");
  circleMovingOutline.setAttributeNS(null, "stroke-width", "20");
  movingOutlineSVG.append(circleMovingOutline);



  // let radius = circleMovingOutline.getAttributeNS(null, "r", "216.5");
  // let circumference = 2 * Math.PI * radius;
  // movingOutlineSVG.style.strokeDasharray = circumference;
  // movingOutlineSVG.style.strokeDashoffset = circumference;
  
  // track.ontimeupdate = () => {
  //   let currentTime = track.currentTime;
  //   let progress = circumference - (currentTime / timer) * circumference
  //   movingOutlineSVG.style.strokeDashoffset = progress;
  // }

  trackPlayerPanel.append(h1, h2, audio, playAnimationDiv, timeDisplay);
  playAnimationDiv.append(playImg, movingOutlineSVG, trackOutlineSVG);
};


const checkPlaying = (audio, playImg, timer, timeDisplay) => {
  console.log(audio);
  if (audio.paused) {
    audio.play();
    playImg.src = "./svg/pause.svg";
    setInterval(() => {
      let mins = Math.floor(timer/ 60)
      let seconds = Math.floor(timer % 60)
      if (seconds < 10 ){
        seconds = "0" + Math.floor(timer % 60)
      }
      timeDisplay.textContent = `${mins}:${seconds}`
      timer--
    }, 1000)
  } else {
    audio.pause();
    playImg.src = "./svg/play.svg";
    clearInterval(timer, timeDisplay)
    timeDisplay.textContent = "Paused";
    // playImg.addEventListener("click", e => {
    //   checkPlaying(audio, playImg);
    // });
  }

  // when user clicks on a category - function getTracksByCategory
  // selceted category - use class eg. c1, c2, c3...
  //  const getTracksByCategory = () => {
  //     console.log('test')
  //  }

  //  navbar click event for Favorites - should show user all tracks that have been liked
};

init();

