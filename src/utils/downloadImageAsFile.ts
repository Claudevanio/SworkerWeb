export async function downloadImagesAsFile(uri: string, name: string) {
  const getImageAsBlob = async (uri: string) => {
    return await fetch(uri, {
      mode: 'no-cors'
    }).then(response => response.blob());
  };
  const blob = await getImageAsBlob(uri);
  const file = new File([blob], name, { type: blob.type });
  return file;
}
