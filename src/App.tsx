import { useState, useEffect, useMemo } from 'react';
import { Sparkles, Search } from 'lucide-react';
import { clubsData } from './data/clubs';
import { Club, ClubType, Rating } from './types';
import ClubCard from './components/ClubCard';
import ClubDetail from './components/ClubDetail';
import AiRecommendationModal from './components/AiRecommendationModal';

export default function App() {
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  
  // Filters
  const [filterType, setFilterType] = useState<ClubType | 'All'>('All');
  const [filterRating, setFilterRating] = useState<Rating | 'All'>('All');
  const [filterMembers, setFilterMembers] = useState<'All' | '<30' | '30-50' | '>50'>('All');
  const [filterFee, setFilterFee] = useState<'All' | '<500' | '500-1000' | '>1000'>('All');
  const [sortBy, setSortBy] = useState<'Random' | 'RatingDesc' | 'FeeAsc' | 'FeeDesc'>('Random');

  // Randomize initially
  const [shuffledClubs, setShuffledClubs] = useState<Club[]>([]);

  useEffect(() => {
    // Shuffle array on mount
    const shuffled = [...clubsData].sort(() => Math.random() - 0.5);
    setShuffledClubs(shuffled);
  }, []);

  const filteredAndSortedClubs = useMemo(() => {
    let result = [...shuffledClubs];

    if (filterType !== 'All') {
      result = result.filter(c => c.type === filterType);
    }
    if (filterRating !== 'All') {
      result = result.filter(c => c.rating === filterRating);
    }
    if (filterMembers !== 'All') {
      result = result.filter(c => {
        const match = c.membersRange.match(/(\d+)~(\d+)/);
        if (!match) return false;
        const avg = (parseInt(match[1]) + parseInt(match[2])) / 2;
        if (filterMembers === '<30') return avg < 30;
        if (filterMembers === '30-50') return avg >= 30 && avg <= 50;
        if (filterMembers === '>50') return avg > 50;
        return true;
      });
    }
    if (filterFee !== 'All') {
      result = result.filter(c => {
        if (filterFee === '<500') return c.fee < 500;
        if (filterFee === '500-1000') return c.fee >= 500 && c.fee <= 1000;
        if (filterFee === '>1000') return c.fee > 1000;
        return true;
      });
    }

    const ratingOrder: Record<string, number> = { '特優': 5, '優等': 4, '甲等': 3, '乙等': 2, '丙等': 1 };

    if (sortBy === 'RatingDesc') {
      result.sort((a, b) => ratingOrder[b.rating] - ratingOrder[a.rating]);
    } else if (sortBy === 'FeeAsc') {
      result.sort((a, b) => a.fee - b.fee);
    } else if (sortBy === 'FeeDesc') {
      result.sort((a, b) => b.fee - a.fee);
    }

    return result;
  }, [shuffledClubs, filterType, filterRating, filterMembers, filterFee, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center mr-4 shadow-sm shadow-indigo-200">
              <span className="text-white font-bold text-xl">CG</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">成功高中社團資訊網</h1>
          </div>
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center px-5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium rounded-full transition-colors"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            AI 智慧推薦
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {selectedClub ? (
          <ClubDetail club={selectedClub} onBack={() => setSelectedClub(null)} />
        ) : (
          <>
            {/* Filters */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-10">
              <div className="flex items-center mb-4 text-slate-800 font-semibold">
                <Search className="w-5 h-5 mr-2 text-slate-400" />
                篩選與排序
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <select 
                  value={filterType} 
                  onChange={e => setFilterType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                >
                  <option value="All">所有類型</option>
                  <option value="學術">學術性</option>
                  <option value="體育">體育性</option>
                  <option value="音樂">音樂性</option>
                  <option value="技藝">技藝性</option>
                  <option value="服務">服務性</option>
                  <option value="康樂">康樂性</option>
                </select>

                <select 
                  value={filterRating} 
                  onChange={e => setFilterRating(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                >
                  <option value="All">所有評鑑</option>
                  <option value="特優">特優</option>
                  <option value="優等">優等</option>
                  <option value="甲等">甲等</option>
                  <option value="乙等">乙等</option>
                  <option value="丙等">丙等</option>
                </select>

                <select 
                  value={filterMembers} 
                  onChange={e => setFilterMembers(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                >
                  <option value="All">所有人數</option>
                  <option value="<30">30人以下</option>
                  <option value="30-50">30~50人</option>
                  <option value=">50">50人以上</option>
                </select>

                <select 
                  value={filterFee} 
                  onChange={e => setFilterFee(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                >
                  <option value="All">所有社費</option>
                  <option value="<500">500元以下</option>
                  <option value="500-1000">500~1000元</option>
                  <option value=">1000">1000元以上</option>
                </select>

                <select 
                  value={sortBy} 
                  onChange={e => setSortBy(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                >
                  <option value="Random">隨機排序 (預設)</option>
                  <option value="RatingDesc">評鑑分數 (高至低)</option>
                  <option value="FeeAsc">社費 (低至高)</option>
                  <option value="FeeDesc">社費 (高至低)</option>
                </select>
              </div>
            </div>

            {/* Club Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedClubs.map(club => (
                <ClubCard key={club.id} club={club} onClick={setSelectedClub} />
              ))}
            </div>

            {filteredAndSortedClubs.length === 0 && (
              <div className="text-center py-20 text-slate-500">
                找不到符合條件的社團，請嘗試調整篩選條件。
              </div>
            )}
          </>
        )}
      </main>

      <AiRecommendationModal 
        isOpen={isAiModalOpen} 
        onClose={() => setIsAiModalOpen(false)} 
      />
    </div>
  );
}
