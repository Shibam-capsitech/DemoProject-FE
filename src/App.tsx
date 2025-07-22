import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignUpPage";
import ClientPage from "./pages/ClientPage";
import TaskListPage from "./pages/TaskListPage";
import NotFoundPage from "./pages/NotFoundPage";
import Dashboard from "./pages/Dashboard";
import TaskDetailsPage from "./pages/TaskDetailsPage";
import ProtectedRoute from "./components/ProtectRoute";
import ClientDetailsPage from "./pages/ClientDetailsPage";
import { useUser } from "./context/UserContext";

function App() {
  const {role} = useUser()
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {role==="Admin" &&
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />}
        <Route
          path="/clients"
          element={
            <ProtectedRoute>
              <ClientPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients/:businessId"
          element={
            <ProtectedRoute>
              <ClientDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <TaskListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks/:taskId"
          element={
            <ProtectedRoute>
              <TaskDetailsPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
