import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import Switch from '../components/Switch';
import { ArrowLeft, Smartphone, Check, Info, Bell, Settings, MessageSquare } from '../components/Icons';
import { useNavigate } from 'react-router-dom';
import { useSmsSettingsContext } from '../contexts/SmsSettingsContext';
import { sendTestPush } from '../services/finaicerApiService';
import { useAuth } from '../contexts/AuthContext';

const SmsSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { settings, setSettings, toggleSmsNotification, setPhoneNumber, savePreferences, fetchPreferences } = useSmsSettingsContext();
  const { token } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if(token) fetchPreferences(token);
  }, [token]);

  const handleTogglePush = () => {
    setSettings(prev => ({...prev, pushEnabled: !prev.pushEnabled }));
  }

  const handleRegisterForPush = () => {
    // In a real Capacitor app, this would trigger the native permission prompt
    // and get the token from FCM/APNs.
    const mockToken = `mock_fcm_token_${Date.now()}`;
    setSettings(prev => ({...prev, pushToken: mockToken}));
    alert(`Dispositivo registrado para notificaciones push (token simulado): ${mockToken}`);
  }

  const handleSendTestPush = async () => {
    if (!token) {
      alert('Debes iniciar sesión para enviar una notificación de prueba.');
      return;
    }
    if (!settings.pushToken) {
      alert('Primero debes registrarte para recibir notificaciones push.');
      return;
    }
    try {
      await sendTestPush(token);
      alert('¡Notificación de prueba enviada! Revisa tu dispositivo (simulado).');
    } catch (error: any) {
      alert(`Error al enviar la notificación de prueba: ${error.message}`);
    }
  };

  const notificationOptions = [
      { key: 'dailyUpdates' as const, title: 'Actualizaciones diarias', subtitle: 'Resumen de gastos del día' },
      { key: 'weeklyReports' as const, title: 'Informes semanales', subtitle: 'Análisis semanal de presupuesto' },
      { key: 'paymentReminders' as const, title: 'Recordatorios de Pagos', subtitle: 'Fechas de vencimiento de facturas' },
      { key: 'budgetAlerts' as const, title: 'Alertas de Presupuesto', subtitle: 'Cuando te acercas a tu límite' },
      { key: 'largeTransactions' as const, title: 'Transacciones Grandes', subtitle: 'Alerta de gastos importantes' },
      { key: 'monthlyGoals' as const, title: 'Metas Mensuales', subtitle: 'Progreso hacia objetivos de ahorro' },
  ];

  const handleSave = async () => {
    if (!token) return;
    setIsSaving(true);
    try {
      await savePreferences(settings, token);
      alert('¡Configuración guardada!');
      navigate(-1);
    } catch (error) {
       alert('Error al guardar la configuración.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex items-center gap-3 p-4 bg-white border-b sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 rounded-md hover:bg-slate-100">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold">Configuración de Notificaciones</h1>
      </header>
      <main className="p-4 space-y-4">
        
        <Card>
          <div className="px-6 pt-6 flex items-center gap-2"><Bell className="h-5 w-5 text-purple-500" /><h4 className="font-semibold">Notificaciones Push</h4></div>
          <div className="px-6 pb-6 space-y-4">
             <div className="flex items-center justify-between pt-4 first:pt-0">
                <div>
                    <div className="font-medium">Habilitar Notificaciones Push</div>
                    <div className="text-sm text-slate-500">Recibe alertas instantáneas en tu dispositivo.</div>
                </div>
                <Switch checked={settings.pushEnabled} onChange={handleTogglePush} />
            </div>
            {settings.pushEnabled && (
              <div className="flex gap-2">
                <button onClick={handleRegisterForPush} className="flex-1 inline-flex items-center justify-center rounded-md border bg-white h-9 px-3 font-medium hover:bg-slate-50 text-sm">
                  {settings.pushToken ? 'Volver a registrar' : 'Registrar Dispositivo'}
                </button>
                 <button onClick={handleSendTestPush} disabled={!settings.pushToken} className="flex-1 inline-flex items-center justify-center rounded-md border bg-white h-9 px-3 font-medium hover:bg-slate-50 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                  Enviar Prueba
                </button>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <div className="px-6 pt-6 flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-blue-500" />
            <h4 className="font-semibold">Notificaciones por SMS</h4>
          </div>
          <div className="px-6 pb-6 space-y-4">
            <div className="space-y-2">
              <label htmlFor="phone-number" className="text-sm font-medium">Número de Teléfono</label>
              <div className="flex gap-2">
                <input id="phone-number" className="flex-1 h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="+1 (555) 123-4567" value={settings.phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                {settings.isVerified && <span className="inline-flex items-center rounded-md bg-blue-600 text-white px-2 py-0.5 text-xs font-medium"><Check className="h-3 w-3 mr-1" /> Verificado</span>}
              </div>
            </div>
             <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-blue-800 font-medium">Información sobre SMS</p>
                <p className="text-blue-700">Los mensajes SMS pueden tener costo según tu operador. Puedes cancelar en cualquier momento respondiendo STOP.</p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
            <div className="px-6 pt-6 flex items-center gap-2"><MessageSquare className="h-5 w-5 text-orange-500" /><h4 className="font-semibold">Tipos de Alertas SMS</h4></div>
            <div className="px-6 pb-6 space-y-4 divide-y divide-slate-100">
                {notificationOptions.map(({ key, title, subtitle }) => (
                    <div key={key} className="flex items-center justify-between pt-4 first:pt-0">
                        <div>
                            <div className="font-medium">{title}</div>
                            <div className="text-sm text-slate-500">{subtitle}</div>
                        </div>
                        <Switch checked={settings.notifications[key]} onChange={() => toggleSmsNotification(key)} />
                    </div>
                ))}
            </div>
        </Card>
        
        <div className="space-y-3 pt-4">
          <button onClick={handleSave} disabled={isSaving} className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 text-white h-10 px-4 font-medium hover:bg-blue-700 disabled:opacity-50">
            <Settings className="h-4 w-4 mr-2" /> {isSaving ? 'Guardando...' : 'Guardar configuración'}
          </button>
          <button onClick={() => navigate(-1)} className="w-full inline-flex items-center justify-center gap-2 rounded-md border bg-white h-10 px-4 font-medium hover:bg-slate-50">
            Cancelar
          </button>
        </div>

      </main>
    </div>
  );
};

export default SmsSettingsPage;