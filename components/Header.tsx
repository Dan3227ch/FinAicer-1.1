import React from 'react';
import { Menu, Bell, User } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 flex items-center justify-between p-4 bg-white border-b z-10">
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-md hover:bg-slate-100">
          <Menu className="h-5 w-5 text-slate-600" />
        </button>
        <h1 className="text-lg font-semibold text-slate-800">FinAIcer</h1>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-md hover:bg-slate-100">
          <Bell className="h-5 w-5 text-slate-600" />
        </button>
        <button className="p-2 rounded-md hover:bg-slate-100">
          <User className="h-5 w-5 text-slate-600" />
        </button>
      </div>
    </header>
  );
};

export default Header;
