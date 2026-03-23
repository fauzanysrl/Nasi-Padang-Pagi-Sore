export default function Topbar() {
  return (
    <header className="bg-white shadow flex items-center justify-between px-6 py-4">
      <h2 className="text-xl font-semibold text-gray-800">Pagi Sore Admin</h2>
      
      <div className="flex items-center space-x-6">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-4 pr-10 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        
        <div className="flex items-center space-x-3 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
            A
          </div>
          <span className="text-sm font-medium text-gray-700">Admin</span>
        </div>
      </div>
    </header>
  );
}
