# @derimalec/ytdl-to-mp3

Download YouTube videos and convert them to common video or audio formats.

## Installation

```bash
npm install @derimalec/ytdl-to-mp3
```

## Usage

```typescript
import { ytDownloader } from "@derimalec/ytdl-to-mp3";

const url = "https://www.youtube.com/watch?v=VIDEO_ID";

// Download as MP4
const video = await ytDownloader.download(url, "./downloads/", {
  outputFormat: "video",
  videoFormat: "mp4",
  quality: "highest",
});

// Convert to MP3
const audio = await ytDownloader.download(url, "./downloads/", {
  outputFormat: "audio",
  audioFormat: "mp3",
  audioBitrate: 320,
});

console.log(video.path, audio.path);
```

### Audio helper

```typescript
const { path } = await ytDownloader.downloadAudio(url, "./downloads/", "highestaudio");
```

### Extend the downloader

```typescript
import { Downloader } from "@derimalec/ytdl-to-mp3";

class MyDownloader extends Downloader {}

const downloader = new MyDownloader();
```

## API

```typescript
download(url: string, outputPath: string, options: DownloadOptions): Promise<{ path: string }>

downloadAudio(url: string, outputPath: string, quality?: Quality): Promise<{ path: string }>
```

```typescript
interface DownloadOptions {
  outputFormat: "audio" | "video";
  quality?: "lowest" | "highest" | "highestaudio" | "lowestaudio" | "highestvideo" | "lowestvideo";
  videoFormat?: "mp4" | "flv" | "avi" | "mov" | "mkv" | "3gp"; // default: "mp4"
  audioFormat?: "mp3" | "wav" | "aac" | "flac" | "ogg";       // default: "mp3"
  audioBitrate?: number;                                      // default: 128
}
```

Files are saved as `{outputPath}/{sanitized_title}.{extension}`. The output directory is created automatically if it does not exist.

## Formats

**Video:** `mp4`, `flv`, `avi`, `mov`, `mkv`, `3gp`

**Audio:** `mp3`, `wav`, `aac`, `flac`, `ogg`

## License

ISC
