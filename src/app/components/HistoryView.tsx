import { Task } from "./DayCard";
import { Category, CategoryBadge } from "./CategoryBadge";
import { Calendar } from "lucide-react";

interface WeekHistory {
  weekStart: string;
  weekEnd: string;
  tasks: Task[];
  achievement: number;
}

interface HistoryViewProps {
  allWeeksData: { [dateKey: string]: Task[] };
  onClose: () => void;
}

export function HistoryView({ allWeeksData, onClose }: HistoryViewProps) {
  // 주차별로 데이터 그룹화
  const getWeekHistory = (): WeekHistory[] => {
    const weeks = new Map<string, Task[]>();

    Object.entries(allWeeksData).forEach(([dateKey, tasks]) => {
      const date = new Date(dateKey);
      const day = date.getDay();
      const diff = day === 0 ? -6 : 1 - day;
      const monday = new Date(date);
      monday.setDate(date.getDate() + diff);
      const weekKey = monday.toISOString().split("T")[0];

      if (!weeks.has(weekKey)) {
        weeks.set(weekKey, []);
      }
      weeks.get(weekKey)!.push(...tasks);
    });

    return Array.from(weeks.entries())
      .map(([weekStart, tasks]) => {
        const startDate = new Date(weekStart);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);

        const completed = tasks.filter((t) => t.completed).length;
        const total = tasks.length;
        const achievement = total > 0 ? (completed / total) * 100 : 0;

        return {
          weekStart,
          weekEnd: endDate.toISOString().split("T")[0],
          tasks,
          achievement,
        };
      })
      .sort((a, b) => new Date(b.weekStart).getTime() - new Date(a.weekStart).getTime());
  };

  const weekHistory = getWeekHistory();

  const formatWeekRange = (weekStart: string, weekEnd: string) => {
    const start = new Date(weekStart);
    const end = new Date(weekEnd);

    const startMonth = start.getMonth() + 1;
    const startDay = start.getDate();
    const endMonth = end.getMonth() + 1;
    const endDay = end.getDate();
    const year = start.getFullYear();

    if (startMonth === endMonth) {
      return `${year}년 ${startMonth}월 ${startDay}일 - ${endDay}일`;
    }
    return `${year}년 ${startMonth}월 ${startDay}일 - ${endMonth}월 ${endDay}일`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* 헤더 */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              과거 주차 기록
            </h2>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            >
              닫기
            </button>
          </div>
        </div>

        {/* 내용 */}
        <div className="flex-1 overflow-y-auto p-6">
          {weekHistory.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              아직 기록이 없습니다.
            </div>
          ) : (
            <div className="space-y-4">
              {weekHistory.map((week) => {
                const categoryStats = new Map<Category, { total: number; completed: number }>();

                week.tasks.forEach((task) => {
                  if (!categoryStats.has(task.category)) {
                    categoryStats.set(task.category, { total: 0, completed: 0 });
                  }
                  const stat = categoryStats.get(task.category)!;
                  stat.total++;
                  if (task.completed) stat.completed++;
                });

                return (
                  <div
                    key={week.weekStart}
                    className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="font-semibold text-gray-700 mb-1">
                          {formatWeekRange(week.weekStart, week.weekEnd)}
                        </div>
                        <div className="text-sm text-gray-600">
                          총 {week.tasks.length}개 계획
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-red-600">
                          {week.achievement.toFixed(0)}%
                        </div>
                        <div className="text-xs text-gray-600">전체 성취도</div>
                      </div>
                    </div>

                    {/* 진행 바 */}
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                      <div
                        className="h-full bg-red-500 transition-all duration-300"
                        style={{ width: `${week.achievement}%` }}
                      />
                    </div>

                    {/* 카테고리별 요약 */}
                    <div className="flex flex-wrap gap-2">
                      {Array.from(categoryStats.entries()).map(([category, stat]) => {
                        const categoryAchievement =
                          stat.total > 0 ? (stat.completed / stat.total) * 100 : 0;
                        return (
                          <div
                            key={category}
                            className="bg-gray-50 rounded px-3 py-1.5 flex items-center gap-2"
                          >
                            <CategoryBadge category={category} />
                            <span className="text-sm text-gray-700">
                              {categoryAchievement.toFixed(0)}% ({stat.completed}/{stat.total})
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
