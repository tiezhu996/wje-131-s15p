import { Navigate } from 'react-router-dom';
import { UserRole } from '../types';

const currentRole: UserRole = UserRole.Admin;

export function RoleGuard({ roles, children }: { roles: UserRole[]; children: JSX.Element }) {
  if (!roles.includes(currentRole)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}
