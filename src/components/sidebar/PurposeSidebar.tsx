
import { Purpose } from '@/types';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { useState } from 'react';

interface PurposeSidebarProps {
  purposes: Purpose[];
  activePurpose: string | null;
  onPurposeSelect: (purposeId: string | null) => void;
  onPlaceSelect: (purposeId: string) => void;
  onPurposeReorder?: (newPurposes: Purpose[]) => void;
}

export const PurposeSidebar = ({
  purposes,
  activePurpose,
  onPurposeSelect,
  onPlaceSelect,
  onPurposeReorder,
}: PurposeSidebarProps) => {
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
    const newPurposes = [...purposes];
    const draggedPurpose = newPurposes[draggedIndex];
    newPurposes.splice(draggedIndex, 1);
    newPurposes.splice(dropIndex, 0, draggedPurpose);
    if (onPurposeReorder) onPurposeReorder(newPurposes);
    setDraggedIndex(null);
  };

  return (
    <div className="p-4 border-b bg-gray-50">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">목적</h2>
      
      <div className="space-y-2">
        <Button
          variant={activePurpose === null ? "default" : "outline"}
          onClick={() => onPurposeSelect(null)}
          className="w-full justify-start"
        >
          전체 보기
        </Button>
        {/* Ensure each map returns a single <div> as ReactNode */}
        {purposes.map((purpose, index) => {
          return (
            <div
              key={purpose.id}
              className={`flex gap-2 ${draggedIndex === index ? 'opacity-50 scale-95' : ''}`}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
            >
              <Button
                variant={activePurpose === purpose.id ? "default" : "outline"}
                onClick={() => onPurposeSelect(purpose.id)}
                className="flex-1 justify-start"
                style={{
                  backgroundColor: activePurpose === purpose.id ? purpose.color : undefined,
                  borderColor: purpose.color,
                }}
              >
                <span className="mr-2">{purpose.icon}</span>
                {purpose.name}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onPlaceSelect(purpose.id)}
                className="px-3"
              >
                <MapPin className="w-4 h-4" />
              </Button>
            </div>
          );
        })}
      </div>
      
      {purposes.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <p className="text-sm">목적을 추가해서</p>
          <p className="text-sm">장소를 선택해보세요!</p>
        </div>
      )}
    </div>
  );
};
