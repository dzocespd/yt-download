import { Downloader } from "./core";

class YouTubeDownloader extends Downloader {}

const downloader = new YouTubeDownloader();

async function examples() {
  const youtubeUrl = "https://www.youtube.com/some-url";
  const outputPath = "./downloads/";

  try {
    // Example 1: Download video as MP4 (most compatible)
    console.log("Downloading video as MP4...");
    const videoResult = await downloader.download(youtubeUrl, outputPath, {
      outputFormat: "video",
      videoFormat: "mp4",
      quality: "highest"
    });
    console.log(`MP4 saved to: ${videoResult.path}`);

    // Example 2: Convert to MP3 audio (most popular)
    console.log("Converting to MP3...");
    const audioResult = await downloader.download(youtubeUrl, outputPath, {
      outputFormat: "audio",
      audioFormat: "mp3",
      audioBitrate: 320,
      quality: "highestaudio"
    });
    console.log(`MP3 saved to: ${audioResult.path}`);

    // Example 3: Download as AVI (universal compatibility)
    console.log("Downloading as AVI...");
    const aviResult = await downloader.download(youtubeUrl, outputPath, {
      outputFormat: "video",
      videoFormat: "avi",
      quality: "highest"
    });
    console.log(`AVI saved to: ${aviResult.path}`);

    // Example 4: Download as MOV (Apple format)
    console.log("Downloading as MOV...");
    const movResult = await downloader.download(youtubeUrl, outputPath, {
      outputFormat: "video",
      videoFormat: "mov",
      quality: "highest"
    });
    console.log(`MOV saved to: ${movResult.path}`);

    // Example 5: Convert to FLAC (lossless audio)
    console.log("Converting to FLAC...");
    const flacResult = await downloader.download(youtubeUrl, outputPath, {
      outputFormat: "audio",
      audioFormat: "flac",
      audioBitrate: 320
    });
    console.log(`FLAC saved to: ${flacResult.path}`);

    // Example 6: Convert to OGG (open source audio)
    console.log("Converting to OGG...");
    const oggResult = await downloader.download(youtubeUrl, outputPath, {
      outputFormat: "audio",
      audioFormat: "ogg",
      audioBitrate: 256
    });
    console.log(`OGG saved to: ${oggResult.path}`);

    // Example 7: Download as 3GP (mobile format)
    console.log("Downloading as 3GP (mobile)...");
    const gp3Result = await downloader.download(youtubeUrl, outputPath, {
      outputFormat: "video",
      videoFormat: "3gp",
      quality: "lowest"
    });
    console.log(`3GP saved to: ${gp3Result.path}`);

    // Example 8: Backward compatibility - old method still works
    console.log("Using backward compatible method...");
    const legacyResult = await downloader.downloadAudio(youtubeUrl, outputPath, "highestaudio");
    console.log(`Legacy MP3 saved to: ${legacyResult.path}`);

  } catch (error) {
    console.error("Download failed:", error);
  }
}

// Uncomment to run examples
// examples();

export { YouTubeDownloader, examples }; 