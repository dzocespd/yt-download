# Youtube to mp3

## A node library to download and convert youtube videos to mp3

### How to use:

1. Install the package npm i @derimalec/ytdl-to-mp3
2. Import it as: import { ytDownloader } from "@derimalec/ytdl-to-mp3";
3. Use it as: const {path} = await ytDownloader.download('some youtube url', 'somepath');

Example:

```typescript
import { ytDownloader } from "@derimalec/ytdl-to-mp3";

const downloadSong = async () => {
  // download returns the full path, with the song name + mp3 extension on it.
  const { path } = await ytDownloader.download(
    "https://www.youtube.com/dummy_youtube_link",
    "your path goes here",
    "highestaudio"
  );
};

downloadSong();
```
