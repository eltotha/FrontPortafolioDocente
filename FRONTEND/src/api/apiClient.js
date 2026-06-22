import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:5151/api', // Asegúrate de apuntar al puerto 5151 activo
    headers: {
        'Content-Type': 'application/json',
    },
});

// INTERCEPTOR: Se ejecuta antes de enviar cualquier petición al backend
apiClient.interceptors.request.use(
    (config) => {
        // 1. Recuperar el usuario guardado en el Login
        const userJson = localStorage.getItem('user');

        if (userJson) {
            const user = JSON.parse(userJson);
            // 2. Inyectar el rol del usuario en el encabezado de la petición
            config.headers['X-User-Role'] = user.tipo;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;