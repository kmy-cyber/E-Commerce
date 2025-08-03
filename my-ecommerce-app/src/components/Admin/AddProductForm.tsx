// src/components/Admin/AddProductForm.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Product, ProductFormData } from "../../interfaces"; // Importa las interfaces
import { ProductService, CategoryService } from "../../services"; // Importa servicios
import { toast } from 'react-toastify'; // Importa la interfaz AppContextType

interface AddProductFormProps {
  editingProduct: Product | null; //
  setEditingProduct: React.Dispatch<React.SetStateAction<Product | null>>; //
  fetchProducts: () => void; //
}

const AddProductForm: React.FC<AddProductFormProps> = ({
  editingProduct,
  setEditingProduct,
  fetchProducts,
}) => {
  const [availableCategories, setAvailableCategories] = useState<string[]>([]); // Estado para categorías dinámicas

  const [formData, setFormData] = useState<ProductFormData>({ //
    name: "",
    description: "",
    imageUrl: "", // This will still hold the URL string if it exists from editingProduct
    enrollmentPrice: "",
    stock: "",
    category: "", // Inicializa como cadena vacía, se establecerá la primera categoría después de la carga
    minOrderQuantity: ""
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null); //
  const [imagePreview, setImagePreview] = useState<string | null>(null); //
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true); //
  const [categoriesError, setCategoriesError] = useState<string | null>(null); //

  // Cargar categorías al montar el componente
  useEffect(() => {
    const fetchProductCategories = async () => { //
      try {
        setLoadingCategories(true); //
        const response = await CategoryService.getCategories(); //
        const categoryNames = response.data.map((cat: any) => cat.name); //
        setAvailableCategories(categoryNames); //
        if (categoryNames.length > 0 && !editingProduct) { //
          setFormData((prev) => ({ //
            ...prev,
            category: categoryNames[0], // Establece la primera categoría como valor por defecto para nuevos productos
          }));
        }
        setCategoriesError(null); //
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) { //
          console.error("Error al cargar categorías:", err.message); //
          setCategoriesError('No se pudieron cargar las categorías. Inténtalo de nuevo más tarde.'); //
        } else {
          console.error("Error inesperado al cargar categorías:", err); //
          setCategoriesError('Ocurrió un error inesperado al cargar las categorías.'); //
        }
        // Fallback a categorías predefinidas si la API falla
        const fallbackCats = [
          "Electrónicos",
          "Ropa",
          "Aseo",
          "Comida",
          "Otros",
        ];
        setAvailableCategories(fallbackCats); //
        if (!editingProduct) { //
          setFormData((prev) => ({ //
            ...prev,
            category: fallbackCats[0], // Establece una categoría por defecto del fallback
          }));
        }
      } finally {
        setLoadingCategories(false); //
      }
    };
    fetchProductCategories(); //
  }, [editingProduct]); //

  useEffect(() => {
    if (editingProduct) { //
      setFormData({ //
        name: editingProduct.name, //
        description: editingProduct.description, //
        imageUrl: editingProduct.imageUrl, //
        enrollmentPrice: editingProduct.enrollmentPrice, //
        minOrderQuantity: editingProduct.minOrderQuantity, //
        stock: editingProduct.stock, //
        category: editingProduct.category, //
      });
      // If editing an existing product with an image URL, set it as preview
      setImagePreview(editingProduct.imageUrl); //
      setSelectedFile(null); // Clear selected file when editing
    } else {
      setFormData({ //
        name: "",
        description: "",
        imageUrl: "",
        enrollmentPrice: "",
        minOrderQuantity: 1, // Default minimum quantity for new products
        stock: "", // Correctly set stock to an empty string for new products
        category: availableCategories.length > 0 ? availableCategories[0] : "", // Set category based on availableCategories
      });
      setImagePreview(null); //
      setSelectedFile(null); //
    }
  }, [editingProduct, availableCategories]); // Añadir availableCategories como dependencia

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target; //

    // Type guard to check if e.target is an HTMLInputElement and if it has files
    if (
      e.target instanceof HTMLInputElement &&
      e.target.type === "file" &&
      name === "imageFile"
    ) {
      const file = e.target.files?.[0] || null; // Use optional chaining and nullish coalescing
      setSelectedFile(file); //
      if (file) { //
        setImagePreview(URL.createObjectURL(file)); //
      } else {
        setImagePreview(null); //
      }
    } else {
      setFormData((prev) => ({ //
        ...prev,
        [name]:
          name === "enrollmentPrice" || name === "stock"
            ? parseFloat(value) || ""
            : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { //
    e.preventDefault(); //
    try {
      let dataToSend: FormData | ProductFormData; //

      // Si hay un archivo seleccionado, usar FormData
      if (selectedFile) { //
        const formDataToSend = new FormData(); //
        formDataToSend.append("name", formData.name); //
        formDataToSend.append("description", formData.description); //
        formDataToSend.append(
          "enrollmentPrice",
          formData.enrollmentPrice.toString()
        ); //
        formDataToSend.append("stock", formData.stock.toString()); //
        formDataToSend.append("category", formData.category); //
        formDataToSend.append("image", selectedFile); //
        dataToSend = formDataToSend; //
      } else {
        // Si no hay archivo, usar el objeto normal (para cuando se edita sin cambiar imagen)
        dataToSend = {
          ...formData,
          enrollmentPrice: parseFloat(formData.enrollmentPrice as string),
          stock: parseInt(formData.stock as string),
        }; //
      }

      if (editingProduct) { //
        await ProductService.updateProduct(editingProduct.id, dataToSend); //
        toast.success("¡Producto actualizado con éxito!");
      } else {
        await ProductService.addProduct(dataToSend); //
        toast.success("¡Producto agregado con éxito!");
      }
      setEditingProduct(null); //
      setFormData({
        name: "",
        description: "",
        imageUrl: "",
        enrollmentPrice: "",
        stock: "",
        minOrderQuantity: 1,
        category: availableCategories.length > 0 ? availableCategories[0] : "", // Reinicia a la primera categoría cargada
      });
      setSelectedFile(null); //
      setImagePreview(null); //
      fetchProducts(); //
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) { //
        console.error(
          "Error al guardar producto:",
          error.response?.data || error.message
        ); //
        const errorMessage =
          error.response?.data?.message || "Error al guardar el producto"; //
        toast.error(`Error: ${errorMessage}`);
      } else {
        console.error("Error inesperado al guardar producto:", error); //
        toast.error("Ocurrió un error inesperado al guardar el producto.");
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
      {/* Header del formulario */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-6">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">
              {editingProduct ? "Editar Producto" : "Agregar Nuevo Producto"}
            </h3>
            <p className="text-teal-100 text-sm">
              {editingProduct ? "Modifica la información del producto" : "Completa los datos del nuevo producto"}
            </p>
          </div>
        </div>
      </div>

      <div className="p-8">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-gray-700 text-lg font-semibold mb-2"
          >
            Nombre del Producto:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 text-base" // Added focus:ring-teal-500
            required
          />
        </div>
        <div>
          <label
            htmlFor="enrollmentPrice"
            className="block text-gray-700 text-lg font-semibold mb-2"
          >
            Precio de Inscripción:
          </label>
          <input
            type="number"
            id="enrollmentPrice"
            name="enrollmentPrice"
            value={formData.enrollmentPrice}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 text-base" // Added focus:ring-teal-500
            step="0.01"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label
            htmlFor="description"
            className="block text-gray-700 text-lg font-semibold mb-2"
          >
            Descripción (Opcional):
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 text-base" // Added focus:ring-teal-500
            placeholder="Describe tu producto aquí... (opcional)"
          ></textarea>
        </div>
        <div>
          <label className="block text-gray-700 text-lg font-semibold mb-2">
            Seleccionar Imagen (Opcional):
          </label>
          <div className="relative">
            <input
              type="file"
              id="imageFile"
              name="imageFile"
              onChange={handleChange}
              className="hidden"
              accept="image/*"
            />
            <label
              htmlFor="imageFile"
              className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition-all duration-300 group"
            >
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400 group-hover:text-teal-500 transition-colors duration-300"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="mt-2">
                  <span className="text-base font-medium text-gray-700 group-hover:text-teal-600">
                    {selectedFile ? selectedFile.name : "Haz clic para seleccionar una imagen"}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">
                    PNG, JPG, GIF hasta 10MB
                  </p>
                </div>
              </div>
            </label>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Si no seleccionas una imagen, se usará una imagen por defecto.
          </p>
          {imagePreview && (
            <div className="mt-4">
              <p className="text-gray-700 text-sm mb-2">Previsualización:</p>
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Image Preview"
                  className="max-w-full h-40 object-cover rounded-lg shadow-md"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement; //
                    target.style.display = "none"; //
                    const errorDiv =
                      target.nextElementSibling as HTMLDivElement; //
                    if (errorDiv) { //
                      errorDiv.style.display = "flex"; //
                    }
                  }}
                />
                <div
                  className="hidden w-full h-40 bg-gray-300 rounded-lg shadow-md items-center justify-center text-gray-700 font-medium" // Changed bg-gray-200 to bg-gray-300 and text-gray-600 to text-gray-700
                  style={{ display: "none" }}
                >
                  Imagen no encontrada
                </div>
              </div>
            </div>
          )}
          {/* Keep a hidden input for imageUrl to maintain the formData structure,
              but it won't be directly tied to file input here.
              The backend would typically provide the URL after upload. */}
          <input type="hidden" name="imageUrl" value={formData.imageUrl} />
        </div>
        <div>
          <label
            htmlFor="stock"
            className="block text-gray-700 text-lg font-semibold mb-2"
          >
            Stock:
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 text-base"
            min="0"
            required
          />
        </div>
        <div>
          <label
            htmlFor="minOrderQuantity"
            className="block text-gray-700 text-lg font-semibold mb-2"
          >
            Cantidad mínima a comprar:
          </label>
          <input
            type="number"
            id="minOrderQuantity"
            name="minOrderQuantity"
            value={formData.minOrderQuantity}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 text-base"
            min="1"
            required
          />
        </div>
        <div>
          {" "}
          {/* Selector de Categoría */}
          <label
            htmlFor="category"
            className="block text-gray-700 text-lg font-semibold mb-2"
          >
            Categoría:
          </label>
          {loadingCategories ? (
            <p className="text-gray-600">Cargando categorías...</p>
          ) : categoriesError ? (
            <p className="text-red-600">{categoriesError}</p>
          ) : (
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 text-base" // Added focus:ring-teal-500
              required
            >
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="md:col-span-2 flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
          <button
            type="submit"
            className="flex items-center space-x-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 text-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{editingProduct ? "Guardar Cambios" : "Agregar Producto"}</span>
          </button>
          {editingProduct && (
            <button
              type="button"
              onClick={() => {
                setEditingProduct(null);
                setSelectedFile(null);
                setImagePreview(null);
              }}
              className="flex items-center space-x-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 text-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Cancelar</span>
            </button>
          )}
        </div>
      </form>
      </div>
    </div>
  );
};

export default AddProductForm;