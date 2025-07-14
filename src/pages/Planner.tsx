
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapView } from '@/components/map/MapView';
import { PurposeSidebar } from '@/components/sidebar/PurposeSidebar';
import { RouteList } from '@/components/route/RouteList';
import { PlaceSelectionModal } from '@/components/place/PlaceSelectionModal';
import { CategoryModal } from '@/components/category/CategoryModal';
import { RoutieCreator } from '@/components/routie/RoutieCreator';
import { ScheduleValidator } from '@/components/schedule/ScheduleValidator';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft } from 'lucide-react';
import { Purpose, Place, SelectedPlace, PurposeSelection, Routie } from '@/types';
import { useToast } from '@/hooks/use-toast';

const Planner = () => {
  const navigate = useNavigate();
  const [purposes, setPurposes] = useState<Purpose[]>([]);
  const [addedPlaces, setAddedPlaces] = useState<Place[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<SelectedPlace[]>([]);
  const [activePurpose, setActivePurpose] = useState<string | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showPlaceModal, setShowPlaceModal] = useState(false);
  const [selectedPurposeForPlaces, setSelectedPurposeForPlaces] = useState<string | null>(null);
  const [purposeSelections, setPurposeSelections] = useState<PurposeSelection[]>([]);
  const [routieStartTime, setRoutieStartTime] = useState('');
  const [routieEndTime, setRoutieEndTime] = useState('');
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

  const handleSaveRoutie = (routieData: Omit<Routie, 'id' | 'createdAt'>) => {
    const newRoutie: Routie = {
      ...routieData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    
    // 실제로는 서버에 저장하거나 로컬 스토리지에 저장
    console.log('루티 저장됨:', newRoutie);
    
    toast({
      title: "루티가 저장되었습니다!",
      description: `"${newRoutie.name}" 루티가 성공적으로 생성되었습니다.`,
    });

    // 홈으로 돌아가기
    navigate('/');
  };

  const handleGoHome = () => {
    navigate('/');
  };

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
            <Button
              onClick={() => setShowCategoryModal(true)}
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              목적 추가
            </Button>
          </div>
        </div>

        <PurposeSidebar
          purposes={purposes}
          activePurpose={activePurpose}
          onPurposeSelect={setActivePurpose}
          onPlaceSelect={openPlaceSelection}
        />

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <RouteList
            places={selectedPlaces}
            purposes={purposes}
            onReorder={handleReorderPlaces}
            onRemove={handleRemovePlace}
            onClearAll={handleClearAll}
          />

          <ScheduleValidator
            selectedPlaces={selectedPlaces}
            startTime={routieStartTime}
            endTime={routieEndTime}
          />

          <RoutieCreator
            selectedPlaces={selectedPlaces}
            purposes={purposes}
            onSaveRoutie={handleSaveRoutie}
          />
        </div>
      </div>

      {/* Main Map Area */}
      <div className="flex-1">
        <MapView
          addedPlaces={addedPlaces}
          selectedPlaces={selectedPlaces}
          purposes={purposes}
          activePurpose={activePurpose}
          onPlaceSelect={handleSelectPlace}
          isPlaceSelected={isPlaceSelected}
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
    </div>
  );
};

export default Planner;
