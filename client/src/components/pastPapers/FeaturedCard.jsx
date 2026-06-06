const FeaturedCard = () => {
  return (
    <div className="bg-white border rounded-2xl flex overflow-hidden">

      <img
        src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300"
        className="w-40 object-cover"
      />

      <div className="p-4">
        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
          Trending
        </span>

        <h3 className="mt-2 font-semibold">
          Macroeconomics Analysis
        </h3>

        <p className="text-xs text-gray-500 mt-2">
          Faculty recommended revision paper for finals.
        </p>

        <button className="mt-3 text-sm text-green-800 font-semibold">
          Access Guide
        </button>
      </div>

    </div>
  );
};

export default FeaturedCard;