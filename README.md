# YouTube Downloader v2.0

## A powerful Node.js library to download YouTube videos and convert them to various formats

### 🚀 What's New in v2.0

- **📹 Video Downloads**: Download YouTube videos in 6 formats: MP4, FLV, AVI, MOV, MKV, 3GP
- **🎵 Multiple Audio Formats**: Support for 5 audio formats: MP3, WAV, AAC, FLAC, OGG
- **🎯 Enhanced Quality Control**: Smart quality validation and better selection options
- **📁 Auto Directory Creation**: Automatically creates output directories if they don't exist
- **🧹 Filename Sanitization**: Automatic cleanup of video titles for safe filenames
- **🔄 Backward Compatibility**: Existing v1.x code continues to work
- **📊 Real-time Progress**: Live download progress with frame counts and time markers

### 📦 Installation

```bash
npm install @derimalec/ytdl-to-mp3
```

### 🎯 Quick Start

```typescript
import { ytDownloader } from "@derimalec/ytdl-to-mp3";

// Download video as MP4 (most compatible)
const videoResult = await ytDownloader.download("https://www.youtube.com/watch?v=VIDEO_ID", "./downloads/", {
  outputFormat: "video",
  videoFormat: "mp4",
  quality: "highest"
});

// Convert to high-quality MP3 audio
const audioResult = await ytDownloader.download("https://www.youtube.com/watch?v=VIDEO_ID", "./downloads/", {
  outputFormat: "audio",
  audioFormat: "mp3",
  audioBitrate: 320
});
```

### 📚 API Reference

#### Main Download Method

```typescript
download(url: string, outputPath: string, options: DownloadOptions): Promise<{ path: string }>
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

### 📊 Supported Formats

#### 🎥 Video Formats

| Format | Video Codec | Audio Codec | Best For | File Size |
|--------|-------------|-------------|----------|-----------|
| **MP4** | H.264 | AAC | General use, web, mobile | Medium |
| **FLV** | H.264 | AAC | Flash legacy, web streaming | Medium |
| **AVI** | H.264 | AAC | Universal compatibility | Large |
| **MOV** | H.264 | AAC | Apple devices, macOS/iOS | Medium |
| **MKV** | H.264 | AAC | High quality, open source | Large |
| **3GP** | H.264 | AAC | Mobile devices, low bandwidth | Very Small |

#### 🎵 Audio Formats

| Format | Codec | Quality | Compression | Best For |
|--------|-------|---------|-------------|----------|
| **MP3** | MPEG-1 Layer III | Lossy | Good | Universal compatibility |
| **WAV** | PCM | Lossless | None | Professional audio |
| **AAC** | Advanced Audio Coding | Lossy | Better than MP3 | Modern devices, Apple |
| **FLAC** | Free Lossless | Lossless | ~50% | Audiophile quality |
| **OGG** | Vorbis | Lossy | Excellent | Open source projects |

### 🎥 Video Download Examples

```typescript
import { ytDownloader } from "@derimalec/ytdl-to-mp3";

// High quality MP4 download (recommended)
const mp4Result = await ytDownloader.download("https://www.youtube.com/watch?v=VIDEO_ID", "./downloads/", {
  outputFormat: "video",
  videoFormat: "mp4",
  quality: "highest"
});

// AVI for universal compatibility
const aviResult = await ytDownloader.download("https://www.youtube.com/watch?v=VIDEO_ID", "./downloads/", {
  outputFormat: "video",
  videoFormat: "avi",
  quality: "highest"
});

// MOV for Apple devices
const movResult = await ytDownloader.download("https://www.youtube.com/watch?v=VIDEO_ID", "./downloads/", {
  outputFormat: "video",
  videoFormat: "mov",
  quality: "highest"
});

// 3GP for mobile/low bandwidth
const gp3Result = await ytDownloader.download("https://www.youtube.com/watch?v=VIDEO_ID", "./downloads/", {
  outputFormat: "video",
  videoFormat: "3gp",
  quality: "lowest"
});
```

### 🎵 Audio Conversion Examples

```typescript
// High quality MP3 conversion (most popular)
const mp3Result = await ytDownloader.download(url, "./downloads/", {
  outputFormat: "audio",
  audioFormat: "mp3",
  audioBitrate: 320,
  quality: "highestaudio"
});

// FLAC for audiophile quality (lossless)
const flacResult = await ytDownloader.download(url, "./downloads/", {
  outputFormat: "audio",
  audioFormat: "flac",
  audioBitrate: 320
});

// WAV for professional use (uncompressed)
const wavResult = await ytDownloader.download(url, "./downloads/", {
  outputFormat: "audio",
  audioFormat: "wav",
  audioBitrate: 192
});

// AAC for modern devices
const aacResult = await ytDownloader.download(url, "./downloads/", {
  outputFormat: "audio",
  audioFormat: "aac",
  audioBitrate: 256
});

// OGG for open source projects
const oggResult = await ytDownloader.download(url, "./downloads/", {
  outputFormat: "audio",
  audioFormat: "ogg",
  audioBitrate: 256
});
```

### 🔄 Backward Compatibility

Your existing v1.x code will continue to work:

```typescript
// This still works from v1.x
const { path } = await ytDownloader.download(
  "https://www.youtube.com/watch?v=VIDEO_ID",
  "./downloads/",
  "highestaudio"
);

// Or use the dedicated method
const result = await ytDownloader.downloadAudio(
  "https://www.youtube.com/watch?v=VIDEO_ID",
  "./downloads/",
  "highestaudio"
);
```

### 🎯 Quality Validation

v2.0 includes smart quality validation:

```typescript
// ✅ Valid combinations
{ outputFormat: "audio", quality: "highestaudio" }   // Works
{ outputFormat: "audio", quality: "lowestaudio" }    // Works
{ outputFormat: "video", quality: "highest" }        // Works
{ outputFormat: "video", quality: "highestvideo" }   // Works

// ❌ Invalid combinations (will throw errors)
{ outputFormat: "audio", quality: "highestvideo" }   // Error!
{ outputFormat: "video", quality: "highestaudio" }   // Error!
```

### 🛠 Custom Implementation

You can also create your own downloader class:

```typescript
import { Downloader } from "@derimalec/ytdl-to-mp3";

class MyCustomDownloader extends Downloader {
  // Add your custom methods here
}

const customDownloader = new MyCustomDownloader();
```

### ⚙️ Requirements

- Node.js 14+ 
- FFmpeg (automatically installed via @ffmpeg-installer/ffmpeg)

### 📁 File Output

- 📁 **Auto-creates** output directories if they don't exist
- 🏷️ **Auto-names** files using the YouTube video title
- 🧹 **Sanitizes** filenames to remove unsafe characters (`<>:"/\|?*`)
- 📎 **Auto-adds** appropriate file extensions
- 💾 **Saves** to: `{outputPath}/{sanitized_title}.{extension}`

### 📊 Progress Tracking

v2.0 includes real-time progress tracking:

```
🎥 Starting video download: Song_Title.mp4
📥 Downloading: 45% | Time: 00:01:23
✅ Video download completed: downloads/Song_Title.mp4
```

### 🚀 Performance Tips

- **MP4** - Best balance of quality, compatibility, and speed
- **3GP** - Fastest downloads, smallest files for mobile
- **FLAC** - Best audio quality but larger files
- **MP3 320kbps** - Best audio quality/size balance

### 📝 License

ISC

### 🤝 Contributing

Feel free to submit issues and pull requests on GitHub!

---

