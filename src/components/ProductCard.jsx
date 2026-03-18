import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden group">
      <Link to={`/products/${product._id}`}>
        <div className="h-48 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.target.src = "https://via.placeholder.com/300x200?text=Product"; }}
          />
        </div>
      </Link>
      <div className="p-4">
        <span className="text-xs text-indigo-600 font-medium uppercase tracking-wide">{product.category}</span>
        <Link to={`/products/${product._id}`}>
          <h3 className="font-semibold text-gray-800 mt-1 mb-2 hover:text-indigo-600 transition-colors line-clamp-2">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-1 mb-3">
          <Star size={14} className="text-yellow-400 fill-yellow-400" />
          <span className="text-sm text-gray-500">{product.rating || "4.5"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-indigo-600">${product.price}</span>
          <button
            onClick={() => onAddToCart(product)}
            className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <ShoppingCart size={14} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
