import { calculateTrendPercentage, cn } from "assets/lib/utils"

const StatsCard = ({ headerTitle, total, currentMonthCount, lastMonthCount }: StatsCard ) => {

  const { trend, percentage } = calculateTrendPercentage(currentMonthCount, lastMonthCount);

  const isDecrement: boolean = trend === "decrement";

// stats-card: p-6 flex flex-col gap-6 bg-white shadow-400 rounded-20 text-dark-100
  return (
    <article className="stats-card">
      <h3 className="text-base font-medium">
        {headerTitle}
      </h3>
      {/* // content: flex flex-row md:flex-col-reverse xl:flex-row xl:items-center gap-3 justify-between */}
      <div className="content">
        <div className="flex flex-col gap-4">
          <h2 className="text-4xl font-semibold">
            {total}
          </h2>
          <div className="flex items-center gap-2">
            <figure className="flex items-center gap-1">
              <img 
                src={`/public/assets/icons/${isDecrement ? 'arrow-down-red.svg' : 'arrow-up-green.svg'}`}
                className="size-5"
                alt="arrow"
                />
              <figcaption className={cn("text-sm font-medium", isDecrement ? 'text-red-600' : 'text-success-700')}>
                {Math.round(percentage)}%
              </figcaption>
            </figure>
            <p className="text-sm font-medium text-gray-100 truncate">vs last month</p>
          </div>
        </div>

        <img
          src={`/public/assets/icons/${isDecrement ? 'decrement.svg' : 'increment.svg'}`}
          className="xl:w-32 w-full h-full md:h-32 xl:h-full"
          alt="trend graph"
        />
      </div>
    </article>
  );
}

export default StatsCard