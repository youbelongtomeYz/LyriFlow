const libraryDiv = document.getElementById('library');
const playerIframe = document.getElementById('player');
const lyricsContainer = document.getElementById('lyrics');

let currentLines = [];
let currentLineIndex = -1;
let lineInterval = null;

libraryDiv.addEventListener('click', e => {
  if (e.target.tagName === 'BUTTON') {
    const songUrl = e.target.dataset.song;
    const artist = e.target.dataset.artist;
    const title = e.target.dataset.title;
    loadSong(songUrl, artist, title);
  }
});

function loadSong(songUrl, artist, title) {
  // Set the player to the embed URL
  playerIframe.src = songUrl;
  lyricsContainer.innerHTML = '';
  currentLines = [];
  currentLineIndex = -1;
  if (lineInterval) clearInterval(lineInterval);

  fetchLyrics(artist, title);
}

function fetchLyrics(artist, title) {
  const apiUrl = `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`;
  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      if (data.lyrics) {
        const lines = data.lyrics.split('\n').filter(line => line.trim() !== '');
        lines.forEach(line => {
          const p = document.createElement('p');
          p.textContent = line;
          lyricsContainer.appendChild(p);
        });
        currentLines = lines;
        startAutoHighlight();
      } else {
        lyricsContainer.textContent = "Lyrics not found!";
      }
    })
    .catch(err => {
      console.error("Error fetching lyrics:", err);
      lyricsContainer.textContent = "Error loading lyrics.";
    });
}

function startAutoHighlight() {
  // Approximate highlight by interval (since embed player may not provide currentTime)
  const totalLines = currentLines.length;
  const highlightInterval = 4000; // every 4 seconds change line
  lineInterval = setInterval(() => {
    if (currentLineIndex + 1 < totalLines) {
      if (currentLineIndex >= 0) {
        lyricsContainer.children[currentLineIndex].classList.remove('highlight');
      }
      currentLineIndex++;
      lyricsContainer.children[currentLineIndex].classList.add('highlight');
      lyricsContainer.children[currentLineIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      clearInterval(lineInterval);
    }
  }, highlightInterval);
}
