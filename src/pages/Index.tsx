
import { useState } from 'react';
import { MapView } from '@/components/map/MapView';
import { RouteList } from '@/components/route/RouteList';
import { PlaceManager } from '@/components/place/PlaceManager';
import { RoutieCreator } from '@/components/routie/RoutieCreator';
import { ScheduleValidator } from '@/components/schedule/ScheduleValidator';
import { PlaceDetailModal } from '@/components/place/PlaceDetailModal';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Place, SelectedPlace } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<SelectedPlace[]>([]);
  const [showPlaceDetailModal, setShowPlaceDetailModal] = useState(false);
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
    const updatedPlaces = reorderedPlaces.map((place, index) => ({
      ...place,
      order: index,
    }));
    setSelectedPlaces(updatedPlaces);
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

  const handleEditPlaceDetails = (place: Place) => {
    setPlaceForDetailEdit(place);
    setShowPlaceDetailModal(true);
  };

  const handleSaveRoutie = (routieData: Omit<Routie, 'id' | 'createdAt'>) => {
    const newRoutie = {
      ...routieData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    
    console.log('루티 저장됨:', newRoutie);
    
    toast({
      title: "루티가 저장되었습니다!",
      description: `"${newRoutie.name}" 루티가 성공적으로 생성되었습니다.`,
    });
  };

  const handleGoToPlanner = () => {
    navigate('/planner');
  };

  const orderedPlaces = selectedPlaces.sort((a, b) => a.order - b.order);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-lg flex flex-col overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">동선 플래너</h1>
            <Button
              onClick={handleGoToPlanner}
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              새 플래너로
            </Button>
          </div>
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

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <RouteList
            places={orderedPlaces}
            onReorder={handleReorderPlaces}
            onRemove={handleRemovePlace}
            onClearAll={handleClearAll}
          />

          <ScheduleValidator
            selectedPlaces={orderedPlaces}
            startTime=""
            endTime=""
          />

          <RoutieCreator
            selectedPlaces={orderedPlaces}
            onSaveRoutie={handleSaveRoutie}
          />
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

export default Index;
