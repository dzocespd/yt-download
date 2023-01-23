import ytdl from "ytdl-core";
import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export type Quality = "lowest" | "highest" | "highestaudio" | "lowestaudio";

export interface IDownloader {
  download: (
    url: string,
    path: string,
    quality?: Quality | undefined
  ) => Promise<{ path: string }>;
}

export abstract class Downloader implements IDownloader {
  download = async (
    url: string,
    path: string,
    quality: Quality | undefined = "highestaudio"
  ): Promise<{ path: string }> => {
    const title = await this.getTitle(url);

    let stream = ytdl(url, {
      quality: quality,
    });
    const pathOfSavedFile = path + `${title}.mp3`;

    return new Promise((resolve, reject) => {
      ffmpeg(stream)
        .output(pathOfSavedFile)
        .audioBitrate(128)
        .on("end", () => {
          resolve({ path: pathOfSavedFile });
        })
        .on("error", () => {
          reject({ message: "Something went wrong" });
        })
        .run();
    });
  };

  private getTitle = async (url: string) => {
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title;

    return title;
  };
}
