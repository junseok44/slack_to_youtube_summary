declare module "youtube-captions-scrapper" {
  export function getSubtitles(options: {
    videoID: string;
    lang: string;
  }): Promise<any>;
}
