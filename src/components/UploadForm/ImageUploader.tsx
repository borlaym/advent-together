import styled from "styled-components"
import React, { useCallback, useState } from "react";
import createImagePreloadPromise from "./createPreloadPromise";

const cloudName = 'adventcalendar';
const unsignedUploadPreset = 'ml_default';
const supportedMediaTypes = [
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'image/webp'
];

export const thumbnail = (id: string) => `https://res.cloudinary.com/adventcalendar/image/upload/w_200,h_200,c_fit/${id}.jpg`;
export const original = (id: string) => `https://res.cloudinary.com/adventcalendar/image/upload/${id}.jpg`;

const Container = styled.label`
  width: 200px;
  height: 200px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 3px;
  background-position: center center;
  background-size: contain;
  background-repeat: no-repeat;
  background-color: #e0a452;
  position: relative;
  font-size: 1.2em;
  cursor: pointer;
`;

const DeleteButton = styled.div`
  position: absolute;
  bottom: 0px;
  right: 0px;
  background: red;
  color: white;
  cursor: pointer;
  padding: 2px;
`


type Props = {
  isUnka?: boolean;
  image: string | null;
  onImageAdded: (img: string) => void;
  onImageRemoved: () => void;
}

export default function ImageUploader({
  onImageAdded,
  onImageRemoved,
  image,
  isUnka
}: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const stopPropagation = useCallback((event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  }, []);

  const startUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      setIsLoading(true);
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
        return createImagePreloadPromise(thumbnail(response.public_id))
          .then(() => {
            onImageAdded(response.public_id);
            setIsLoading(false);
          });
      })
      .catch(err => {
        setIsLoading(false);
        console.error(err);
      })
    }
  }, [onImageAdded]);

  const handleRemove = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    onImageRemoved();
  }, [onImageRemoved]);

  if (!image) {
    return (
      <Container onClick={stopPropagation}>
        <input
          type="file"
          style={{ display: "none" }}
          onChange={startUpload}
          accept={supportedMediaTypes.join(', ')}
        />
        {isLoading ? (isUnka ? 'Uploading...' : 'Töltés...') : (isUnka ? 'Upload an image' : 'Tölts fel egy képet!')}
      </Container>
    )
  }

  return (
    <Container
      onClick={stopPropagation}
      style={{
        backgroundImage: `url('${thumbnail(image)}')`
      }}
    >
      <DeleteButton onClick={handleRemove}>{isUnka ? 'Remove' : 'Törlés'}</DeleteButton>
    </Container>
  )
}