import React from 'react';
import Card from '../components/Card';
import { MessageSquare, Bell, TrendingUp, Smartphone } from '../components/Icons';
import Switch from '../components/Switch';
import { useNavigate } from 'react-router-dom';
import { useSmsSettingsContext } from '../contexts/SmsSettingsContext';

const SmsPage: React.FC = () => {
    const navigate = useNavigate();
    // Fix: Correctly destructure toggleSmsNotification from the context. The property was misnamed.
    const { settings, toggleSmsNotification } = useSmsSettingsContext();

    const recentMessages = [
        { id: 1, time: "Hoy 2:30 PM", text: "💰 Actualización Diaria: Has gastado $45.20 hoy. Presupuesto restante: $89.80" },
        { id: 2, time: "Ayer 6:00 PM", text: "🎯 ¡Excelente trabajo! Te mantuviste dentro del presupuesto ayer y ahorraste $12.50" },
        { id: 3, time: "Hace 2 días", text: "⚠️ Alerta: Gasto grande detectado - $250 en Best Buy. Responde DETALLES para ver desglose" },
    ];

    return (
        <div className="p-4 space-y-4">
            <Card>
                <div className="px-6 pt-6 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-green-500" />
                    <h4 className="leading-none font-semibold">Asistente Financiero SMS</h4>
                </div>
                <div className="px-6 pb-6 space-y-4">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3"><Bell className="h-4 w-4 text-slate-500" /><span className="text-sm">Alertas de gastos diarios</span></div>
                            <Switch checked={settings.notifications.dailyUpdates} onChange={() => toggleSmsNotification('dailyUpdates')} />
                        </div>
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3"><TrendingUp className="h-4 w-4 text-slate-500" /><span className="text-sm">Actualizaciones semanales</span></div>
                            <Switch checked={settings.notifications.weeklyReports} onChange={() => toggleSmsNotification('weeklyReports')} />
                        </div>
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3"><Smartphone className="h-4 w-4 text-slate-500" /><span className="text-sm">Recordatorios de pagos</span></div>
                            <Switch checked={settings.notifications.paymentReminders} onChange={() => toggleSmsNotification('paymentReminders')} />
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <h4 className="font-medium mb-3">Mensajes SMS Recientes</h4>
                        <div className="space-y-3">
                            {recentMessages.map(msg => (
                                <div key={msg.id} className="bg-slate-100 p-3 rounded-lg">
                                    <div className="flex items-center gap-2 mb-1">
                                        <MessageSquare className="h-3 w-3 text-green-500" />
                                        <span className="text-xs text-slate-500">{msg.time}</span>
                                    </div>
                                    <p className="text-sm">{msg.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button 
                        onClick={() => navigate('/sms/settings')}
                        className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 h-9 px-4 py-2"
                    >
                        Configurar Ajustes SMS
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default SmsPage;