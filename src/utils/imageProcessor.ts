export class ImageProcessor {

  // Convert base64 to ImageData for processing
  async base64ToImageData(base64: string): Promise<ImageData> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        resolve(imageData);
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = `data:image/png;base64,${base64}`;
    });
  }

  // Enhance image for better OCR
  enhanceForOCR(imageData: ImageData): ImageData {
    const data = imageData.data;

    // Convert to grayscale and increase contrast
    for (let i = 0; i < data.length; i += 4) {
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];

      // Increase contrast
      const contrasted = this.increaseContrast(gray, 1.5);

      data[i] = contrasted;     // R
      data[i + 1] = contrasted; // G
      data[i + 2] = contrasted; // B
    }

    return imageData;
  }

  private increaseContrast(value: number, factor: number): number {
    const normalized = value / 255;
    const contrasted = (normalized - 0.5) * factor + 0.5;
    return Math.max(0, Math.min(255, contrasted * 255));
  }

  // Detect color-based resources (simplified)
  detectResourceByColor(r: number, g: number, b: number): string {
    // These are approximate color ranges - would need calibration
    if (g > 100 && r < 100 && b < 100) return 'WOOD';
    if (r > 150 && g < 100 && b < 100) return 'BRICK';
    if (r > 200 && g > 200 && b < 150) return 'WHEAT';
    if (g > 150 && r > 150 && b > 150) return 'SHEEP';
    if (r < 100 && g < 100 && b > 100) return 'ORE';
    if (r > 200 && g > 180 && b < 150) return 'DESERT';

    return 'UNKNOWN';
  }

  // Crop region from base64 image
  async cropRegion(
    base64: string,
    x: number,
    y: number,
    width: number,
    height: number
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(img, x, y, width, height, 0, 0, width, height);
        resolve(canvas.toDataURL('image/png').split(',')[1]);
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = `data:image/png;base64,${base64}`;
    });
  }
}

export const imageProcessor = new ImageProcessor();
