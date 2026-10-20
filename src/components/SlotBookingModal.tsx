import React from 'react';
import { ReserveSlotModal, ReserveSlotModalProps } from './customer/ReserveSlotModal';

export const SlotBookingModal: React.FC<ReserveSlotModalProps> = (props) => {
  return <ReserveSlotModal {...props} />;
};

export default SlotBookingModal;
export { ReserveSlotModal };
