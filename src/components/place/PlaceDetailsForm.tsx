
import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PlaceDetailsFormProps {
  onDetailsChange: (details: {
    stayDuration?: number;
    openTime?: string;
    closeTime?: string;
    breakTimeStart?: string;
    breakTimeEnd?: string;
    closedDays?: string[];
  }) => void;
  initialValues?: {
    stayDuration?: number;
    openTime?: string;
    closeTime?: string;
    breakTimeStart?: string;
    breakTimeEnd?: string;
    closedDays?: string[];
  };
}

const weekdays = ['월', '화', '수', '목', '금', '토', '일'];

export const PlaceDetailsForm = ({ onDetailsChange, initialValues }: PlaceDetailsFormProps) => {
  const [stayDuration, setStayDuration] = useState<number | undefined>(initialValues?.stayDuration ?? 0);
  const [openTime, setOpenTime] = useState(initialValues?.openTime ?? '00:00');
  const [closeTime, setCloseTime] = useState(initialValues?.closeTime ?? '12:59');
  const [breakTimeStart, setBreakTimeStart] = useState(initialValues?.breakTimeStart ?? '');
  const [breakTimeEnd, setBreakTimeEnd] = useState(initialValues?.breakTimeEnd ?? '');
  const [closedDays, setClosedDays] = useState<string[]>(initialValues?.closedDays ?? []);
  const [breakTimeEnabled, setBreakTimeEnabled] = useState(false);

  const handleChange = () => {
    const details: any = {};
    if (stayDuration !== undefined) details.stayDuration = stayDuration;
    if (openTime) details.openTime = openTime;
    if (closeTime) details.closeTime = closeTime;
    if (breakTimeEnabled) {
      if (breakTimeStart) details.breakTimeStart = breakTimeStart;
      if (breakTimeEnd) details.breakTimeEnd = breakTimeEnd;
    }
    if (closedDays.length > 0) details.closedDays = closedDays;
    onDetailsChange(details);
  };

  const handleClosedDayChange = (day: string, checked: boolean) => {
    const newClosedDays = checked
      ? [...closedDays, day]
      : closedDays.filter(d => d !== day);
    setClosedDays(newClosedDays);
    setTimeout(handleChange, 0);
  };

  // 브레이크 타임 토글이 off로 바뀌면 값 초기화
  const handleBreakTimeToggle = (checked: boolean) => {
    setBreakTimeEnabled(checked);
    if (!checked) {
      setBreakTimeStart('');
      setBreakTimeEnd('');
      setTimeout(handleChange, 0);
    } else {
      setTimeout(handleChange, 0);
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-sm">장소 상세 정보 (선택사항)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="stayDuration">체류 시간 (분)</Label>
          <Input
            id="stayDuration"
            type="number"
            placeholder="예: 60"
            value={typeof stayDuration === 'number' ? stayDuration : ''}
            onChange={(e) => {
              const value = e.target.value ? parseInt(e.target.value) : undefined;
              setStayDuration(value);
              setTimeout(handleChange, 0);
            }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="openTime">영업 시작</Label>
            <Input
              id="openTime"
              type="time"
              value={openTime}
              onChange={(e) => {
                setOpenTime(e.target.value);
                setTimeout(handleChange, 0);
              }}
            />
          </div>
          <div>
            <Label htmlFor="closeTime">영업 종료</Label>
            <Input
              id="closeTime"
              type="time"
              value={closeTime}
              onChange={(e) => {
                setCloseTime(e.target.value);
                setTimeout(handleChange, 0);
              }}
            />
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">브레이크 타임</Label>
          <div className="flex items-center space-x-2 mb-2">
            <Switch
              id="break-time-switch"
              checked={breakTimeEnabled}
              onCheckedChange={handleBreakTimeToggle}
            />
            <Label htmlFor="break-time-switch" className="text-xs">브레이크 타임 입력</Label>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Input
              type="time"
              placeholder="시작"
              value={breakTimeStart}
              onChange={(e) => {
                setBreakTimeStart(e.target.value);
                setTimeout(handleChange, 0);
              }}
              disabled={!breakTimeEnabled}
            />
            <Input
              type="time"
              placeholder="종료"
              value={breakTimeEnd}
              onChange={(e) => {
                setBreakTimeEnd(e.target.value);
                setTimeout(handleChange, 0);
              }}
              disabled={!breakTimeEnabled}
            />
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">휴무일</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {weekdays.map((day) => (
              <div key={day} className="flex items-center space-x-2">
                <Checkbox
                  id={`day-${day}`}
                  checked={closedDays.includes(day)}
                  onCheckedChange={(checked) => 
                    handleClosedDayChange(day, checked as boolean)
                  }
                />
                <Label 
                  htmlFor={`day-${day}`} 
                  className="text-sm font-normal"
                >
                  {day}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
