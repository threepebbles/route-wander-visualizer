
import { useMemo } from 'react';
import { Category, SelectedPlace } from '@/types';

interface MapViewProps {
  places: SelectedPlace[];
  categories: Category[];
  activeCategory: string | null;
}

export const MapView = ({ places, categories, activeCategory }: MapViewProps) => {
  const sortedPlaces = useMemo(() => {
    return [...places].sort((a, b) => a.order - b.order);
  }, [places]);

  const filteredPlaces = useMemo(() => {
    if (!activeCategory) return sortedPlaces;
    return sortedPlaces.filter(place => place.categoryId === activeCategory);
  }, [sortedPlaces, activeCategory]);

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.color || '#3b82f6';
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.icon || '📍';
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-green-50 overflow-hidden">
      {/* Background Map Image */}
      <div className="absolute inset-0 opacity-20">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 800 600"
          className="w-full h-full"
        >
          {/* Simple map-like background */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Decorative roads/paths */}
          <path
            d="M 100 100 Q 200 150 300 120 T 500 140 T 700 160"
            stroke="#d1d5db"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 50 300 Q 150 280 250 300 T 450 320 T 650 300"
            stroke="#d1d5db"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 200 450 Q 300 420 400 450 T 600 470"
            stroke="#d1d5db"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Route Lines */}
      {sortedPlaces.length > 1 && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="#ef4444"
              />
            </marker>
          </defs>
          {sortedPlaces.map((place, index) => {
            if (index === sortedPlaces.length - 1) return null;
            const nextPlace = sortedPlaces[index + 1];
            const shouldShow = !activeCategory || 
              (place.categoryId === activeCategory && nextPlace.categoryId === activeCategory);
            
            if (!shouldShow) return null;

            return (
              <line
                key={`line-${place.id}-${nextPlace.id}`}
                x1={`${place.x}%`}
                y1={`${place.y}%`}
                x2={`${nextPlace.x}%`}
                y2={`${nextPlace.y}%`}
                stroke="#ef4444"
                strokeWidth="3"
                strokeDasharray="8,4"
                markerEnd="url(#arrowhead)"
                className="animate-pulse"
              />
            );
          })}
        </svg>
      )}

      {/* Place Markers */}
      {filteredPlaces.map((place, index) => (
        <div
          key={place.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-110"
          style={{
            left: `${place.x}%`,
            top: `${place.y}%`,
          }}
        >
          {/* Marker */}
          <div
            className="relative flex items-center justify-center w-12 h-12 rounded-full shadow-lg cursor-pointer border-4 border-white"
            style={{ backgroundColor: getCategoryColor(place.categoryId) }}
          >
            <span className="text-white text-lg font-bold">
              {getCategoryIcon(place.categoryId)}
            </span>
            
            {/* Order number */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
              {place.order + 1}
            </div>
          </div>

          {/* Info tooltip */}
          <div className="absolute top-14 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-3 min-w-48 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
            <h3 className="font-semibold text-gray-800">{place.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{place.description}</p>
            <div className="text-xs text-gray-500 mt-2">
              순서: {place.order + 1}번째 방문
            </div>
          </div>
        </div>
      ))}

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
        <h3 className="font-semibold text-gray-800 mb-2">범례</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>동선 (방문 순서)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span>마커 (선택된 장소)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
