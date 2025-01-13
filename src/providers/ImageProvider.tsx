import { createContext, Dispatch, FC, PropsWithChildren, SetStateAction, useContext, useMemo, useState } from 'react';

const ImageContext = createContext<{
  images: ImageFile[];
  setImages: Dispatch<SetStateAction<ImageFile[]>>;
}>({ images: [], setImages: () => { } });

const useImages = () => useContext(ImageContext);

const ImageProvider: FC<PropsWithChildren> = ({ children }) => {
  const [images, setImages] = useState<ImageFile[]>([]);

  const ctx = useMemo(() => ({ images, setImages }), [images]);

  return (
    <ImageContext.Provider value={ctx}>
      {children}
    </ImageContext.Provider>
  );
};

export { useImages };
export default ImageProvider;
