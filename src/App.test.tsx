import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { UI_CONSTANTS } from './constants/ui';

type MockLeague = {
  idLeague: string;
  strLeague: string;
  strSport: string;
  strLeagueAlternate: string;
};

const sampleLeagues: MockLeague[] = [
  { idLeague: '1', strLeague: 'English Premier League', strSport: 'Soccer', strLeagueAlternate: 'EPL' },
  { idLeague: '2', strLeague: 'NBA', strSport: 'Basketball', strLeagueAlternate: 'National Basketball Association' },
];

const renderFreshApp = async () => {
  vi.resetModules();
  const App = (await import('./App')).default;
  return render(<App />);
};

const mockFetchOnce = (payload: unknown, ok = true) => {
  (globalThis.fetch as unknown as Mock).mockResolvedValueOnce({
    ok,
    json: async () => payload,
  });
};

describe('App integration', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
    vi.resetModules();
  });

  it('shows loader while fetching and renders leagues with footer count', async () => {
    mockFetchOnce({ leagues: sampleLeagues });

    const { container } = await renderFreshApp();

    expect(container.querySelector('.loader')).toBeTruthy();

    await waitFor(() => expect(screen.getByText('English Premier League')).toBeInTheDocument());
    expect(screen.getByText('NBA')).toBeInTheDocument();
    expect(screen.getByText(/Showing/i)).toHaveTextContent('Showing 2 of 2 leagues');
  });

  it('filters by search term and shows empty state when no match', async () => {
    mockFetchOnce({ leagues: sampleLeagues });

    await renderFreshApp();
    await waitFor(() => screen.getByText('English Premier League'));

    const searchInput = screen.getByLabelText(UI_CONSTANTS.SEARCH_LEAGUES_PLACEHOLDER);
    fireEvent.change(searchInput, { target: { value: 'premier' } });

    expect(screen.getByText('English Premier League')).toBeInTheDocument();
    expect(screen.queryByText('NBA')).not.toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    expect(screen.getByText(UI_CONSTANTS.EMPTY_STATE)).toBeInTheDocument();
  });

  it('filters by sport dropdown', async () => {
    mockFetchOnce({ leagues: sampleLeagues });

    await renderFreshApp();
    await waitFor(() => screen.getByText('NBA'));

    const select = screen.getByLabelText(UI_CONSTANTS.FILTER_BY_SPORT_LABEL);
    fireEvent.change(select, { target: { value: 'Soccer' } });

    expect(screen.getByText('English Premier League')).toBeInTheDocument();
    expect(screen.queryByText('NBA')).not.toBeInTheDocument();

    fireEvent.change(select, { target: { value: UI_CONSTANTS.ALL_SPORTS_TERM } });
    expect(screen.getByText('NBA')).toBeInTheDocument();
  });

  it('shows error message when leagues fetch fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    (globalThis.fetch as unknown as Mock).mockRejectedValueOnce(new Error('network down'));

    await renderFreshApp();

    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
    expect(screen.getByText(/unable to load leagues/i)).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('does not refetch badge when cached for the same league', async () => {
    mockFetchOnce({ leagues: sampleLeagues });
    mockFetchOnce({ seasons: [{ strBadge: 'https://badge.example/test.png' }] });

    await renderFreshApp();
    await waitFor(() => screen.getByText('English Premier League'));

    const user = userEvent.setup();
    const leagueButton = screen.getByRole('button', { name: /view english premier league/i });

    await user.click(leagueButton);
    await waitFor(() => expect((globalThis.fetch as Mock).mock.calls.length).toBe(2));

    await user.click(leagueButton);
    expect((globalThis.fetch as Mock).mock.calls.length).toBe(2);
  });
});
