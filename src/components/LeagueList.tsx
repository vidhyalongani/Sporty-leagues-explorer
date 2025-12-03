import type { League } from '../types/league';

type LeagueListProps = {
  leagues: League[];
};

export default function LeagueList({ leagues }: LeagueListProps) {
  return (
    <div className="league-list">
      {leagues.map((league) => (
        <div key={league.idLeague} className="league-card">
          <h3>{league.strLeague}</h3>
          <p>Sport: {league.strSport}</p>
          {league.strLeagueAlternate && (
            <p>Also known as: {league.strLeagueAlternate}</p>
          )}
        </div>
      ))}
    </div>
  );
}
