import { Task } from "./DayCard";
import { CATEGORIES, Category, CategoryBadge } from "./CategoryBadge";
import { Flame, TrendingDown } from "lucide-react";

interface WeeklyStatsProps {
  weekTasks: Task[];
  streak: number;
}

export function WeeklyStats({ weekTasks, streak }: WeeklyStatsProps) {
  // 카테고리별 성취도 계산
  const categoryStats = CATEGORIES.map((category) => {
    const categoryTasks = weekTasks.filter((t) => t.category === category);
    const completed = categoryTasks.filter((t) => t.completed).length;
    const total = categoryTasks.length;
    const achievement = total > 0 ? (completed / total) * 100 : 0;

    return {
      category,
      completed,
      total,
      achievement,
    };
  }).filter((stat) => stat.total > 0); // 계획이 있는 카테고리만 표시

  // 가장 성취하지 못한 카테고리 찾기
  const lowestCategory = categoryStats.length > 0
    ? categoryStats.reduce((prev, current) =>
        current.achievement < prev.achievement ? current : prev
      )
    : null;

  // 전체 성취도
  const totalCompleted = weekTasks.filter((t) => t.completed).length;
  const totalTasks = weekTasks.length;
  const overallAchievement = totalTasks > 0 ? (totalCompleted / totalTasks) * 100 : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">주간 통계</h2>
          <p className="text-gray-600">
            전체 성취도: <span className="font-bold text-red-600">{overallAchievement.toFixed(0)}%</span>
          </p>
        </div>
        
        {/* 연속 달성일 */}
        <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-lg">
          <Flame className="w-5 h-5 text-orange-500" />
          <div>
            <div className="text-xs text-gray-600">연속 달성</div>
            <div className="text-xl font-bold text-orange-600">{streak}일</div>
          </div>
        </div>
      </div>

      {/* 가장 부진한 카테고리 */}
      {lowestCategory && lowestCategory.achievement < 100 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-start gap-3">
            <TrendingDown className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-lg font-semibold text-gray-800">
                  가장 성취하지 못한 카테고리
                </span>
                <CategoryBadge category={lowestCategory.category} size="md" />
              </div>
              <div className="text-3xl font-bold text-red-600 mb-1">
                {lowestCategory.achievement.toFixed(0)}%
              </div>
              <p className="text-sm text-gray-600">
                {lowestCategory.total}개 중 {lowestCategory.completed}개 완료
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 카테고리별 성취도 */}
      {categoryStats.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-700 mb-3">카테고리별 성취도</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {categoryStats
              .sort((a, b) => a.achievement - b.achievement)
              .map((stat) => (
                <div
                  key={stat.category}
                  className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                >
                  <CategoryBadge category={stat.category} />
                  <div className="mt-2">
                    <div className="text-2xl font-bold text-gray-800">
                      {stat.achievement.toFixed(0)}%
                    </div>
                    <div className="text-xs text-gray-600">
                      {stat.completed}/{stat.total}
                    </div>
                  </div>
                  {/* 진행 바 */}
                  <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 transition-all duration-300"
                      style={{ width: `${stat.achievement}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {categoryStats.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          이번 주에 계획을 추가해보세요!
        </div>
      )}
    </div>
  );
}