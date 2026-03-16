import { Check, Plus, X } from "lucide-react";
import { useState } from "react";
import { CATEGORIES, Category, CategoryBadge } from "./CategoryBadge";

export interface Task {
  id: string;
  text: string;
  category: Category;
  completed: boolean;
}

interface DayCardProps {
  date: Date;
  tasks: Task[];
  onTaskToggle: (taskId: string) => void;
  onTaskAdd: (text: string, category: Category) => void;
  onTaskDelete: (taskId: string) => void;
  isToday: boolean;
}

export function DayCard({
  date,
  tasks,
  onTaskToggle,
  onTaskAdd,
  onTaskDelete,
  isToday,
}: DayCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>("논술");

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const achievement = totalCount > 0 ? completedCount / totalCount : 0;

  // 성취도에 따라 빨간색 투명도 조절 (성취도가 높을수록 진해짐)
  const backgroundColor = `rgba(239, 68, 68, ${achievement * 0.9 + 0.1})`;

  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const dayName = dayNames[date.getDay()];
  const dayNumber = date.getDate();

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      onTaskAdd(newTaskText.trim(), selectedCategory);
      setNewTaskText("");
      setSelectedCategory("논술");
      setIsAdding(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* 헤더 */}
      <div
        className="px-4 py-3 rounded-t-lg"
        style={{ backgroundColor }}
      >
        <div className="flex items-center justify-between text-white">
          <div>
            <div className="text-sm font-medium">{dayName}</div>
            <div className="text-2xl font-bold">{dayNumber}</div>
          </div>
          <div className="text-right">
            <div className="text-xs opacity-90">성취도</div>
            <div className="text-xl font-bold">
              {totalCount > 0 ? Math.round(achievement * 100) : 0}%
            </div>
          </div>
        </div>
        {isToday && (
          <div className="mt-2 text-xs text-white bg-white/20 rounded px-2 py-1 inline-block">
            오늘
          </div>
        )}
      </div>

      {/* 할 일 목록 */}
      <div className="flex-1 bg-white border border-gray-200 rounded-b-lg p-3 overflow-y-auto">
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-2 group hover:bg-gray-50 p-2 rounded transition-colors"
            >
              <button
                onClick={() => onTaskToggle(task.id)}
                className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  task.completed
                    ? "bg-red-500 border-red-500"
                    : "border-gray-300 hover:border-red-400"
                }`}
              >
                {task.completed && <Check className="w-3 h-3 text-white" />}
              </button>
              <span
                className={`flex-1 text-sm ${
                  task.completed
                    ? "line-through text-gray-400"
                    : "text-gray-700"
                }`}
              >
                {task.text}
              </span>
              <div className="flex-shrink-0">
                <CategoryBadge category={task.category} />
              </div>
              <button
                onClick={() => onTaskDelete(task.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
              </button>
            </div>
          ))}
        </div>

        {/* 추가 버튼/입력 */}
        {isAdding ? (
          <div className="mt-2 space-y-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as Category)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddTask();
                if (e.key === "Escape") {
                  setIsAdding(false);
                  setNewTaskText("");
                }
              }}
              placeholder="공부 계획 입력..."
              className="w-full px-3 py-2 text-sm border border-red-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddTask}
                className="flex-1 px-3 py-1.5 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                추가
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewTaskText("");
                }}
                className="flex-1 px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="mt-2 w-full px-3 py-2 text-sm text-red-600 border border-dashed border-red-300 rounded hover:bg-red-50 transition-colors flex items-center justify-center gap-1"
          >
            <Plus className="w-4 h-4" />
            계획 추가
          </button>
        )}
      </div>
    </div>
  );
}