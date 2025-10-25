import React from 'react';
import { NavLink } from 'react-router-dom';
import { House, ChartColumn, MessageSquare, Smartphone, User } from './Icons';

const navItems = [
  { to: '/', icon: House, label: 'Inicio' },
  { to: '/budget', icon: ChartColumn, label: 'Presupuesto' },
  { to: '/ai-assistant', icon: MessageSquare, label: 'Asistente IA' }, // Updated route and label
  { to: '/sms', icon: Smartphone, label: 'SMS' },
  { to: '/profile', icon: User, label: 'Perfil' },
];

const BottomNav: React.FC = () => {
  const activeLinkClass = "text-blue-600";
  const inactiveLinkClass = "text-slate-500";

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-2 z-10">
      <div className="flex justify-around">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => 
              `flex flex-col items-center gap-1 p-2 rounded-md hover:bg-slate-100 ${isActive ? activeLinkClass : inactiveLinkClass}`
            }
          >
            <Icon className="h-5 w-5" />
            <span className="text-xs font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;