import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Loader } from '../components/Loader';
import { BeachReport } from '../components/BeachReport';
import { BeachCard } from '../components/BeachCard';
import { useNavigate } from 'react-router-dom'


const FORM_RULES = {
    name: [
        v => !v.trim() && "El nombre es obligatorio",
        v => v.trim().length < 3 && "El nombre debe tener al menos 3 carácteres"
    ],
    username: [
        v => !v.trim() && "El nombre de usuario es obligatorio",
        v => v.trim().length < 3 && "El nombre de usuario debe tener al menos 3 carácteres"
    ],
    email: [
        v => !v && "El correo electrónico es obligatorio",
        v => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && "El formato del correo electrónico no es válido"
    ],
    password: [
        v => v && v.length < 8 && "La contraseña debe tener al menos 8 carácteres",
        v => v && !/[A-Z]/.test(v) && "Debe contener al menos una letra mayúscula",
        v => v && !/[a-z]/.test(v) && "Debe contener al menos una letra minúscula",
        v => v && !/[0-9]/.test(v) && "Debe contener al menos un número",
        v => v && !/[!@#$%^&*(),.?":{}|<>_\-]/.test(v) && "Debe contener al menos un carácter especial"
    ]
};

export const UserPage = () => {
  const navigate = useNavigate();
  
  // Recoger el token del AuthContext
  const { token } = useAuth();  
  
  const [user, setUser] = useState ({
    email: "",
    username: "",
    name: "",
    password: ""
  });
  const [reports, setReports] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const toggleFavorite = async (beachId) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/toggle-favorite/${beachId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!data.favorite) {
      setFavorites(prev => prev.filter(b => b.id !== beachId))
      toast.success("🌊Se ha eliminado la playa de favoritos🌊");
    }
  }


  // Pedir los datos del usuario
  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        const userResponse = await fetch(`${import.meta.env.VITE_API_URL}/auth/get-user`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const userData = await userResponse.json();
        setUser(userData);

        const reportsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/get-user-reports`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const reportsData = await reportsResponse.json();
        setReports(reportsData);

        const favoritesResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/get-user-favorites`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const favoritesData = await favoritesResponse.json();
        setFavorites(favoritesData);
      } catch (err) {
        toast.error("🚩Error al cargar los datos🚩");
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  const updateField = (k) => (e) => {
    const value = e.target.value;
    setUser((f) => ({ ...f, [k]: value }));
    validateField(k, value);
  };

  const validateForm = () => {
        const newErrors = {};
        Object.keys(user).forEach((key) => {
            validateField(key, user[key]) || (newErrors[key] = true);
        });
        return Object.values(newErrors).length === 0;
    };

  const validateField = (key, value) => {
        let message = "";

        const validators = FORM_RULES[key];
        if (validators) {
            for (const test of validators) {
                const error = test(value);
                if (error) {
                    message = error;
                    break;
                }
            }
        }

        setErrors(prev => ({ ...prev, [key]: message }));
        return message === "";
    };

  // Guardar cambios en el perfil
  const updateUser = async (e) => {
    e.preventDefault();

    const formOk = validateForm();
    if (!formOk) {
      return;
    }

    const updatePromise = fetch(`${import.meta.env.VITE_API_URL}/auth/update-user`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(user)
    }).then(async res => {
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "🚩Error en el servidor");
      }

      return data;
    });

    toast.promise(updatePromise, {
      loading: "Actualizando usuario...",
      success: (data) => `🌊Datos actualizados correctamente!🌊`,
      error: (err) => err.message || "🚩Error inesperado🚩"
    })
    .catch(() => { })

  }
  
  return (
    <>
      {/* Formulario */}
      <div className="w-90 lg:w-full max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-kaushan">Mi Perfil</h2>
        <form onSubmit={updateUser} className="flex flex-col gap-5">
          {["email", "username", "name", "password"].map((field) => (
            <div key={field}>
              <label className="block text-sm text-gray-600 mb-1">
                {field === "username" ? "Nombre de usuario" : field === "name" ? "Nombre completo" : field === "password" ? "Contraseña" : "Email"}
              </label>
              <input
                type={field === "password" ? "password" : "text"}
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder={field === "password" ? "••••••••" : ""}
                value={field !== "password" ? user[field] ?? "" : undefined}
                onChange={updateField(field)}
              />
              {errors[field] && <small className="text-red-500">{errors[field]}</small>}
            </div>
          ))}
          <button type="submit" className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300">
            Guardar cambios
          </button>
        </form>
      </div>

      {/* Reportes y Playas favoritas */}
      <div className="w-90 lg:w-full max-w-6xl mx-auto mt-8 flex flex-col lg:flex-row gap-6">
        {/* Mis playas favoritas */}
        <div className="flex-1 p-6 bg-white shadow-lg rounded-xl mb-10">
          <h2 className="text-2xl font-bold text-blue-700 mb-4 text-kaushan">Mis Playas Favoritas</h2>
          {loading ? (
            <Loader />
          ) : favorites.length === 0 ? (
            <p className="text-gray-500">Aún no tienes playas favoritas.</p>
          ) : (
            <ul className="space-y-3 group flex-col">
              {favorites.map((beach) => (
                <BeachCard key={beach.id} beach={beach} onToggleFavorite={toggleFavorite} />
              ))}
            </ul>
          )}
        </div>
        
        {/* Mis reportes */}
        <div className="flex-1 p-6 bg-white shadow-lg rounded-xl mb-10">
          <h2 className="text-2xl font-bold text-blue-700 mb-4 text-kaushan">Mis Reportes</h2>
          {loading ? (
            <Loader />
          ) : reports.length === 0 ? (
            <p className="text-gray-500">Aún no has enviado ningún reporte.</p>
          ) : (
            <ul className="space-y-3">
              {reports.map((report) => (
                <BeachReport key={report.id} report={report} />
              ))}
            </ul>
          )}
        </div>

      </div>
    </>
  );
};