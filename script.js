const audio = document.getElementById('audio');
const lyricsContainer = document.getElementById('lyrics');

let lyrics = []; // array of {time, text}
let currentLine = -1;

// Load LRC file
fetch('lyrics/example.lrc')
  .then(response => response.text())
  .then(data => {
    // Split lines and parse timestamps
    const lines = data.split('\n').filter(line => line.includes(']'));
    lines.forEach(line => {
      const match = line.match(/\[(\d+):(\d+\.\d+)\](.*)/);
      if (match) {
        const minutes = parseInt(match[1]);
        const seconds = parseFloat(match[2]);
        const text = match[3].trim();
        const time = minutes * 60 + seconds;
        lyrics.push({ time, text });

        // Add paragraph to HTML
        const p = document.createElement('p');
        p.textContent = text;
        lyricsContainer.appendChild(p);
      }
    });
  });

// Highlight lyrics as song plays
audio.addEventListener('timeupdate', () => {
  if (!lyrics.length) return;

  // Find the current line
  for (let i = 0; i < lyrics.length; i++) {
    if (audio.currentTime >= lyrics[i].time && (i === lyrics.length - 1 || audio.currentTime < lyrics[i + 1].time)) {
      if (currentLine !== i) {
        // Remove highlight from previous line
        if (currentLine >= 0) {
          lyricsContainer.children[currentLine].classList.remove('highlight');
        }
        // Highlight current line
        lyricsContainer.children[i].classList.add('highlight');
        currentLine = i;

        // Scroll the container to keep the line in view
        lyricsContainer.children[i].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      break;
    }
  }
});
