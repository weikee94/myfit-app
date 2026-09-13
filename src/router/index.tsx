import { createBrowserRouter, Navigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import AuthGuard from "@/components/auth/AuthGuard";
import LoginPage from "@/pages/auth/LoginPage";
import AuthCallbackPage from "@/pages/auth/AuthCallbackPage";
import DashboardPage from "@/pages/DashboardPage";
import WorkoutLogPage from "@/pages/WorkoutLogPage";
import NewWorkoutPage from "@/pages/NewWorkoutPage";
import WorkoutDetailPage from "@/pages/WorkoutDetailPage";
import ExerciseLibraryPage from "@/pages/ExerciseLibraryPage";
import ExerciseDetailPage from "@/pages/ExerciseDetailPage";
import ProgressPage from "@/pages/ProgressPage";
import ProfilePage from "@/pages/ProfilePage";
import PlanPage from "@/pages/PlanPage";
import PlanWeekPage from "@/pages/PlanWeekPage";

export const router = createBrowserRouter([
  { path: "/login",          element: <LoginPage /> },
  { path: "/auth/callback",  element: <AuthCallbackPage /> },
  {
    element: <AuthGuard><AppLayout /></AuthGuard>,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "/dashboard",        element: <DashboardPage /> },
      { path: "/workouts",         element: <WorkoutLogPage /> },
      { path: "/workouts/new",     element: <NewWorkoutPage /> },
      { path: "/workouts/:id",     element: <WorkoutDetailPage /> },
      { path: "/exercises",        element: <ExerciseLibraryPage /> },
      { path: "/exercises/:id",    element: <ExerciseDetailPage /> },
      { path: "/progress",         element: <ProgressPage /> },
      { path: "/plan",             element: <PlanPage /> },
      { path: "/plan/:week",       element: <PlanWeekPage /> },
      { path: "/profile",          element: <ProfilePage /> },
    ],
  },
]);
