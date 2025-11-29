// src/components/CategoryCard.jsx
export default function CategoryCard({ category, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="flex-shrink-0 w-32 cursor-pointer group"
    >
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 text-center group-hover:-translate-y-1">
        {/* Icon with background color */}
        <div 
          className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 text-3xl"
          style={{ backgroundColor: category.color || '#3B82F6' + '20' }}
        >
          {category.icon || '📦'}
        </div>
        
        {/* Category Name */}
        <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
          {category.name}
        </h3>
        
        {/* Deal Count */}
        {category.deals_count !== undefined && (
          <p className="text-xs text-gray-500">
            {category.deals_count} {category.deals_count === 1 ? 'deal' : 'deals'}
          </p>
        )}
      </div>
    </div>
  );
}
