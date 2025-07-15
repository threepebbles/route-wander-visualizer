
import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Place } from '@/types';
import { Search } from 'lucide-react';

interface PlaceSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlace: (place: Place) => void;
}

const PREDEFINED_PLACES: Place[] = [
  // 음식점 카테고리용
  { id: '1', name: '맛있는 파스타', address: '서울시 강남구 테헤란로 123', x: 20, y: 30 },
  { id: '2', name: '전통 한정식', address: '서울시 중구 명동길 456', x: 60, y: 20 },
  { id: '3', name: '스시 오마카세', address: '서울시 서초구 서초대로 789', x: 40, y: 70 },
  { id: '4', name: '브런치 카페', address: '서울시 마포구 홍대입구역 101', x: 80, y: 50 },
  
  // 카페 카테고리용
  { id: '5', name: '아늑한 서재', address: '서울시 성북구 안암로 111', x: 30, y: 40 },
  { id: '6', name: '루프탑 카페', address: '서울시 용산구 이태원로 222', x: 70, y: 30 },
  { id: '7', name: '디저트 하우스', address: '서울시 송파구 올림픽로 333', x: 50, y: 60 },
  
  // 관광지 카테고리용
  { id: '8', name: '역사 박물관', address: '서울시 종로구 세종대로 444', x: 25, y: 55 },
  { id: '9', name: '예술 갤러리', address: '서울시 강서구 화곡로 555', x: 65, y: 45 },
  { id: '10', name: '전망대', address: '서울시 중랑구 망우로 666', x: 45, y: 25 },
  { id: '11', name: '공원', address: '서울시 동작구 사당로 777', x: 75, y: 65 },
  
  // 쇼핑 카테고리용
  { id: '12', name: '대형 백화점', address: '서울시 영등포구 여의대로 888', x: 55, y: 35 },
  { id: '13', name: '전통 시장', address: '서울시 동대문구 청계천로 999', x: 35, y: 65 },
  { id: '14', name: '아울렛', address: '서울시 구로구 디지털로 000', x: 85, y: 40 },
  
  // 병원/약국 카테고리용
  { id: '15', name: '종합병원', address: '서울시 서대문구 연세로 111', x: 40, y: 45 },
  { id: '16', name: '동네 약국', address: '서울시 은평구 은평로 222', x: 60, y: 55 },
  
  // 주유소 카테고리용
  { id: '17', name: 'GS25 주유소', address: '서울시 노원구 노원로 333', x: 20, y: 70 },
  { id: '18', name: '셀프 주유소', address: '서울시 도봉구 도봉로 444', x: 80, y: 25 },
];

export const PlaceSelectionModal = ({
  isOpen,
  onClose,
  onSelectPlace,
}: PlaceSelectionModalProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPlaces = useMemo(() => {
    return PREDEFINED_PLACES.filter(place => {
      const matchesSearch = place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          place.address.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [searchTerm]);

  const handlePlaceClick = (place: Place) => {
    onSelectPlace(place);
    handleClose();
  };

  const handleClose = () => {
    setSearchTerm('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>장소 선택</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="장소명 또는 주소로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

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
                    <p className="text-sm text-gray-600 mt-1">{place.address}</p>
                    <div className="text-xs text-gray-500 mt-2">
                      위치: {place.x}%, {place.y}%
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handlePlaceClick(place)}
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
