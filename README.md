# YouTube Downloader v2.0

## A powerful Node.js library to download YouTube videos and convert them to various formats

### 🚀 What's New in v2.0

- **Video Downloads**: Download YouTube videos in MP4, WebM, or FLV formats
- **Multiple Audio Formats**: Support for MP3, WAV, and AAC audio conversion
- **Enhanced Quality Control**: Better quality selection for both video and audio
- **Filename Sanitization**: Automatic cleanup of video titles for safe filenames
- **Backward Compatibility**: Existing v1.x code continues to work

### 📦 Installation

```bash
npm install @derimalec/ytdl-to-mp3
```

### 🎯 Quick Start

```typescript
import { ytDownloader } from "@derimalec/ytdl-to-mp3";

// Download video as MP4
const videoResult = await ytDownloader.download("https://www.youtube.com/watch?v=VIDEO_ID", "./downloads/", {
  outputFormat: "video",
  videoFormat: "mp4",
  quality: "highest"
});

// Convert to MP3 audio
const audioResult = await ytDownloader.download("https://www.youtube.com/watch?v=VIDEO_ID", "./downloads/", {
  outputFormat: "audio",
  audioFormat: "mp3",
  audioBitrate: 320
});
```

### 📚 API Reference

#### Main Download Method

```typescript
download(url: string, path: string, options: DownloadOptions): Promise<{ path: string }>
```

#### DownloadOptions

```typescript
interface DownloadOptions {
  quality?: Quality;           // "lowest" | "highest" | "highestaudio" | "lowestaudio"
  outputFormat: OutputFormat;  // "audio" | "video"
  videoFormat?: VideoFormat;   // "mp4" | "webm" | "flv"
  audioFormat?: AudioFormat;   // "mp3" | "wav" | "aac"
  audioBitrate?: number;       // Audio bitrate (default: 128)
}
```

### 🎥 Video Download Examples

```typescript
import { ytDownloader } from "@derimalec/ytdl-to-mp3";

// High quality MP4 download
const mp4Result = await ytDownloader.download("https://www.youtube.com/watch?v=VIDEO_ID", "./downloads/", {
  outputFormat: "video",
  videoFormat: "mp4",
  quality: "highest"
});

// WebM format download
const webmResult = await ytDownloader.download("https://www.youtube.com/watch?v=VIDEO_ID", "./downloads/", {
  outputFormat: "video",
  videoFormat: "webm",
  quality: "highest"
});
```

### 🎵 Audio Conversion Examples

```typescript
// High quality MP3 conversion
const mp3Result = await ytDownloader.download(url, "./downloads/", {
  outputFormat: "audio",
  audioFormat: "mp3",
  audioBitrate: 320,
  quality: "highestaudio"
});

// WAV format conversion
const wavResult = await ytDownloader.download(url, "./downloads/", {
  outputFormat: "audio",
  audioFormat: "wav",
  audioBitrate: 192
});

// AAC format conversion
const aacResult = await ytDownloader.download(url, "./downloads/", {
  outputFormat: "audio",
  audioFormat: "aac",
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

- Downloaded files are automatically named using the YouTube video title
- Filenames are sanitized to remove unsafe characters
- File extensions are automatically added based on the chosen format
- Files are saved to: `{path}{sanitized_title}.{extension}`

### 🐛 Error Handling

```typescript
try {
  const result = await ytDownloader.download(url, path, options);
  console.log(`File saved to: ${result.path}`);
} catch (error) {
  console.error("Download failed:", error.message);
}
```

### 📝 License

ISC

### 🤝 Contributing

Feel free to submit issues and pull requests on GitHub!
