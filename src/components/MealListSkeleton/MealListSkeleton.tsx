export const MealListSkeleton = () => (
  <div className="flex gap-6 flex-wrap justify-center h-72 items-center">
    {Array(3)
      .fill(null)
      .map((_, index) => (
        <div
          className="animate-pulse h-64 w-64 bg-slate-300 rounded-lg"
          key={index}
        />
      ))}
  </div>
);
