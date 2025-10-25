import React, { useState } from 'react';
import Card from '../components/Card';
import { recentTransactions } from '../constants';
import { TrendingUp, TrendingDown, DollarSign, PiggyBank, MoreHorizontal } from '../components/Icons';
import { Transaction } from '../types';
import TransactionDetailModal from '../components/TransactionDetailModal';

const TransactionItem: React.FC<{ transaction: Transaction; onClick: () => void; }> = ({ transaction, onClick }) => {
    const isIncome = transaction.type === 'income';
    return (
        <button className="w-full text-left transition-transform duration-200 hover:scale-[1.02]" onClick={onClick}>
            <Card className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${transaction.iconBgColor}`}>
                            {React.cloneElement(transaction.icon, { className: `h-4 w-4 ${transaction.iconColor}` })}
                        </div>
                        <div>
                            <div className="font-medium">{transaction.name}</div>
                            <div className="text-sm text-slate-500">{transaction.category}</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className={`font-semibold ${isIncome ? 'text-green-600' : ''}`}>
                            {isIncome ? '+ ' : ''}${transaction.amount.toFixed(2)}
                        </div>
                        <div className="text-xs text-slate-500">{transaction.date}</div>
                    </div>
                </div>
            </Card>
        </button>
    );
};

const HomePage: React.FC = () => {
    const totalBalance = 12547.83;
    const monthlyIncome = 4200.00;
    const monthlyExpenses = 3180.50;
    const savingsGoal = 5000;
    const savingsProgress = 2400;
    const savingsPercentage = (savingsProgress / savingsGoal) * 100;

    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

    return (
        <>
            <div className="p-4 space-y-4">
                <Card>
                    <div className="px-6 pt-6 pb-2">
                        <h4 className="text-sm text-slate-500">Saldo Total</h4>
                    </div>
                    <div className="px-6 pb-6">
                        <div className="text-2xl font-bold">${totalBalance.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
                        <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                            <TrendingUp className="h-3 w-3" />
                            +2.5% del mes pasado
                        </div>
                    </div>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                    <Card className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="h-4 w-4 text-slate-500" />
                            <span className="text-sm text-slate-500">Ingresos mensuales</span>
                        </div>
                        <div className="text-lg font-semibold">${monthlyIncome.toLocaleString('en-US')}</div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingDown className="h-4 w-4 text-red-500" />
                            <span className="text-sm text-slate-500">Gastos mensuales</span>
                        </div>
                        <div className="text-lg font-semibold">${monthlyExpenses.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
                    </Card>
                </div>

                <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <PiggyBank className="h-4 w-4 text-blue-500" />
                        <span className="text-sm text-slate-500">Progreso Meta de Ahorro</span>
                    </div>
                    <div className="text-lg font-semibold mb-2">${savingsProgress.toLocaleString('en-US')} / ${savingsGoal.toLocaleString('en-US')}</div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${savingsPercentage}%` }}></div>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{savingsPercentage.toFixed(0)}% completado • Faltan ${ (savingsGoal - savingsProgress).toLocaleString('en-US')}</div>
                </Card>

                <div className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg font-semibold">Transacciones recientes</h2>
                        <button className="text-sm font-medium text-blue-600 hover:text-blue-800">Ver todas</button>
                    </div>
                    <div className="space-y-2">
                        {recentTransactions.map(tx => 
                            <TransactionItem 
                                key={tx.id} 
                                transaction={tx} 
                                onClick={() => setSelectedTransaction(tx)} 
                            />
                        )}
                    </div>
                </div>

                <Card className="p-4 text-center bg-slate-100">
                    <button className="w-full text-slate-600 font-medium flex items-center justify-center gap-2">
                        <MoreHorizontal className="h-4 w-4" />
                        Cargar Más Transacciones
                    </button>
                </Card>
            </div>
            {selectedTransaction && (
                <TransactionDetailModal 
                    transaction={selectedTransaction} 
                    onClose={() => setSelectedTransaction(null)}
                />
            )}
        </>
    );
};

export default HomePage;