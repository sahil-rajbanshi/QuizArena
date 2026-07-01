import { createBrowserRouter } from "react-router-dom";
import RouteErrorBoundary from "./components/layout/RouteErrorBoundary";
import NotFoundRedirect from "./components/layout/NotFoundRedirect";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import AdminRoute from "./components/layout/AdminRoute";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import Topics from "./pages/topics/Topics";
import QuizSession from "./pages/quiz/QuizSession";
import QuizResults from "./pages/quiz/QuizResults";
import AdminQuestions from "./pages/admin/AdminQuestions";
import QuestionForm from "./pages/admin/QuestionForm";

const router = createBrowserRouter([
  { path: "/login", element: <Login />, errorElement: <RouteErrorBoundary /> },
  { path: "/register", element: <Register />, errorElement: <RouteErrorBoundary /> },
  {
    element: <ProtectedRoute />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/topics", element: <Topics /> },
      { path: "/quiz", element: <QuizSession /> },
      { path: "/quiz/:id/results", element: <QuizResults /> },
    ],
  },
  {
    element: <AdminRoute />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { path: "/admin/questions", element: <AdminQuestions /> },
      { path: "/admin/questions/new", element: <QuestionForm /> },
      { path: "/admin/questions/:id/edit", element: <QuestionForm /> },
    ],
  },
  { path: "*", element: <NotFoundRedirect /> },
]);

export default router;