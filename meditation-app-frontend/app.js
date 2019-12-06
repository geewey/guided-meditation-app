// API
const apiHeader = {
  "Content-Type": "application/json",
  Accept: "application/json"
};

const get = (url, id = "") => {
  return fetch(url + id).then(resp => resp.json());
};

const postUser = (url, postData) => {
  return fetch(url, {
    method: "POST",
    headers: apiHeader,
    body: JSON.stringify({ username: postData })
  }).then(resp => resp.json());
};

const postFavorite = (url, user_id, track_id) => {
  return fetch(url, {
    method: "POST",
    headers: apiHeader,
    body: JSON.stringify({ user_id, track_id })
  }).then(resp => resp.json());
};

const destroy = (url, id) => {
  return fetch(url + id, {
    method: "DELETE",
    headers: apiHeader
  }).then(resp => resp.json());
};

const TRACKS_URL = "http://localhost:3000/tracks/";
const USERS_URL = "http://localhost:3000/users/";
const FAVORITES_URL = "http://localhost:3000/favorites/";

const API = { get, postUser, postFavorite, destroy };

// CONSTs
const alltracksPanel = document.querySelector(".all-tracks-panel");
const trackPlayerPanel = document.querySelector(".track-player-panel");
const svgNamespace = "http://www.w3.org/2000/svg";
let isUserLoggedIn = false;
let currentUserId = null;

//FUNCTIONs
const init = () => {
  fetchTracks();
};

// Set user sign-in checks
const userForm = document.querySelector("#sign-in");
userForm.addEventListener("submit", e => {
  submitUser(e, userForm);
});
const submitUser = (e, userForm) => {
  e.preventDefault();
  const userInputField = userForm.querySelector("input");
  if (userInputField.value.length < 2) {
    alert("Username must contain at least 2 characters.");
  } else {
    findOrCreateUser(userInputField, userForm);
  }
};
const findOrCreateUser = (userInputField, userForm) => {
  // renders the username to the page, in place of username input field
  // loads the favorites of an existing user
  API.postUser(USERS_URL, userInputField.value)
    .then(userData => {
      console.log(userData);
      isUserLoggedIn = true;
      currentUserId = userData.id;
      toggleUserSignIn(userInputField, userForm);
      toggleUserFavorites(userData);
    })
    .catch(error => console.log(error.message));
};
const toggleUserSignIn = (userInputField, userForm) => {
  const signInOverlay = document.querySelector("#sign-in-overlay");
  const userWelcomeP = document.createElement("p");
  userWelcomeP.className = "user-welcome-p";
  userWelcomeP.innerText = `Welcome ${userInputField.value}!`;
  userForm.className = "hidden";
  // maybe have time for a logout feature?
  userInputField.value = "";
  signInOverlay.append(userWelcomeP);
};

// Render sign-in user's favorite track(s)
// toggles button to "active" for existing favorites
const toggleUserFavorites = userData => {
  const allTrackCards = Array.from(
    document.getElementsByClassName("track-card")
  );
  const userFavorites = userData.favorites;
  for (let userFavorite of userFavorites) {
    activateUserFavorites(userFavorite, allTrackCards);
  }
};
const activateUserFavorites = (userFavorite, allTrackCards) => {
  allTrackCards.forEach(trackCard => {
    trackCardFavBtn = trackCard.querySelector(".favorite-button");

    if (trackCard.getAttribute("track-id") == userFavorite.track_id) {
      trackCard.classList.add("user-favorite");
      trackCard.dataset.favoriteId = userFavorite.id;
      trackCardFavBtn.innerText = "♥";
      trackCardFavBtn.classList.add("activated");
    }
  });
};

// Set favorite button functionality
// only active if isUserLoggedIn === true
const toggleFavoriteBtn = (trackCard, trackCardFavBtn, track) => {
  const clickedTrackId = track.id;
  if (isUserLoggedIn && !trackCardFavBtn.classList.contains("activated")) {
    trackCardFavBtn.innerText = "♥";
    trackCardFavBtn.classList.add("activated");
    addToUserFavorites(clickedTrackId, trackCard);
  } else if (
    isUserLoggedIn &&
    trackCardFavBtn.classList.contains("activated")
  ) {
    trackCardFavBtn.innerText = "♡";
    trackCardFavBtn.classList.remove("activated");
    deleteFromUserFavorites(trackCard.dataset.favoriteId, trackCard);
  }
};

const addToUserFavorites = (clickedTrackId, trackCard) => {
  // add favorite id to card
  API.postFavorite(FAVORITES_URL, currentUserId, clickedTrackId)
    .then(favData => {
      trackCard.dataset.favoriteId = favData.id;
    })
    .catch(error => console.log(error.message));
};

const deleteFromUserFavorites = (favoriteId, trackCard) => {
  // remove favorite id from card
  API.destroy(FAVORITES_URL, favoriteId)
    .then(() => {
      trackCard.removeAttribute("data-favorite-id");
    })
    .catch(error => console.log(error.message));
};

// Fetch all tracks from Rails API
const fetchTracks = () => {
  API.get(TRACKS_URL).then(tracksData => renderTracks(tracksData));
};
const renderTracks = tracksData => {
  tracksData.forEach(track => renderTrackCard(track));
};
const renderTrackCard = track => {
  //at some point display the track cards with images.
  const trackCard = document.createElement("div");
  const trackCategory = track.category.split(" ").join("-");

  trackCard.setAttribute("track-id", track.id);
  trackCard.className = `track-card ${trackCategory}`;

  const title = document.createElement("h2");
  title.innerText = track.title;
  title.style.color = "white";

  const favoriteBtn = document.createElement("button");
  favoriteBtn.innerText = "♡";
  favoriteBtn.className = "favorite-button";
  favoriteBtn.setAttribute("track-id", track.id);
  favoriteBtn.addEventListener("click", () => {
    toggleFavoriteBtn(trackCard, favoriteBtn, track);
  });

  const viewBtn = document.createElement("button");
  viewBtn.innerText = "View";
  // may replace br with CSS margin/padding
  const br = document.createElement("br");

  alltracksPanel.append(trackCard, br);
  trackCard.append(title, viewBtn, favoriteBtn);

  viewBtn.addEventListener("click", e => {
    viewTrack(track);
  });
};

// Render selected track to view panel
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
  }
  // when user clicks on a category - function getTracksByCategory
  //  const getTracksByCategory = () => {
  //     console.log('test')
  //  }

  //  navbar click event for Favorites - should show user all tracks that have been liked
};

init();

//HTML background image?:
// src="https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=813&q=80"
