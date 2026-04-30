export const getUserRoleFromToken = (token) => {
  const storedRole = localStorage.getItem("userRole");
  if (storedRole) {
    return storedRole;
  }

  if (!token) {
    return null;
  }

  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
    );
    return payload.role || null;
  } catch (error) {
    console.error("Error decoding token role", error);
    return null;
  }
};
