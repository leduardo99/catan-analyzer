export enum ResourceType {
  WOOD = 'WOOD',
  BRICK = 'BRICK',
  WHEAT = 'WHEAT',
  SHEEP = 'SHEEP',
  ORE = 'ORE',
  DESERT = 'DESERT',
}

export interface HexTile {
  id: string;
  resource: ResourceType;
  number: number;
  position: { x: number; y: number };
  hasRobber: boolean;
}

export interface Settlement {
  id: string;
  position: { x: number; y: number };
  player: string;
  isCity: boolean;
}

export interface BoardState {
  tiles: HexTile[];
  settlements: Settlement[];
  robberPosition: { x: number; y: number } | null;
}

export interface Position {
  x: number;
  y: number;
  adjacentTiles: string[];
}

export interface PositionAnalysis {
  position: Position;
  probability: number;
  expectedValue: number;
  resources: { [key in ResourceType]?: number };
  score: number;
}

export interface Strategy {
  type: 'SETTLEMENT' | 'CITY' | 'TRADE' | 'DEVELOPMENT';
  priority: number;
  description: string;
  position?: Position;
  reasoning: string;
}
