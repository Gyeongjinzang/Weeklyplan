import { Sparkles, Target, Trophy, Zap } from "lucide-react";

interface MotivationBannerProps {
  weekAchievement: number;
  streak: number;
}

export function MotivationBanner({ weekAchievement, streak }: MotivationBannerProps) {
  const getMessage = () => {
    if (weekAchievement === 100) {
      return {
        icon: <Trophy className="w-8 h-8" />,
        title: "완벽한 한 주를 보내셨습니다! 🎉",
        message: "모든 계획을 완수하셨네요. 정말 대단해요!",
        bgColor: "bg-gradient-to-r from-yellow-500 to-orange-500",
      };
    } else if (weekAchievement >= 80) {
      return {
        icon: <Sparkles className="w-8 h-8" />,
        title: "거의 다 왔어요! 💪",
        message: `${weekAchievement.toFixed(0)}% 달성! 조금만 더 힘내세요!`,
        bgColor: "bg-gradient-to-r from-blue-500 to-purple-500",
      };
    } else if (weekAchievement >= 50) {
      return {
        icon: <Target className="w-8 h-8" />,
        title: "좋은 페이스입니다! 🎯",
        message: `${weekAchievement.toFixed(0)}% 달성. 꾸준함이 힘입니다!`,
        bgColor: "bg-gradient-to-r from-green-500 to-teal-500",
      };
    } else if (weekAchievement > 0) {
      return {
        icon: <Zap className="w-8 h-8" />,
        title: "시작이 반입니다! ⚡",
        message: "한 걸음씩 나아가고 있어요. 화이팅!",
        bgColor: "bg-gradient-to-r from-pink-500 to-red-500",
      };
    } else {
      return {
        icon: <Target className="w-8 h-8" />,
        title: "새로운 시작을 응원합니다! 🌟",
        message: "오늘부터 계획을 세워보세요!",
        bgColor: "bg-gradient-to-r from-indigo-500 to-purple-500",
      };
    }
  };

  const { icon, title, message, bgColor } = getMessage();

  // 연속 달성 메시지
  const getStreakMessage = () => {
    if (streak >= 30) return "한 달 연속! 정말 놀라워요! 🔥";
    if (streak >= 14) return "2주 연속! 엄청난 의지력이에요! 🔥";
    if (streak >= 7) return "일주일 연속! 계속 달려보세요! 🔥";
    if (streak >= 3) return "3일 연속! 습관이 만들어지고 있어요! 🔥";
    if (streak >= 1) return `${streak}일 연속 달성 중! 🔥`;
    return null;
  };

  const streakMessage = getStreakMessage();

  return (
    <div className={`${bgColor} rounded-lg p-6 text-white mb-6 shadow-lg`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">{icon}</div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          <p className="text-lg opacity-95 mb-3">{message}</p>
          {streakMessage && (
            <div className="inline-block bg-white/20 rounded-full px-4 py-2 text-sm font-semibold">
              {streakMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
