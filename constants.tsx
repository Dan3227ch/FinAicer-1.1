import React from 'react';
import { Transaction, BudgetCategory, ChatMessage, SavingTip } from './types';
import { Coffee, ShoppingCart, Car, House, Utensils, Wifi, CreditCard, PiggyBank, TargetIcon, Lightbulb, Star, Award, Bot, Sparkles, Palette, Globe, DollarSign as DollarSignIcon, Calendar, Lock, Fingerprint, Eye, Mail, CircleQuestion, Settings, LogOut, PenLine, Camera, ChevronRight, Plus, Menu, Bell, User, ArrowLeft, Send } from './components/Icons';

export const recentTransactions: Transaction[] = [
    { id: '1', name: 'Depósito Salario', category: 'Ingresos', amount: 4200.00, type: 'income', date: 'Hace 3 días', fullDate: '2024-05-20T09:00:00Z', description: 'Salario mensual de la empresa.', icon: <Wifi />, iconBgColor: 'bg-green-100', iconColor: 'text-green-600' },
    { id: '2', name: 'Starbucks', category: 'Restaurantes', amount: 8.50, type: 'expense', date: 'Hoy', fullDate: '2024-05-23T08:30:00Z', description: 'Café latte y croissant.', icon: <Coffee />, iconBgColor: 'bg-orange-100', iconColor: 'text-orange-500' },
    { id: '3', name: 'Alimentos integrales', category: 'Comestibles', amount: 67.23, type: 'expense', date: 'Ayer', fullDate: '2024-05-22T18:15:00Z', description: 'Compra semanal de comestibles.', icon: <ShoppingCart />, iconBgColor: 'bg-green-100', iconColor: 'text-green-500' },
    { id: '4', name: 'Terpel', category: 'Transporte', amount: 45.00, type: 'expense', date: 'Hace 2 días', fullDate: '2024-05-21T12:00:00Z', description: 'Tanque lleno de gasolina para el coche.', icon: <Car />, iconBgColor: 'bg-blue-100', iconColor: 'text-blue-500' },
    { id: '5', name: 'Netflix', category: 'Entretenimiento', amount: 15.99, type: 'expense', date: 'Hace 1 semana', fullDate: '2024-05-16T20:00:00Z', description: 'Suscripción mensual de Netflix.', icon: <CreditCard />, iconBgColor: 'bg-red-100', iconColor: 'text-red-500' },
];

export const budgetCategories: BudgetCategory[] = [
    { id: '1', name: 'Comestibles', spent: 280, budget: 400, icon: <ShoppingCart className="text-blue-500" />, color: 'blue' },
    { id: '2', name: 'Transporte', spent: 150, budget: 200, icon: <Car className="text-green-500" />, color: 'green' },
    { id: '3', name: 'Vivienda', spent: 1200, budget: 1200, icon: <House className="text-red-500" />, color: 'red' },
    { id: '4', name: 'Restaurantes', spent: 180, budget: 150, icon: <Utensils className="text-orange-500" />, color: 'orange' },
];

export const initialChatMessages: ChatMessage[] = [
    {
        id: 1,
        sender: 'ai',
        text: '¡Hola! Soy tu asesor financiero IA. Te puedo ayudar con presupuestos, estrategias de ahorro y análisis de gastos. ¿Qué te gustaría saber?'
    },
    {
        id: 2,
        sender: 'user',
        text: '¿Cómo puedo ahorrar más dinero este mes?'
    },
    {
        id: 3,
        sender: 'ai',
        text: (
            <>
                <p>Basándome en tus patrones de gasto, te recomiendo:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Reducir comidas fuera por $200/mes</li>
                    <li>Cambiar a un plan de teléfono más barato (ahorro $30)</li>
                    <li>Usar la regla de presupuesto 50/30/20</li>
                </ul>
            </>
        )
    }
];

export const initialSavingTips: SavingTip[] = [
  { id: '1', title: 'Prepara café en casa', description: 'Ahorra hasta $150 al mes preparando café en casa en lugar de comprar.', difficulty: 'Fácil', potentialSaving: 150, frequency: 'Mensual', icon: <Coffee className="h-4 w-4 text-amber-500" />, implemented: false },
  { id: '2', title: 'Usa la regla 50/30/20', description: 'Destino 50% a necesidades, 30% a deseos y 20% al ahorro.', difficulty: 'Medio', potentialSaving: 400, frequency: 'Mensual', icon: <TargetIcon className="h-4 w-4 text-blue-500" />, implemented: false },
  { id: '3', title: 'Lista de compras y comparación', description: 'Haz una lista antes de ir de compras y compara precios online.', difficulty: 'Fácil', potentialSaving: 200, frequency: 'Mensual', icon: <ShoppingCart className="h-4 w-4 text-green-500" />, implemented: false },
  { id: '4', title: 'Revisar suscripciones mensuales', description: 'Cancela servicios que no utilices activamente. Revisa cada 3 meses.', difficulty: 'Fácil', potentialSaving: 80, frequency: 'Mensual', icon: <CreditCard className="h-4 w-4 text-red-500" />, implemented: false },
  { id: '5', title: 'Optimiza tus viajes', description: 'Combina viajes, usa transporte público o camina cuando sea posible.', difficulty: 'Medio', potentialSaving: 120, frequency: 'Mensual', icon: <Car className="h-4 w-4 text-purple-500" />, implemented: false },
  { id: '6', title: 'Automatiza tus ahorros', description: 'Programa transferencias automáticas al comenzar cada mes.', difficulty: 'Fácil', potentialSaving: 500, frequency: 'Mensual', icon: <PiggyBank className="h-4 w-4 text-pink-500" />, implemented: false },
];