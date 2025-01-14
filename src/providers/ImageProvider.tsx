import { createContext, Dispatch, FC, PropsWithChildren, SetStateAction, useContext, useMemo, useState } from 'react';

interface ImageContextProps {
  images: ImageFile[];
  setImages: Dispatch<SetStateAction<ImageFile[]>>;
}

const ImageContext = createContext<ImageContextProps>({ images: [], setImages: () => { } });

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
