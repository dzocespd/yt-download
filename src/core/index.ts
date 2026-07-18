import { Readable } from "stream";
import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import type { Innertube, Types } from "youtubei.js" with {
  "resolution-mode": "import",
};

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export type Quality =
  | "lowest"
  | "highest"
  | "highestaudio"
  | "lowestaudio"
  | "highestvideo"
  | "lowestvideo";
export type OutputFormat = "audio" | "video";
export type VideoFormat = "mp4" | "flv" | "avi" | "mov" | "mkv" | "3gp";
export type AudioFormat = "mp3" | "wav" | "aac" | "flac" | "ogg";

export interface DownloadOptions {
  quality?: Quality;
  outputFormat: OutputFormat;
  videoFormat?: VideoFormat;
  audioFormat?: AudioFormat;
  audioBitrate?: number;
}

export interface IDownloader {
  download: (
    url: string,
    outputPath: string,
    options: DownloadOptions
  ) => Promise<{ path: string }>;

  downloadAudio: (
    url: string,
    outputPath: string,
    quality?: Quality
  ) => Promise<{ path: string }>;
}

type YoutubeiModule = typeof import("youtubei.js", {
  with: { "resolution-mode": "import" },
});

let youtubeiPromise: Promise<YoutubeiModule> | null = null;
let innertubePromise: Promise<Innertube> | null = null;

const getYoutubei = (): Promise<YoutubeiModule> => {
  if (!youtubeiPromise) {
    youtubeiPromise = import("youtubei.js").then((mod) => {
      // Required so ciphered stream URLs (e.g. TV client) can be deciphered.
      mod.Platform.shim.eval = async (data: { output: string }) =>
        new Function(data.output)();
      return mod;
    });
  }
  return youtubeiPromise;
};

const getInnertube = async (): Promise<Innertube> => {
  if (!innertubePromise) {
    innertubePromise = (async () => {
      const { Innertube, UniversalCache } = await getYoutubei();
      return Innertube.create({
        cache: new UniversalCache(false),
      });
    })();
  }
  return innertubePromise;
};

const extractVideoId = (url: string): string => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  throw new Error(`Could not extract YouTube video ID from: ${url}`);
};

const mapQuality = (quality: Quality): string => {
  switch (quality) {
    case "lowest":
    case "lowestaudio":
    case "lowestvideo":
      return "bestefficiency";
    case "highest":
    case "highestaudio":
    case "highestvideo":
    default:
      return "best";
  }
};

/**
 * YouTube currently blocks most adaptive (separate audio/video) URLs without a
 * poToken. Muxed progressive formats (itag 18) from ANDROID/TV still work, so
 * we always fetch video+audio and let ffmpeg extract audio when needed.
 */
const createDownloadStream = async (
  videoId: string,
  quality: Quality
): Promise<Readable> => {
  const yt = await getInnertube();
  const { Utils } = await getYoutubei();

  const formatOptions: Types.FormatOptions = {
    type: "video+audio",
    quality: mapQuality(quality),
    client: "ANDROID",
  };

  let webStream: ReadableStream<Uint8Array>;
  try {
    webStream = await yt.download(videoId, formatOptions);
  } catch {
    webStream = await yt.download(videoId, {
      ...formatOptions,
      client: "TV",
    });
  }

  return Readable.from(Utils.streamToIterable(webStream));
};

export abstract class Downloader implements IDownloader {
  download = async (
    url: string,
    outputPath: string,
    options: DownloadOptions
  ): Promise<{ path: string }> => {
    const videoId = extractVideoId(url);
    const title = await this.getTitle(videoId);
    const sanitizedTitle = this.sanitizeFilename(title);

    this.ensureDirectoryExists(outputPath);

    const { outputFormat } = options;
    const {
      quality = outputFormat === "audio" ? "highestaudio" : "highest",
      videoFormat = "mp4",
      audioFormat = "mp3",
      audioBitrate = 128,
    } = options;

    this.validateQualityForFormat(quality, outputFormat);

    const stream = await createDownloadStream(videoId, quality);

    if (outputFormat === "video") {
      return this.downloadVideo(stream, outputPath, sanitizedTitle, videoFormat);
    }

    return this.convertToAudio(
      stream,
      outputPath,
      sanitizedTitle,
      audioFormat,
      audioBitrate
    );
  };

  downloadAudio = async (
    url: string,
    outputPath: string,
    quality: Quality = "highestaudio"
  ): Promise<{ path: string }> => {
    return this.download(url, outputPath, {
      quality,
      outputFormat: "audio",
      audioFormat: "mp3",
    });
  };

