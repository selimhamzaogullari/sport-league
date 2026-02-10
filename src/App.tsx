import React, { useState, useEffect, useMemo } from 'react';

const API_ALL_LEAGUES = 'https://www.thesportsdb.com/api/v1/json/3/all_leagues.php';
const API_SEASON_BADGE = 'https://www.thesportsdb.com/api/v1/json/3/lookupleague.php?id=';

const App = () => {
  const [leagues, setLeagues] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState('All');
  const [loading, setLoading] = useState(true);
  const [badges, setBadges] = useState({}); // Caching badges

  useEffect(() => {
    // 1. Fetch with Cache Logic
    const fetchData = async () => {
      const cachedData = localStorage.getItem('sports_leagues');
      if (cachedData) {
        setLeagues(JSON.parse(cachedData));
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(API_ALL_LEAGUES);
        const data = await res.json();
        setLeagues(data.leagues);
        localStorage.setItem('sports_leagues', JSON.stringify(data.leagues));
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. Filter Logic (Memoized for performance)
  const filteredLeagues = useMemo(() => {
    return leagues.filter(league => {
      const matchesSearch = league.strLeague.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSport = selectedSport === 'All' || league.strSport === selectedSport;
      return matchesSearch && matchesSport;
    });
  }, [leagues, searchTerm, selectedSport]);

  const sportsOptions = ['All', ...new Set(leagues.map(l => l.strSport))];

  // 3. Handle League Click (Fetch Badge)
  const fetchBadge = async (id) => {
    if (badges[id]) return; // Already cached in state

    const res = await fetch(`${API_SEASON_BADGE}${id}`);
    const data = await res.json();
    const badgeUrl = data.leagues?.[0]?.strBadge;
    setBadges(prev => ({ ...prev, [id]: badgeUrl }));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Sports Leagues Explorer</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search leagues..."
          className="flex-1 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="p-3 border rounded-lg shadow-sm bg-white"
          onChange={(e) => setSelectedSport(e.target.value)}
        >
          {sportsOptions.map(sport => (
            <option key={sport} value={sport}>{sport}</option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {loading ? <p>Loading...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeagues.map(league => (
            <div 
              key={league.idLeague}
              onClick={() => fetchBadge(league.idLeague)}
              className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer border border-transparent hover:border-blue-400"
            >
              <h3 className="text-xl font-bold text-blue-700 mb-2">{league.strLeague}</h3>
              <p className="text-sm text-gray-500 font-medium mb-1 uppercase tracking-wider">{league.strSport}</p>
              <p className="text-sm text-gray-400 italic mb-4">
                {league.strLeagueAlternate || 'No alternate names'}
              </p>
              
              {/* Badge Display Area */}
              {badges[league.idLeague] && (
                <div className="mt-4 flex justify-center animate-fade-in">
                  <img src={badges[league.idLeague]} alt="Badge" className="h-24 w-24 object-contain" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;