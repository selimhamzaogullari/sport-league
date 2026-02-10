import React from 'react';

interface LeagueFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedSport: string;
  onSportChange: (value: string) => void;
  sportOptions: string[];
}

const LeagueFilters: React.FC<LeagueFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedSport,
  onSportChange,
  sportOptions,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      {/* Search Input */}
      <div className="relative flex-1">
        <input
          type="text"
          value={searchTerm}
          placeholder="Search leagues..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white outline-none shadow-sm"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Sport Select */}
      <div className="w-full sm:w-48">
        <select
          value={selectedSport}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white outline-none cursor-pointer"
          onChange={(e) => onSportChange(e.target.value)}
        >
          {sportOptions.map((sport) => (
            <option key={sport} value={sport}>
              {sport}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LeagueFilters;