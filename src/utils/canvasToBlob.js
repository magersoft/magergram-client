export default (canvas, username, filename) => {
  const dataURL = canvas.toDataURL('image/jpeg');
  const blobBinary = atob(dataURL.split(',')[1]);
  const array = [];
  for (let i = 0; i < blobBinary.length; i++) {
    array.push(blobBinary.charCodeAt(i));
  }
  const blob = new File([new Uint8Array(array)], { type: 'image/jpeg' });
  return new File([blob], username ? `${username}-post.jpg` : `${filename}.jpg`)
}
