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
const renderTracks = data => {
  data.forEach(track => renderTrackCard(track));
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
  //when user clicks on track need to show the selected track details with the player feature
};

const viewTrack = track => {
  trackPlayerPanel.innerHTML = "";

  const h1 = document.createElement("h1");
  h1.innerText = track.title;

  const h2 = document.createElement("h2");
  h2.innerText =
    `${Math.floor(track.length_in_seconds / 60)} min ` +
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
    checkPlaying(audio, playImg);
  });

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

  const timeDisplay = document.createElement("h1");
  timeDisplay.className = "time-display";
  timeDisplay.innerText = "0:00";

  playAnimationDiv.append(playImg, trackOutlineSVG, movingOutlineSVG);
  trackPlayerPanel.append(h1, h2, audio, playAnimationDiv, timeDisplay);
};

const checkPlaying = (audio, playImg) => {
  console.log(audio);
  if (audio.paused) {
    audio.play();
    playImg.src = "./svg/pause.svg";
  } else {
    audio.pause();
    playImg.src = "./svg/play.svg";
    playImg.addEventListener("click", e => {
      checkPlaying(audio, playImg);
    });

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
    const circleMovingOutline = document.createElementNS(
      svgNamespace,
      "circle"
    );
    circleMovingOutline.setAttributeNS(null, "cx", "226.5");
    circleMovingOutline.setAttributeNS(null, "cy", "226.5");
    circleMovingOutline.setAttributeNS(null, "r", "216.5");
    circleMovingOutline.setAttributeNS(null, "stroke", "#018EBA");
    circleMovingOutline.setAttributeNS(null, "stroke-width", "20");
    movingOutlineSVG.append(circleMovingOutline);

    const timeDisplay = document.createElement("h1");
    timeDisplay.className = "time-display";
    timeDisplay.innerText = "0:00";

    playAnimationDiv.append(playImg, trackOutlineSVG, movingOutlineSVG);
    trackPlayerPanel.append(h1, h2, audio, playAnimationDiv, timeDisplay);
  }

  const checkPlaying = (audio, playImg) => {
    console.log(audio);
    if (audio.paused) {
      audio.play();
      playImg.src = "./svg/pause.svg";
    } else {
      audio.pause();
      playImg.src = "./svg/play.svg";
    }
  };

  // when user clicks on a category - function getTracksByCategory
  //  const getTracksByCategory = () => {
  //     console.log('test')
  //  }

  //  navbar click event for Favorites - should show user all tracks that have been liked

  init();
};

app();

//HTML background image?:
// src="https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=813&q=80"
