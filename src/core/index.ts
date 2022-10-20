import ytdl from "ytdl-core";
import ffmpeg from "fluent-ffmpeg";
import readline from "readline";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export interface IDownloader {
  download: (url: string, path: string, quality: string) => void;
}

export abstract class Downloader implements IDownloader {
  download = async (
    url: string,
    path: string,
    quality: string = "highestaudio"
  ) => {
    const title = await this.getTitle(url);

    let stream = ytdl(url, {
      quality: quality,
    });

    let start = Date.now();

    ffmpeg(stream)
      .audioBitrate(128)
      .save(path + `${title}.mp3`)

      .on("progress", (p) => {
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`${p.targetSize}kb downloaded`);
      })
      .on("end", () => {
        console.log(`\ndone, thanks - ${(Date.now() - start) / 1000}s`);
      });
  };

  private getTitle = async (url: string) => {
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title;

    return title;
  };
}