  private downloadVideo = (
    stream: Readable,
    outputPath: string,
    title: string,
    format: VideoFormat
  ): Promise<{ path: string }> => {
    const pathOfSavedFile = path.join(outputPath, `${title}.${format}`);

    return new Promise((resolve, reject) => {
      let command = ffmpeg(stream).output(pathOfSavedFile);

      if (format === "mp4") {
        command = command
          .videoCodec("libx264")
          .audioCodec("aac")
          .outputOptions(["-preset fast", "-crf 22", "-movflags +faststart"]);
      } else if (format === "flv") {
        command = command.videoCodec("libx264").audioCodec("aac");
      } else if (format === "avi") {
        command = command
          .videoCodec("libx264")
          .audioCodec("aac")
          .outputOptions(["-preset fast"]);
      } else if (format === "mov") {
        command = command
          .videoCodec("libx264")
          .audioCodec("aac")
          .outputOptions(["-preset fast", "-movflags +faststart"]);
      } else if (format === "mkv") {
        command = command
          .videoCodec("libx264")
          .audioCodec("aac")
          .outputOptions(["-preset fast"]);
      } else if (format === "3gp") {
        command = command
          .videoCodec("libx264")
          .audioCodec("aac")
          .outputOptions([
            "-preset fast",
            "-profile:v baseline",
            "-level 3.0",
            "-s 320x240",
          ]);
      }

      command
        .on("start", () => {
          process.stdout.write(
            `🎥 Starting video download: ${title}.${format}\n`
          );
        })
        .on("end", () => {
          process.stdout.write(
            `\n✅ Video download completed: ${pathOfSavedFile}\n`
          );
          resolve({ path: pathOfSavedFile });
        })
        .on("error", (err) => {
          process.stdout.write(`\n❌ Video download failed\n`);
          reject({ message: "Video download failed", error: err.message });
        });

      command.run();
    });
  };

  private convertToAudio = (
    stream: Readable,
    outputPath: string,
    title: string,
    format: AudioFormat,
    bitrate: number
  ): Promise<{ path: string }> => {
    const pathOfSavedFile = path.join(outputPath, `${title}.${format}`);

    return new Promise((resolve, reject) => {
      const ffmpegCommand = ffmpeg(stream)
        .noVideo()
        .output(pathOfSavedFile)
        .audioBitrate(bitrate)
        .format(format)
        .on("start", () => {
          process.stdout.write(
            `🎵 Starting audio conversion: ${title}.${format}\n`
          );
        })
        .on("end", () => {
          process.stdout.write(
            `\n✅ Audio conversion completed: ${pathOfSavedFile}\n`
          );
          resolve({ path: pathOfSavedFile });
        })
        .on("error", (err) => {
          process.stdout.write(`\n❌ Audio conversion failed\n`);
          reject({ message: "Audio conversion failed", error: err.message });
        });

      ffmpegCommand.run();
    });
  };

  private getTitle = async (videoId: string): Promise<string> => {
    const yt = await getInnertube();
    const info = await yt.getBasicInfo(videoId, { client: "ANDROID" });
    return info.basic_info.title || videoId;
  };

  private sanitizeFilename = (filename: string): string => {
    return filename
      .replace(/[<>:"/\\|?*]/g, "")
      .replace(/\s+/g, "_")
      .trim();
  };

  private ensureDirectoryExists = (dirPath: string): void => {
    if (!fs.existsSync(dirPath)) {
      process.stdout.write(`📁 Creating directory: ${dirPath}\n`);
      fs.mkdirSync(dirPath, { recursive: true });
      process.stdout.write(`✅ Directory created successfully\n`);
    }
  };

  private validateQualityForFormat = (
    quality: Quality,
    outputFormat: OutputFormat
  ): void => {
    const audioQualities: Quality[] = [
      "highestaudio",
      "lowestaudio",
      "highest",
      "lowest",
    ];
    const videoQualities: Quality[] = [
      "highest",
      "lowest",
      "highestvideo",
      "lowestvideo",
    ];

    if (outputFormat === "audio" && !audioQualities.includes(quality)) {
      throw new Error(
        `Invalid quality "${quality}" for audio format. ` +
          `Use one of: ${audioQualities.join(", ")}`
      );
    }

    if (outputFormat === "video" && !videoQualities.includes(quality)) {
      throw new Error(
        `Invalid quality "${quality}" for video format. ` +
          `Use one of: ${videoQualities.join(", ")}`
      );
    }
  };
}
