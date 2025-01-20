import ImageType from "../enums/ImageType";
import { compareImages, inferImageType } from "../utils/image.utils";

interface QualityConfig {
  maxDifference?: number;
  step?: number;
  initialQuality?: number;
}

export type ImageModelProps = {
  filename: string;
  type: string;
  size: number;
  src: string;
  img: HTMLImageElement;
};

class ImageModel {
  filename: string;
  type: string;
  size: number;
  src: string;
  img: HTMLImageElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  static create(input: string | File): Promise<ImageModel> {
    return new Promise((resolve, reject) => {
      const data: Partial<ImageModelProps> = {};
      const img = new Image();

      img.onload = () => resolve(new ImageModel({ ...data, img } as ImageModelProps));
      img.onerror = () => reject(new Error('Failed to load image'));

      if (input instanceof File) {
        const reader = new FileReader();

        reader.onload = () => data.src = img.src = `${reader.result}`;
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(input);

        data.filename = input.name;
        data.type = input.type;
        data.size = input.size;
      } else {
        data.src = img.src = input;
        data.filename = input.split('/').pop() || 'unknown';
        data.type = inferImageType(input);
        data.size = 0; // Size is not available for URL sources
      }
    });
  }

  constructor({ filename, type, size, src, img }: ImageModelProps) {
    this.filename = filename;
    this.type = type;
    this.size = size;
    this.src = src;
    this.img = img;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true })!;

    if (this.img.complete) {
      this.initializeCanvas();
    } else {
      this.img.onload = () => this.initializeCanvas();
    }
  }

  get name(): string {
    return this.filename.replace(/\.[^.]+$/, '');
  }

  initializeCanvas(): void {
    this.canvas.width = this.img.width;
    this.canvas.height = this.img.height;
    this.ctx.drawImage(this.img, 0, 0);
  }

  getDataURL(type: ImageType = ImageType.PNG, quality?: number): string {
    const format = type === ImageType.JPG ? ImageType.JPEG : type;
    return this.canvas.toDataURL(format, quality);
  }

  getImageData(): ImageData {
    return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
  }

  convert(type: ImageType, quality?: number): Promise<ImageModel> {
    return new Promise((resolve) => {
      const src = this.getDataURL(type, quality);
      const img = new Image();

      img.onload = () => {
        const filename = `${this.name}.${type.split('/').pop()}`;
        resolve(new ImageModel({ filename, type, size: 0, src, img }));
      };

      img.src = src;
    });
  }

  async convertAutoQuality(type: ImageType, config: QualityConfig = {}): Promise<ImageModel> {
    const { maxDifference = 0.005, step = 0.01, initialQuality = 1 } = config;
    const imageData = this.getImageData();
    let quality = initialQuality;
    let image: ImageModel = this;

    while (quality >= 0) {
      const convertedImage = await this.convert(type, quality);
      const difference = await compareImages(imageData, convertedImage.getImageData());

      if (difference <= maxDifference) {
        image = convertedImage;
        quality = Math.round((quality - step) * 10_000) / 10_000; // Continue to check lower qualities
      } else {
        console.log(this.name, quality + step);
        break;
      }
    }

    return image;
  }
}

export default ImageModel;
