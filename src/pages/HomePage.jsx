import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import api from "../utils/api";
import toast from "react-hot-toast";
import { ArrowRight, Layers3, PackageCheck, Sparkles, Tags } from "lucide-react";
import ProductCard from "../components/ProductCard";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart!`);
  };

  const topRatedProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 4);
  }, [products]);

  const latestProducts = useMemo(() => {
    return [...products].slice(0, 4);
  }, [products]);

  const featuredCategories = useMemo(() => {
    const categoryCounts = products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
  }, [products]);

  return (
    <div>
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-24">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-extrabold mb-6 leading-tight">
              Shop Smarter,
              <br />
              <span className="text-yellow-300">Grow Bigger</span>
            </h1>
            <p className="text-xl text-indigo-100 mb-10 max-w-2xl">
              Discover more products, more categories, and better ways to explore everything in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 hover:text-indigo-800 transition-all shadow-lg"
              >
                Shop Now <ArrowRight size={20} />
              </Link>
              <Link
                to="/products?sort=rating"
                className="inline-flex items-center justify-center gap-2 border border-white/30 bg-white/10 px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all"
              >
                Top Rated <Sparkles size={20} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">
              <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 p-5">
                <p className="text-3xl font-bold">{products.length}+</p>
                <p className="text-indigo-100 mt-1">Products ready to browse</p>
              </div>
              <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 p-5">
                <p className="text-3xl font-bold">{new Set(products.map((product) => product.category)).size}</p>
                <p className="text-indigo-100 mt-1">Categories growing your catalog</p>
              </div>
              <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 p-5">
                <p className="text-3xl font-bold">{products.filter((product) => product.stock > 0).length}</p>
                <p className="text-indigo-100 mt-1">Items currently in stock</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <Layers3 className="text-indigo-600 mb-4" size={28} />
            <h2 className="text-lg font-bold text-gray-800 mb-2">Built For More Products</h2>
            <p className="text-gray-500">Browse a growing catalog with search, categories, sorting, and clean discovery.</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <PackageCheck className="text-indigo-600 mb-4" size={28} />
            <h2 className="text-lg font-bold text-gray-800 mb-2">Better Product Discovery</h2>
            <p className="text-gray-500">See curated sections like top rated products and category collections right from the homepage.</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <Tags className="text-indigo-600 mb-4" size={28} />
            <h2 className="text-lg font-bold text-gray-800 mb-2">Ready To Scale</h2>
            <p className="text-gray-500">This layout gives your store room to grow before you move to full backend pagination and admin tools.</p>
          </div>
        </div>

        <section className="mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Shop By Category</h2>
              <p className="text-gray-500 mt-2">Highlight the sections that will make your store feel broader and more complete.</p>
            </div>
            <Link to="/products" className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1">
              Browse catalog <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredCategories.map(([category, count]) => (
              <Link
                key={category}
                to={`/products?category=${encodeURIComponent(category)}`}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:border-indigo-200 hover:shadow-md transition-all"
              >
                <p className="text-sm font-medium text-indigo-600 uppercase tracking-wide">{category}</p>
                <h3 className="text-xl font-bold text-gray-800 mt-3">{count} products</h3>
                <p className="text-gray-500 mt-2">Explore everything in {category}.</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Featured Products</h2>
              <p className="text-gray-500 mt-2">Top picks that give your homepage a stronger store feel.</p>
            </div>
            <Link to="/products" className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1">
              View all <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-2xl" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-xl mb-4">No products yet!</p>
              <p className="text-gray-400">Products will appear here once added.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {topRatedProducts.map((product) => (
                <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} />
              ))}
            </div>
          )}
        </section>

        {!loading && latestProducts.length > 0 && (
          <section>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">New In Store</h2>
                <p className="text-gray-500 mt-2">Fresh additions help the website feel active and growing.</p>
              </div>
              <Link to="/products?sort=featured" className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1">
                See more <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {latestProducts.map((product) => (
                <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default HomePage;
