
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
        
        if (currentTime >= breakStart && currentTime <= breakEnd) {
          issues.push({
            type: 'break_time',
            placeIndex: index,
            message: `${place.name}의 브레이크 타임(${place.breakTimeStart}-${place.breakTimeEnd})에 해당합니다.`
          });
        }
      }

      // 체류 시간 추가
      if (place.stayDuration) {
        currentTime += place.stayDuration;
      } else {
        currentTime += 60; // 기본 1시간
      }

      // 이동 시간 추가 (기본 30분)
      if (index < selectedPlaces.length - 1) {
        currentTime += 30;
      }
    });

    // 전체 시간 체크
    if (currentTime > endTimeMinutes) {
      issues.push({
        type: 'insufficient_time',
        placeIndex: -1,
        message: '전체 일정이 종료 시간을 초과합니다.'
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
