import { useEffect, useMemo, useState } from 'react';
import z from 'zod';
import './App.css';
import sportyLogo from './assets/sporty-logo.webp';
import LeagueFilters from './components/LeagueFilers';
import LeagueList from './components/LeagueList';
import { ALL_LEAGUES_URL } from './constants/api-url';
import type { League } from './types/league';

const leaguesCache = { current: null as League[] | null };
const leagueSchema = z.object({
  idLeague: z.string(),
  strLeague: z.string(),
  strSport: z.string().optional().default(''),
  strLeagueAlternate: z.string().optional().default(''),
});

function App() {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sportFilter, setSportFilter] = useState('All');
  
  useEffect(() => {
    const controller = new AbortController();

    const fetchLeagues = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const response = await fetch(ALL_LEAGUES_URL, { signal: controller.signal });
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
          <section className="controls" aria-label="Filters">
            <LeagueFilters
              searchTerm={searchTerm}
              sportFilter={sportFilter}
              sports={sports}
              onSearchChange={setSearchTerm}
              onSportChange={setSportFilter}
            />
          </section>
          <section className="leagues" aria-label="Leagues List">
            {fetchError && (
              <div className="error" role="alert">
                Unable to load leagues: {fetchError}
              </div>
            )}

            <div className="list-container">
              {isLoading ? (
                <span className="loading">Loading leagues...</span>
              ) : (
                <LeagueList leagues={leagues} />
              )}
            </div>
          </section>
        </div>
      </div>

      <footer className="footer">© 2025 Sporty Group</footer>
    </main>
  )
}

export default App
