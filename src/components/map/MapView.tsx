
import { useMemo, useState } from 'react';
import { Category, SelectedPlace, Place } from '@/types';
import { Button } from '@/components/ui/button';

// 미리 정의된 장소 목록
const PREDEFINED_PLACES: Place[] = [
  // 음식점 카테고리용
  { id: '1', name: '맛있는 파스타', description: '이탈리안 레스토랑', x: 20, y: 30, categoryId: 'food' },
  { id: '2', name: '전통 한정식', description: '한국 전통 요리', x: 60, y: 20, categoryId: 'food' },
  { id: '3', name: '스시 오마카세', description: '고급 일식당', x: 40, y: 70, categoryId: 'food' },
  { id: '4', name: '브런치 카페', description: '아침 식사 전문', x: 80, y: 50, categoryId: 'food' },
  
  // 카페 카테고리용
  { id: '5', name: '아늑한 서재', description: '독서하기 좋은 카페', x: 30, y: 40, categoryId: 'cafe' },
  { id: '6', name: '루프탑 카페', description: '도시 전망이 멋진 곳', x: 70, y: 30, categoryId: 'cafe' },
  { id: '7', name: '디저트 하우스', description: '수제 케이크 전문', x: 50, y: 60, categoryId: 'cafe' },
  
  // 관광지 카테고리용
  { id: '8', name: '역사 박물관', description: '지역 역사를 알 수 있는 곳', x: 25, y: 55, categoryId: 'tourist' },
  { id: '9', name: '예술 갤러리', description: '현대 미술 전시', x: 65, y: 45, categoryId: 'tourist' },
  { id: '10', name: '전망대', description: '시내가 한눈에 보이는 곳', x: 45, y: 25, categoryId: 'tourist' },
  { id: '11', name: '공원', description: '산책하기 좋은 녹지', x: 75, y: 65, categoryId: 'tourist' },
  
  // 쇼핑 카테고리용
  { id: '12', name: '대형 백화점', description: '다양한 브랜드가 있는 곳', x: 55, y: 35, categoryId: 'shopping' },
  { id: '13', name: '전통 시장', description: '지역 특산품을 살 수 있는 곳', x: 35, y: 65, categoryId: 'shopping' },
  { id: '14', name: '아울렛', description: '할인 쇼핑몰', x: 85, y: 40, categoryId: 'shopping' },
  
  // 병원/약국 카테고리용
  { id: '15', name: '종합병원', description: '24시간 응급실 운영', x: 40, y: 45, categoryId: 'medical' },
  { id: '16', name: '동네 약국', description: '처방전 조제', x: 60, y: 55, categoryId: 'medical' },
  
  // 주유소 카테고리용
  { id: '17', name: 'GS25 주유소', description: '편의점 함께 운영', x: 20, y: 70, categoryId: 'gas' },
  { id: '18', name: '셀프 주유소', description: '저렴한 기름값', x: 80, y: 25, categoryId: 'gas' },
];

interface MapViewProps {
  addedPlaces: Place[];
  selectedPlaces: SelectedPlace[];
  categories: Category[];
  activeCategory: string | null;
  onPlaceSelect: (place: Place, categoryId: string) => void;
  isPlaceSelected: (placeId: string) => boolean;
}

export const MapView = ({ 
  addedPlaces, 
  selectedPlaces, 
  categories, 
  activeCategory, 
  onPlaceSelect, 
  isPlaceSelected 
}: MapViewProps) => {
  const [clickedPlace, setClickedPlace] = useState<Place | null>(null);

  const sortedPlaces = useMemo(() => {
    return [...selectedPlaces].sort((a, b) => a.order - b.order);
  }, [selectedPlaces]);

  const filteredSelectedPlaces = useMemo(() => {
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

  const handleMarkerClick = (place: Place) => {
    setClickedPlace(place);
  };

  const handleSelectPlace = (place: Place) => {
    onPlaceSelect(place, place.categoryId);
    setClickedPlace(null);
  };

  const handleCloseInfo = () => {
    setClickedPlace(null);
  };

  const getMarkerOpacity = (categoryId: string) => {
    if (!activeCategory) return 1;
    return activeCategory === categoryId ? 1 : 0.3;
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
              opacity: getMarkerOpacity(place.categoryId),
            }}
            onClick={() => handleMarkerClick(place)}
          >
            <div
              className="relative flex items-center justify-center w-10 h-10 rounded-full shadow-lg border-2 border-white"
              style={{ backgroundColor: getCategoryColor(place.categoryId) }}
            >
              <span className="text-white text-sm">
                {getCategoryIcon(place.categoryId)}
              </span>
            </div>
          </div>
        );
      })}

      {/* Selected Place Markers */}
      {filteredSelectedPlaces.map((place, index) => (
        <div
          key={place.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-110"
          style={{
            left: `${place.x}%`,
            top: `${place.y}%`,
          }}
        >
          {/* Selected Marker */}
          <div
            className="relative flex items-center justify-center w-12 h-12 rounded-full shadow-lg cursor-pointer border-4 border-white ring-2 ring-yellow-400"
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
          <div className="text-xs text-gray-500 mb-4">
            위치: {clickedPlace.x}%, {clickedPlace.y}%
          </div>
          <Button
            onClick={() => handleSelectPlace(clickedPlace)}
            className="w-full"
            size="sm"
          >
            이 장소 선택하기
          </Button>
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
