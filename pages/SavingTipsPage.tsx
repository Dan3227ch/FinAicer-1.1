import React from 'react';
import Card from '../components/Card';
import { ArrowLeft, TrendingUp, Star, Lightbulb, DollarSign, Calendar } from '../components/Icons';
import { useNavigate } from 'react-router-dom';
import { SavingTip } from '../types';
import { useAppContext } from '../contexts/AppContext';

const TipCard: React.FC<{ tip: SavingTip; onImplement: (id: string) => void }> = ({ tip, onImplement }) => {
  const difficultyColors = {
    'Fácil': 'bg-green-100 text-green-800',
    'Medio': 'bg-yellow-100 text-yellow-800',
    'Difícil': 'bg-red-100 text-red-800',
  };
  return (
    <div className="p-4 border rounded-lg bg-white">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-opacity-20 bg-amber-100">{tip.icon}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium">{tip.title}</h4>
            <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${difficultyColors[tip.difficulty]}`}>{tip.difficulty}</span>
          </div>
          <p className="text-sm text-slate-500 mb-2">{tip.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1"><DollarSign className="h-3 w-3 text-green-600" /><span className="font-medium text-green-600">${tip.potentialSaving}</span></div>
              <div className="flex items-center gap-1"><Calendar className="h-3 w-3 text-slate-500" /><span className="text-slate-500">{tip.frequency}</span></div>
            </div>
            <button 
                onClick={() => onImplement(tip.id)}
                disabled={tip.implemented}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium border h-8 px-3 disabled:bg-green-100 disabled:text-green-700 disabled:border-green-200 bg-white hover:bg-slate-50">
                {tip.implemented ? 'Implementado' : 'Implementar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SavingTipsPage: React.FC = () => {
  const navigate = useNavigate();
  const { savingTips, implementTip, getImplementedCount, getImplementedSavings, getTotalPotentialSavings } = useAppContext();
  const totalPotentialSaving = getTotalPotentialSavings();
  const implementedSavings = getImplementedSavings();
  const potentialAchieved = totalPotentialSaving > 0 ? (implementedSavings / totalPotentialSaving) * 100 : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex items-center gap-3 p-4 bg-white border-b sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 rounded-md hover:bg-slate-100"><ArrowLeft className="h-5 w-5" /></button>
        <h1 className="text-lg font-semibold">Consejos de ahorro</h1>
      </header>
      <main className="p-4 space-y-4">
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-500 rounded-lg"><TrendingUp className="h-4 w-4 text-white" /></div>
              <div>
                <h3 className="font-semibold">Potencial de Ahorro</h3>
                <p className="text-sm text-slate-500">Basado en tus patrones de gasto</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-bold text-green-600">${totalPotentialSaving}</div>
                <div className="text-sm text-slate-500">Posible ahorro mensual</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">${implementedSavings}</div>
                <div className="text-sm text-slate-500">Ya implementado</div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
            <div className="px-6 pt-6 flex items-center gap-2"><Lightbulb className="h-5 w-5 text-orange-500" /><h4 className="font-semibold">Consejos personalizados</h4></div>
            <div className="px-6 pb-6 space-y-3">
                {savingTips.map(tip => <TipCard key={tip.id} tip={tip} onImplement={implementTip} />)}
            </div>
        </Card>
        
        <Card>
            <div className="px-6 pt-6"><h4 className="font-semibold">Tu Progreso</h4></div>
            <div className="px-6 pb-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-slate-100 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{getImplementedCount()}</div>
                        <div className="text-sm text-slate-500">Consejos implementados</div>
                    </div>
                    <div className="text-center p-3 bg-slate-100 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{potentialAchieved.toFixed(0)}%</div>
                        <div className="text-sm text-slate-500">Potencial alcanzado</div>
                    </div>
                </div>
            </div>
        </Card>
      </main>
    </div>
  );
};

export default SavingTipsPage;
