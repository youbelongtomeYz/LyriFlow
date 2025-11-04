const audio = document.getElementById("audio");
const lyricsDiv = document.getElementById("lyrics");
let lyrics = [];
let currentLine = 0;

fetch("lyrics/example.lrc")
  .then((res) => res.text())
  .then(parseLyrics);

function parseLyrics(text) {
  const lines = text
    .split("\n")
    .map((line) => {
      const match = line.match(/\[(\d+):(\d+\.\d+)\](.*)/);
      if (!match) return null;
      const [, min, sec, lyric] = match;
      return { time: parseFloat(min) * 60 + parseFloat(sec), lyric };
    })
    .filter(Boolean);
  lyrics = lines;
  lyrics.forEach((line) => {
    const p = document.createElement("p");
    p.textContent = line.lyric;
    lyricsDiv.appendChild(p);
  });
}

audio.addEventListener("timeupdate", () => {
  if (!lyrics.length) return;
  const currentTime = audio.currentTime;
  const index = lyrics.findIndex(
    (line, i) =>
      currentTime >= line.time &&
      (i === lyrics.length - 1 || currentTime < lyrics[i + 1].time)
  );
  if (index !== -1 && index !== currentLine) {
    const ps = lyricsDiv.querySelectorAll("p");
    ps.forEach((p) => p.classList.remove("active"));
    ps[index].classList.add("active");
    currentLine = index;
  }
});
