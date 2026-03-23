export default function Table({ columns, data, keyExtractor, renderRow, emptyMessage = "No records found." }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
            <tr>
              {columns.map((col, index) => (
                <th key={index} className={`px-6 py-4 font-semibold ${col.className || ''}`}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={keyExtractor(item, index)} className="hover:bg-gray-50 transition-colors">
                  {renderRow(item)}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
