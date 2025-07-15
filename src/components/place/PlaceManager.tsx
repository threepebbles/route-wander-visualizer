
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, MapPin, Edit, Trash2 } from 'lucide-react';
import { Place } from '@/types';

interface PlaceManagerProps {
  places: Place[];
  onAddPlace: (place: Omit<Place, 'id'>) => void;
  onUpdatePlace: (updatedPlace: Place) => void;
  onDeletePlace: (placeId: string) => void;
  onSelectPlace: (place: Place) => void;
  selectedPlaces: Place[];
}

export const PlaceManager = ({
  places,
  onAddPlace,
  onUpdatePlace,
  onDeletePlace,
  onSelectPlace,
  selectedPlaces,
}: PlaceManagerProps) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPlace, setNewPlace] = useState({
    name: '',
    address: '',
    x: 50,
    y: 50,
  });

  const handleAddPlace = () => {
    if (!newPlace.name.trim() || !newPlace.address.trim()) return;
    
    onAddPlace({
      ...newPlace,
      x: Math.random() * 80 + 10, // 10-90% 범위에서 랜덤 위치
      y: Math.random() * 80 + 10,
    });
    
    setNewPlace({ name: '', address: '', x: 50, y: 50 });
    setIsAddModalOpen(false);
  };

  const isPlaceSelected = (placeId: string) => {
    return selectedPlaces.some(p => p.id === placeId);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            장소 관리
          </CardTitle>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                장소 추가
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>새 장소 추가</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="place-name">장소명 *</Label>
                  <Input
                    id="place-name"
                    placeholder="장소 이름을 입력하세요"
                    value={newPlace.name}
                    onChange={(e) => setNewPlace(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="place-address">주소 *</Label>
                  <Input
                    id="place-address"
                    placeholder="주소를 입력하세요"
                    value={newPlace.address}
                    onChange={(e) => setNewPlace(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1"
                  >
                    취소
                  </Button>
                  <Button
                    onClick={handleAddPlace}
                    className="flex-1"
                    disabled={!newPlace.name.trim() || !newPlace.address.trim()}
                  >
                    추가
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {places.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-sm">등록된 장소가 없습니다.</p>
            <p className="text-sm mt-1">새 장소를 추가해보세요!</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {places.map((place) => (
              <div
                key={place.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{place.name}</h3>
                  <p className="text-sm text-gray-600">{place.address}</p>
                  <div className="text-xs text-gray-500 mt-1">
                    {place.stayDuration && `체류시간: ${place.stayDuration}분`}
                    {place.openTime && place.closeTime && ` • 영업: ${place.openTime}-${place.closeTime}`}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!isPlaceSelected(place.id) ? (
                    <Button
                      size="sm"
                      onClick={() => onSelectPlace(place)}
                    >
                      선택
                    </Button>
                  ) : (
                    <div className="text-xs text-green-600 font-medium px-2 py-1 bg-green-50 rounded">
                      선택됨
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeletePlace(place.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
