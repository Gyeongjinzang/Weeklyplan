import { useState, useEffect } from "react";
import { DayCard, Task } from "./DayCard";
import { ChevronLeft, ChevronRight, History } from "lucide-react";
import { WeeklyStats } from "./WeeklyStats";
import { HistoryView } from "./HistoryView";
import { Category } from "./CategoryBadge";
import { MotivationBanner } from "./MotivationBanner";
import { WeeklyGoal } from "./WeeklyGoal";

interface WeekData {
  [dateKey: string]: Task[];
}

interface WeeklyGoals {
  [weekKey: string]: string;
}

export function WeeklyCalendar() {
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = day === 0 ? -6 : 1 - day; // 월요일을 주의 시작으로
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);
    monday.setHours(0, 0, 0, 0);
    return monday;
  });

  const [weekData, setWeekData] = useState<WeekData>(() => {
    const stored = localStorage.getItem("study-planner-data");
    if (!stored) return {};
    
    try {
      const parsed = JSON.parse(stored);
      // 기존 데이터가 category 필드가 없는 경우 마이그레이션
      const migrated: WeekData = {};
      Object.entries(parsed).forEach(([dateKey, tasks]) => {
        migrated[dateKey] = (tasks as Task[]).map((task) => {
          if (!task.category) {
            return { ...task, category: "논술" as Category };
          }
          return task;
        });
      });
      return migrated;
    } catch (e) {
      console.error("Failed to parse stored data:", e);
      return {};
    }
  });

  const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoals>(() => {
    const stored = localStorage.getItem("study-planner-goals");
    if (!stored) return {};
    
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse stored goals:", e);
      return {};
    }
  });

  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    localStorage.setItem("study-planner-data", JSON.stringify(weekData));
  }, [weekData]);

  useEffect(() => {
    localStorage.setItem("study-planner-goals", JSON.stringify(weeklyGoals));
  }, [weeklyGoals]);

  // 연속 달성일 계산
  const calculateStreak = (): number => {
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateKey = formatDateKey(checkDate);
      const dayTasks = weekData[dateKey] || [];

      if (dayTasks.length === 0) {
        // 계획이 없는 날은 건너뜀
        continue;
      }

      const allCompleted = dayTasks.every((task) => task.completed);
      if (allCompleted) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const getWeekDates = (startDate: Date): Date[] => {
    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates(currentWeekStart);

  const formatDateKey = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const handleTaskToggle = (date: Date, taskId: string) => {
    const dateKey = formatDateKey(date);
    setWeekData((prev) => ({
      ...prev,
      [dateKey]: (prev[dateKey] || []).map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ),
    }));
  };

  const handleTaskAdd = (date: Date, text: string, category: Category) => {
    const dateKey = formatDateKey(date);
    const newTask: Task = {
      id: `${Date.now()}-${Math.random()}`,
      text,
      category,
      completed: false,
    };
    setWeekData((prev) => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), newTask],
    }));
  };

  const handleTaskDelete = (date: Date, taskId: string) => {
    const dateKey = formatDateKey(date);
    setWeekData((prev) => ({
      ...prev,
      [dateKey]: (prev[dateKey] || []).filter((task) => task.id !== taskId),
    }));
  };

  const goToPreviousWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(newStart);
  };

  const goToNextWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(newStart);
  };

  const goToThisWeek = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);
    monday.setHours(0, 0, 0, 0);
    setCurrentWeekStart(monday);
  };

  const getWeekRangeText = () => {
    const endDate = new Date(currentWeekStart);
    endDate.setDate(currentWeekStart.getDate() + 6);

    const startMonth = currentWeekStart.getMonth() + 1;
    const startDay = currentWeekStart.getDate();
    const endMonth = endDate.getMonth() + 1;
    const endDay = endDate.getDate();
    const year = currentWeekStart.getFullYear();

    if (startMonth === endMonth) {
      return `${year}년 ${startMonth}월 ${startDay}일 - ${endDay}일`;
    }
    return `${year}년 ${startMonth}월 ${startDay}일 - ${endMonth}월 ${endDay}일`;
  };

  // 이번 주 모든 태스크 가져오기
  const getCurrentWeekTasks = (): Task[] => {
    const tasks: Task[] = [];
    weekDates.forEach((date) => {
      const dateKey = formatDateKey(date);
      tasks.push(...(weekData[dateKey] || []));
    });
    return tasks;
  };

  const streak = calculateStreak();
  const currentWeekTasks = getCurrentWeekTasks();
  const currentWeekKey = formatDateKey(currentWeekStart);
  
  const totalCompleted = currentWeekTasks.filter((t) => t.completed).length;
  const totalTasks = currentWeekTasks.length;
  const weekAchievement = totalTasks > 0 ? (totalCompleted / totalTasks) * 100 : 0;

  const handleGoalUpdate = (goal: string) => {
    setWeeklyGoals((prev) => ({
      ...prev,
      [currentWeekKey]: goal,
    }));
  };

  return (
    <div className="w-full h-full bg-gray-50 p-4 md:p-6 overflow-y-auto">
      <div className="max-w-[1600px] mx-auto">
        {/* 헤더 */}
        <div className="mb-4 md:mb-6">
          <div className="flex items-center justify-between mb-4 gap-3">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              주간 공부 계획
            </h1>
            <button
              onClick={() => setShowHistory(true)}
              className="px-3 py-2 md:px-4 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2 text-sm"
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">과거 기록</span>
            </button>
          </div>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 md:gap-3">
              <button
                onClick={goToPreviousWeek}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="text-sm md:text-lg font-medium text-gray-700">
                {getWeekRangeText()}
              </div>
              <button
                onClick={goToNextWeek}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <button
              onClick={goToThisWeek}
              className="px-3 py-2 md:px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
            >
              이번 주
            </button>
          </div>
        </div>

        {/* 동기부여 배너 */}
        <MotivationBanner weekAchievement={weekAchievement} streak={streak} />

        {/* 주간 목표 */}
        <WeeklyGoal
          weekKey={currentWeekKey}
          initialGoal={weeklyGoals[currentWeekKey] || ""}
          onGoalUpdate={handleGoalUpdate}
        />

        {/* 주간 통계 */}
        <WeeklyStats weekTasks={currentWeekTasks} streak={streak} />

        {/* 캘린더 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 md:gap-4 mb-6">
          {weekDates.map((date) => {
            const dateKey = formatDateKey(date);
            const tasks = weekData[dateKey] || [];
            return (
              <div key={dateKey} className="min-h-[400px] lg:min-h-[600px]">
                <DayCard
                  date={date}
                  tasks={tasks}
                  onTaskToggle={(taskId) => handleTaskToggle(date, taskId)}
                  onTaskAdd={(text, category) => handleTaskAdd(date, text, category)}
                  onTaskDelete={(taskId) => handleTaskDelete(date, taskId)}
                  isToday={isToday(date)}
                />
              </div>
            );
          })}
        </div>

        {/* 과거 기록 모달 */}
        {showHistory && (
          <HistoryView
            allWeeksData={weekData}
            onClose={() => setShowHistory(false)}
          />
        )}
      </div>
    </div>
  );
}