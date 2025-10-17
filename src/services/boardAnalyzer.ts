import { BoardState, HexTile, ResourceType, Position, PositionAnalysis } from '../types/catan';

export class BoardAnalyzer {

  // Catan dice probability distribution
  private readonly diceProbabilities: { [key: number]: number } = {
    2: 1/36, 3: 2/36, 4: 3/36, 5: 4/36, 6: 5/36,
    7: 6/36, 8: 5/36, 9: 4/36, 10: 3/36, 11: 2/36, 12: 1/36
  };

  // Resource values (relative importance)
  private readonly resourceValues: { [key in ResourceType]: number } = {
    [ResourceType.WOOD]: 1.0,
    [ResourceType.BRICK]: 1.0,
    [ResourceType.WHEAT]: 1.1,
    [ResourceType.SHEEP]: 0.9,
    [ResourceType.ORE]: 1.2,
    [ResourceType.DESERT]: 0,
  };

  analyzeBoard(boardState: BoardState): PositionAnalysis[] {
    const positions = this.generatePossiblePositions(boardState);
    const analyses: PositionAnalysis[] = [];

    for (const position of positions) {
      const analysis = this.analyzePosition(position, boardState);
      analyses.push(analysis);
    }

    // Sort by score descending
    return analyses.sort((a, b) => b.score - a.score);
  }

  private analyzePosition(position: Position, boardState: BoardState): PositionAnalysis {
    const adjacentTiles = boardState.tiles.filter(tile =>
      position.adjacentTiles.includes(tile.id)
    );

    let totalProbability = 0;
    let expectedValue = 0;
    const resources: { [key in ResourceType]?: number } = {};

    for (const tile of adjacentTiles) {
      if (tile.hasRobber || tile.resource === ResourceType.DESERT) {
        continue;
      }

      const prob = this.diceProbabilities[tile.number] || 0;
      const value = this.resourceValues[tile.resource];

      totalProbability += prob;
      expectedValue += prob * value;

      if (!resources[tile.resource]) {
        resources[tile.resource] = 0;
      }
      resources[tile.resource]! += prob;
    }

    // Calculate diversity bonus
    const diversityBonus = Object.keys(resources).length * 0.5;

    // Calculate score
    const score = expectedValue * 100 + diversityBonus;

    return {
      position,
      probability: totalProbability,
      expectedValue,
      resources,
      score,
    };
  }

  private generatePossiblePositions(boardState: BoardState): Position[] {
    // In a real implementation, this would detect all valid settlement positions
    // For now, we'll generate positions at the intersections of hexagons

    const positions: Position[] = [];
    const tiles = boardState.tiles;

    // Each hex has 6 corners, shared with adjacent hexes
    // This is a simplified version - you'd need actual hex grid math

    for (let i = 0; i < tiles.length; i++) {
      const tile = tiles[i];

      // Generate 6 corner positions for each hex
      for (let corner = 0; corner < 6; corner++) {
        const angle = (Math.PI / 3) * corner;
        const radius = 60; // Approximate hex radius

        const x = tile.position.x + radius * Math.cos(angle);
        const y = tile.position.y + radius * Math.sin(angle);

        // Find adjacent tiles (simplified)
        const adjacentTiles = tiles
          .filter(t => {
            const dist = Math.sqrt(
              Math.pow(t.position.x - x, 2) +
              Math.pow(t.position.y - y, 2)
            );
            return dist < radius * 1.5;
          })
          .map(t => t.id);

        if (adjacentTiles.length >= 2) {
          positions.push({
            x,
            y,
            adjacentTiles,
          });
        }
      }
    }

    return this.deduplicatePositions(positions);
  }

  private deduplicatePositions(positions: Position[]): Position[] {
    const unique: Position[] = [];
    const threshold = 10; // pixels

    for (const pos of positions) {
      const isDuplicate = unique.some(u =>
        Math.abs(u.x - pos.x) < threshold &&
        Math.abs(u.y - pos.y) < threshold
      );

      if (!isDuplicate) {
        unique.push(pos);
      }
    }

    return unique;
  }

  calculateProbabilityPips(number: number): number {
    // Dots/pips shown on Catan number tokens
    const pips: { [key: number]: number } = {
      2: 1, 3: 2, 4: 3, 5: 4, 6: 5,
      8: 5, 9: 4, 10: 3, 11: 2, 12: 1
    };
    return pips[number] || 0;
  }

  getResourceDistribution(boardState: BoardState): { [key in ResourceType]?: number } {
    const distribution: { [key in ResourceType]?: number } = {};

    for (const tile of boardState.tiles) {
      if (!distribution[tile.resource]) {
        distribution[tile.resource] = 0;
      }
      distribution[tile.resource]!++;
    }

    return distribution;
  }
}

export const boardAnalyzer = new BoardAnalyzer();
