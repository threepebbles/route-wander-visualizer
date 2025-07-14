
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Map, Clock, Users } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  const handleCreateRoutie = () => {
    navigate('/planner');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">동선 플래너</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            나만의 여행 루티를 만들어보세요
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            목적별 장소를 연결하고, 시간을 최적화한 완벽한 동선 계획을 세워보세요.
          </p>
        </div>

        {/* CTA Section */}
        <div className="text-center mb-16">
          <Button
            onClick={handleCreateRoutie}
            size="lg"
            className="text-lg px-8 py-4 h-auto"
          >
            <Plus className="w-6 h-6 mr-2" />
            새 루티 만들기
          </Button>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Map className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>지도 기반 계획</CardTitle>
              <CardDescription>
                지도에서 직접 장소를 선택하고 동선을 확인하세요
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>시간 최적화</CardTitle>
              <CardDescription>
                영업시간과 체류시간을 고려한 실현 가능한 일정을 만들어요
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>목적별 관리</CardTitle>
              <CardDescription>
                식사, 관광, 쇼핑 등 목적별로 장소를 체계적으로 관리하세요
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* How it works */}
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            이렇게 사용하세요
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                1
              </div>
              <h4 className="font-medium mb-2">목적 설정</h4>
              <p className="text-sm text-gray-600">식사, 관광 등 여행 목적을 추가하세요</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                2
              </div>
              <h4 className="font-medium mb-2">장소 선택</h4>
              <p className="text-sm text-gray-600">지도에서 원하는 장소를 찾아 추가하세요</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                3
              </div>
              <h4 className="font-medium mb-2">동선 최적화</h4>
              <p className="text-sm text-gray-600">방문 순서를 조정하고 시간을 확인하세요</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                4
              </div>
              <h4 className="font-medium mb-2">루티 저장</h4>
              <p className="text-sm text-gray-600">완성된 루티를 저장하고 공유하세요</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
