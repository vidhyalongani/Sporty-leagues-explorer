import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import z from 'zod';
import './app-d.css';
import fallbackBadge from './assets/fallback-badge.svg';
import sportyLogo from './assets/sporty-logo.webp';
import BadgeModal from './components/BadgeModal';
import LeagueFilters from './components/LeagueFilters';
import LeagueList from './components/LeagueList';
import Loader from './components/Loader';
import { API_CONSTANTS } from './constants/api-url';
import { UI_CONSTANTS } from './constants/ui';
import type { League } from './types/league';

const leaguesCache = { current: null as League[] | null };
const leagueSchema = z.object({
  idLeague: z.string(),
  strLeague: z.string(),
  strSport: z.string().optional().default(''),
  strLeagueAlternate: z.string().optional().default(''),
});
const seasonSchema = z.object({
  strBadge: z.string().optional().nullable().default(''),
});
const seasonsSchema = z.array(seasonSchema);

function App() {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sportFilter, setSportFilter] = useState('All');
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [badgeMap, setBadgeMap] = useState<Record<string, string>>({});
  const inFlightBadgesRef = useRef<Set<string>>(new Set());

  const cacheBadgeForLeague = useCallback((leagueId: string, badgeUrl: string) => {
    setBadgeMap(prev => ({ ...prev, [leagueId]: badgeUrl }));
  }, []);

  const deferredSearchTerm = useDeferredValue(searchTerm);
  
  useEffect(() => {
    const controller = new AbortController();
    const fetchLeagues = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const response = await fetch(API_CONSTANTS.ALL_LEAGUES_URL, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Network response for leagues fetch has errors: ${response.status}`);
        }
        const data = await response.json();
        const parsedLeagues = z.array(leagueSchema).safeParse(data?.leagues);
        if (parsedLeagues.success) {
          leaguesCache.current = parsedLeagues.data;
          setLeagues(parsedLeagues.data);
        } else {
          console.warn('Validation errors, leagues data could not be parsed:', parsedLeagues.error);
          setLeagues([]);
        }
      } catch (error) {
        if ((error as Error)?.name === 'AbortError') return;
        setFetchError((error as Error).message);
      } finally {
        setIsLoading(false);
      }
    };
    if (leaguesCache.current) {
      setLeagues(leaguesCache.current);
    } else {
      fetchLeagues();
    }
    return () => controller.abort();
  }, []);

  const sports = useMemo(() => {
    const uniqueSportSet = new Set<string>();
    leagues.forEach((league) => {
      if (!league.strSport) return;
      uniqueSportSet.add(league.strSport);
    });
    return Array.from(uniqueSportSet).sort((a, b) => a.localeCompare(b));
  }, [leagues]);

  const filterBySport = useCallback((selectedSport: string) => {
    setSportFilter(selectedSport);
  }, []);

  const filteredLeagues = useMemo(() => {
    const searchQuery = deferredSearchTerm.toLowerCase().trim();
    const searchQueryLength = searchQuery.length;
    return leagues.filter((league) => {
      const matchesSearchTerm =
        searchQueryLength === 0 ||
        league.strLeague.toLowerCase().includes(searchQuery) ||
        league.strLeagueAlternate.toLowerCase().includes(searchQuery);

      const matchesSport = sportFilter === UI_CONSTANTS.ALL_SPORTS_TERM || league.strSport === sportFilter;
      return matchesSearchTerm && matchesSport;
    });
  }, [leagues, deferredSearchTerm, sportFilter]);

  const fetchBadgeForLeague = useCallback(async (leagueId: string) => {
    if (badgeMap[leagueId] || inFlightBadgesRef.current.has(leagueId)) return;
    inFlightBadgesRef.current.add(leagueId);
    try {
      const response = await fetch(`${API_CONSTANTS.SEASON_BADGE_URL}${encodeURIComponent(leagueId)}`);
      if (!response.ok) {
        throw new Error(`Network response for season badge fetch has errors: ${response.status}`);
      }
      const data = await response.json();
      const parsedSeasons = seasonsSchema.safeParse(data?.seasons ?? []);
      const seasons = parsedSeasons.success ? parsedSeasons.data : [];
      const rawBadge =
        seasons.find((s) => typeof s.strBadge === 'string' && s.strBadge.trim() !== '')?.strBadge ?? '';
      const badgeUrl = rawBadge !== '' ? rawBadge : fallbackBadge;
      cacheBadgeForLeague(leagueId, badgeUrl);
    } catch (error) {
      console.error('Error fetching badge:', error);
      cacheBadgeForLeague(leagueId, fallbackBadge);
    } finally {
      inFlightBadgesRef.current.delete(leagueId);
    }
  }, [badgeMap, cacheBadgeForLeague]);

  const handleLeagueClick = useCallback((league: League | null) => {
    if (!league) {
      setSelectedLeague(null);
      return;
    }
    setSelectedLeague(league);
    fetchBadgeForLeague(league.idLeague);
  }, [fetchBadgeForLeague]);

  return (     
    <main className="page">
      <header className="nav">
        <div className="nav-inner">
          <div className="nav-left">
            <img src={sportyLogo} alt="Sporty Group" className="brand-logo" />
            <div className="brand-text">
              <span className="title"> Sporty Leagues Explorer</span>
            </div>
          </div>
        </div>
      </header>

      <div className="content">
        <div className="content-inner">
          <LeagueFilters
            searchTerm={searchTerm}
            sportFilter={sportFilter}
            sports={sports}
            onSearchChange={setSearchTerm}
            onSportChange={filterBySport}
          />
          
          {fetchError && (
            <div className="error" role="alert">
              Unable to load leagues: {fetchError}
            </div>
          )}

          <div className="list-container">
            {isLoading ? (
              <Loader />
            ) : ( filteredLeagues.length === 0 ? (
              <div className="empty">{UI_CONSTANTS.EMPTY_STATE}</div>
            ) : (
              <LeagueList leagues={filteredLeagues} onSelect={handleLeagueClick} />
            ))}
          </div>
        </div>
      </div>

      <footer className="footer">© 2025 Sporty Group</footer>

      {
        selectedLeague && (<BadgeModal
          league={selectedLeague}
          strBadge={badgeMap[selectedLeague.idLeague]}
          onClose={() => setSelectedLeague(null)}
        />)
      }
    </main>
  )
}

export default App
