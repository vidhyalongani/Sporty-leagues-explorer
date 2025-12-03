import type { League } from '../types/league';
import LeagueCard from './LeagueCard';

type LeagueListProps = {
  leagues: League[];
  onSelect: (league: League) => void;
};

export default function LeagueList({ leagues, onSelect }: LeagueListProps) {
  return (
    <div className="league-list">
      {leagues.map((league) => (
        <LeagueCard key={league.idLeague} league={league} onClick={onSelect} />
      ))}
    </div>
  );
}
