import { BoardState, Strategy, PositionAnalysis, ResourceType } from '../types/catan';
import { boardAnalyzer } from '../services/boardAnalyzer';

export class StrategyEngine {

  generateStrategies(boardState: BoardState): Strategy[] {
    const strategies: Strategy[] = [];

    // Analyze all positions
    const positions = boardAnalyzer.analyzeBoard(boardState);

    // Settlement strategies
    const topSettlementPositions = positions.slice(0, 3);
    topSettlementPositions.forEach((analysis, index) => {
      strategies.push({
        type: 'SETTLEMENT',
        priority: 100 - (index * 10),
        description: `Build settlement at position (${Math.round(analysis.position.x)}, ${Math.round(analysis.position.y)})`,
        position: analysis.position,
        reasoning: this.generateSettlementReasoning(analysis),
      });
    });

    // City upgrade strategies
    if (boardState.settlements.length > 0) {
      const settlementAnalyses = this.analyzeExistingSettlements(boardState, positions);
      const topCity = settlementAnalyses[0];

      if (topCity && topCity.score > 60) {
        strategies.push({
          type: 'CITY',
          priority: 85,
          description: `Upgrade settlement to city for 2x production`,
          reasoning: `This settlement has high production value (${topCity.score.toFixed(1)}) and would benefit from doubling output.`,
        });
      }
    }

    // Resource scarcity strategies
    const distribution = boardAnalyzer.getResourceDistribution(boardState);
    const scarceResources = this.findScarceResources(distribution);

    if (scarceResources.length > 0) {
      strategies.push({
        type: 'TRADE',
        priority: 70,
        description: `Focus on acquiring ${scarceResources.join(', ')}`,
        reasoning: `Board has limited access to these resources. Consider 4:1 or port trades.`,
      });
    }

    // Development card strategy
    if (this.shouldBuyDevelopmentCard(boardState)) {
      strategies.push({
        type: 'DEVELOPMENT',
        priority: 60,
        description: `Consider buying development cards`,
        reasoning: `Good ore/wheat access. Dev cards provide flexibility and victory points.`,
      });
    }

    return strategies.sort((a, b) => b.priority - a.priority);
  }

  private generateSettlementReasoning(analysis: PositionAnalysis): string {
    const reasons: string[] = [];

    reasons.push(`Expected value: ${analysis.expectedValue.toFixed(2)}`);
    reasons.push(`Probability: ${(analysis.probability * 100).toFixed(1)}%`);

    const resourceTypes = Object.keys(analysis.resources);
    if (resourceTypes.length >= 3) {
      reasons.push(`Diverse resources (${resourceTypes.length} types)`);
    }

    // Check for high-value numbers
    const hasHighProbNumber = Object.entries(analysis.resources).some(([resource, prob]) => {
      return prob && prob > 0.12; // 6 or 8
    });

    if (hasHighProbNumber) {
      reasons.push('Adjacent to 6 or 8');
    }

    return reasons.join(' • ');
  }

  private analyzeExistingSettlements(
    boardState: BoardState,
    allPositions: PositionAnalysis[]
  ): PositionAnalysis[] {
    const settlementAnalyses: PositionAnalysis[] = [];

    for (const settlement of boardState.settlements) {
      if (settlement.isCity) continue;

      // Find matching position analysis
      const analysis = allPositions.find(p =>
        Math.abs(p.position.x - settlement.position.x) < 10 &&
        Math.abs(p.position.y - settlement.position.y) < 10
      );

      if (analysis) {
        settlementAnalyses.push(analysis);
      }
    }

    return settlementAnalyses.sort((a, b) => b.score - a.score);
  }

  private findScarceResources(distribution: { [key in ResourceType]?: number }): string[] {
    const scarce: string[] = [];
    const total = Object.values(distribution).reduce((sum, count) => sum + (count || 0), 0);

    for (const [resource, count] of Object.entries(distribution)) {
      if (resource === ResourceType.DESERT) continue;

      const percentage = (count || 0) / total;
      if (percentage < 0.15) { // Less than 15% of tiles
        scarce.push(resource.toLowerCase());
      }
    }

    return scarce;
  }

  private shouldBuyDevelopmentCard(boardState: BoardState): boolean {
    const distribution = boardAnalyzer.getResourceDistribution(boardState);

    const oreCount = distribution[ResourceType.ORE] || 0;
    const wheatCount = distribution[ResourceType.WHEAT] || 0;

    // If we have good ore and wheat access, dev cards are viable
    return oreCount >= 3 && wheatCount >= 3;
  }
}

export const strategyEngine = new StrategyEngine();
