/**
 * Promisify preloading an image. Resolve when the image is preloaded
 */
 export default function createImagePreloadPromise(src: string | null) {
  return new Promise<void>((resolve, reject) => {
    if (!src) {
      return resolve();
    }
    const img = new Image();
    img.src = src;
    if (img.complete) {
      resolve();
    } else {
      const handleLoad = () => resolve();
      img.addEventListener('load', handleLoad);

      const handleError = () => reject(new Error('Image loading falied'));
      img.addEventListener('error', handleError);
    }
  });
}