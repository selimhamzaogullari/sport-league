// Alt Bileşen: LeagueCard
interface CardProps {
  league: League;
  badge?: string;
  onClick: () => void;
}

const LeagueCard: React.FC<CardProps> = ({ league, badge, onClick }) => (
  <article 
    onClick={onClick}
    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer border border-gray-200 flex flex-col items-center text-center h-full"
  >
    <span className="text-xs font-semibold uppercase tracking-wider text-primary-dark mb-2">
      {league.strSport}
    </span>
    <h2 className="text-xl font-bold text-primary-800 mb-2">{league.strLeague}</h2>
    <p className="text-sm text-gray-500 italic mb-4">
      {league.strLeagueAlternate || '---'}
    </p>
    
    {badge && (
      <div className="mt-auto pt-4 animate-in fade-in zoom-in duration-300">
        <img src={badge} alt={`${league.strLeague} badge`} className="w-24 h-24 object-contain" />
      </div>
    )}
  </article>
);

export default LeagueCard;