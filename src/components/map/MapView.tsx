import { useMemo, useState } from 'react';
import { Purpose, SelectedPlace, Place } from '@/types';
import { Button } from '@/components/ui/button';

interface MapViewProps {
  addedPlaces: Place[];
  selectedPlaces: SelectedPlace[];
  purposes: Purpose[];
  activePurpose: string | null;
  onPlaceSelect: (place: Place, purposeId: string) => void;
  isPlaceSelected: (placeId: string) => boolean;
  onEditPlaceDetails?: (place: Place) => void;
}

export const MapView = ({ 
  addedPlaces, 
  selectedPlaces, 
  purposes, 
  activePurpose, 
  onPlaceSelect, 
  isPlaceSelected,
  onEditPlaceDetails 
}: MapViewProps) => {
  const [clickedPlace, setClickedPlace] = useState<Place | null>(null);

  // 방문 순서(목적+장소 순서) 그대로 사용
  const sortedPlaces = selectedPlaces;

  const filteredSelectedPlaces = useMemo(() => {
    if (!activePurpose) return selectedPlaces;
    return selectedPlaces.filter(place => place.purposeId === activePurpose);
  }, [selectedPlaces, activePurpose]);

  const getPurposeColor = (purposeId: string) => {
    const purpose = purposes.find(cat => cat.id === purposeId);
    return purpose?.color || '#3b82f6';
  };

  const getPurposeIcon = (purposeId: string) => {
    const purpose = purposes.find(cat => cat.id === purposeId);
    return purpose?.icon || '📍';
  };

  const handleMarkerClick = (place: Place) => {
    setClickedPlace(place);
  };

  const handleSelectPlace = (place: Place) => {
    onPlaceSelect(place, place.purposeId);
    setClickedPlace(null);
  };

  const handleEditDetails = (place: Place) => {
    if (onEditPlaceDetails) {
      onEditPlaceDetails(place);
    }
    setClickedPlace(null);
  };

  const handleCloseInfo = () => {
    setClickedPlace(null);
  };

  const getMarkerOpacity = (purposeId: string) => {
    if (!activePurpose) return 1;
    return activePurpose === purposeId ? 1 : 0.3;
  };

  const isSelectedPlace = (placeId: string) => {
    return selectedPlaces.some(p => p.id === placeId);
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
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
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
            const shouldShow = !activePurpose || 
              (place.purposeId === activePurpose && nextPlace.purposeId === activePurpose);
            
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

      {/* Added Place Markers (not selected) */}
      {addedPlaces.map((place) => {
        const isSelected = isPlaceSelected(place.id);
        if (isSelected) return null;

        return (
          <div
            key={`added-${place.id}`}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-110 cursor-pointer"
            style={{
              left: `${place.x}%`,
              top: `${place.y}%`,
              opacity: getMarkerOpacity(place.purposeId),
            }}
            onClick={() => handleMarkerClick(place)}
          >
            <div
              className="relative flex items-center justify-center w-10 h-10 rounded-full shadow-lg border-2 border-white"
              style={{ backgroundColor: getPurposeColor(place.purposeId) }}
            >
              <span className="text-white text-sm">
                {getPurposeIcon(place.purposeId)}
              </span>
            </div>
          </div>
        );
      })}

      {/* Selected Place Markers */}
      {filteredSelectedPlaces.map((place) => {
        // 전체 방문 순서에서의 index를 찾음
        const visitIndex = sortedPlaces.findIndex(p => p.id === place.id);
        return (
          <div
            key={place.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-110 cursor-pointer"
            style={{
              left: `${place.x}%`,
              top: `${place.y}%`,
            }}
            onClick={() => handleMarkerClick(place)}
          >
            <div
              className="relative flex items-center justify-center w-12 h-12 rounded-full shadow-lg border-4 border-white ring-2 ring-yellow-400"
              style={{ backgroundColor: getPurposeColor(place.purposeId) }}
            >
              <span className="text-white text-lg font-bold">
                {getPurposeIcon(place.purposeId)}
              </span>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                {visitIndex + 1}
              </div>
            </div>

            <div className="absolute top-14 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-3 min-w-48 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
              <h3 className="font-semibold text-gray-800">{place.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{place.description}</p>
              <div className="text-xs text-gray-500 mt-2">
                순서: {place.order + 1}번째 방문
                {place.stayDuration && (
                  <div>체류시간: {place.stayDuration}분</div>
                )}
                {place.openTime && place.closeTime && (
                  <div>영업시간: {place.openTime}-{place.closeTime}</div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Place Info Card */}
      {clickedPlace && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-sm z-20">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-gray-800">{clickedPlace.name}</h3>
            <button
              onClick={handleCloseInfo}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-3">{clickedPlace.description}</p>
          <div className="text-xs text-gray-500 mb-4 space-y-1">
            <div>위치: {clickedPlace.x}%, {clickedPlace.y}%</div>
            {clickedPlace.stayDuration && (
              <div>체류 시간: {clickedPlace.stayDuration}분</div>
            )}
            {clickedPlace.openTime && clickedPlace.closeTime && (
              <div>영업 시간: {clickedPlace.openTime} - {clickedPlace.closeTime}</div>
            )}
            {clickedPlace.breakTimeStart && clickedPlace.breakTimeEnd && (
              <div>브레이크 타임: {clickedPlace.breakTimeStart} - {clickedPlace.breakTimeEnd}</div>
            )}
            {clickedPlace.closedDays && clickedPlace.closedDays.length > 0 && (
              <div>휴무일: {clickedPlace.closedDays.join(', ')}</div>
            )}
          </div>
          
          <div className="space-y-2">
            {!isSelectedPlace(clickedPlace.id) ? (
              <Button
                onClick={() => handleSelectPlace(clickedPlace)}
                className="w-full"
                size="sm"
              >
                이 장소 선택하기
              </Button>
            ) : (
              <Button
                onClick={() => handleEditDetails(clickedPlace)}
                variant="outline"
                className="w-full"
                size="sm"
              >
                상세 정보 수정
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
        <h3 className="font-semibold text-gray-800 mb-2">범례</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>동선 (방문 순서)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full ring-1 ring-yellow-400"></div>
            <span>선택된 장소</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span>추가된 장소</span>
          </div>
        </div>
      </div>
    </div>
  );
};
