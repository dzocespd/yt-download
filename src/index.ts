import { Downloader } from "./core";

// Export all types for TypeScript users
export type {
  Quality,
  OutputFormat,
  VideoFormat,
  AudioFormat,
  DownloadOptions,
  IDownloader
} from "./core";

// Main downloader class
export class YoutubeDl extends Downloader {}

// Default instance for convenience
export const ytDownloader = new YoutubeDl();

// Export the base Downloader class as well
export { Downloader };
