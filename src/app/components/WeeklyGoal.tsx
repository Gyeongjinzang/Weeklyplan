import { useState } from "react";
import { Target, Edit2, Check, X } from "lucide-react";

interface WeeklyGoalProps {
  weekKey: string;
  initialGoal: string;
  onGoalUpdate: (goal: string) => void;
}

export function WeeklyGoal({ weekKey, initialGoal, onGoalUpdate }: WeeklyGoalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [goalText, setGoalText] = useState(initialGoal);

  const handleSave = () => {
    onGoalUpdate(goalText);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setGoalText(initialGoal);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-5 mb-6 border-l-4 border-red-500">
      <div className="flex items-start gap-3">
        <Target className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800">이번 주 목표</h3>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-gray-400 hover:text-red-600 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
          </div>
          {isEditing ? (
            <div>
              <textarea
                value={goalText}
                onChange={(e) => setGoalText(e.target.value)}
                placeholder="이번 주에 달성하고 싶은 목표를 적어보세요..."
                className="w-full px-3 py-2 text-sm border border-red-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                rows={3}
                autoFocus
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleSave}
                  className="px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center gap-1 text-sm"
                >
                  <Check className="w-4 h-4" />
                  저장
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors flex items-center gap-1 text-sm"
                >
                  <X className="w-4 h-4" />
                  취소
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 whitespace-pre-wrap">
              {goalText || "목표를 설정해보세요!"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
