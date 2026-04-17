import { roles } from '@/config/roles';
import Chip from '../ui/Chip';

export default function RoleChips({ className }: { className?: string }) {
  return (
    <div className={`flex flex-wrap gap-3 ${className || ''}`}>
      {roles.map(role => (
        <Chip key={role.id} role={role} />
      ))}
    </div>
  );
}
