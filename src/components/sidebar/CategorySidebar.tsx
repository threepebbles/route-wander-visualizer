
import { Category } from '@/types';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

interface CategorySidebarProps {
  categories: Category[];
  activeCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
  onPlaceSelect: (categoryId: string) => void;
}

export const CategorySidebar = ({
  categories,
  activeCategory,
  onCategorySelect,
  onPlaceSelect,
}: CategorySidebarProps) => {
  return (
    <div className="p-4 border-b bg-gray-50">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">카테고리</h2>
      
      <div className="space-y-2">
        <Button
          variant={activeCategory === null ? "default" : "outline"}
          onClick={() => onCategorySelect(null)}
          className="w-full justify-start"
        >
          전체 보기
        </Button>
        
        {categories.map((category) => (
          <div key={category.id} className="flex gap-2">
            <Button
              variant={activeCategory === category.id ? "default" : "outline"}
              onClick={() => onCategorySelect(category.id)}
              className="flex-1 justify-start"
              style={{
                backgroundColor: activeCategory === category.id ? category.color : undefined,
                borderColor: category.color,
              }}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => onPlaceSelect(category.id)}
              className="px-3"
            >
              <MapPin className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
      
      {categories.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <p className="text-sm">카테고리를 추가해서</p>
          <p className="text-sm">장소를 선택해보세요!</p>
        </div>
      )}
    </div>
  );
};
