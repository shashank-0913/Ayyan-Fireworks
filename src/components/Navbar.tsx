import React from 'react';
import { CustomerNavbar } from './customer/CustomerNavbar';
import { SHOW_SLOT_BOOKING_UI } from '../config/features';

export const Navbar: React.FC = () => {
  return <CustomerNavbar />;
};

export default Navbar;
export { CustomerNavbar, SHOW_SLOT_BOOKING_UI };

