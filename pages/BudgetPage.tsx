import React from 'react';
import Card from '../components/Card';
import { budgetCategories } from '../constants';
import { BudgetCategory } from '../types';
import { Plus } from '../components/Icons';
import { useNavigate } from 'react-router-dom';

const ProgressBar: React.FC<{ spent: number; budget: number, color: string }> = ({ spent, budget, color }) => {
    const percentage = budget > 0 ? (spent / budget) * 100 : 0;
    const displayPercentage = Math.min(percentage, 100);
    const colorClass = `bg-${color}-500`;

    return (
        <div className="bg-slate-200 relative h-2 w-full overflow-hidden rounded-full">
            <div className={`h-full w-full flex-1 transition-all ${colorClass}`} style={{ transform: `translateX(-${100 - displayPercentage}%)` }}></div>
        </div>
    );
};

const BudgetCategoryItem: React.FC<{ category: BudgetCategory }> = ({ category }) => {
    const remaining = category.budget - category.spent;
    const isOverBudget = remaining < 0;

    return (
        <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-opacity-20 bg-${category.color}-500`}>
                        {category.icon}
                    </div>
                    <span className="font-medium">{category.name}</span>
                </div>
                <div className="text-right">
                    <div className="font-semibold">${category.spent.toLocaleString()}</div>
                    <div className="text-xs text-slate-500">de ${category.budget.toLocaleString()}</div>
                </div>
            </div>
            <ProgressBar spent={category.spent} budget={category.budget} color={category.color} />
            <div className={`text-xs ${isOverBudget ? 'text-red-500' : 'text-slate-500'}`}>
                {isOverBudget ? `Excedido por $${Math.abs(remaining).toLocaleString()}` : `$${remaining.toLocaleString()} restantes`}
            </div>
        </Card>
    );
};


const BudgetPage: React.FC = () => {
    const navigate = useNavigate();
    const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0);
    const totalBudget = budgetCategories.reduce((sum, cat) => sum + cat.budget, 0);
    const totalPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
    const totalRemaining = totalBudget - totalSpent;

    return (
        <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Seguimiento Presupuesto</h2>
                <button 
                  onClick={() => navigate('/budget/add')}
                  className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 h-8 px-3">
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar categoría
                </button>
            </div>

            <Card>
                <div className="px-6 pt-6 pb-3">
                    <h4 className="text-base">Resumen de Este Mes</h4>
                </div>
                <div className="px-6 pb-6">
                    <div className="text-2xl font-bold mb-2">${totalSpent.toLocaleString()} / ${totalBudget.toLocaleString()}</div>
                    <ProgressBar spent={totalSpent} budget={totalBudget} color="blue" />
                    <div className="text-sm text-slate-500 mt-2">
                        {totalPercentage.toFixed(1)}% del presupuesto usado • ${totalRemaining.toLocaleString()} restantes
                    </div>
                </div>
            </Card>

            <div className="space-y-3">
                {budgetCategories.map(cat => <BudgetCategoryItem key={cat.id} category={cat} />)}
            </div>
        </div>
    );
};

export default BudgetPage;
