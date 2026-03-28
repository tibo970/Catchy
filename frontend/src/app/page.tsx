"use client";

import { useState } from "react";
import { Search, TrendingDown, Bell, Zap, ChevronRight, ShoppingCart, Percent, Loader2, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Product {
  retailer: string;
  name: string;
  price: number;
  currency: string;
  url: string;
  prediction: string;
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!search.trim()) return;
    setLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch(`http://localhost:8000/search?q=${encodeURIComponent(search)}`);
      const data = await res.json();
      setResults(data.results);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <TrendingDown className="w-6 h-6 text-primary" />,
      title: "Prédictions IA",
      desc: "Sachez si c'est le moment idéal pour acheter ou s'il faut attendre."
    },
    {
      icon: <Bell className="w-6 h-6 text-secondary" />,
      title: "Alertes Prix",
      desc: "Recevez une notification dès que votre produit de rêve baisse de prix."
    },
    {
      icon: <Percent className="w-6 h-6 text-accent" />,
      title: "Codes Promo",
      desc: "Accédez aux meilleurs codes promo vérifiés par la communauté."
    }
  ];

  const popularSearches = ["Switch 2", "iPhone 16 Pro", "RTX 5080", "PS5 Pro"];

  return (
    <main className="flex-1 flex flex-col items-center px-6 pt-24 pb-12 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-5xl z-10 flex flex-col items-center">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-white/10 text-xs font-medium text-white/70 mb-6">
            <Zap className="w-3 h-3 text-secondary fill-secondary" />
            <span>Nouveau : Prédictions Switch 2 disponibles</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Trouvez le <span className="text-gradient">meilleur prix</span> <br /> 
            en un instant
          </h1>
          <AnimatePresence>
            {!hasSearched && (
              <motion.p 
                exit={{ opacity: 0, height: 0 }}
                className="text-lg text-white/60 max-w-2xl mx-auto mb-10 overflow-hidden"
              >
                Comparez Amazon, Fnac, Boulanger et plus. Obtenez des prédictions basées sur l'IA et ne loupez plus aucun code promo.
              </motion.p>
            )}
          </AnimatePresence>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center">
              <div className="absolute left-5 text-white/40">
                <Search className="w-6 h-6" />
              </div>
              <input 
                type="text"
                placeholder="Ex: Nintendo Switch 2, iPhone 16..."
                className="w-full h-16 pl-14 pr-32 bg-gray-900/80 glass border-none rounded-2xl text-xl text-white placeholder:text-white/20 focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button 
                onClick={handleSearch}
                disabled={loading}
                className="absolute right-2 top-2 bottom-2 px-6 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Comparer"}
              </button>
            </div>
          </div>

          {!hasSearched && (
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <span className="text-sm text-white/40 py-1">Populaire :</span>
              {popularSearches.map((tag) => (
                <button 
                  key={tag} 
                  onClick={() => { setSearch(tag); handleSearch(); }}
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Results Grid */}
        <AnimatePresence>
          {hasSearched && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full mb-16"
            >
              <div className="flex justify-between items-end mb-8">
                <h2 className="text-2xl font-bold">Résultats pour <span className="text-primary">"{search}"</span></h2>
                <span className="text-sm text-white/40">{results.length} offres trouvées</span>
              </div>
              
              {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-48 rounded-3xl glass border border-white/5 animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map((product, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="group p-6 rounded-3xl glass border border-white/5 hover:border-white/10 transition-colors flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-bold uppercase tracking-wider text-white/40 border border-white/5">
                            {product.retailer}
                          </span>
                          <div className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                            product.prediction === 'decreasing' ? 'bg-green-500/10 text-green-400' : 'bg-primary/10 text-primary'
                          }`}>
                            {product.prediction === 'decreasing' ? 'PRIX EN BAISSE' : 'PRIX STABLE'}
                          </div>
                        </div>
                        <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                      </div>
                      
                      <div className="mt-6 flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold">{product.price.toFixed(2)}€</span>
                          <p className="text-[10px] text-white/30 uppercase">Livraison incluse</p>
                        </div>
                        <a 
                          href={product.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                        >
                          <ExternalLink className="w-5 h-5 text-white/60" />
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
              
              {!loading && results.length === 0 && (
                <div className="text-center py-20 glass rounded-3xl border border-white/5">
                  <p className="text-white/40">Aucun résultat trouvé. Essaie une autre recherche !</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features Grid (Show only if no search results) */}
        {!hasSearched && (
          <div className="grid md:grid-cols-3 gap-8 w-full">
            {features.map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="p-8 rounded-3xl glass border border-white/5 hover:border-white/10 transition-colors group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:border-white/20 transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-white/50 leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <footer className="mt-32 pt-12 border-t border-white/5 w-full max-w-5xl flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-xl font-bold text-gradient">Catchy</div>
        <p className="text-white/30 text-sm">© 2026 Catchy Inc. Tous droits réservés.</p>
        <div className="flex gap-6 text-white/40 text-sm">
          <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
          <a href="#" className="hover:text-white transition-colors">A propos</a>
        </div>
      </footer>
    </main>
  );
}
