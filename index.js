const image = document.getElementById('cover'),
    title = document.getElementById('music-title'),
    artist = document.getElementById('music-artist'),
    currentTimeEl = document.getElementById('current-time'),
    durationEl = document.getElementById('duration'),
    progress = document.getElementById('progress'),
    playerProgress = document.getElementById('player-progress'),
    prevBtn = document.getElementById('prev'),
    nextBtn = document.getElementById('next'),
    playBtn = document.getElementById('play'),
    background = document.getElementById('bg-img');

const music = new Audio();

const songs = [
    {
        path: 'assets/drake.mp3',
        displayName: 'GREECE',
        cover: 'assets/drake.png',
        artist: 'DJ Khaled ft. Drake',
    },
    {
        path: 'assets/green.mp3',
        displayName: 'Barcelona92',
        cover: 'assets/green.png',
        artist: 'Green Montana ft. SDM',
    },
    {
        path: 'assets/laylow.mp3',
        displayName: '10',
        cover: 'assets/laylow.jpg',
        artist: 'Laylow',
    },
    {
        path: 'assets/plk.mp3',
        displayName: 'La nuit',
        cover: 'assets/plk.jpg',
        artist: 'PLK ft. TIF',
    }
];

let musicIndex = 0;
let isPlaying = false;

function togglePlay() {
    if (isPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
}

function playMusic() {
    isPlaying = true;
    // Change play button icon
    playBtn.classList.replace('fa-play', 'fa-pause');
    // Set button hover title
    playBtn.setAttribute('title', 'Pause');
    music.play();
}

function pauseMusic() {
    isPlaying = false;
    // Change pause button icon
    playBtn.classList.replace('fa-pause', 'fa-play');
    // Set button hover title
    playBtn.setAttribute('title', 'Play');
    music.pause();
}

function loadMusic(song) {
    music.src = song.path;
    title.textContent = song.displayName;
    artist.textContent = song.artist;
    image.src = song.cover;
    background.src = song.cover;
}

function changeMusic(direction) {
    musicIndex = (musicIndex + direction + songs.length) % songs.length;
    loadMusic(songs[musicIndex]);
    playMusic();
}

function updateProgressBar() {
    const { duration, currentTime } = music;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;

    const formatTime = (time) => String(Math.floor(time)).padStart(2, '0');
    durationEl.textContent = `${formatTime(duration / 60)}:${formatTime(duration % 60)}`;
    currentTimeEl.textContent = `${formatTime(currentTime / 60)}:${formatTime(currentTime % 60)}`;
}

let isDragging = false;

function startDrag(e) {
    isDragging = true;
    setProgressBar(e);
}

function endDrag() {
    isDragging = false;
}

function dragProgress(e) {
    if (!isDragging) return;
    setProgressBar(e);
}

function setProgressBar(e) {
    const width = playerProgress.clientWidth;
    let clickX;
    if (e.type.includes('touch')) {
        const touch = e.touches[0];
        clickX = touch.clientX - playerProgress.getBoundingClientRect().left;
    } else {
        clickX = e.offsetX;
    }
    const progressPercent = Math.max(0, Math.min(clickX / width, 1)); // Clamp entre 0 et 1
    music.currentTime = progressPercent * music.duration;
}

playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', () => changeMusic(-1));
nextBtn.addEventListener('click', () => changeMusic(1));
music.addEventListener('ended', () => changeMusic(1));
music.addEventListener('timeupdate', updateProgressBar);
playerProgress.addEventListener('click', setProgressBar);

// Événements pour la souris
playerProgress.addEventListener('mousedown', startDrag);
document.addEventListener('mouseup', endDrag);
document.addEventListener('mousemove', dragProgress);

// Événements pour le tactile
playerProgress.addEventListener('touchstart', startDrag);
document.addEventListener('touchend', endDrag);
document.addEventListener('touchmove', dragProgress);


loadMusic(songs[musicIndex]);