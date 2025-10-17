import { BoardState, HexTile, ResourceType } from '../types/catan';

/**
 * Mock Board Service for testing without actual game running
 * Provides realistic Catan board layouts for development
 */
export class MockBoardService {

  /**
   * Generate a standard Catan board (base game)
   */
  generateStandardBoard(): BoardState {
    const tiles: HexTile[] = [
      // Top row (3 tiles)
      { id: 't1', resource: ResourceType.WOOD, number: 11, position: { x: 500, y: 200 }, hasRobber: false },
      { id: 't2', resource: ResourceType.SHEEP, number: 12, position: { x: 600, y: 200 }, hasRobber: false },
      { id: 't3', resource: ResourceType.WHEAT, number: 9, position: { x: 700, y: 200 }, hasRobber: false },

      // Second row (4 tiles)
      { id: 'm1', resource: ResourceType.BRICK, number: 4, position: { x: 450, y: 300 }, hasRobber: false },
      { id: 'm2', resource: ResourceType.ORE, number: 6, position: { x: 550, y: 300 }, hasRobber: false },
      { id: 'm3', resource: ResourceType.SHEEP, number: 5, position: { x: 650, y: 300 }, hasRobber: false },
      { id: 'm4', resource: ResourceType.BRICK, number: 10, position: { x: 750, y: 300 }, hasRobber: false },

      // Middle row (5 tiles)
      { id: 'c1', resource: ResourceType.WHEAT, number: 3, position: { x: 400, y: 400 }, hasRobber: false },
      { id: 'c2', resource: ResourceType.WOOD, number: 11, position: { x: 500, y: 400 }, hasRobber: false },
      { id: 'c3', resource: ResourceType.DESERT, number: 7, position: { x: 600, y: 400 }, hasRobber: true },
      { id: 'c4', resource: ResourceType.WOOD, number: 4, position: { x: 700, y: 400 }, hasRobber: false },
      { id: 'c5', resource: ResourceType.WHEAT, number: 8, position: { x: 800, y: 400 }, hasRobber: false },

      // Fourth row (4 tiles)
      { id: 'b1', resource: ResourceType.BRICK, number: 8, position: { x: 450, y: 500 }, hasRobber: false },
      { id: 'b2', resource: ResourceType.ORE, number: 10, position: { x: 550, y: 500 }, hasRobber: false },
      { id: 'b3', resource: ResourceType.WOOD, number: 9, position: { x: 650, y: 500 }, hasRobber: false },
      { id: 'b4', resource: ResourceType.SHEEP, number: 3, position: { x: 750, y: 500 }, hasRobber: false },

      // Bottom row (3 tiles)
      { id: 'bt1', resource: ResourceType.ORE, number: 5, position: { x: 500, y: 600 }, hasRobber: false },
      { id: 'bt2', resource: ResourceType.SHEEP, number: 2, position: { x: 600, y: 600 }, hasRobber: false },
      { id: 'bt3', resource: ResourceType.WHEAT, number: 6, position: { x: 700, y: 600 }, hasRobber: false },
    ];

    return {
      tiles,
      settlements: [],
      robberPosition: { x: 600, y: 400 }, // Desert
    };
  }

  /**
   * Generate a resource-rich board (testing high scores)
   */
  generateRichBoard(): BoardState {
    const tiles: HexTile[] = [
      // Lots of 6s and 8s
      { id: '1', resource: ResourceType.WHEAT, number: 6, position: { x: 500, y: 300 }, hasRobber: false },
      { id: '2', resource: ResourceType.ORE, number: 8, position: { x: 600, y: 300 }, hasRobber: false },
      { id: '3', resource: ResourceType.WOOD, number: 6, position: { x: 700, y: 300 }, hasRobber: false },
      { id: '4', resource: ResourceType.BRICK, number: 8, position: { x: 550, y: 400 }, hasRobber: false },
      { id: '5', resource: ResourceType.SHEEP, number: 5, position: { x: 650, y: 400 }, hasRobber: false },
    ];

    return {
      tiles,
      settlements: [],
      robberPosition: null,
    };
  }

  /**
   * Generate a scarce board (testing low scores)
   */
  generateScarceBoard(): BoardState {
    const tiles: HexTile[] = [
      // Lots of 2s, 3s, 11s, 12s
      { id: '1', resource: ResourceType.WOOD, number: 2, position: { x: 500, y: 300 }, hasRobber: false },
      { id: '2', resource: ResourceType.BRICK, number: 12, position: { x: 600, y: 300 }, hasRobber: false },
      { id: '3', resource: ResourceType.WHEAT, number: 3, position: { x: 700, y: 300 }, hasRobber: false },
      { id: '4', resource: ResourceType.ORE, number: 11, position: { x: 550, y: 400 }, hasRobber: false },
      { id: '5', resource: ResourceType.DESERT, number: 7, position: { x: 650, y: 400 }, hasRobber: true },
    ];

    return {
      tiles,
      settlements: [],
      robberPosition: { x: 650, y: 400 },
    };
  }

  /**
   * Generate board with existing settlements (mid-game)
   */
  generateMidGameBoard(): BoardState {
    const board = this.generateStandardBoard();

    board.settlements = [
      { id: 's1', position: { x: 525, y: 250 }, player: 'blue', isCity: false },
      { id: 's2', position: { x: 625, y: 350 }, player: 'red', isCity: false },
      { id: 's3', position: { x: 575, y: 450 }, player: 'blue', isCity: true },
    ];

    return board;
  }

  /**
   * Get random board for testing variety
   */
  getRandomBoard(): BoardState {
    const boards = [
      () => this.generateStandardBoard(),
      () => this.generateRichBoard(),
      () => this.generateScarceBoard(),
      () => this.generateMidGameBoard(),
    ];

    const random = boards[Math.floor(Math.random() * boards.length)];
    return random();
  }
}

export const mockBoardService = new MockBoardService();
