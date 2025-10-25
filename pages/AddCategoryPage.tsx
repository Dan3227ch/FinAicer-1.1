import React, { useState } from 'react';
import Card from '../components/Card';
import { ArrowLeft, ShoppingCart, Car, House, Utensils, Coffee, Gamepad2, Heart, Briefcase, GraduationCap, Shirt, Plane } from '../components/Icons';
import { useNavigate } from 'react-router-dom';

const icons = [
  { name: 'Comestibles', icon: ShoppingCart },
  { name: 'Transporte', icon: Car },
  { name: 'Vivienda', icon: House },
  { name: 'Restaurantes', icon: Utensils },
  { name: 'Cafetería', icon: Coffee },
  { name: 'Entretenimiento', icon: Gamepad2 },
  { name: 'Salud', icon: Heart },
  { name: 'Trabajo', icon: Briefcase },
  { name: 'Educación', icon: GraduationCap },
  { name: 'Ropa', icon: Shirt },
  { name: 'Viajes', icon: Plane },
];

const colors = [
  { name: 'Azul', class: 'bg-blue-500' },
  { name: 'Verde', class: 'bg-green-500' },
  { name: 'Rojo', class: 'bg-red-500' },
  { name: 'Naranja', class: 'bg-orange-500' },
  { name: 'Púrpura', class: 'bg-purple-500' },
  { name: 'Rosa', class: 'bg-pink-500' },
  { name: 'Amarillo', class: 'bg-yellow-500' },
  { name: 'Índigo', class: 'bg-indigo-500' },
];

const AddCategoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [budget, setBudget] = useState('');

  const isFormValid = categoryName && budget && selectedIcon && selectedColor;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex items-center gap-3 p-4 bg-white border-b sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 rounded-md hover:bg-slate-100">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold">Agregar Nueva Categoría</h1>
      </header>
      <main className="p-4 space-y-4">
        <Card>
          <div className="px-6 pt-6"><h4 className="font-semibold">Información de la categoría</h4></div>
          <div className="px-6 pb-6 space-y-6">
            <div className="space-y-2">
              <label htmlFor="category-name" className="text-sm font-medium">Nombre de la Categoría</label>
              <input id="category-name" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej: Gimnasio, Mascotas, Hobby..." />
            </div>
            <div className="space-y-2">
              <label htmlFor="budget-amount" className="text-sm font-medium">Presupuesto Mensual</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                <input id="budget-amount" type="number" value={budget} onChange={(e) => setBudget(e.target.value)} className="h-9 w-full rounded-md border border-slate-300 bg-white pl-7 pr-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0.00" />
              </div>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="px-6 pt-6"><h4 className="font-semibold">Seleccionar Ícono</h4></div>
          <div className="px-6 pb-6">
            <div className="grid grid-cols-4 gap-3">
              {icons.map(({ name, icon: Icon }) => (
                <button key={name} onClick={() => setSelectedIcon(name)} className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-colors ${selectedIcon === name ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}>
                  <div className="p-2 rounded-full bg-slate-100"><Icon className="h-4 w-4 text-slate-500" /></div>
                  <span className="text-xs text-center">{name}</span>
                </button>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <div className="px-6 pt-6"><h4 className="font-semibold">Seleccionar Color</h4></div>
          <div className="px-6 pb-6">
            <div className="grid grid-cols-4 gap-3">
              {colors.map(({ name, class: colorClass }) => (
                <button key={name} onClick={() => setSelectedColor(name)} className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-colors ${selectedColor === name ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}>
                  <div className={`w-8 h-8 rounded-full ${colorClass}`}></div>
                  <span className="text-xs text-center">{name}</span>
                </button>
              ))}
            </div>
          </div>
        </Card>

        <div className="space-y-3 pt-4">
          <button disabled={!isFormValid} className="w-full inline-flex items-center justify-center rounded-md bg-blue-600 text-white h-10 px-4 font-medium hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed">
            Crear Categoría
          </button>
          <button onClick={() => navigate(-1)} className="w-full inline-flex items-center justify-center rounded-md border bg-white h-10 px-4 font-medium hover:bg-slate-50">
            Cancelar
          </button>
        </div>
      </main>
    </div>
  );
};

export default AddCategoryPage;