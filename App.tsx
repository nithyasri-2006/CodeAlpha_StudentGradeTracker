
import React, { useState, useMemo, useEffect } from 'react';
import { 
  PlusIcon, 
  TrashIcon, 
  ChartBarIcon, 
  UserGroupIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  SparklesIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { Student, GradeStats, AIInsights } from './types';
import StatsCard from './components/StatsCard';
import { getAIInsights } from './services/geminiService';

const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [aiInsights, setAiInsights] = useState<AIInsights | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  // Stats calculation
  const stats = useMemo<GradeStats>(() => {
    if (students.length === 0) return { average: 0, highest: 0, lowest: 0, total: 0 };
    const grades = students.map(s => s.grade);
    return {
      average: Number((grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(1)),
      highest: Math.max(...grades),
      lowest: Math.min(...grades),
      total: students.length
    };
  }, [students]);

  const handleAddGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !grade) return;
    
    const newStudent: Student = {
      id: crypto.randomUUID(),
      name,
      grade: Number(grade),
      subject,
      date: new Date().toLocaleDateString()
    };
    
    setStudents(prev => [newStudent, ...prev]);
    setName('');
    setGrade('');
  };

  const removeStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const generateAIReport = async () => {
    if (students.length === 0) return;
    setLoadingAI(true);
    try {
      const insights = await getAIInsights(students);
      setAiInsights(insights);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAI(false);
    }
  };

  const getGradeColor = (g: number) => {
    if (g >= 90) return '#10b981'; // Emerald
    if (g >= 75) return '#3b82f6'; // Blue
    if (g >= 60) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AcademicCapIcon className="w-8 h-8 text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-900">EduGrade <span className="text-indigo-600">Pro</span></h1>
          </div>
          <button 
            onClick={generateAIReport}
            disabled={students.length === 0 || loadingAI}
            className="flex items-center space-x-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 transition-colors disabled:opacity-50"
          >
            {loadingAI ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-700 border-t-transparent" />
            ) : (
              <SparklesIcon className="w-5 h-5" />
            )}
            <span>AI Analysis</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Entry & List */}
        <div className="lg:col-span-4 space-y-6">
          {/* Add Form */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <PlusIcon className="w-5 h-5 text-indigo-600" />
              Add Student Grade
            </h2>
            <form onSubmit={handleAddGrade} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Student Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Grade (0-100)</label>
                  <input 
                    type="number" 
                    min="0"
                    max="100"
                    value={grade}
                    onChange={e => setGrade(e.target.value)}
                    placeholder="85"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                  <select 
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  >
                    <option>Mathematics</option>
                    <option>Science</option>
                    <option>History</option>
                    <option>Language</option>
                    <option>Arts</option>
                  </select>
                </div>
              </div>
              <button 
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center justify-center space-x-2"
              >
                <PlusIcon className="w-5 h-5" />
                <span>Save Grade</span>
              </button>
            </form>
          </section>

          {/* Student List */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="font-semibold text-slate-900">Student List</h2>
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">{students.length} Total</span>
            </div>
            <div className="max-h-[500px] overflow-y-auto">
              {students.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <UserGroupIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>No grades recorded yet.</p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {students.map(student => (
                    <li key={student.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                      <div>
                        <h4 className="font-medium text-slate-900">{student.name}</h4>
                        <p className="text-xs text-slate-500">{student.subject} • {student.date}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-lg font-bold" style={{ color: getGradeColor(student.grade) }}>
                          {student.grade}
                        </span>
                        <button 
                          onClick={() => removeStudent(student.id)}
                          className="text-slate-300 hover:text-red-500 transition-colors p-1"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Analytics & Reports */}
        <div className="lg:col-span-8 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatsCard 
              label="Class Average" 
              value={stats.average} 
              icon={<ChartBarIcon className="w-6 h-6" />} 
              color="bg-blue-500" 
            />
            <StatsCard 
              label="Highest Score" 
              value={stats.highest} 
              icon={<ArrowTrendingUpIcon className="w-6 h-6" />} 
              color="bg-emerald-500" 
            />
            <StatsCard 
              label="Lowest Score" 
              value={stats.lowest} 
              icon={<ArrowTrendingDownIcon className="w-6 h-6" />} 
              color="bg-rose-500" 
            />
          </div>

          {/* Visual Analysis */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
              <ChartBarIcon className="w-5 h-5 text-indigo-600" />
              Grade Distribution
            </h2>
            <div className="h-[300px] w-full">
              {students.length === 0 ? (
                <div className="flex items-center justify-center h-full text-slate-400 italic">
                  Enter data to visualize grades
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={students}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                    <Tooltip 
                      cursor={{fill: '#f8fafc'}}
                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    />
                    <Bar dataKey="grade" radius={[4, 4, 0, 0]} barSize={40}>
                      {students.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getGradeColor(entry.grade)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </section>

          {/* AI Insights Card */}
          {aiInsights && (
            <section className="bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-100 overflow-hidden text-white animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-2">
                    <SparklesIcon className="w-6 h-6" />
                    <h2 className="text-xl font-bold">AI Performance Report</h2>
                  </div>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-widest">
                    {aiInsights.performanceLevel}
                  </span>
                </div>
                <div className="space-y-4">
                  <p className="text-indigo-50 leading-relaxed text-lg">
                    {aiInsights.summary}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {aiInsights.recommendations.map((rec, i) => (
                      <div key={i} className="bg-white/10 p-4 rounded-xl flex items-start space-x-3">
                        <span className="mt-1 w-5 h-5 flex-shrink-0 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold">
                          {i+1}
                        </span>
                        <p className="text-sm">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Summary Report Section (Task Requirement) */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Summary Report</h2>
                <button 
                  onClick={() => window.print()}
                  className="text-indigo-600 text-sm font-medium hover:underline"
                >
                  Print Report
                </button>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left text-sm">
                 <thead className="text-slate-500 border-b border-slate-100 uppercase tracking-tighter text-[10px] font-bold">
                   <tr>
                     <th className="py-3 px-2">Student</th>
                     <th className="py-3 px-2">Subject</th>
                     <th className="py-3 px-2">Date</th>
                     <th className="py-3 px-2 text-right">Grade</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                   {students.map(s => (
                     <tr key={s.id} className="hover:bg-slate-50">
                        <td className="py-3 px-2 font-medium">{s.name}</td>
                        <td className="py-3 px-2 text-slate-500">{s.subject}</td>
                        <td className="py-3 px-2 text-slate-500">{s.date}</td>
                        <td className="py-3 px-2 text-right font-bold" style={{ color: getGradeColor(s.grade) }}>{s.grade}%</td>
                     </tr>
                   ))}
                   {students.length > 0 && (
                     <tr className="bg-slate-50 font-bold">
                        <td colSpan={3} className="py-4 px-2 text-right text-slate-600 uppercase text-xs">Averaged Total Result</td>
                        <td className="py-4 px-2 text-right text-indigo-600 text-lg">{stats.average}%</td>
                     </tr>
                   )}
                 </tbody>
               </table>
             </div>
          </section>
        </div>
      </main>

      {/* Floating Action Button for Mobile Add */}
      <div className="lg:hidden fixed bottom-6 right-6">
        <button 
          onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
          className="bg-indigo-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform"
        >
          <PlusIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default App;
