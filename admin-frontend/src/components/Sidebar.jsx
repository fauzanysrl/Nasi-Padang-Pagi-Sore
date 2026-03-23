import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo padang.jpg'

const navItems = [
  { name: 'Dashboard', path: '/' },
  { name: 'Menu Management', path: '/menus' },
  { name: 'Categories', path: '/categories' },
  { name: 'Orders', path: '/orders' },
  { name: 'Users', path: '/users' },
  { name: 'Table Management', path: '/tables' },
  { name: 'Reports', path: '/reports' },
  { name: 'Settings', path: '/settings' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-green-800 text-white flex flex-col min-h-screen">
      <div className="p-4 items-center justify-center flex border-b border-green-700">
        <h1 className="text-xl font-bold tracking-wider">PAGI SORE</h1>
      </div>
      <nav className="flex-1 mt-6">
        <ul className="space-y-2 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`block px-4 py-2 rounded-md transition-colors ${
                    isActive ? 'bg-green-700 font-semibold' : 'hover:bg-green-700/50'
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-green-700">
        <button 
          onClick={() => {
            alert('Logged out completely! Redircting...');
            window.location.href = '/';
          }}
          className="w-full text-left px-4 py-2 rounded-md hover:bg-red-600 transition-colors font-medium"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
