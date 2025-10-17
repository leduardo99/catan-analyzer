import { BoardState, HexTile, ResourceType } from '../types/catan';

/**
 * Real Board Detector - Processes screenshot to detect actual Catan board
 */
export class RealBoardDetector {

  /**
   * Process screenshot and extract board state
   */
  async detectBoard(screenshotBase64: string): Promise<BoardState> {
    console.log('Processing screenshot...');

    // Convert base64 to image
    const image = await this.base64ToImage(screenshotBase64);

    // Detect tiles
    const tiles = await this.detectTiles(image);

    // Detect numbers on tiles
    const tilesWithNumbers = await this.detectNumbers(tiles, image);

    // Detect resources (colors)
    const completeTiles = await this.detectResources(tilesWithNumbers, image);

    console.log(`Detected ${completeTiles.length} tiles`);

    return {
      tiles: completeTiles,
      settlements: [],
      robberPosition: null,
    };
  }

  /**
   * Convert base64 to Image element
   */
  private async base64ToImage(base64: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = `data:image/png;base64,${base64}`;
    });
  }

  /**
   * Detect hexagonal tiles on the board
   * For now, uses fixed positions - you'll calibrate these
   */
  private async detectTiles(image: HTMLImageElement): Promise<Array<{id: string, position: {x: number, y: number}}>> {
    // Standard Catan board has 19 hexagons
    // These positions need to be calibrated based on your screen resolution
    // For 1920x1080, assuming Catan Universe is maximized

    const centerX = image.width / 2;
    const centerY = image.height / 2;
    const hexSize = 80; // Approximate size, needs calibration
    const hexHeight = hexSize * Math.sqrt(3);

    const tiles: Array<{id: string, position: {x: number, y: number}}> = [];

    // Generate standard Catan hex grid
    // Row 0 (top): 3 hexes
    for (let i = 0; i < 3; i++) {
      tiles.push({
        id: `r0-${i}`,
        position: {
          x: centerX + (i - 1) * hexSize * 1.5,
          y: centerY - hexHeight * 2,
        },
      });
    }

    // Row 1: 4 hexes
    for (let i = 0; i < 4; i++) {
      tiles.push({
        id: `r1-${i}`,
        position: {
          x: centerX + (i - 1.5) * hexSize * 1.5,
          y: centerY - hexHeight,
        },
      });
    }

    // Row 2 (middle): 5 hexes
    for (let i = 0; i < 5; i++) {
      tiles.push({
        id: `r2-${i}`,
        position: {
          x: centerX + (i - 2) * hexSize * 1.5,
          y: centerY,
        },
      });
    }

    // Row 3: 4 hexes
    for (let i = 0; i < 4; i++) {
      tiles.push({
        id: `r3-${i}`,
        position: {
          x: centerX + (i - 1.5) * hexSize * 1.5,
          y: centerY + hexHeight,
        },
      });
    }

    // Row 4 (bottom): 3 hexes
    for (let i = 0; i < 3; i++) {
      tiles.push({
        id: `r4-${i}`,
        position: {
          x: centerX + (i - 1) * hexSize * 1.5,
          y: centerY + hexHeight * 2,
        },
      });
    }

    return tiles;
  }

  /**
   * Detect numbers on tiles using OCR or pattern matching
   */
  private async detectNumbers(
    tiles: Array<{id: string, position: {x: number, y: number}}>,
    image: HTMLImageElement
  ): Promise<Array<HexTile>> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);

    const result: HexTile[] = [];

    for (const tile of tiles) {
      // Extract region around tile center
      const regionSize = 50;
      const x = Math.max(0, tile.position.x - regionSize / 2);
      const y = Math.max(0, tile.position.y - regionSize / 2);

      // Get pixel data
      const imageData = ctx.getImageData(x, y, regionSize, regionSize);

      // Detect number (simplified - you'll integrate Tesseract here)
      const number = await this.detectNumberInRegion(imageData);

      result.push({
        id: tile.id,
        resource: ResourceType.DESERT, // Will be filled by detectResources
        number: number || 7, // Default to 7 (desert/robber)
        position: tile.position,
        hasRobber: false,
      });
    }

    return result;
  }

  /**
   * Simple number detection (placeholder for Tesseract integration)
   */
  private async detectNumberInRegion(imageData: ImageData): Promise<number | null> {
    // TODO: Integrate with Tesseract.js for real OCR
    // For now, return random valid Catan numbers for testing
    const validNumbers = [2, 3, 4, 5, 6, 8, 9, 10, 11, 12];
    return validNumbers[Math.floor(Math.random() * validNumbers.length)];
  }

  /**
   * Detect resource type by analyzing tile color
   */
  private async detectResources(
    tiles: HexTile[],
    image: HTMLImageElement
  ): Promise<HexTile[]> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);

    return tiles.map(tile => {
      // Sample color from tile center
      const x = Math.floor(tile.position.x);
      const y = Math.floor(tile.position.y);

      if (x < 0 || y < 0 || x >= image.width || y >= image.height) {
        return tile;
      }

      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const [r, g, b] = [pixel[0], pixel[1], pixel[2]];

      // Detect resource by color
      const resource = this.colorToResource(r, g, b);

      return {
        ...tile,
        resource,
      };
    });
  }

  /**
   * Convert RGB color to resource type
   * These values need calibration based on Catan Universe's actual colors
   */
  private colorToResource(r: number, g: number, b: number): ResourceType {
    // Forest (green/dark green)
    if (g > r && g > b && g > 80) {
      return ResourceType.WOOD;
    }

    // Hills (red/brown/brick)
    if (r > g && r > b && r > 100) {
      return ResourceType.BRICK;
    }

    // Fields (yellow/wheat)
    if (r > 180 && g > 150 && b < 100) {
      return ResourceType.WHEAT;
    }

    // Pasture (light green/lime)
    if (g > 140 && r > 100 && r < 200 && b < 120) {
      return ResourceType.SHEEP;
    }

    // Mountains (gray/dark)
    if (r < 100 && g < 100 && b < 100) {
      return ResourceType.ORE;
    }

    // Desert (sandy/yellow-brown)
    if (r > 150 && g > 120 && b < 100 && Math.abs(r - g) < 50) {
      return ResourceType.DESERT;
    }

    // Default to wood if unclear
    return ResourceType.WOOD;
  }
}

export const realBoardDetector = new RealBoardDetector();
