import { memo } from 'react';
import type { League } from '../types/league';
import LeagueCard from './LeagueCard';

type LeagueListProps = {
  leagues: League[];
  onSelect: (league: League) => void;
};

function LeagueList({ leagues, onSelect }: LeagueListProps) {
  return (
    <div className="league-list">
      {leagues.map((league) => (
        <LeagueCard key={league.idLeague} league={league} onSelect={onSelect} />
      ))}
    </div>
  );
}

export default memo(LeagueList);
