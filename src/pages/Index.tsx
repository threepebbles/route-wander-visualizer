
import { useState } from 'react';
import { MapView } from '@/components/map/MapView';
import { CategorySidebar } from '@/components/sidebar/CategorySidebar';
import { RouteList } from '@/components/route/RouteList';
import { PlaceSelectionModal } from '@/components/place/PlaceSelectionModal';
import { CategoryModal } from '@/components/category/CategoryModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Category, Place, SelectedPlace } from '@/types';

const Index = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<SelectedPlace[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showPlaceModal, setShowPlaceModal] = useState(false);
  const [selectedCategoryForPlaces, setSelectedCategoryForPlaces] = useState<string | null>(null);

  const handleAddCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
    };
    setCategories([...categories, newCategory]);
  };

  const handleSelectPlace = (place: Place, categoryId: string) => {
    const selectedPlace: SelectedPlace = {
      ...place,
      categoryId,
      order: selectedPlaces.length,
    };
    setSelectedPlaces([...selectedPlaces, selectedPlace]);
    setShowPlaceModal(false);
  };

  const handleReorderPlaces = (reorderedPlaces: SelectedPlace[]) => {
    const updatedPlaces = reorderedPlaces.map((place, index) => ({
      ...place,
      order: index,
    }));
    setSelectedPlaces(updatedPlaces);
  };

  const handleRemovePlace = (placeId: string) => {
    setSelectedPlaces(selectedPlaces.filter(place => place.id !== placeId));
  };

  const handleClearAll = () => {
    setSelectedPlaces([]);
  };

  const openPlaceSelection = (categoryId: string) => {
    setSelectedCategoryForPlaces(categoryId);
    setShowPlaceModal(true);
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
          places={selectedPlaces}
          categories={categories}
          activeCategory={activeCategory}
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
        onSelectPlace={handleSelectPlace}
      />
    </div>
  );
};

export default Index;
