import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface Store2Product {
  id: string;
  code: string;
  name: string;
  category: 'acai' | 'bebidas' | 'complementos' | 'sobremesas' | 'outros' | 'sorvetes';
  is_weighable: boolean;
  unit_price?: number;
  price_per_gram?: number;
  image_url?: string;
  stock_quantity: number;
  min_stock: number;
  is_active: boolean;
  barcode?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export const useStore2Products = () => {
  const [products, setProducts] = useState<Store2Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Carregando produtos da Loja 2...');
      
      // Check if Supabase is properly configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || 
          supabaseUrl === 'your_supabase_url_here' || 
          supabaseKey === 'your_supabase_anon_key_here' ||
          supabaseUrl.includes('placeholder')) {
        console.warn('⚠️ Supabase não configurado - usando produtos de demonstração para Loja 2');
        
        // Fallback para produtos de demonstração
        const demoProducts: Store2Product[] = [
          {
            id: 'demo-acai-300-loja2',
            code: 'ACAI300L2',
            name: 'Açaí 300ml - Loja 2',
            category: 'acai',
            is_weighable: false,
            unit_price: 15.90,
            price_per_gram: undefined,
            image_url: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=400',
            stock_quantity: 100,
            min_stock: 10,
            is_active: true,
            barcode: '',
            description: 'Açaí tradicional 300ml - Loja 2',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'demo-acai-500-loja2',
            code: 'ACAI500L2',
            name: 'Açaí 500ml - Loja 2',
            category: 'acai',
            is_weighable: false,
            unit_price: 22.90,
            price_per_gram: undefined,
            image_url: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=400',
            stock_quantity: 100,
            min_stock: 10,
            is_active: true,
            barcode: '',
            description: 'Açaí tradicional 500ml - Loja 2',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'demo-acai-1kg-loja2',
            code: 'ACAI1KGL2',
            name: 'Açaí 1kg (Pesável) - Loja 2',
            category: 'acai',
            is_weighable: true,
            unit_price: undefined,
            price_per_gram: 0.04499,
            image_url: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=400',
            stock_quantity: 50,
            min_stock: 5,
            is_active: true,
            barcode: '',
            description: 'Açaí tradicional vendido por peso - Loja 2',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
        
        setProducts(demoProducts);
        setLoading(false);
        return;
      }
      
      // Primeiro, tentar carregar da tabela store2_products
      console.log('📊 Tentando carregar da tabela store2_products...');
      const { data: store2Data, error: store2Error } = await supabase
        .from('store2_products')
        .select('*')
        .order('name');

      if (store2Error) {
        console.warn('⚠️ Erro ao carregar da tabela store2_products:', store2Error);
        console.log('🔄 Tentando carregar da tabela pdv_products como fallback...');
        
        // Fallback: tentar carregar da tabela pdv_products
        const { data: pdvData, error: pdvError } = await supabase
          .from('pdv_products')
          .select('*')
          .eq('is_active', true)
          .order('name');

        if (pdvError) {
          console.error('❌ Erro ao carregar produtos do PDV também:', pdvError);
          throw pdvError;
        }

        console.log(`✅ ${pdvData?.length || 0} produtos carregados da tabela pdv_products (fallback)`);
        setProducts(pdvData || []);
      } else {
        console.log(`✅ ${store2Data?.length || 0} produtos carregados da tabela store2_products`);
        setProducts(store2Data || []);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar produtos';
      console.error('❌ Erro ao carregar produtos da Loja 2:', errorMessage);
      setError(errorMessage);
      
      // Fallback final para produtos de demonstração em caso de erro
      console.log('🔄 Usando produtos de demonstração como último recurso...');
      const demoProducts: Store2Product[] = [
        {
          id: 'demo-acai-300-loja2',
          code: 'ACAI300L2',
          name: 'Açaí 300ml - Loja 2',
          category: 'acai',
          is_weighable: false,
          unit_price: 15.90,
          image_url: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=400',
          stock_quantity: 100,
          min_stock: 10,
          is_active: true,
          barcode: '',
          description: 'Açaí tradicional 300ml - Loja 2',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'demo-acai-500-loja2',
          code: 'ACAI500L2',
          name: 'Açaí 500ml - Loja 2',
          category: 'acai',
          is_weighable: false,
          unit_price: 22.90,
          image_url: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=400',
          stock_quantity: 100,
          min_stock: 10,
          is_active: true,
          barcode: '',
          description: 'Açaí tradicional 500ml - Loja 2',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'demo-acai-1kg-loja2',
          code: 'ACAI1KGL2',
          name: 'Açaí 1kg (Pesável) - Loja 2',
          category: 'acai',
          is_weighable: true,
          unit_price: undefined,
          price_per_gram: 0.04499,
          image_url: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=400',
          stock_quantity: 50,
          min_stock: 5,
          is_active: true,
          barcode: '',
          description: 'Açaí tradicional vendido por peso - Loja 2',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      setProducts(demoProducts);
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (product: Omit<Store2Product, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('🚀 Criando produto na Loja 2:', product);
      
      const { data, error } = await supabase
        .from('store2_products')
        .insert([{
          ...product,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      
      setProducts(prev => [...prev, data]);
      console.log('✅ Produto da Loja 2 criado:', data);
      return data;
    } catch (err) {
      console.error('❌ Erro ao criar produto da Loja 2:', err);
      throw new Error(err instanceof Error ? err.message : 'Erro ao criar produto');
    }
  }, []);

  const updateProduct = useCallback(async (id: string, updates: Partial<Store2Product>) => {
    try {
      console.log('✏️ Atualizando produto da Loja 2:', id, updates);
      
      const { data, error } = await supabase
        .from('store2_products')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setProducts(prev => prev.map(p => p.id === id ? data : p));
      console.log('✅ Produto da Loja 2 atualizado:', data);
      return data;
    } catch (err) {
      console.error('❌ Erro ao atualizar produto da Loja 2:', err);
      throw new Error(err instanceof Error ? err.message : 'Erro ao atualizar produto');
    }
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    try {
      console.log('🗑️ Excluindo produto da Loja 2:', id);
      
      const { error } = await supabase
        .from('store2_products')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
      
      setProducts(prev => prev.filter(p => p.id !== id));
      console.log('✅ Produto da Loja 2 excluído');
    } catch (err) {
      console.error('❌ Erro ao excluir produto da Loja 2:', err);
      throw new Error(err instanceof Error ? err.message : 'Erro ao excluir produto');
    }
  }, []);

  const searchProducts = useCallback((query: string) => {
    if (!query.trim()) return products;
    
    const searchTerm = query.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.code.toLowerCase().includes(searchTerm) ||
      product.barcode?.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    );
  }, [products]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    refetch: fetchProducts
  };
};