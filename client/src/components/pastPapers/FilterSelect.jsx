const FilterSelect = ({ label }) => {
  return (
    <div>
      <label className="text-xs text-gray-400">{label}</label>

      <select className="w-full border rounded-xl px-3 py-2 text-sm mt-1">
        <option>All</option>
      </select>
    </div>
  );
};

export default FilterSelect;