import DayMealCard from './DayMealCard';

function MealDaySection({ day, meals }) {
  return (
    <div>
      <h2 className="text-[22px] text-light-text dark:text-dark-text font-bold px-4 pb-3 pt-5">{day}</h2>
      {meals.map((meal, idx) => (
        <DayMealCard key={idx} {...meal} />
      ))}
    </div>
  );
}

export default MealDaySection;
