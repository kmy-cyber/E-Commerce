// src/components/Admin/CategoryManager.tsx
import React, { useState, useEffect } from 'react';
import { CategoryService } from '../../services';

interface Category {
  id: number;
  name: string;
  description: string;
  productCount: number;
}

interface CategoryManagerProps {
  products: any[];
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ products }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  // Cargar categorías desde la API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await CategoryService.getCategoryStats();
        setCategories(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Error al cargar las categorías');
        // Fallback a categorías por defecto
        setCategories([
          { id: 1, name: 'Electrónicos', description: 'Dispositivos y gadgets tecnológicos', productCount: 0 },
          { id: 2, name: 'Ropa', description: 'Vestimenta y accesorios de moda', productCount: 0 },
          { id: 3, name: 'Aseo', description: 'Productos de higiene personal', productCount: 0 },
          { id: 4, name: 'Comida', description: 'Alimentos y bebidas', productCount: 0 },
          { id: 5, name: 'Otros', description: 'Productos diversos', productCount: 0 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (newCategory.name.trim()) {
      try {
        await CategoryService.createCategory({
          name: newCategory.name.trim(),
          description: newCategory.description.trim() || undefined
        });
        
        // Recargar categorías
        const updatedResponse = await CategoryService.getCategoryStats();
        setCategories(updatedResponse.data);
        
        setNewCategory({ name: '', description: '' });
        setShowAddForm(false);
        alert('Categoría creada exitosamente');
      } catch (err) {
        console.error('Error creating category:', err);
        alert('Error al crear la categoría');
      }
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
  };

  const handleUpdateCategory = async () => {
    if (editingCategory) {
      try {
        await CategoryService.updateCategory(editingCategory.id, {
          name: editingCategory.name.trim(),
          description: editingCategory.description.trim() || undefined
        });
        
        // Recargar categorías
        const updatedResponse = await CategoryService.getCategoryStats();
        setCategories(updatedResponse.data);
        
        setEditingCategory(null);
        alert('Categoría actualizada exitosamente');
      } catch (err) {
        console.error('Error updating category:', err);
        alert('Error al actualizar la categoría');
      }
    }
  };

  const handleDeleteCategory = async (id: number) => {
    const category = categories.find(cat => cat.id === id);
    if (category && category.productCount > 0) {
      alert(`No se puede eliminar la categoría "${category.name}" porque tiene ${category.productCount} productos asociados.`);
      return;
    }
    
    if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      try {
        await CategoryService.deleteCategory(id);
        
        // Recargar categorías
        const updatedResponse = await CategoryService.getCategoryStats();
        setCategories(updatedResponse.data);
        
        alert('Categoría eliminada exitosamente');
      } catch (err) {
        console.error('Error deleting category:', err);
        alert('Error al eliminar la categoría');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        <span className="ml-3 text-gray-600">Cargando categorías...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con botón agregar */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestión de Categorías</h2>
          <p className="text-gray-600">Organiza y administra las categorías de productos</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Nueva Categoría</span>
        </button>
      </div>

      {/* Formulario para agregar categoría */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Agregar Nueva Categoría</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                placeholder="Nombre de la categoría"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
              <input
                type="text"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                placeholder="Descripción de la categoría"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleAddCategory}
              className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300"
            >
              Agregar
            </button>
          </div>
        </div>
      )}

      {/* Lista de categorías */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-teal-100 p-2 rounded-lg">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Productos</span>
                <span className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-sm font-semibold">
                  {category.productCount}
                </span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleEditCategory(category)}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 text-sm"
              >
                Editar
              </button>
              <button
                onClick={() => handleDeleteCategory(category.id)}
                disabled={category.productCount > 0}
                className={`flex-1 font-medium py-2 px-4 rounded-lg transition-colors duration-300 text-sm ${
                  category.productCount > 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de edición */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Editar Categoría</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <input
                  type="text"
                  value={editingCategory.description}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingCategory(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdateCategory}
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;