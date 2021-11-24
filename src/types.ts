export type Present = {
  uuid: string;
  day: number;
  uploader: string;
  uploaderName: string | null;
  content: string;
  image?: string;
}

export type Calendar = {
  uuid: string;
  presents: Present[];
  name: string;
}