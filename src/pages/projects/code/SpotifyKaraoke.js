import Image from "../../../components/Image"
import { Caption } from "../../../components/styles/Caption.styled"
import Subtitle from "../../../components/Subtitle"
import Video from "../../../components/Video"
import spotifyKaraokeVideo from "../../../resources/videos/spotifyKaraokeDemo.mp4"

const SpotifyKaraoke = () => {
  return (
    <div>
      <Subtitle title={"Spotify Karaoke"} subtitle={"August - October 2023"} />
      <br />
      <Video url={spotifyKaraokeVideo} width={"65%"} />
      <Caption>Video demo of the app running locally, showcasing features for the song "Call Me Maybe" by Carly Rae Jepsen.</Caption>
      <br />
      Search for songs on Spotify, and for those with listed lyrics in English,
      the app will generate a vocaless track to sing along to, as well as lyrics animated to match with the words as they appear in the song.
      You can also click on the words to instantly jump to that point in the song.
      <br />
      <br />
      <a href="https://github.com/MyriadRivers/spotify-karaoke">Frontend</a> was developed in React.js with TypeScript and
      <a href="https://github.com/MyriadRivers/spotify-karaoke-generation"> backend</a> was developed in python,
      leveraging WhisperX, a version of OpenAI's Whisper speech-to-text transcription model, and Deezer's Spleeter source separation model.
      <br />
      <br />
      Lyrics are synchronized with a dynamic programming based approach matching Spotify lyrics,
      which have the correct words but no word timestamps, with WhisperX detected words, which contain timestamps but not 100% accurate words.

    </div>
  )
}

export default SpotifyKaraoke