import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import api from "../utils/api";
import toast from "react-hot-toast";
import { ShoppingCart, Star, ArrowLeft, Package } from "lucide-react";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error(error);
        navigate("/products");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i += 1) {
      dispatch(addToCart(product));
    }
    toast.success(`${product.name} added to cart!`);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
          <div className="h-96 bg-gray-200 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/2" />
            <div className="h-24 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors mb-8"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl overflow-hidden h-96">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = "https://via.placeholder.com/500x400?text=Product"; }}
          />
        </div>

        <div>
          <span className="text-sm text-indigo-600 font-medium uppercase tracking-wide">{product.category}</span>
          <h1 className="text-3xl font-bold text-gray-800 mt-2 mb-4">{product.name}</h1>

          <div className="flex items-center gap-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={18}
                className={i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}
              />
            ))}
            <span className="text-sm text-gray-500 ml-1">{product.rating} rating</span>
          </div>

          <p className="text-3xl font-bold text-indigo-600 mb-6">${product.price}</p>

          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

          <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
            <Package size={16} />
            <span>{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</span>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <label className="text-sm font-medium text-gray-700">Quantity:</label>
            <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-3 py-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-indigo-600 font-bold"
              >
                -
              </button>
              <span className="font-semibold text-gray-800 w-6 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-indigo-600 font-bold"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={20} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
