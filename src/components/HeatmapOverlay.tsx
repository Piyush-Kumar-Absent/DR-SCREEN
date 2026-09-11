import React from 'react';
import { LesionMarker } from '../types';

interface HeatmapOverlayProps {
  opacity: number;
  showLesionMarkers?: boolean;
  lesions?: LesionMarker[];
  selectedLesionId?: string | null;
  onSelectLesion?: (lesion: LesionMarker | null) => void;
}

export const HeatmapOverlay: React.FC<HeatmapOverlayProps> = ({
  opacity,
  showLesionMarkers = true,
  lesions = [],
  selectedLesionId,
  onSelectLesion
}) => {
  return (
    <div
      className="absolute inset-0 pointer-events-none transition-opacity duration-300"
      style={{ opacity }}
    >
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          {/* Primary Microaneurysm cluster heat gradient */}
          <radialGradient id="heat-primary" cx="30%" cy="38%" r="14%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#f97316" stopOpacity="0.75" />
            <stop offset="75%" stopColor="#eab308" stopOpacity="0.4" />
            <stop offset="95%" stopColor="#10b981" stopOpacity="0.1" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          {/* Secondary dot hemorrhage gradient */}
          <radialGradient id="heat-secondary" cx="35%" cy="45%" r="12%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#f97316" stopOpacity="0.7" />
            <stop offset="80%" stopColor="#eab308" stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          {/* Temporal arcade focal lesion */}
          <radialGradient id="heat-arcade" cx="22%" cy="48%" r="10%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#f59e0b" stopOpacity="0.6" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          {/* Superior arcade microaneurysm */}
          <radialGradient id="heat-superior" cx="32%" cy="28%" r="8%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#eab308" stopOpacity="0.35" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Heatmap intensity blobs matching fundus lesions */}
        <circle cx="30" cy="38" r="14" fill="url(#heat-primary)" />
        <circle cx="35" cy="45" r="12" fill="url(#heat-secondary)" />
        <circle cx="22" cy="48" r="10" fill="url(#heat-arcade)" />
        <circle cx="32" cy="28" r="8" fill="url(#heat-superior)" />

        {/* Clinical marker rings around verified microaneurysms */}
        {showLesionMarkers && (
          <>
            <circle
              cx="30"
              cy="38"
              r="5.5"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="0.8"
              strokeDasharray="1.5 1.5"
              className="animate-pulse"
            />
            <circle
              cx="35"
              cy="45"
              r="4.5"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="0.8"
              strokeDasharray="1.5 1.5"
            />
            <circle
              cx="22"
              cy="48"
              r="3.8"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="0.8"
              strokeDasharray="1.5 1.5"
            />
            <circle
              cx="32"
              cy="28"
              r="3.2"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="0.8"
              strokeDasharray="1.5 1.5"
            />
          </>
        )}
      </svg>

      {/* Interactive clickable pins if lesions list provided */}
      {showLesionMarkers && lesions && lesions.length > 0 && (
        <div className="absolute inset-0 pointer-events-auto">
          {lesions.map((lesion) => {
            const isSelected = selectedLesionId === lesion.id;
            return (
              <button
                key={lesion.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectLesion?.(isSelected ? null : lesion);
                }}
                style={{ left: `${lesion.x}%`, top: `${lesion.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 p-1 rounded-full group cursor-pointer transition-transform ${
                  isSelected ? 'scale-125 z-20' : 'hover:scale-110 z-10'
                }`}
                title={`${lesion.label} (${lesion.confidence}%)`}
              >
                <span className="relative flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600 border-2 border-white shadow-xs items-center justify-center text-[8px] font-bold text-white">
                    !
                  </span>
                </span>

                {/* Pin Tooltip */}
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-slate-900/90 text-white text-[10px] font-medium px-2 py-0.5 rounded shadow-lg whitespace-nowrap z-30 pointer-events-none">
                  {lesion.label} ({lesion.confidence}%)
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
