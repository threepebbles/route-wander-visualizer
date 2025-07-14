
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Clock } from 'lucide-react';

interface TimeInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const TimeInput = ({ value, onChange, placeholder, disabled }: TimeInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hours, setHours] = useState('00');
  const [minutes, setMinutes] = useState('00');

  useEffect(() => {
    if (value) {
      const [h, m] = value.split(':');
      setHours(h || '00');
      setMinutes(m || '00');
    }
  }, [value]);

  const handleTimeSelect = (h: string, m: string) => {
    const timeString = `${h.padStart(2, '0')}:${m.padStart(2, '0')}`;
    onChange(timeString);
    setIsOpen(false);
  };

  const generateHours = () => {
    return Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  };

  const generateMinutes = () => {
    return Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
          disabled={disabled}
        >
          <Clock className="mr-2 h-4 w-4" />
          {value || placeholder || '시간 선택'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-4">
          <div className="mb-4">
            <Input
              type="time"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="mb-2"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium mb-2">시간</div>
              <div className="max-h-32 overflow-y-auto grid grid-cols-3 gap-1">
                {generateHours().map((hour) => (
                  <Button
                    key={hour}
                    variant={hours === hour ? "default" : "outline"}
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => {
                      setHours(hour);
                      handleTimeSelect(hour, minutes);
                    }}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">분</div>
              <div className="max-h-32 overflow-y-auto grid grid-cols-2 gap-1">
                {generateMinutes().map((minute) => (
                  <Button
                    key={minute}
                    variant={minutes === minute ? "default" : "outline"}
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => {
                      setMinutes(minute);
                      handleTimeSelect(hours, minute);
                    }}
                  >
                    {minute}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
