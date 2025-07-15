
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PlaceDetailsForm } from './PlaceDetailsForm';
import { Place } from '@/types';

interface PlaceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  place: Place | null;
  onUpdatePlace: (updatedPlace: Place) => void;
}

export const PlaceDetailModal = ({
  isOpen,
  onClose,
  place,
  onUpdatePlace,
}: PlaceDetailModalProps) => {
  const [placeDetails, setPlaceDetails] = useState<Partial<Place>>({});

  const handleSave = () => {
    if (!place) return;
    const filteredDetails = Object.fromEntries(
      Object.entries(placeDetails).filter(([_, v]) => v !== undefined && v !== '')
    );
    const updatedPlace: Place = {
      ...place,
      ...filteredDetails,
    };
    onUpdatePlace(updatedPlace);
    setPlaceDetails({});
    onClose();
  };

  const handleClose = () => {
    setPlaceDetails({});
    onClose();
  };

  if (!place) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>장소 상세 정보 수정</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 border rounded-lg bg-gray-50">
            <h3 className="font-medium text-gray-800">{place.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{place.address}</p>
          </div>

          <PlaceDetailsForm
            key={place.id}
            onDetailsChange={setPlaceDetails}
            initialValues={{
              name: place.name,
              address: place.address,
              stayDuration: place.stayDuration,
              openTime: place.openTime,
              closeTime: place.closeTime,
              breakTimeStart: place.breakTimeStart,
              breakTimeEnd: place.breakTimeEnd,
              closedDays: place.closedDays,
            }}
          />

          <div className="flex gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1"
            >
              저장
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
