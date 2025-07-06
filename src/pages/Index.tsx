
import { useState } from 'react';
import { MapView } from '@/components/map/MapView';
import { CategorySidebar } from '@/components/sidebar/CategorySidebar';
import { RouteList } from '@/components/route/RouteList';
import { PlaceSelectionModal } from '@/components/place/PlaceSelectionModal';
import { CategoryModal } from '@/components/category/CategoryModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Category, Place, SelectedPlace, CategorySelection } from '@/types';

const Index = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [addedPlaces, setAddedPlaces] = useState<Place[]>([]); // 추가된 모든 장소들
  const [selectedPlaces, setSelectedPlaces] = useState<SelectedPlace[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showPlaceModal, setShowPlaceModal] = useState(false);
  const [selectedCategoryForPlaces, setSelectedCategoryForPlaces] = useState<string | null>(null);
  const [categorySelections, setCategorySelections] = useState<CategorySelection[]>([]);

  const handleAddCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
    };
    setCategories([...categories, newCategory]);
  };

  // 카테고리에 장소 추가 (여러 개 가능)
  const handleAddPlace = (place: Place, categoryId: string) => {
    const placeWithCategory = { ...place, categoryId };
    
    // 이미 추가된 장소인지 확인
    const isAlreadyAdded = addedPlaces.some(p => p.id === place.id && p.categoryId === categoryId);
    if (!isAlreadyAdded) {
      setAddedPlaces(prev => [...prev, placeWithCategory]);
    }
    setShowPlaceModal(false);
  };

  // 카테고리에서 장소 선택 (하나만 가능)
  const handleSelectPlace = (place: Place, categoryId: string) => {
    // 기존 선택된 장소가 있으면 제거
    const existingSelection = categorySelections.find(sel => sel.categoryId === categoryId);
    let newSelections = categorySelections;
    
    if (existingSelection) {
      newSelections = categorySelections.filter(sel => sel.categoryId !== categoryId);
      setSelectedPlaces(prev => prev.filter(p => p.id !== existingSelection.placeId));
    }

    // 새로운 선택 추가
    const newSelection: CategorySelection = {
      categoryId,
      placeId: place.id
    };
    setCategorySelections([...newSelections, newSelection]);

    const selectedPlace: SelectedPlace = {
      ...place,
      categoryId,
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
      setCategorySelections(prev => 
        prev.filter(sel => sel.placeId !== placeId)
      );
    }
    setSelectedPlaces(selectedPlaces.filter(place => place.id !== placeId));
  };

  const handleClearAll = () => {
    setSelectedPlaces([]);
    setCategorySelections([]);
  };

  const openPlaceSelection = (categoryId: string) => {
    setSelectedCategoryForPlaces(categoryId);
    setShowPlaceModal(true);
  };

  const isPlaceSelected = (placeId: string) => {
    return categorySelections.some(sel => sel.placeId === placeId);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-lg flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">동선 플래너</h1>
            <Button
              onClick={() => setShowCategoryModal(true)}
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              카테고리
            </Button>
          </div>
        </div>

        <CategorySidebar
          categories={categories}
          activeCategory={activeCategory}
          onCategorySelect={setActiveCategory}
          onPlaceSelect={openPlaceSelection}
        />

        <div className="flex-1 overflow-hidden">
          <RouteList
            places={selectedPlaces}
            categories={categories}
            onReorder={handleReorderPlaces}
            onRemove={handleRemovePlace}
            onClearAll={handleClearAll}
          />
        </div>
      </div>

      {/* Main Map Area */}
      <div className="flex-1">
        <MapView
          addedPlaces={addedPlaces}
          selectedPlaces={selectedPlaces}
          categories={categories}
          activeCategory={activeCategory}
          onPlaceSelect={handleSelectPlace}
          isPlaceSelected={isPlaceSelected}
        />
      </div>

      {/* Modals */}
      <CategoryModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onAdd={handleAddCategory}
      />

      <PlaceSelectionModal
        isOpen={showPlaceModal}
        onClose={() => setShowPlaceModal(false)}
        categoryId={selectedCategoryForPlaces}
        onSelectPlace={handleAddPlace}
      />
    </div>
  );
};

export default Index;
