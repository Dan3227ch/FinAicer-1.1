import React, { ReactNode } from 'react';
import { HashRouter, Routes, Route, Outlet, useLocation, Navigate } from 'react-router-dom';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import BudgetPage from './pages/BudgetPage';
import AddCategoryPage from './pages/AddCategoryPage';
import AIAssistantPage from './pages/AIAssistantPage'; // Renamed from ChatPage
import SavingTipsPage from './pages/SavingTipsPage';
import SmsPage from './pages/SmsPage';
import SmsSettingsPage from './pages/SmsSettingsPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import { AppProvider } from './contexts/AppContext';
import { SmsSettingsProvider } from './contexts/SmsSettingsContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// AppLayout defines the main structure with Header and BottomNav
const AppLayout: React.FC = () => {
    const location = useLocation();
    const noHeaderFooterRoutes = ['/sms/settings', '/budget/add', '/chat/tips'];
    const showHeaderFooter = !noHeaderFooterRoutes.includes(location.pathname);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            {showHeaderFooter && <Header />}
            <main className={`pb-20 ${showHeaderFooter ? 'pt-16' : ''}`}>
                <Outlet />
            </main>
            {showHeaderFooter && <BottomNav />}
        </div>
    );
};

// PrivateRoute protects routes that require authentication
const PrivateRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        // You can render a loading spinner here
        return <div className="flex justify-center items-center h-screen">Cargando...</div>;
    }

    if (!user) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
        <AppProvider>
            <SmsSettingsProvider>
                <HashRouter>
                    <Routes>
                        {/* Public routes */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        
                        {/* Routes without main layout but are private */}
                        <Route path="/sms/settings" element={<PrivateRoute><SmsSettingsPage /></PrivateRoute>} />
                        <Route path="/budget/add" element={<PrivateRoute><AddCategoryPage /></PrivateRoute>} />
                        <Route path="/chat/tips" element={<PrivateRoute><SavingTipsPage /></PrivateRoute>} />

                        {/* Protected routes with main layout */}
                        <Route 
                            element={
                                <PrivateRoute>
                                    <AppLayout />
                                </PrivateRoute>
                            }
                        >
                            <Route path="/" element={<HomePage />} />
                            <Route path="/budget" element={<BudgetPage />} />
                            <Route path="/ai-assistant" element={<AIAssistantPage />} /> {/* Renamed route */}
                            <Route path="/sms" element={<SmsPage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                        </Route>

                    </Routes>
                </HashRouter>
            </SmsSettingsProvider>
        </AppProvider>
    </AuthProvider>
  );
};

export default App;