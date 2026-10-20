import React from 'react';
import { ReserveSlotModal, ReserveSlotModalProps, UserPassItem } from './customer/ReserveSlotModal';

export const SlotBookingModal: React.FC<ReserveSlotModalProps> = (props) => {
  return <ReserveSlotModal {...props} />;
};

export default SlotBookingModal;
export { ReserveSlotModal };
export type { ReserveSlotModalProps, UserPassItem };
