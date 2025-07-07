import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignUpPage";
import ClientPage from "./pages/ClientPage";
import TaskListPage from "./pages/TaskListPage";
import NotFoundPage from "./pages/NotFoundPage";
import Dashboard from "./pages/Dashboard";
import TaskDetailsPage from "./pages/TaskDetailsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<Dashboard/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/admin/clients" element={<ClientPage />} />
        <Route path="/admin/tasks" element={<TaskListPage />} />
        <Route path="/admin/tasks/:id" element={<TaskDetailsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
