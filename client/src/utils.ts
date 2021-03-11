export const coverSizing = (frameWidth:number, frameHeight:number, imageWidth:number, imageHeight:number) => {

  const frameRatio = frameWidth / frameHeight;
  const imageRatio = imageWidth / imageHeight;

  const newImage = {
    x: 0,
    y: 0,
    width: frameWidth,
    height: frameHeight,
  }

  if (imageRatio > frameRatio) {
    const heightRatio = frameHeight / imageHeight;
    newImage.width = Math.round(imageWidth * heightRatio);

    newImage.x = (frameWidth - newImage.width) / 2;

  } else {
    const widthRatio = frameWidth / imageWidth;
    newImage.height = Math.round(imageHeight * widthRatio);
    newImage.y = (frameHeight - newImage.height) / 2;
  }

  return newImage;
}
