const audio = document.getElementById('audio');
const lyricsContainer = document.getElementById('lyrics');

// Song info
const artist = "The Weeknd";
const title = "Lost in the Fire";

// Wait for audio metadata to load (duration)
audio.addEventListener('loadedmetadata', () => {
  fetchLyrics();
});

function fetchLyrics() {
  fetch(`https://api.lyrics.ovh/v1/${artist}/${title}`)
    .then(response => response.json())
    .then(data => {
      if (data.lyrics) {
        const lines = data.lyrics.split('\n').filter(line => line.trim() !== '');
        const duration = audio.duration; // duration in seconds
        const lineDuration = duration / lines.length; // approximate duration per line

        lines.forEach((line, index) => {
          const p = document.createElement('p');
          p.textContent = line;
          p.dataset.time = index * lineDuration;
          lyricsContainer.appendChild(p);
        });

        highlightLyrics(lines.length);
      } else {
        lyricsContainer.textContent = "Lyrics not found!";
      }
    })
    .catch(err => {
      console.error("Error fetching lyrics:", err);
      lyricsContainer.textContent = "Error loading lyrics.";
    });
}

function highlightLyrics(lineCount) {
  let currentLine = -1;
  audio.addEventListener('timeupdate', () => {
    for (let i = 0; i < lineCount; i++) {
      const p = lyricsContainer.children[i];
      const time = parseFloat(p.dataset.time);
      if (audio.currentTime >= time && currentLine !== i) {
        // Remove previous highlight
        if (currentLine >= 0) lyricsContainer.children[currentLine].classList.remove('highlight');
        // Highlight current line
        p.classList.add('highlight');
        currentLine = i;
        p.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });
}
