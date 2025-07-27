import React, { useState, useEffect } from 'react';
import '../../index.css';
import { 
  Plus, 
  Minus, 
  Search, 
  ShoppingCart, 
  Trash2, 
  Calculator,
  Scale,
  Package,
  DollarSign,
  CreditCard,
  Banknote,
  QrCode,
  Receipt,
  X,
  AlertCircle,
  User,
  Phone
} from 'lucide-react';
import { useStore2Products, Store2Product } from '../../hooks/useStore2Products';
import { useStore2Sales, useStore2Cart } from '../../hooks/useStore2Sales';
import { useStore2PDVCashRegister } from '../../hooks/useStore2PDVCashRegister';
import { PesagemModal } from '../PDV/PesagemModal';
import Store2ReceiptModal from './Store2ReceiptModal';
import { PDVOperator } from '../../types/pdv';

interface Store2PDVSalesScreenProps {
  operator?: PDVOperator;
  scaleHook?: any;
}

const Store2PDVSalesScreen: React.FC<Store2PDVSalesScreenProps> = ({ operator, scaleHook }) => {
  const { products, loading: productsLoading, error: productsError, refetch: refetchProducts } = useStore2Products();
  const { createSale } = use<boltArtifact id="fix-store2-products-loading" title="Corrigir carregamento de produtos da Loja 2">