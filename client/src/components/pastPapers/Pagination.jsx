const Pagination = ({ current, setCurrent }) => {
  return (
    <div className="flex justify-between mt-10">

      <p className="text-sm text-gray-500">
        Showing 1-6 of 142
      </p>

      <div className="flex gap-2">
        {[1, 2, 3].map((n) => (
          <button
            key={n}
            onClick={() => setCurrent(n)}
            className={`w-8 h-8 rounded ${
              current === n ? "bg-green-800 text-white" : "border"
            }`}
          >
            {n}
          </button>
        ))}
      </div>

    </div>
  );
};

export default Pagination;