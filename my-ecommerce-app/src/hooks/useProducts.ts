import { useState, useEffect } from 'react';
import { Product } from '../interfaces';
import { ProductService } from '../services';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ProductService.getProducts();
      setProducts(response.data);
    } catch (err) {
      setError('Error al cargar productos');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    setProducts,
    loading,
    error,
    refetch: fetchProducts
  };
};