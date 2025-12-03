type LeagueFiltersProps = {
  searchTerm: string;
  sportFilter: string;
  sports: string[];
  onSearchChange: (value: string) => void;
  onSportChange: (value: string) => void;
};

export default function LeagueFilters({
  searchTerm,
  sportFilter,
  sports,
  onSearchChange,
  onSportChange,
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
          placeholder="Search by league or alternate name"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search leagues"
        />
      </div>
      <div className="control-group">
        <div className="label-row">
          <span>Sport</span>
        </div>
        <select
          className="select"
          value={sportFilter}
          onChange={(e) => onSportChange(e.target.value)}
          aria-label="Filter by sport"
        >
          <option value="All">All sports</option>
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
