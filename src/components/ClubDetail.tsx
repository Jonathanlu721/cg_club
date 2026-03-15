import { ArrowLeft, Users, DollarSign, Award, BookOpen, Calendar, Star } from 'lucide-react';
import { Club } from '../types';

interface Props {
  club: Club;
  onBack: () => void;
}

export default function ClubDetail({ club, onBack }: Props) {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-8 md:p-12">
        <button
          onClick={onBack}
          className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          返回社團列表
        </button>

        <div className="flex flex-wrap items-center gap-4 mb-6">
          <span className="px-4 py-1.5 text-sm font-medium rounded-full bg-indigo-50 text-indigo-600">
            {club.type}
          </span>
          <span className="px-4 py-1.5 text-sm font-medium rounded-full bg-yellow-50 text-yellow-700 flex items-center">
            <Star className="w-4 h-4 mr-1.5 fill-current" />
            評鑑：{club.rating}
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">{club.name}</h1>
        <p className="text-xl text-slate-600 mb-12 leading-relaxed">{club.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="flex items-start p-6 rounded-2xl bg-slate-50">
            <Users className="w-6 h-6 text-indigo-500 mr-4 mt-1" />
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">社團人數</h3>
              <p className="text-slate-600">{club.membersRange}</p>
            </div>
          </div>
          <div className="flex items-start p-6 rounded-2xl bg-slate-50">
            <DollarSign className="w-6 h-6 text-emerald-500 mr-4 mt-1" />
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">社費</h3>
              <p className="text-slate-600">{club.fee} 元 / 學期</p>
            </div>
          </div>
          <div className="flex items-start p-6 rounded-2xl bg-slate-50">
            <Award className="w-6 h-6 text-orange-500 mr-4 mt-1" />
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">幹部名單</h3>
              <p className="text-slate-600">{club.cadres.join('、')}</p>
            </div>
          </div>
          <div className="flex items-start p-6 rounded-2xl bg-slate-50">
            <BookOpen className="w-6 h-6 text-blue-500 mr-4 mt-1" />
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">社課內容</h3>
              <p className="text-slate-600 leading-relaxed">{club.classContent}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
            <Calendar className="w-6 h-6 mr-3 text-indigo-600" />
            年度活動
          </h3>
          <ul className="space-y-4">
            {club.activities.map((activity, index) => (
              <li key={index} className="flex items-center p-4 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold mr-4 shrink-0">
                  {index + 1}
                </div>
                <span className="text-slate-700 font-medium">{activity}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
