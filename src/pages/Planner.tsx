import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapView } from '@/components/map/MapView';
import { PurposeSidebar } from '@/components/sidebar/PurposeSidebar';
import { RouteList } from '@/components/route/RouteList';
import { PlaceSelectionModal } from '@/components/place/PlaceSelectionModal';
import { PlaceDetailModal } from '@/components/place/PlaceDetailModal';
import { CategoryModal } from '@/components/category/CategoryModal';
import { ScheduleValidator } from '@/components/schedule/ScheduleValidator';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, ArrowLeft, Clock } from 'lucide-react';
import { Purpose, Place, SelectedPlace, PurposeSelection } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { TimeInput } from '@/components/ui/time-input';

const Planner = () => {
  const navigate = useNavigate();
  const [purposes, setPurposes] = useState<Purpose[]>([]);
  const [addedPlaces, setAddedPlaces] = useState<Place[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<SelectedPlace[]>([]);
  const [activePurpose, setActivePurpose] = useState<string | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showPlaceModal, setShowPlaceModal] = useState(false);
  const [showPlaceDetailModal, setShowPlaceDetailModal] = useState(false);
  const [selectedPurposeForPlaces, setSelectedPurposeForPlaces] = useState<string | null>(null);
  const [purposeSelections, setPurposeSelections] = useState<PurposeSelection[]>([]);
  const [routeStartTime, setRouteStartTime] = useState('');
  const [routeEndTime, setRouteEndTime] = useState('');
  const [scheduleValidationEnabled, setScheduleValidationEnabled] = useState(false);
  const [placeForDetailEdit, setPlaceForDetailEdit] = useState<Place | null>(null);
  const { toast } = useToast();

  const handleAddPurpose = (purpose: Omit<Purpose, 'id'>) => {
    const newPurpose: Purpose = {
      ...purpose,
      id: Date.now().toString(),
    };
    setPurposes([...purposes, newPurpose]);
  };

  const handleAddPlace = (place: Place, purposeId: string) => {
    const placeWithPurpose = { ...place, purposeId };
    
    setAddedPlaces(prev => [...prev, placeWithPurpose]);
    setShowPlaceModal(false);
  };

  const handleSelectPlace = (place: Place, purposeId: string) => {
    const existingSelection = purposeSelections.find(sel => sel.purposeId === purposeId);
    let newSelections = purposeSelections;
    
    if (existingSelection) {
      newSelections = purposeSelections.filter(sel => sel.purposeId !== purposeId);
      setSelectedPlaces(prev => prev.filter(p => p.id !== existingSelection.placeId));
    }

    const newSelection: PurposeSelection = {
      purposeId,
      placeId: place.id
    };
    setPurposeSelections([...newSelections, newSelection]);

    const selectedPlace: SelectedPlace = {
      ...place,
      purposeId,
      categoryId: purposeId, // For backward compatibility
      order: selectedPlaces.length,
    };
    setSelectedPlaces(prev => [...prev, selectedPlace]);
  };

  const handleReorderPlaces = (reorderedPlaces: SelectedPlace[]) => {
    const updatedPlaces = reorderedPlaces.map((place, index) => ({
      ...place,
      order: index,
    }));
    setSelectedPlaces(updatedPlaces);
  };

  const handleRemovePlace = (placeId: string) => {
    const placeToRemove = selectedPlaces.find(p => p.id === placeId);
    if (placeToRemove) {
      setPurposeSelections(prev => 
        prev.filter(sel => sel.placeId !== placeId)
      );
    }
    setSelectedPlaces(selectedPlaces.filter(place => place.id !== placeId));
  };

  const handleClearAll = () => {
    setSelectedPlaces([]);
    setPurposeSelections([]);
  };

  const openPlaceSelection = (purposeId: string) => {
    setSelectedPurposeForPlaces(purposeId);
    setShowPlaceModal(true);
  };

  const isPlaceSelected = (placeId: string) => {
    return purposeSelections.some(sel => sel.placeId === placeId);
  };

  const handleEditPlaceDetails = (place: Place) => {
    setPlaceForDetailEdit(place);
    setShowPlaceDetailModal(true);
  };

  const handleUpdatePlace = (updatedPlace: Place) => {
    // Update in addedPlaces
    setAddedPlaces(prev => 
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

  const handlePurposeReorder = (newPurposes: Purpose[]) => {
    setPurposes(newPurposes);
  };

  const orderedPlaces = purposes.flatMap(purpose =>
    selectedPlaces.filter(place => place.purposeId === purpose.id)
  );

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
              <h1 className="text-2xl font-bold text-gray-800">동선 계획</h1>
            </div>
            <Button
              onClick={() => setShowCategoryModal(true)}
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              목적 추가
            </Button>
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
                      value={routeStartTime}
                      onChange={setRouteStartTime}
                      placeholder="시작 시간"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-time" className="text-xs text-muted-foreground">
                      종료 시간
                    </Label>
                    <TimeInput
                      value={routeEndTime}
                      onChange={setRouteEndTime}
                      placeholder="종료 시간"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <PurposeSidebar
          purposes={purposes}
          activePurpose={activePurpose}
          onPurposeSelect={setActivePurpose}
          onPlaceSelect={openPlaceSelection}
          onPurposeReorder={handlePurposeReorder}
        />

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <RouteList
            places={orderedPlaces}
            purposes={purposes}
            onReorder={() => {}} // 드래그 비활성화
            onRemove={handleRemovePlace}
            onClearAll={handleClearAll}
          />

          {scheduleValidationEnabled && (
            <ScheduleValidator
              selectedPlaces={orderedPlaces}
              startTime={routeStartTime}
              endTime={routeEndTime}
            />
          )}
        </div>
      </div>

      {/* Main Map Area */}
      <div className="flex-1">
        <MapView
          addedPlaces={addedPlaces}
          selectedPlaces={orderedPlaces}
          purposes={purposes}
          activePurpose={activePurpose}
          onPlaceSelect={handleSelectPlace}
          isPlaceSelected={isPlaceSelected}
          onEditPlaceDetails={handleEditPlaceDetails}
        />
      </div>

      {/* Modals */}
      <CategoryModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onAdd={handleAddPurpose}
      />

      <PlaceSelectionModal
        isOpen={showPlaceModal}
        onClose={() => setShowPlaceModal(false)}
        purposeId={selectedPurposeForPlaces}
        onSelectPlace={handleAddPlace}
      />

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
