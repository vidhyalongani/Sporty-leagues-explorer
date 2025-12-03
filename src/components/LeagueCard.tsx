import type { League } from '../types/league';

type LeagueCardProps = {
  league: League;
};

function LeagueCard({ league }: LeagueCardProps) {
  return (
    <button
      key={league.idLeague}
      type="button"
      className="league-card"
      onClick={(e) => e.preventDefault()}
      aria-label={`View ${league.strLeague}`}
    >
      <div className="league-card-initial">{league.strLeague.slice(0, 2).toUpperCase()}</div>
      <div className="league-card-body">
        <div className="league-name">{league.strLeague}</div>
        <div className="league-tag-row">
          {league.strSport && (
            <span className="tag league-sport" aria-label={`Sport: ${league.strSport}`}>
              {league.strSport}
            </span>
          )}
          {league.strLeagueAlternate && (
            <span className="tag league-alt-name" aria-label={`Alternate name: ${league.strLeagueAlternate}`}>
              {league.strLeagueAlternate}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

export default LeagueCard;
