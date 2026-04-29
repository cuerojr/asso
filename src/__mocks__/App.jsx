import { Routes, Route } from "react-router-dom";

export default function AppMock() {
  return (
    <Routes>
      <Route path="/user/login" element={<div>Login Page</div>} />
      <Route path="/app" element={<div>App Page</div>} />
    </Routes>
  );
}
