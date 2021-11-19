export type Present = {
  uuid: string;
  day: number;
  uploader: string;
  uploaderName: string | null;
  contentType: 'Text' | 'Image';
  content: string;
}

export type Calendar = {
  uuid: string;
  presents: Present[];
  name: string;
}