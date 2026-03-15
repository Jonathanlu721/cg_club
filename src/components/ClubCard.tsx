import { Club } from '../types';

interface Props {
  club: Club;
  onClick: (club: Club) => void;
}

export default function ClubCard({ club, onClick }: Props) {
  return (
    <div
      onClick={() => onClick(club)}
      className="relative group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100"
    >
      <div className="p-6 h-full flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-4">
            <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-indigo-50 text-indigo-600">
              {club.type}
            </span>
            <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getRatingColor(club.rating)}`}>
              {club.rating}
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">{club.name}</h3>
        </div>
        
        {/* Hover overlay for brief */}
        <div className="absolute inset-0 bg-indigo-600/95 text-white p-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p className="text-center font-medium leading-relaxed">{club.brief}</p>
        </div>
      </div>
    </div>
  );
}

function getRatingColor(rating: string) {
  switch (rating) {
    case '特優': return 'bg-yellow-100 text-yellow-800';
    case '優等': return 'bg-orange-100 text-orange-800';
    case '甲等': return 'bg-emerald-100 text-emerald-800';
    case '乙等': return 'bg-blue-100 text-blue-800';
    case '丙等': return 'bg-slate-100 text-slate-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}
