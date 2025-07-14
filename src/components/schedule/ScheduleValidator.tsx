
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { SelectedPlace, ScheduleValidation } from '@/types';

interface ScheduleValidatorProps {
  selectedPlaces: SelectedPlace[];
  startTime: string;
  endTime: string;
}

export const ScheduleValidator = ({ selectedPlaces, startTime, endTime }: ScheduleValidatorProps) => {
  const validateSchedule = (): ScheduleValidation => {
    const issues: ScheduleValidation['issues'] = [];
    
    if (!startTime || !endTime || selectedPlaces.length === 0) {
      return { isValid: false, issues: [] };
    }

    let currentTime = parseTime(startTime);
    const endTimeMinutes = parseTime(endTime);
    
    selectedPlaces.forEach((place, index) => {
      // 영업시간 체크
      if (place.openTime && place.closeTime) {
        const openTime = parseTime(place.openTime);
        const closeTime = parseTime(place.closeTime);
        
        // 현재 시간이 영업시간 범위 내에 있는지 확인
        if (currentTime < openTime || currentTime > closeTime) {
          issues.push({
            type: 'closed',
            placeIndex: index,
            message: `${place.name}의 영업시간(${place.openTime}-${place.closeTime})을 벗어났습니다.`
          });
        }
      }

      // 브레이크 타임 체크
      if (place.breakTimeStart && place.breakTimeEnd) {
        const breakStart = parseTime(place.breakTimeStart);
        const breakEnd = parseTime(place.breakTimeEnd);
        const stayDuration = place.stayDuration || 60;
        
        // 체류 시간 동안 브레이크 타임과 겹치는지 확인
        if (currentTime < breakEnd && (currentTime + stayDuration) > breakStart) {
          issues.push({
            type: 'break_time',
            placeIndex: index,
            message: `${place.name}의 브레이크 타임(${place.breakTimeStart}-${place.breakTimeEnd})과 겹칩니다.`
          });
        }
      }

      // 체류 시간 추가 (현재 장소에서의 체류)
      const stayDuration = place.stayDuration || 60; // 기본 1시간
      currentTime += stayDuration;

      // 다음 장소로의 이동 시간 추가 (마지막 장소가 아닌 경우)
      if (index < selectedPlaces.length - 1) {
        const nextPlace = selectedPlaces[index + 1];
        const travelTime = calculateTravelTime(place, nextPlace);
        currentTime += travelTime;
      }
    });

    // 전체 시간이 종료 시간을 초과하는지 확인
    if (currentTime > endTimeMinutes) {
      const exceededMinutes = currentTime - endTimeMinutes;
      issues.push({
        type: 'insufficient_time',
        placeIndex: -1,
        message: `전체 일정이 종료 시간을 ${exceededMinutes}분 초과합니다.`
      });
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  };

  const parseTime = (timeString: string): number => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // 두 지점 간의 이동 시간을 계산하는 함수
  const calculateTravelTime = (place1: SelectedPlace, place2: SelectedPlace): number => {
    const distance = Math.sqrt(
      Math.pow(place1.x - place2.x, 2) + Math.pow(place1.y - place2.y, 2)
    );
    // 거리에 따른 이동 시간 (분 단위) - 최소 5분, 최대 60분
    return Math.max(5, Math.min(60, Math.round(distance * 0.8)));
  };

  const validation = validateSchedule();

  if (!startTime || !endTime || selectedPlaces.length === 0) {
    return null;
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          {validation.isValid ? (
            <>
              <CheckCircle className="w-5 h-5 text-green-600" />
              일정 검증 결과
            </>
          ) : (
            <>
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              일정 검증 결과
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {validation.isValid ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span>현재 계획은 실현 가능합니다 👍</span>
          </div>
        ) : (
          <div className="space-y-2">
            {validation.issues.map((issue, index) => (
              <div key={index} className="flex items-start gap-2 text-yellow-700">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="text-sm">
                  {issue.placeIndex >= 0 && `${issue.placeIndex + 1}번째 장소: `}
                  {issue.message} ⚠️
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
