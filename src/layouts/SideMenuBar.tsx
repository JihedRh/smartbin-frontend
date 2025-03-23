import { SvgColor } from 'src/components/svg-color';

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    title: 'Dashboard',
    path: '/home',
    icon: icon('ic-analytics'),
    roles: ['admin', 'user', 'manager'], 
  },
  {
    title: 'Users',
    path: '/user',
    icon: icon('ic-user'),
    roles: ['admin'], 
  },
  {
    title: 'Personal Profile',
    path: '/user_profile',
    icon: icon('profile_ic'),
    roles: ['admin' , 'user' , 'manager'], 
  },
  {
    title: 'Statistics',
    path: '/stats',
    icon: icon('stats'),
    roles: ['admin'], 
  },
  {
    title: 'OP Bin Reports',
    path: '/OR-bin',
    icon: icon('or_bins'),
    roles: ['admin'], 
  },
  {
    title: 'Hospitals',
    path: '/hospital',
    icon: icon('hospital'),
    roles: ['manager', 'admin'], 
  },
];
