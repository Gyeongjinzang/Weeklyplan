export const CATEGORIES = [
  "논술",
  "작문",
  "상식(경향)",
  "상식(동아)",
  "한국일보",
  "스트 쓰기",
  "기획안 작성",
] as const;

export type Category = (typeof CATEGORIES)[number];

const CATEGORY_COLORS: Record<Category, string> = {
  논술: "#ef4444", // red
  작문: "#f97316", // orange
  "상식(경향)": "#eab308", // yellow
  "상식(동아)": "#22c55e", // green
  한국일보: "#3b82f6", // blue
  "스트 쓰기": "#a855f7", // purple
  "기획안 작성": "#ec4899", // pink
};

interface CategoryBadgeProps {
  category: Category;
  size?: "sm" | "md";
}

export function CategoryBadge({ category, size = "sm" }: CategoryBadgeProps) {
  const color = CATEGORY_COLORS[category];

  return (
    <span
      className={`inline-block rounded px-2 py-0.5 text-white ${
        size === "sm" ? "text-xs" : "text-sm"
      }`}
      style={{ backgroundColor: color }}
    >
      {category}
    </span>
  );
}
