import { useState, useEffect, useMemo } from 'react';
import './App.css'
import { leagueService } from './services/service';
import LeagueCard from './components/LeagueCard';
import type { League } from './types';
import LeagueFilters from './components/LeagueFilters';

const API_ALL_LEAGUES = 'https://www.thesportsdb.com/api/v1/json/3/all_leagues.php';
const API_BADGE = 'https://www.thesportsdb.com/api/v1/json/3/lookupleague.php?id=';

function App() {
  console.log("sadkasdlaskd")
  const [leagues, setLeagues] = useState<League[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState('All');
  const [badges, setBadges] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Get All Leagues
    const loadLeagues = async () => {
      try {
        const data = await leagueService.getAllLeagues();
        setLeagues(data.leagues);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadLeagues();
  }, []);

  // Sport Types
  const sportOptions = ['All', 'Soccer', 'Basketball', 'Motorsport']

  // Filter
  const filteredLeagues = useMemo(() => {
    return leagues.filter(l => {
      const nameMatch = l.strLeague.toLowerCase().includes(searchTerm.toLowerCase());
      const sportMatch = selectedSport === 'All' || l.strSport === selectedSport;
      return nameMatch && sportMatch;
    });
  }, [leagues, searchTerm, selectedSport]);

  // Get Badge (Image)
  const handleLeagueClick = async (id: string) => {
   if (badges[id]) return; // Simple cache

    try {
      const badgeUrl = await leagueService.getLeagueBadge(id);
      if (badgeUrl) {
        setBadges(prev => ({ ...prev, [id]: badgeUrl }));
      }
    } catch (error) {
      console.error(error);
    }
  };
  console.log(filteredLeagues)

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Sports Leagues</h1>
          
          {/* Filter Controls */}
          <LeagueFilters 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedSport={selectedSport}
            onSportChange={setSelectedSport}
            sportOptions={sportOptions}
          />
        </header>

        {loading ? (
          <div className="text-center py-20">Loading leagues...</div>
        ) : filteredLeagues.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLeagues.map(league => (
              <LeagueCard 
                key={league.idLeague}
                league={league}
                badge={badges[league.idLeague]}
                onClick={() => handleLeagueClick(league.idLeague)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">No leagues found.</div>
        )}
      </div>
    </main>
  );
}

export default App
