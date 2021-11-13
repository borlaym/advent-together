export type Present = {
  day: number;
  uploader: string;
  contentType: 'Text' | 'Image';
  content: string;
}

export type Calendar = {
  uuid: string;
  presents: Present[];
}