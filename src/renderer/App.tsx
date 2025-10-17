import React, { useState, useEffect } from 'react';
import { BoardState, Strategy, PositionAnalysis, ResourceType } from '../types/catan';
import { strategyEngine } from '../utils/strategyEngine';
import { boardAnalyzer } from '../services/boardAnalyzer';
import { mockBoardService } from '../services/mockBoardService';
import { realBoardDetector } from '../services/realBoardDetector';
import './App.css';

const App: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [topPositions, setTopPositions] = useState<PositionAnalysis[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [useMockData, setUseMockData] = useState(false); // ← Changed to false (use real data)
  const [error, setError] = useState<string | null>(null);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [showCalibration, setShowCalibration] = useState(false);

  // Check if electronAPI is available
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.electronAPI) {
      console.warn('ElectronAPI not available - running in browser mode');
      setError('Running in browser mode - some features may not work');
    }
  }, []);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      let boardState: BoardState;

      if (useMockData) {
        // Use mock data for development
        boardState = mockBoardService.generateStandardBoard();
        console.log('Using mock board data');
      } else {
        // Capture screenshot and process with real detection
        console.log('Capturing screenshot...');
        const screenshotData = await window.electronAPI.captureScreenshot();
        setScreenshot(screenshotData); // Store for calibration view

        console.log('Processing screenshot with real detector...');
        boardState = await realBoardDetector.detectBoard(screenshotData);

        console.log('Board detected:', {
          tiles: boardState.tiles.length,
          sample: boardState.tiles.slice(0, 3),
        });

        setError(`✅ Detected ${boardState.tiles.length} tiles`);
      }

      // Analyze positions
      const positions = boardAnalyzer.analyzeBoard(boardState);
      setTopPositions(positions.slice(0, 5));

      // Generate strategies
      const newStrategies = strategyEngine.generateStrategies(boardState);
      setStrategies(newStrategies);

    } catch (error) {
      console.error('Analysis failed:', error);
      setError(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleMode = () => {
    setUseMockData(!useMockData);
    setStrategies([]);
    setTopPositions([]);
    setScreenshot(null);
  };

  const toggleVisibility = () => {
    const newVisible = !isVisible;
    setIsVisible(newVisible);
    if (window.electronAPI) {
      window.electronAPI.toggleOverlay(newVisible);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains('drag-handle')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - dragOffset.x;
      const deltaY = e.clientY - dragOffset.y;

      window.moveTo(window.screenX + deltaX, window.screenY + deltaY);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const getPriorityColor = (priority: number): string => {
    if (priority >= 90) return '#4ade80';
    if (priority >= 70) return '#fbbf24';
    return '#f87171';
  };

  const getResourceEmoji = (resource: ResourceType): string => {
    const emojis = {
      [ResourceType.WOOD]: '🌲',
      [ResourceType.BRICK]: '🧱',
      [ResourceType.WHEAT]: '🌾',
      [ResourceType.SHEEP]: '�양',
      [ResourceType.ORE]: '⛰️',
      [ResourceType.DESERT]: '🏜️',
    };
    return emojis[resource] || '?';
  };

  return (
    <div className={`app-container ${isVisible ? 'visible' : 'hidden'}`} onMouseDown={handleMouseDown}>
      <div className="drag-handle">
        <div className="title">Catan Analyzer</div>
        <div className="controls">
          <button onClick={toggleVisibility} className="btn-icon" title="Toggle visibility">
            {isVisible ? '👁️' : '👁️‍🗨️'}
          </button>
          <button onClick={() => window.electronAPI?.minimizeWindow()} className="btn-icon" title="Minimize">
            ➖
          </button>
          <button onClick={() => window.electronAPI?.closeWindow()} className="btn-icon close" title="Close">
            ❌
          </button>
        </div>
      </div>

      <div className="content">
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', alignItems: 'center' }}>
          <button
            onClick={toggleMode}
            style={{
              padding: '6px 12px',
              background: useMockData ? '#6366f1' : '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '11px',
              cursor: 'pointer',
              fontWeight: '600',
            }}
            title={useMockData ? 'Using mock data (click to use real detection)' : 'Using real detection (click to use mock data)'}
          >
            {useMockData ? '🧪 Mock Mode' : '📸 Real Mode'}
          </button>

          {screenshot && (
            <button
              onClick={() => setShowCalibration(!showCalibration)}
              style={{
                padding: '6px 12px',
                background: '#8b5cf6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '11px',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              {showCalibration ? '📊 Results' : '🔍 Calibration'}
            </button>
          )}
        </div>

        {error && (
          <div style={{
            padding: '10px',
            background: error.startsWith('✅') ? '#10b981' : '#fbbf24',
            color: '#fff',
            borderRadius: '8px',
            marginBottom: '10px',
            fontSize: '12px'
          }}>
            {error}
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="analyze-button"
        >
          {isAnalyzing ? 'Analyzing...' : `🎲 Analyze Board ${useMockData ? '(Mock)' : '(Real)'}`}
        </button>

        {showCalibration && screenshot && (
          <div style={{
            marginTop: '12px',
            padding: '12px',
            background: 'rgba(30, 41, 59, 0.6)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <h4 style={{ fontSize: '13px', marginBottom: '8px', color: '#fbbf24' }}>📸 Screenshot Preview</h4>
            <img
              src={`data:image/png;base64,${screenshot}`}
              alt="Screenshot"
              style={{
                width: '100%',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            />
            <p style={{ fontSize: '11px', marginTop: '8px', color: 'rgba(255, 255, 255, 0.6)' }}>
              Use this to verify tiles are detected correctly. If positions are wrong, calibration is needed.
            </p>
          </div>
        )}

        {topPositions.length > 0 && (
          <div className="section">
            <h3>🎯 Top Positions</h3>
            <div className="positions-list">
              {topPositions.map((pos, idx) => (
                <div key={idx} className="position-card">
                  <div className="position-header">
                    <span className="position-rank">#{idx + 1}</span>
                    <span className="position-score">{pos.score.toFixed(1)}</span>
                  </div>
                  <div className="position-stats">
                    <div className="stat">
                      <span className="stat-label">Probability:</span>
                      <span className="stat-value">{(pos.probability * 100).toFixed(1)}%</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Expected:</span>
                      <span className="stat-value">{pos.expectedValue.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="resources">
                    {Object.entries(pos.resources).map(([resource, prob]) => (
                      <span key={resource} className="resource-tag" title={`${resource}: ${((prob || 0) * 100).toFixed(1)}%`}>
                        {getResourceEmoji(resource as ResourceType)}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {strategies.length > 0 && (
          <div className="section">
            <h3>💡 Strategy Suggestions</h3>
            <div className="strategies-list">
              {strategies.map((strategy, idx) => (
                <div key={idx} className="strategy-card">
                  <div className="strategy-header">
                    <span
                      className="priority-indicator"
                      style={{ backgroundColor: getPriorityColor(strategy.priority) }}
                    />
                    <span className="strategy-type">{strategy.type}</span>
                  </div>
                  <div className="strategy-description">{strategy.description}</div>
                  <div className="strategy-reasoning">{strategy.reasoning}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {strategies.length === 0 && topPositions.length === 0 && (
          <div className="empty-state">
            <p>Click "Analyze Board" to start</p>
            <p className="help-text">Make sure Catan Universe is visible on screen</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
