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
  description: string;
}

export function isValidPresent(data: any): boolean {
  try {
    return (
      data.uuid.length > 0 &&
      data.day > -1 && data.day < 24 &&
      (data.uploaderName ? data.uploaderName.length < 100 : true) &&
      data.content.length <= 2000 &&
      (data.image ? data.image.length <= 2000 : true)
    );
  }
  catch (err) {
    return false;
  }
}
