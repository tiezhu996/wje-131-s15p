import { Navigate, createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../App';
import { Dashboard } from '../pages/Dashboard';
import { MaterialManage } from '../pages/MaterialManage';
import { ProjectGantt } from '../pages/ProjectGantt';
import { TaskBoard } from '../pages/TaskBoard';
import { TimesheetReport } from '../pages/TimesheetReport';
import { UserRole } from '../types';
import { RoleGuard } from './guards';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'projects/:id/gantt', element: <ProjectGantt /> },
      { path: 'projects/:id/board', element: <TaskBoard /> },
      {
        path: 'materials',
        element: (
          <RoleGuard roles={[UserRole.Admin, UserRole.ProjectManager, UserRole.Foreman]}>
            <MaterialManage />
          </RoleGuard>
        )
      },
      { path: 'reports/timesheet', element: <TimesheetReport /> }
    ]
  }
]);
