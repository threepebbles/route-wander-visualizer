
import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Place } from '@/types';
import { Search } from 'lucide-react';

interface PlaceSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId: string | null;
  onSelectPlace: (place: Place, categoryId: string) => void;
}

// 미리 정의된 장소 목록 (실제 앱에서는 API나 데이터베이스에서 가져올 데이터)
const PREDEFINED_PLACES: Place[] = [
  // 음식점 카테고리용
  { id: '1', name: '맛있는 파스타', description: '이탈리안 레스토랑', x: 20, y: 30, categoryId: 'food' },
  { id: '2', name: '전통 한정식', description: '한국 전통 요리', x: 60, y: 20, categoryId: 'food' },
  { id: '3', name: '스시 오마카세', description: '고급 일식당', x: 40, y: 70, categoryId: 'food' },
  { id: '4', name: '브런치 카페', description: '아침 식사 전문', x: 80, y: 50, categoryId: 'food' },
  
  // 카페 카테고리용
  { id: '5', name: '아늑한 서재', description: '독서하기 좋은 카페', x: 30, y: 40, categoryId: 'cafe' },
  { id: '6', name: '루프탑 카페', description: '도시 전망이 멋진 곳', x: 70, y: 30, categoryId: 'cafe' },
  { id: '7', name: '디저트 하우스', description: '수제 케이크 전문', x: 50, y: 60, categoryId: 'cafe' },
  
  // 관광지 카테고리용
  { id: '8', name: '역사 박물관', description: '지역 역사를 알 수 있는 곳', x: 25, y: 55, categoryId: 'tourist' },
  { id: '9', name: '예술 갤러리', description: '현대 미술 전시', x: 65, y: 45, categoryId: 'tourist' },
  { id: '10', name: '전망대', description: '시내가 한눈에 보이는 곳', x: 45, y: 25, categoryId: 'tourist' },
  { id: '11', name: '공원', description: '산책하기 좋은 녹지', x: 75, y: 65, categoryId: 'tourist' },
  
  // 쇼핑 카테고리용
  { id: '12', name: '대형 백화점', description: '다양한 브랜드가 있는 곳', x: 55, y: 35, categoryId: 'shopping' },
  { id: '13', name: '전통 시장', description: '지역 특산품을 살 수 있는 곳', x: 35, y: 65, categoryId: 'shopping' },
  { id: '14', name: '아울렛', description: '할인 쇼핑몰', x: 85, y: 40, categoryId: 'shopping' },
  
  // 병원/약국 카테고리용
  { id: '15', name: '종합병원', description: '24시간 응급실 운영', x: 40, y: 45, categoryId: 'medical' },
  { id: '16', name: '동네 약국', description: '처방전 조제', x: 60, y: 55, categoryId: 'medical' },
  
  // 주유소 카테고리용
  { id: '17', name: 'GS25 주유소', description: '편의점 함께 운영', x: 20, y: 70, categoryId: 'gas' },
  { id: '18', name: '셀프 주유소', description: '저렴한 기름값', x: 80, y: 25, categoryId: 'gas' },
];

export const PlaceSelectionModal = ({
  isOpen,
  onClose,
  categoryId,
  onSelectPlace,
}: PlaceSelectionModalProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPlaces = useMemo(() => {
    return PREDEFINED_PLACES.filter(place => {
      const matchesSearch = place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          place.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [searchTerm]);

  const handleSelectPlace = (place: Place) => {
    if (!categoryId) return;
    
    const placeWithCategory = { ...place, categoryId };
    onSelectPlace(placeWithCategory, categoryId);
  };

  const handleClose = () => {
    setSearchTerm('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>장소 선택</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="장소명 또는 설명으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Places List */}
          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredPlaces.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>검색 결과가 없습니다.</p>
                <p className="text-sm mt-1">다른 키워드로 검색해보세요.</p>
              </div>
            ) : (
              filteredPlaces.map((place) => (
                <div
                  key={place.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{place.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{place.description}</p>
                    <div className="text-xs text-gray-500 mt-2">
                      위치: {place.x}%, {place.y}%
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleSelectPlace(place)}
                    size="sm"
                    className="ml-4"
                  >
                    선택
                  </Button>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={handleClose}>
              닫기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
