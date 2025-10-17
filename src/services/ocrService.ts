import Tesseract from 'tesseract.js';

export class OCRService {
  private worker: Tesseract.Worker | null = null;

  async initialize(): Promise<void> {
    this.worker = await Tesseract.createWorker('eng', 1, {
      logger: (m) => console.log(m),
    });

    await this.worker.setParameters({
      tessedit_char_whitelist: '23456789101112',
      tessedit_pageseg_mode: Tesseract.PSM.SPARSE_TEXT,
    });
  }

  async recognizeNumbers(imageData: string): Promise<string[]> {
    if (!this.worker) {
      await this.initialize();
    }

    try {
      const { data } = await this.worker!.recognize(imageData);

      // Extract numbers from text
      const numbers: string[] = [];
      const matches = data.text.match(/\d+/g);

      if (matches) {
        matches.forEach(match => {
          const num = parseInt(match);
          if (num >= 2 && num <= 12 && num !== 7) {
            numbers.push(match);
          }
        });
      }

      return numbers;
    } catch (error) {
      console.error('OCR recognition error:', error);
      return [];
    }
  }

  async detectTileRegions(imageData: string): Promise<Array<{x: number, y: number, width: number, height: number}>> {
    // Simplified tile detection - in production, you'd use more sophisticated computer vision
    // This assumes a standard Catan board layout
    const regions: Array<{x: number, y: number, width: number, height: number}> = [];

    // Standard Catan board has 19 hexagons in specific positions
    // These would need to be calibrated based on actual screen resolution
    const hexWidth = 100;
    const hexHeight = 115;
    const centerX = 960; // Assuming 1920x1080 screen
    const centerY = 540;

    // Center hex
    regions.push({ x: centerX - hexWidth/2, y: centerY - hexHeight/2, width: hexWidth, height: hexHeight });

    // This is a simplified layout - you'd need actual coordinates based on hex grid math
    // For now, returning the center position

    return regions;
  }

  async terminate(): Promise<void> {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
    }
  }
}

export const ocrService = new OCRService();
