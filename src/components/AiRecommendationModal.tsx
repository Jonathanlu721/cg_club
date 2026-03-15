import { useState } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { clubsData } from '../data/clubs';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface Recommendation {
  name: string;
  reason: string;
}

export default function AiRecommendationModal({ isOpen, onClose }: Props) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleRecommend = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setError('');
    setRecommendations(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const clubsContext = clubsData.map(c => `- ${c.name} (${c.type}): ${c.brief}`).join('\n');
      
      const prompt = `
你是一個高中社團推薦助手。
以下是成功高中的社團列表與簡介：
${clubsContext}

學生需求：${input}

請根據學生的需求，從上述社團中推薦 3 個最適合的社團，並說明推薦理由。
請務必以 JSON 陣列格式回傳，格式如下：
[
  { "name": "社團名稱", "reason": "推薦理由" },
  { "name": "社團名稱", "reason": "推薦理由" },
  { "name": "社團名稱", "reason": "推薦理由" }
]
不要回傳任何其他文字，只要 JSON。
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      const text = response.text || '';
      try {
        const result = JSON.parse(text);
        setRecommendations(result);
      } catch (e) {
        console.error("Failed to parse JSON", text);
        setError('解析推薦結果失敗，請再試一次。');
      }
    } catch (err) {
      console.error(err);
      setError('發生錯誤，請稍後再試。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-50/50">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center">
            <Sparkles className="w-6 h-6 text-indigo-600 mr-2" />
            AI 智慧推薦社團
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          <p className="text-slate-600 mb-4">
            不知道該選什麼社團嗎？告訴我你的興趣、專長或是想在社團學到什麼，AI 將為你推薦最適合的 3 個社團！
          </p>
          
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="例如：我喜歡聽音樂，也想學點樂器，但沒有基礎。希望社團氣氛活潑一點..."
            className="w-full h-32 p-4 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none resize-none transition-all mb-4"
          />
          
          <button
            onClick={handleRecommend}
            disabled={loading || !input.trim()}
            className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-medium rounded-xl transition-colors flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                AI 思考中...
              </>
            ) : (
              '開始推薦'
            )}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl text-sm">
              {error}
            </div>
          )}

          {recommendations && (
            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-bold text-slate-800 mb-4">為您推薦的社團：</h3>
              {recommendations.map((rec, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                  <h4 className="text-xl font-bold text-indigo-600 mb-2">{rec.name}</h4>
                  <p className="text-slate-700 leading-relaxed">{rec.reason}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
