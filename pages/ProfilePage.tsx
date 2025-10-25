import React from 'react';
import Card from '../components/Card';
import { useNavigate } from 'react-router-dom';
import { Camera, PenLine, Star, TrendingUp, Settings, LogOut, ChevronRight } from '../components/Icons';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    
    if (!user) {
        return null; // Or a loading indicator
    }

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };
    
    return (
        <div className="p-4 space-y-4">
            <Card className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
                <div className="relative p-6">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <span className="relative flex h-20 w-20 shrink-0 overflow-hidden rounded-full">
                                <span className="bg-slate-200 flex size-full items-center justify-center rounded-full text-3xl font-medium text-slate-600">
                                    {user.name.charAt(0).toUpperCase()}
                                </span>
                            </span>
                            <button className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center hover:bg-slate-200">
                                <Camera className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold">{user.name}</h2>
                            <p className="text-slate-500">{user.email}</p>
                            <span className="mt-2 inline-flex items-center rounded-md bg-slate-200 px-2 py-0.5 text-xs font-medium">
                                <Star className="h-3 w-3 mr-1 text-yellow-500" />Usuario Premium
                            </span>
                        </div>
                        <button className="h-8 px-3 inline-flex items-center justify-center gap-2 rounded-md border bg-white text-sm hover:bg-slate-50">
                            <PenLine className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </Card>

            <Card>
                <div className="px-6 pt-6 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <h4 className="font-semibold">Tus Estadísticas</h4>
                </div>
                <div className="px-6 pb-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-slate-100 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">$12.5k</div>
                            <div className="text-sm text-slate-500">Total Ahorrado</div>
                        </div>
                         <div className="text-center p-3 bg-slate-100 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">72%</div>
                            <div className="text-sm text-slate-500">Meta Mensual</div>
                        </div>
                    </div>
                </div>
            </Card>
            
            <Card>
                <div className="px-6 pt-6 flex items-center gap-2"><Settings className="h-5 w-5 text-gray-500" /><h4 className="font-semibold">Configuración</h4></div>
                <div className="px-6 pb-6 space-y-4">
                     <button onClick={() => navigate('/sms/settings')} className="w-full justify-between inline-flex items-center gap-2 rounded-md border bg-white h-10 px-4 font-medium hover:bg-slate-50 text-sm">Configurar Ajustes SMS <ChevronRight className="h-4 w-4" /></button>
                </div>
            </Card>

            <Card>
                <div className="p-4">
                    <button onClick={handleLogout} className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-red-500 text-white h-10 px-4 font-medium hover:bg-red-600">
                        <LogOut className="h-4 w-4" />Cerrar Sesión
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default ProfilePage;
