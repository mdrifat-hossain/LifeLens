function DayMealCard({ title, details, image }) {
  return (
    <div className="p-4">
      <div className="flex items-stretch justify-between gap-4 rounded-xl">
        <div className="flex flex-[2_2_0px] flex-col gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-base font-bold">{title}</p>
            <p className="text-sm text-[#637488]">{details}</p>
          </div>
          <div className="flex gap-30">
            <button className="bg-[#f0f2f4] text-sm font-medium rounded-xl h-8 px-4 w-fit inline-block">
              <span className="truncate">View Recipe</span>
            </button>
            <button className="bg-[#f0f2f4] text-sm font-medium rounded-xl h-8 px-4 inline-block">
              Edit
            </button>
          </div>
        </div>
        <div
          className="aspect-video bg-center bg-no-repeat bg-cover rounded-xl flex-1"
          style={{ backgroundImage: `url(${image})` }}
        ></div>
      </div>
    </div>
  );
}

export default DayMealCard;
