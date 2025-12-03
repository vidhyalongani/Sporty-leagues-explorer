import type { League } from '../types/league';
import LeagueCard from './LeagueCard';

type LeagueListProps = {
  leagues: League[];
};

export default function LeagueList({ leagues }: LeagueListProps) {
  return (
    <div className="league-list">
      {leagues.map((league) => (
        <LeagueCard key={league.idLeague} league={league} />
      ))}
    </div>
  );
}
