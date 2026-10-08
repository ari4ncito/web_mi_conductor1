import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout.jsx";
import AuthLayout from "../layouts/AuthLayout.jsx";

import ProtectedRoute from "./ProtectedRoute.jsx";
import PublicRoute from "./PublicRoute.jsx";

const Login = lazy(() => import("../modules/auth/pages/Login.jsx"));
const CrearCuenta = lazy(() => import("../modules/auth/pages/CrearCuenta.jsx"));
const RecoverPassword = lazy(() => import("../modules/auth/pages/RecoverPassword.jsx"));
const ResetPassword = lazy(() => import("../modules/auth/pages/ResetPassword.jsx"));

const DashboardPage = lazy(() => import("../modules/dashboard/pages/DashboardPage.jsx"));
const DriversPage = lazy(() => import("../modules/drivers/pages/DriversPage.jsx"));
const IncidentManagementPage = lazy(() => import("../modules/incidents/pages/IncidentManagementPage.jsx"));
const ServiceRequestsShell = lazy(() => import("../modules/serviceRequests/pages/ServiceRequestsShell.jsx"));
const TrackingPage = lazy(() => import("../modules/tracking/pages/TrackingPage.jsx"));
const UsersPage = lazy(() => import("../modules/users/pages/UsersPage.jsx"));
const VehiclesPage = lazy(() => import("../modules/vehicles/pages/VehiclesPage.jsx"));
const RolesPage = lazy(() => import("../modules/roles/pages/roles.jsx"));

const ClientsShell = lazy(() => import("../modules/clients/pages/ClientsShell.jsx"));

const PrincipalPage = lazy(() => import("../modules/principalPage/page/PrincipalPage.jsx"));

export default function AppRoutes() {

    return (
        <BrowserRouter>
            <Suspense fallback={<div className="flex items-center justify-center h-screen">Cargando...</div>}>
                <Routes>

                    {/* ================================= */}
                    {/* PÁGINA PRINCIPAL - PÚBLICA        */}
                    {/* ================================= */}

                    <Route
                        path="/"
                        element={<PrincipalPage />}
                    />


                    {/* ================================= */}
                    {/* RUTAS PÚBLICAS DE AUTENTICACIÓN  */}
                    {/* ================================= */}

                    <Route element={<PublicRoute />}>

                        <Route element={<AuthLayout />}>

                            <Route
                                path="/login"
                                element={<Login />}
                            />

                            <Route
                                path="/register"
                                element={<CrearCuenta />}
                            />

                            <Route
                                path="/recover-password"
                                element={<RecoverPassword />}
                            />

                            <Route
                                path="/reset-password"
                                element={<ResetPassword />}
                            />

                        </Route>

                    </Route>


                    {/* ================================= */}
                    {/* RUTAS PROTEGIDAS                  */}
                    {/* ================================= */}

                    <Route element={<ProtectedRoute />}>

                        <Route element={<AdminLayout />}>

                            <Route
                                path="/dashboard"
                                element={<DashboardPage />}
                            />

                            <Route
                                path="/roles"
                                element={<RolesPage />}
                            />

                            <Route
                                path="/users"
                                element={<UsersPage />}
                            />

                            <Route
                                path="/clients/*"
                                element={<ClientsShell />}
                            />

                            <Route
                                path="/drivers"
                                element={<DriversPage />}
                            />

                            <Route
                                path="/vehicles"
                                element={<VehiclesPage />}
                            />

                            <Route
                                path="/service-requests/*"
                                element={<ServiceRequestsShell />}
                            />

                            <Route
                                path="/tracking"
                                element={<TrackingPage />}
                            />

                            <Route
                                path="/incidents"
                                element={<IncidentManagementPage />}
                            />

                        </Route>

                    </Route>


                    {/* ================================= */}
                    {/* RUTA NO ENCONTRADA                */}
                    {/* ================================= */}

                    <Route
                        path="*"
                        element={<Navigate to="/" replace />}
                    />

                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}