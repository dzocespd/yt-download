import ytdl from "ytdl-core";
import ffmpeg from "fluent-ffmpeg";
import readline from "readline";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export type Quality = "lowest" | "highest" | "highestaudio" | "lowestaudio";

export interface IDownloader {
  download: (
    url: string,
    path: string,
    quality?: Quality | undefined
  ) => Promise<string>;
}

export abstract class Downloader implements IDownloader {
  download = async (
    url: string,
    path: string,
    quality: Quality | undefined = "highestaudio"
  ) => {
    const title = await this.getTitle(url);

    let stream = ytdl(url, {
      quality: quality,
    });

    let start = Date.now();

    const pathOfSavedFile = path + `${title}.mp3`;

    ffmpeg(stream)
      .audioBitrate(128)
      .save(pathOfSavedFile)

      .on("progress", (p) => {
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`${p.targetSize}kb downloaded`);
      })
      .on("end", () => {
        console.log(`\ndone, thanks - ${(Date.now() - start) / 1000}s`);
      });

    return pathOfSavedFile;
  };

  private getTitle = async (url: string) => {
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title;

    return title;
  };
}
