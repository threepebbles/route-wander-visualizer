
import { useState } from 'react';
import { SelectedPlace } from '@/types';
import { Button } from '@/components/ui/button';
import { Trash2, GripVertical, Clock, Navigation } from 'lucide-react';

interface RouteListProps {
  places: SelectedPlace[];
  onReorder: (places: SelectedPlace[]) => void;
  onRemove: (placeId: string) => void;
  onClearAll: () => void;
}

export const RouteList = ({
  places,
  onReorder,
  onRemove,
  onClearAll,
}: RouteListProps) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newPlaces = [...places];
    const draggedPlace = newPlaces[draggedIndex];
    
    // Remove dragged item
    newPlaces.splice(draggedIndex, 1);
    
    // Insert at new position
    newPlaces.splice(dropIndex, 0, draggedPlace);
    
    // Update order
    const reorderedPlaces = newPlaces.map((place, index) => ({
      ...place,
      order: index,
    }));
    
    onReorder(reorderedPlaces);
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">방문 순서</h2>
        {places.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearAll}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            전체 삭제
          </Button>
        )}
      </div>

      {places.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <p className="text-sm">아직 선택된 장소가 없습니다.</p>
          <p className="text-sm mt-1">장소를 선택해서 동선을 만들어보세요!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {places.map((place, index) => (
            <div key={place.id}>
              <div
                className="bg-white rounded-lg p-4 border-2 border-blue-200 transition-all duration-200 hover:shadow-md cursor-move"
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold bg-blue-500">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{place.name}</h3>
                    <p className="text-sm text-gray-600">{place.address}</p>
                    {place.stayDuration && (
                      <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        체류시간: {place.stayDuration}분
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(place.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* 이동 정보 표시 (마지막 장소가 아닌 경우) */}
              {index < places.length - 1 && (
                <div className="flex items-center justify-center py-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                    <Navigation className="w-3 h-3" />
                    <span>이동시간: 30분</span>
                    <span>•</span>
                    <span>거리: 100m</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {places.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-800">
            <strong>총 {places.length}개 장소</strong>
          </div>
          <div className="text-xs text-blue-600 mt-1">
            위 순서대로 방문하게 됩니다. 드래그해서 순서를 변경할 수 있어요!
          </div>
        </div>
      )}
    </div>
  );
};
