
import { Purpose } from '@/types';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

interface PurposeSidebarProps {
  purposes: Purpose[];
  activePurpose: string | null;
  onPurposeSelect: (purposeId: string | null) => void;
  onPlaceSelect: (purposeId: string) => void;
}

export const PurposeSidebar = ({
  purposes,
  activePurpose,
  onPurposeSelect,
  onPlaceSelect,
}: PurposeSidebarProps) => {
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
        
        {purposes.map((purpose) => (
          <div key={purpose.id} className="flex gap-2">
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
        ))}
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
