import React from 'react';
import { Transaction } from '../types';
import Card from './Card';
import { DollarSign, Calendar } from './Icons';

interface TransactionDetailModalProps {
  transaction: Transaction;
  onClose: () => void;
}

const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({ transaction, onClose }) => {
  const isIncome = transaction.type === 'income';

  const formattedDate = new Date(transaction.fullDate).toLocaleString('es-ES', {
    dateStyle: 'long',
    timeStyle: 'short',
  });

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" 
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <Card 
        className="w-full max-w-md p-6 animate-fade-in-up" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Detalles de la Transacción</h3>
            <button onClick={onClose} className="p-1 text-2xl font-bold leading-none rounded-full h-8 w-8 flex items-center justify-center hover:bg-slate-100">&times;</button>
        </div>
        
        <div className="flex items-center gap-4 py-4">
            <div className={`p-3 rounded-full ${transaction.iconBgColor}`}>
                {React.cloneElement(transaction.icon, { className: `h-6 w-6 ${transaction.iconColor}` })}
            </div>
            <div>
                <div className="text-xl font-bold">{transaction.name}</div>
                <div className="text-md text-slate-500">{transaction.category}</div>
            </div>
        </div>

        <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <DollarSign className="h-4 w-4" />
                    Monto
                </div>
                <div className={`font-semibold text-lg ${isIncome ? 'text-green-600' : 'text-slate-800'}`}>
                    {isIncome ? '+ ' : '- '}${transaction.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="h-4 w-4" />
                    Fecha y Hora
                </div>
                <div className="font-medium text-sm text-right">{formattedDate}</div>
            </div>
             {transaction.description && (
                <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="text-sm text-slate-600 mb-1">Descripción</div>
                    <p className="font-medium text-sm">{transaction.description}</p>
                </div>
             )}
        </div>
        
        <button 
            onClick={onClose}
            className="mt-6 w-full inline-flex items-center justify-center rounded-md bg-blue-600 text-white h-10 px-4 font-medium hover:bg-blue-700"
        >
            Cerrar
        </button>
      </Card>
       <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default TransactionDetailModal;