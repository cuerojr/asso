import React, { Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import UserLayout from "../../layout/UserLayout";

const Login = React.lazy(() => import("./login"));
const OlvidePwd = React.lazy(() => import("./olvide-pwd"));

const User = () => {
  return (
    <UserLayout>
      <Suspense fallback={<div className="loading" />}>
        <Routes>
          {/* Ruta por defecto dentro de /user */}
          <Route index element={<Navigate to="login" replace />} />

          {/* Rutas relativas */}
          <Route path="login" element={<Login />} />
          <Route path="olvide-pwd" element={<OlvidePwd />} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/error" replace />} />
        </Routes>
      </Suspense>
    </UserLayout>
  );
};

export default User;
