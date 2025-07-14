
export interface Purpose {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Place {
  id: string;
  name: string;
  description: string;
  x: number;
  y: number;
  purposeId: string;
  // 새로운 상세 정보 필드들
  stayDuration?: number; // 체류 시간 (분 단위)
  openTime?: string; // 영업 시작 시간 (HH:MM 형식)
  closeTime?: string; // 영업 종료 시간 (HH:MM 형식)
  breakTimeStart?: string; // 브레이크 타임 시작 (HH:MM 형식)
  breakTimeEnd?: string; // 브레이크 타임 종료 (HH:MM 형식)
  closedDays?: string[]; // 휴무일 (월,화,수,목,금,토,일)
}

export interface SelectedPlace extends Place {
  order: number;
}

export interface MapPosition {
  x: number;
  y: number;
}

export interface PurposeSelection {
  purposeId: string;
  placeId: string;
}

export interface Routie {
  id: string;
  name: string;
  startTime: string; // HH:MM 형식
  endTime: string; // HH:MM 형식
  selectedPlaces: SelectedPlace[];
  purposes: Purpose[];
  createdAt: Date;
}

export interface ScheduleValidation {
  isValid: boolean;
  issues: Array<{
    type: 'break_time' | 'closed' | 'insufficient_time' | 'overlap';
    placeIndex: number;
    message: string;
  }>;
}
