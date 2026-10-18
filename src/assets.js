// Vite supplies the deployment prefix, including GitHub project Pages paths.
export const asset = path => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
