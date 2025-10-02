import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { Route, SelectedPlace, Purpose } from '@/types';

interface RouteCreatorProps {
  selectedPlaces: SelectedPlace[];
  purposes: Purpose[];
  onSaveRoute: (route: Omit<Route, 'id' | 'createdAt'>) => void;
}

export const RouteCreator = ({ selectedPlaces, purposes, onSaveRoute }: RouteCreatorProps) => {
  const [routeName, setRouteName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleSave = () => {
    if (!routeName.trim() || !startTime || !endTime) {
      alert('동선 이름과 시작/종료 시간을 모두 입력해주세요.');
      return;
    }

    if (selectedPlaces.length === 0) {
      alert('최소 한 개의 장소를 선택해주세요.');
      return;
    }

    onSaveRoute({
      name: routeName.trim(),
      startTime,
      endTime,
      selectedPlaces: [...selectedPlaces],
      purposes: [...purposes],
    });

    // 폼 초기화
    setRouteName('');
    setStartTime('');
    setEndTime('');
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">동선 생성</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="routeName">동선 이름</Label>
          <Input
            id="routeName"
            placeholder="예: 강남 맛집 투어"
            value={routeName}
            onChange={(e) => setRouteName(e.target.value)}
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
          disabled={!routeName.trim() || !startTime || !endTime || selectedPlaces.length === 0}
        >
          <Save className="w-4 h-4 mr-2" />
          이 동선 저장하기
        </Button>
      </CardContent>
    </Card>
  );
};
