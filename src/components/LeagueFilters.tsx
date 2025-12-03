import { memo } from 'react';
import { UI_CONSTANTS } from "../constants/ui";

type LeagueFiltersProps = {
  searchTerm: string;
  sportFilter: string;
  sports: string[];
  hasFilters: boolean;
  onSearchChange: (value: string) => void;
  onSportChange: (value: string) => void;
  onClear: () => void;
};

function LeagueFilters({
  searchTerm,
  sportFilter,
  sports,
  hasFilters,
  onSearchChange,
  onSportChange,
  onClear,
}: LeagueFiltersProps) {
  return (
    <section className="controls" aria-label="Filters">
      <div className="control-group">
        <div className="label-row">
          <span>Search leagues</span>
        </div>
        <input
          className="input"
          type="search"
          placeholder={UI_CONSTANTS.SEARCH_LEAGUES_PLACEHOLDER}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label={UI_CONSTANTS.SEARCH_LEAGUES_PLACEHOLDER}
        />
      </div>
      <div className="control-group">
        <div className="label-row">
          <span>Sport</span>
          {hasFilters && (
            <button className="clear-btn" type="button" onClick={onClear}>
              Clear filters
            </button>
          )}
        </div>
        <select
          className="select"
          value={sportFilter}
          onChange={(e) => onSportChange(e.target.value)}
          aria-label={UI_CONSTANTS.FILTER_BY_SPORT_LABEL}
        >
          <option value={UI_CONSTANTS.ALL_SPORTS_TERM}>{UI_CONSTANTS.ALL_SPORTS_TERM}</option>
          {sports.map((sport) => (
            <option key={sport} value={sport}>
              {sport}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}

export default memo(LeagueFilters);
