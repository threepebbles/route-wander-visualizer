
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { Routie, SelectedPlace } from '@/types';

interface RoutieCreatorProps {
  selectedPlaces: SelectedPlace[];
  onSaveRoutie: (routie: Omit<Routie, 'id' | 'createdAt'>) => void;
}

export const RoutieCreator = ({ selectedPlaces, onSaveRoutie }: RoutieCreatorProps) => {
  const [routieName, setRoutieName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleSave = () => {
    if (!routieName.trim() || !startTime || !endTime) {
      alert('루티 이름과 시작/종료 시간을 모두 입력해주세요.');
      return;
    }

    if (selectedPlaces.length === 0) {
      alert('최소 한 개의 장소를 선택해주세요.');
      return;
    }

    onSaveRoutie({
      name: routieName.trim(),
      startTime,
      endTime,
      selectedPlaces: [...selectedPlaces],
    });

    // 폼 초기화
    setRoutieName('');
    setStartTime('');
    setEndTime('');
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">루티 생성</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="routieName">루티 이름</Label>
          <Input
            id="routieName"
            placeholder="예: 강남 맛집 투어"
            value={routieName}
            onChange={(e) => setRoutieName(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startTime">시작 시간</Label>
            <Input
              id="startTime"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="endTime">종료 시간</Label>
            <Input
              id="endTime"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>

        <div className="text-sm text-gray-600">
          선택된 장소: {selectedPlaces.length}개
        </div>

        <Button 
          onClick={handleSave} 
          className="w-full"
          disabled={!routieName.trim() || !startTime || !endTime || selectedPlaces.length === 0}
        >
          <Save className="w-4 h-4 mr-2" />
          이 루티 저장하기
        </Button>
      </CardContent>
    </Card>
  );
};
