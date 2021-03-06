import { Navigate } from 'react-router-dom';
import DashboardLayout from 'src/components/DashboardLayout';
import MainLayout from 'src/components/MainLayout';
import Dashboard from 'src/pages/Dashboard';
import NotFound from 'src/pages/NotFound';
import ChatBot from "./pages/ChatBot";

const routes = [
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [
      { path: 'accounts', element: <app-accounts /> },
      { path: 'payments', element: <app-payments /> },
      { path: 'chatbot', element: <ChatBot /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '404', element: <NotFound /> },
      { path: '/', element: <Navigate to="/app/payments" /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

export default routes;
