import styled from "styled-components"
import React, { useCallback } from "react";

const cloudName = 'adventcalendar';
const unsignedUploadPreset = 'ml_default';
const supportedMediaTypes = [
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'image/webp'
];

const Container = styled.label`
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px gray dotted;
  background-position: center center;
  background-size: contain;
  background-repeat: no-repeat;
`;


type Props = {
  image: string | null;
  onImageAdded: (img: string) => void;
  onImageRemoved: () => void;
}

export default function ImageUploader({
  onImageAdded,
  onImageRemoved,
  image
}: Props) {

  const stopPropagation = useCallback((event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  }, []);

  const startUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      const file = e.target.files.item(0);
      if (!file) {
        return; // Shouldn't happen
      }
      e.target.value = '';
      const fd = new FormData();
      fd.append('upload_preset', unsignedUploadPreset);
      fd.append('tags', 'browser_upload'); // Optional - add tag for image admin in Cloudinary
      fd.append('file', file);
      fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
        method: 'POST',
        body: fd,
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
      .then(response => response.json())
      .then(response => {
        console.log(response);
        onImageAdded(response.public_id)
      })
      .catch(err => {
        console.error(err);
      })
    }
  }, []);

  if (!image) {
    return (
      <Container onClick={stopPropagation}>
        <input
          type="file"
          style={{ display: "none" }}
          onChange={startUpload}
          accept={supportedMediaTypes.join(', ')}
        />
        'Tölts fel egy képet!'
      </Container>
    )
  }

  return (
    <Container
      onClick={stopPropagation}
      style={{
        backgroundImage: `url('https://res.cloudinary.com/adventcalendar/image/upload/w_200,h_200,c_fit/${image}.jpg'`
      }}
    >

    </Container>
  )
}