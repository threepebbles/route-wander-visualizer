
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapView } from '@/components/map/MapView';
import { PlaceManager } from '@/components/place/PlaceManager';
import { RouteList } from '@/components/route/RouteList';
import { PlaceDetailModal } from '@/components/place/PlaceDetailModal';
import { ScheduleValidator } from '@/components/schedule/ScheduleValidator';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Clock } from 'lucide-react';
import { Place, SelectedPlace } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { TimeInput } from '@/components/ui/time-input';

const Planner = () => {
  const navigate = useNavigate();
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<SelectedPlace[]>([]);
  const [showPlaceDetailModal, setShowPlaceDetailModal] = useState(false);
  const [routieStartTime, setRoutieStartTime] = useState('');
  const [routieEndTime, setRoutieEndTime] = useState('');
  const [scheduleValidationEnabled, setScheduleValidationEnabled] = useState(false);
  const [placeForDetailEdit, setPlaceForDetailEdit] = useState<Place | null>(null);
  const { toast } = useToast();

  const handleAddPlace = (place: Omit<Place, 'id'>) => {
    const newPlace: Place = {
      ...place,
      id: Date.now().toString(),
    };
    setPlaces([...places, newPlace]);
    toast({
      title: "장소가 추가되었습니다!",
      description: `"${newPlace.name}"이 등록되었습니다.`,
    });
  };

  const handleSelectPlace = (place: Place) => {
    const isAlreadySelected = selectedPlaces.some(p => p.id === place.id);
    if (isAlreadySelected) {
      toast({
        title: "이미 선택된 장소입니다",
        description: `"${place.name}"은 이미 동선에 포함되어 있습니다.`,
        variant: "destructive",
      });
      return;
    }

    const selectedPlace: SelectedPlace = {
      ...place,
      order: selectedPlaces.length,
    };
    setSelectedPlaces(prev => [...prev, selectedPlace]);
    
    toast({
      title: "장소가 선택되었습니다!",
      description: `"${place.name}"이 동선에 추가되었습니다.`,
    });
  };

  const handleReorderPlaces = (reorderedPlaces: SelectedPlace[]) => {
    setSelectedPlaces(reorderedPlaces);
  };

  const handleRemovePlace = (placeId: string) => {
    const place = selectedPlaces.find(p => p.id === placeId);
    setSelectedPlaces(prev => 
      prev.filter(p => p.id !== placeId)
        .map((p, index) => ({ ...p, order: index }))
    );
    
    if (place) {
      toast({
        title: "장소가 제거되었습니다",
        description: `"${place.name}"이 동선에서 제거되었습니다.`,
      });
    }
  };

  const handleClearAll = () => {
    setSelectedPlaces([]);
    toast({
      title: "모든 장소가 제거되었습니다",
      description: "동선이 초기화되었습니다.",
    });
  };

  const handleDeletePlace = (placeId: string) => {
    const place = places.find(p => p.id === placeId);
    
    // 선택된 장소에서도 제거
    setSelectedPlaces(prev => 
      prev.filter(p => p.id !== placeId)
        .map((p, index) => ({ ...p, order: index }))
    );
    
    // 전체 장소 목록에서 제거
    setPlaces(prev => prev.filter(p => p.id !== placeId));
    
    if (place) {
      toast({
        title: "장소가 삭제되었습니다",
        description: `"${place.name}"이 완전히 삭제되었습니다.`,
      });
    }
  };

  const handleEditPlaceDetails = (place: Place) => {
    setPlaceForDetailEdit(place);
    setShowPlaceDetailModal(true);
  };

  const handleUpdatePlace = (updatedPlace: Place) => {
    // Update in places
    setPlaces(prev => 
      prev.map(place => place.id === updatedPlace.id ? updatedPlace : place)
    );
    
    // Update in selectedPlaces
    setSelectedPlaces(prev => 
      prev.map(place => place.id === updatedPlace.id ? { ...place, ...updatedPlace } : place)
    );

    toast({
      title: "장소 정보가 업데이트되었습니다!",
      description: `"${updatedPlace.name}"의 상세 정보가 수정되었습니다.`,
    });
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const orderedPlaces = selectedPlaces.sort((a, b) => a.order - b.order);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-lg flex flex-col overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGoHome}
                className="p-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h1 className="text-2xl font-bold text-gray-800">루티 계획</h1>
            </div>
          </div>

          {/* Schedule Validation Toggle */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="schedule-validation"
                checked={scheduleValidationEnabled}
                onCheckedChange={setScheduleValidationEnabled}
              />
              <Label htmlFor="schedule-validation" className="text-sm font-medium">
                일정 검증 표시
              </Label>
            </div>
          </div>

          {/* Time Input Card */}
          {scheduleValidationEnabled && (
            <Card className="mb-4">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <Label className="text-sm font-medium">일정 시간</Label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="start-time" className="text-xs text-muted-foreground">
                      시작 시간
                    </Label>
                    <TimeInput
                      value={routieStartTime}
                      onChange={setRoutieStartTime}
                      placeholder="시작 시간"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-time" className="text-xs text-muted-foreground">
                      종료 시간
                    </Label>
                    <TimeInput
                      value={routieEndTime}
                      onChange={setRoutieEndTime}
                      placeholder="종료 시간"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Place Manager */}
        <div className="p-4 border-b">
          <PlaceManager
            places={places}
            onAddPlace={handleAddPlace}
            onUpdatePlace={handleUpdatePlace}
            onDeletePlace={handleDeletePlace}
            onSelectPlace={handleSelectPlace}
            selectedPlaces={selectedPlaces}
          />
        </div>

        {/* Route List and Schedule Validation */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <RouteList
            places={orderedPlaces}
            onReorder={handleReorderPlaces}
            onRemove={handleRemovePlace}
            onClearAll={handleClearAll}
          />

          {scheduleValidationEnabled && (
            <ScheduleValidator
              selectedPlaces={orderedPlaces}
              startTime={routieStartTime}
              endTime={routieEndTime}
            />
          )}
        </div>
      </div>

      {/* Main Map Area */}
      <div className="flex-1">
        <MapView
          places={places}
          selectedPlaces={orderedPlaces}
          onPlaceSelect={handleSelectPlace}
          onEditPlaceDetails={handleEditPlaceDetails}
        />
      </div>

      {/* Place Detail Modal */}
      <PlaceDetailModal
        isOpen={showPlaceDetailModal}
        onClose={() => setShowPlaceDetailModal(false)}
        place={placeForDetailEdit}
        onUpdatePlace={handleUpdatePlace}
      />
    </div>
  );
};

export default Planner;
