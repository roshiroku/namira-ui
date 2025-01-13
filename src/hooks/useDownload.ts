import JSZip from 'jszip';

const useDownload = () => {
  const download = (files: { name: string; url: string }[]) => {
    files.forEach((file) => {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const zip = async (
    files: { name: string; url: string }[],
    zipFileName: string = 'files.zip'
  ) => {
    const zip = new JSZip();
    const filePromises = files.map(async (file) => {
      const response = await fetch(file.url);
      const blob = await response.blob();
      zip.file(file.name, blob);
    });

    await Promise.all(filePromises);

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(zipBlob);
    link.download = zipFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return { download, zip };
};

export default useDownload;
