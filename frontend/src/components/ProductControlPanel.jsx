import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCw, Trash2, X, RefreshCw } from 'lucide-react';

/**
 * Game-like Control Panel for Product Manipulation
 * Beautiful glassmorphism design with smooth animations
 */
export default function ProductControlPanel({
  selectedItem,
  onMove,
  onRotate,
  onRotateDirection,
  onDelete,
  onClose,
  canMoveUp,
  canMoveDown,
  canMoveLeft,
  canMoveRight,
  canRotate
}) {
  if (!selectedItem) return null;

  return (
    <div className="fixed top-24 right-6 z-50 animate-slide-in-right max-h-[calc(100vh-7rem)] overflow-y-auto">
      {/* Glassmorphism Container */}
      <div className="relative">
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-50 animate-pulse"></div>

        {/* Main Panel */}
        <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-5 w-80">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🎮</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">{selectedItem.name}</h3>
                <p className="text-white/70 text-xs">Use controls to adjust position</p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="glass-button w-10 h-10 rounded-xl flex items-center justify-center hover:bg-red-500/20 transition-all duration-300"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Control Grid - Vertical Layout */}
          <div className="flex flex-col gap-4">
            {/* Directional Controls */}
            <div className="flex flex-col items-center gap-2">
              <p className="text-white/70 text-xs font-semibold mb-1">MOVE</p>

              {/* Up Arrow */}
              <button
                onClick={() => onMove('up')}
                disabled={!canMoveUp}
                className={`game-button ${!canMoveUp ? 'opacity-30 cursor-not-allowed' : ''}`}
                title="Move Up (↑)"
              >
                <ArrowUp className="w-5 h-5" />
              </button>

              {/* Left, Center, Right */}
              <div className="flex gap-2">
                <button
                  onClick={() => onMove('left')}
                  disabled={!canMoveLeft}
                  className={`game-button ${!canMoveLeft ? 'opacity-30 cursor-not-allowed' : ''}`}
                  title="Move Left (←)"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center">
                  <span className="text-2xl">📦</span>
                </div>

                <button
                  onClick={() => onMove('right')}
                  disabled={!canMoveRight}
                  className={`game-button ${!canMoveRight ? 'opacity-30 cursor-not-allowed' : ''}`}
                  title="Move Right (→)"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Down Arrow */}
              <button
                onClick={() => onMove('down')}
                disabled={!canMoveDown}
                className={`game-button ${!canMoveDown ? 'opacity-30 cursor-not-allowed' : ''}`}
                title="Move Down (↓)"
              >
                <ArrowDown className="w-5 h-5" />
              </button>
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

            {/* Action Controls */}
            <div className="flex flex-col gap-3">
              <p className="text-white/70 text-xs font-semibold mb-1 text-center">ACTIONS</p>
              
              {/* Rotate Button */}
              <button
                onClick={onRotate}
                disabled={!canRotate}
                className={`action-button bg-gradient-to-br from-blue-500 to-purple-600 ${!canRotate ? 'opacity-30 cursor-not-allowed' : ''}`}
                title={selectedItem.rotation?.needsRotation ? 'Stand Up' : 'Lay Down'}
              >
                <RotateCw className="w-5 h-5" />
                <span className="text-sm font-semibold">
                  {selectedItem.rotation?.needsRotation ? 'Stand Up' : 'Lay Down'}
                </span>
              </button>

              {/* Rotate Direction Button - Only show when item is laid down */}
              {selectedItem.rotation?.needsRotation && (
                <button
                  onClick={onRotateDirection}
                  className="action-button bg-gradient-to-br from-cyan-500 to-blue-600"
                  title="Rotate Direction (Change Orientation)"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span className="text-sm font-semibold">Rotate Direction</span>
                </button>
              )}

              {/* Delete Button */}
              <button
                onClick={onDelete}
                className="action-button bg-gradient-to-br from-red-500 to-pink-600 hover:scale-105"
                title="Remove from Hamper"
              >
                <Trash2 className="w-5 h-5" />
                <span className="text-sm font-semibold">Remove</span>
              </button>
            </div>
          </div>

          {/* Keyboard Hints */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="text-white/50 text-xs space-y-1">
              <p className="text-center font-semibold text-white/70">⌨️ Keyboard Shortcuts</p>
              <p>↑↓←→ Move</p>
              <p>R - Rotate (Stand/Lay)</p>
              <p>T - Turn Direction</p>
              <p>Del - Remove</p>
              <p>Esc - Close</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

