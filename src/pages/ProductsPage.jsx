import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import api from "../utils/api";
import toast from "react-hot-toast";
import { ShoppingCart, Star, Search, SlidersHorizontal, X } from "lucide-react";

const sortLabels = {
  "price-low": "Low to High",
  "price-high": "High to Low",
  rating: "Top Rated",
  name: "A to Z",
};

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "featured");
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products");
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const nextParams = {};

    if (search.trim()) nextParams.search = search.trim();
    if (category !== "All") nextParams.category = category;
    if (sortBy !== "featured") nextParams.sort = sortBy;

    setSearchParams(nextParams, { replace: true });
  }, [category, search, setSearchParams, sortBy]);

  const categories = ["All", ...new Set(products.map((product) => product.category))];

  const filteredProducts = products.filter((product) => {
    const matchSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "All" || product.category === category;
    return matchSearch && matchCategory;
  });

  const filtered = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart!`);
  };

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setSortBy("featured");
  };

  const hasActiveFilters = search.trim() || category !== "All" || sortBy !== "featured";

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col gap-3 mb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">All Products</h1>
          <p className="text-gray-500 mt-2">
            {loading
              ? "Loading products..."
              : `Showing ${filtered.length} of ${products.length} products`}
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <SlidersHorizontal size={16} />
          Refine by search, category, or sort order
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-sm mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full lg:w-56 px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          >
            <option value="featured">Sort: Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="name">Name: A to Z</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
            >
              <X size={16} />
              Reset
            </button>
          )}
        </div>

        <div className="flex gap-2 flex-wrap mt-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors ${
                category === cat
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-indigo-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {hasActiveFilters && !loading && (
        <div className="flex flex-wrap items-center gap-2 mb-6 text-sm">
          <span className="text-gray-500">Active filters:</span>
          {search.trim() && (
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700">
              Search: {search.trim()}
            </span>
          )}
          {category !== "All" && (
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700">
              Category: {category}
            </span>
          )}
          {sortBy !== "featured" && (
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700">
              Sort: {sortLabels[sortBy]}
            </span>
          )}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-2xl" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-xl mb-2">No products found!</p>
          <p className="text-gray-400 text-sm">Try a different search, category, or reset your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <div key={product._id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden group">
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
                    onClick={() => handleAddToCart(product)}
                    className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                  >
                    <ShoppingCart size={14} />
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
