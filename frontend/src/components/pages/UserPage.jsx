import { useState, useEffect } from "react";
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast';

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
        v => !v && "La contraseña es obligatoria",
        v => v.length < 8 && "La contraseña debe tener al menos 8 carácteres",
        v => !/[A-Z]/.test(v) && "Debe contener al menos una letra mayúscula",
        v => !/[a-z]/.test(v) && "Debe contener al menos una letra minúscula",
        v => !/[0-9]/.test(v) && "Debe contener al menos un número",
        v => !/[!@#$%^&*(),.?":{}|<>_\-]/.test(v) && "Debe contener al menos un carácter especial"
    ]
};

export const UserPage = () => {
  const { userId } = useAuth();
  const [user, setUser] = useState ({
    id: userId,
    email: "",
    username: "",
    name: "",
    password: ""
  });

  const [loading, setLoading] = useState(true);

  // Pedir los datos del usuario
  useEffect(() => {
    if (!userId) {
      return;
    }
    const fetchUser = async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/get-user/${userId}`);
      const data = await response.json();
      setUser(data);
      setLoading(false);
    };

    fetchUser();
  }, [userId]);

  const updateField = (k) => (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [k]: value }));
    validateField(k, value);
  };

  const validateForm = () => {
        const newErrors = {};
        Object.keys(form).forEach((key) => {
            validateField(key, form[key]) || (newErrors[key] = true);
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user)
    }).then(async res => {
      const data = await res.json();
      console.log("RESULT: ", data);
      console.log("FORM: ", user);
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

  if (loading) return (
    <p className="text-center mt-20">Cargando perfil...</p>
  )

  return (
      <div className="w-90 lg:w-full max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">Mi Perfil</h2>

        <form onSubmit={updateUser} className="flex flex-col gap-5">

          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={user.email}
              onChange={updateField("email")}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Nombre de usuario</label>
            <input
              type="text"
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={user.username}
              onChange={updateField("username")}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Nombre completo</label>
            <input
              type="text"
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={user.name || ""}
              onChange={updateField("name")}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Contraseña</label>
            <input
              type="password"
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="••••••••"
              value={user.password}
              onChange={updateField("password")}
            />
          </div>


          <button type="submit" className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300">
            Guardar cambios
          </button>
        </form>
      </div>
  )
}