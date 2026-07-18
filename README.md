# YouTube Downloader v2.0

## A Node.js library to download YouTube videos and convert them to various formats

Powered by [`youtubei.js`](https://github.com/LuanRT/YouTube.js) and FFmpeg.

### What's New in v2.0

- **Video downloads**: MP4, FLV, AVI, MOV, MKV, 3GP
- **Audio conversion**: MP3, WAV, AAC, FLAC, OGG
- **Quality validation**: Smart checks for audio vs video quality options
- **Auto directory creation**: Creates the output folder if it does not exist
- **Reliable fetching**: Uses `youtubei.js` instead of the archived `@distube/ytdl-core`

### Installation

```bash
npm install @derimalec/ytdl-to-mp3
```

### Quick Start

```typescript
import { ytDownloader } from "@derimalec/ytdl-to-mp3";

// Download video as MP4
const videoResult = await ytDownloader.download(
  "https://www.youtube.com/watch?v=VIDEO_ID",
  "./downloads/",
  {
    outputFormat: "video",
    videoFormat: "mp4",
    quality: "highest",
  }
);

// Convert to MP3
const audioResult = await ytDownloader.download(
  "https://www.youtube.com/watch?v=VIDEO_ID",
  "./downloads/",
  {
    outputFormat: "audio",
    audioFormat: "mp3",
    audioBitrate: 320,
  }
);
```

### API Reference

#### Main Download Method

```typescript
download(url: string, outputPath: string, options: DownloadOptions): Promise<{ path: string }>
```

#### Convenience Audio Method

```typescript
downloadAudio(url: string, outputPath: string, quality?: Quality): Promise<{ path: string }>
```

#### DownloadOptions

```typescript
interface DownloadOptions {
  quality?: Quality;           // "lowest" | "highest" | "highestaudio" | "lowestaudio" | "highestvideo" | "lowestvideo"
  outputFormat: OutputFormat;  // "audio" | "video"
  videoFormat?: VideoFormat;   // "mp4" | "flv" | "avi" | "mov" | "mkv" | "3gp"
  audioFormat?: AudioFormat;   // "mp3" | "wav" | "aac" | "flac" | "ogg"
  audioBitrate?: number;       // Audio bitrate (default: 128)
}
```

### Supported Formats

#### Video Formats

| Format | Video Codec | Audio Codec | Best For | File Size |
|--------|-------------|-------------|----------|-----------|
| **MP4** | H.264 | AAC | General use, web, mobile | Medium |
| **FLV** | H.264 | AAC | Flash legacy, web streaming | Medium |
| **AVI** | H.264 | AAC | Universal compatibility | Large |
| **MOV** | H.264 | AAC | Apple devices, macOS/iOS | Medium |
| **MKV** | H.264 | AAC | High quality, open source | Large |
| **3GP** | H.264 | AAC | Mobile devices, low bandwidth | Very Small |

#### Audio Formats

| Format | Codec | Quality | Compression | Best For |
|--------|-------|---------|-------------|----------|
| **MP3** | MPEG-1 Layer III | Lossy | Good | Universal compatibility |
| **WAV** | PCM | Lossless | None | Professional audio |
| **AAC** | Advanced Audio Coding | Lossy | Better than MP3 | Modern devices, Apple |
| **FLAC** | Free Lossless | Lossless | ~50% | Audiophile quality |
| **OGG** | Vorbis | Lossy | Excellent | Open source projects |

### Video Download Examples

```typescript
import { ytDownloader } from "@derimalec/ytdl-to-mp3";

const mp4Result = await ytDownloader.download(url, "./downloads/", {
  outputFormat: "video",
  videoFormat: "mp4",
  quality: "highest",
});

const aviResult = await ytDownloader.download(url, "./downloads/", {
  outputFormat: "video",
  videoFormat: "avi",
  quality: "highest",
});

const movResult = await ytDownloader.download(url, "./downloads/", {
  outputFormat: "video",
  videoFormat: "mov",
  quality: "highest",
});

const gp3Result = await ytDownloader.download(url, "./downloads/", {
  outputFormat: "video",
  videoFormat: "3gp",
  quality: "lowest",
});
```

### Audio Conversion Examples

```typescript
const mp3Result = await ytDownloader.download(url, "./downloads/", {
  outputFormat: "audio",
  audioFormat: "mp3",
  audioBitrate: 320,
  quality: "highestaudio",
});

const flacResult = await ytDownloader.download(url, "./downloads/", {
  outputFormat: "audio",
  audioFormat: "flac",
  audioBitrate: 320,
});

const wavResult = await ytDownloader.download(url, "./downloads/", {
  outputFormat: "audio",
  audioFormat: "wav",
  audioBitrate: 192,
});

const aacResult = await ytDownloader.download(url, "./downloads/", {
  outputFormat: "audio",
  audioFormat: "aac",
  audioBitrate: 256,
});

const oggResult = await ytDownloader.download(url, "./downloads/", {
  outputFormat: "audio",
  audioFormat: "ogg",
  audioBitrate: 256,
});
```

### Backward Compatibility

The dedicated audio helper from v1.x still works:

```typescript
const result = await ytDownloader.downloadAudio(
  "https://www.youtube.com/watch?v=VIDEO_ID",
  "./downloads/",
  "highestaudio"
);
```

### Quality Validation

```typescript
// Valid combinations
{ outputFormat: "audio", quality: "highestaudio" }
{ outputFormat: "audio", quality: "lowestaudio" }
{ outputFormat: "video", quality: "highest" }
{ outputFormat: "video", quality: "highestvideo" }

// Invalid combinations (throw errors)
{ outputFormat: "audio", quality: "highestvideo" }
{ outputFormat: "video", quality: "highestaudio" }
```

### Custom Implementation

```typescript
import { Downloader } from "@derimalec/ytdl-to-mp3";

class MyCustomDownloader extends Downloader {
  // Add your custom methods here
}

const customDownloader = new MyCustomDownloader();
```

### How It Works

1. Fetches stream data with **youtubei.js** (InnerTube API)
2. Downloads a muxed progressive stream (video + audio)
3. Pipes it through **FFmpeg** to convert to the requested format

Audio exports strip the video track; video exports re-encode to the chosen container.

### Limitations

YouTube currently restricts most adaptive (separate high-resolution video / high-bitrate audio) URLs without extra attestation tokens. This library therefore uses available **muxed progressive** streams (typically around **360p** for video). Output audio bitrate is still controlled by `audioBitrate` during FFmpeg conversion.

### Requirements

- Node.js **16.8+** (needed by `youtubei.js` / undici `fetch`)
- FFmpeg (bundled automatically via `@ffmpeg-installer/ffmpeg`)

### File Output

- Auto-creates output directories if they do not exist
- Names files from the YouTube video title
- Sanitizes unsafe filename characters (`<>:"/\|?*`)
- Adds the correct file extension
- Saves to: `{outputPath}/{sanitized_title}.{extension}`

### Console Output

```
🎥 Starting video download: Song_Title.mp4
✅ Video download completed: downloads/Song_Title.mp4

🎵 Starting audio conversion: Song_Title.mp3
✅ Audio conversion completed: downloads/Song_Title.mp3
```

### Performance Tips

- **MP4** — best balance of quality, compatibility, and speed
- **3GP** — smallest files for mobile / low bandwidth
- **FLAC** — best audio fidelity, larger files
- **MP3 320kbps** — best everyday audio quality/size balance

### License

ISC

### Contributing

Feel free to submit issues and pull requests on GitHub.
