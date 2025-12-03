import type { League } from '../types/league';

type LeagueCardProps = {
  league: League;
};

function LeagueCard({ league }: LeagueCardProps) {
  return (
    <div key={league.idLeague} className="league-card">
      <h3>{league.strLeague}</h3>
      <p>Sport: {league.strSport}</p>
      {league.strLeagueAlternate && (
        <p>Also known as: {league.strLeagueAlternate}</p>
      )}
    </div>
  );
};

export default LeagueCard;
