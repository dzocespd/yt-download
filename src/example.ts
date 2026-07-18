import { Downloader } from "./core";

class YouTubeDownloader extends Downloader {}

const downloader = new YouTubeDownloader();

async function examples() {
  const youtubeUrl =
    "https://www.youtube.com/url_here";
  const outputPath = "./downloads/";

  try {
    console.log("Downloading video as MP4...");
    const videoResult = await downloader.download(youtubeUrl, outputPath, {
      outputFormat: "video",
      videoFormat: "mp4",
      quality: "highest",
    });
    console.log(`MP4 saved to: ${videoResult.path}`);

    console.log("Converting to MP3...");
    const audioResult = await downloader.download(youtubeUrl, outputPath, {
      outputFormat: "audio",
      audioFormat: "mp3",
      audioBitrate: 320,
      quality: "highestaudio",
    });
    console.log(`MP3 saved to: ${audioResult.path}`);
  } catch (error) {
    console.error("Download failed:", error);
  }
}

examples();

export { YouTubeDownloader, examples };
