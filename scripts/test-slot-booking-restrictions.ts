import { getSlotStartDateTime, isSlotExpired, getSlotStatus } from '../src/lib/utils';
import { processBookingSubmission } from '../api/book-slot';
import { Slot } from '../src/types';

async function runTests() {
  console.log('=== RUNNING SLOT BOOKING RESTRICTION & VALIDATION TESTS ===\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}${detail ? ` - ${detail}` : ''}`);
      failed++;
    }
  }

  // TEST 1: Datetime parsing
  const testDate = '2026-10-15';
  const testTime = '09:00';
  const dt = getSlotStartDateTime(testDate, testTime);
  assert(dt !== null && dt.getFullYear() === 2026 && dt.getMonth() === 9 && dt.getDate() === 15 && dt.getHours() === 9 && dt.getMinutes() === 0,
    'getSlotStartDateTime correctly calculates local Date object');

  // TEST 2: Slot expiration rule
  // If slotDateTime <= referenceTime -> expired
  const now = new Date('2026-10-15T11:00:00');
  const pastSlotExpired = isSlotExpired('2026-10-15', '10:00', now);
  const exactCurrentSlotExpired = isSlotExpired('2026-10-15', '11:00', now);
  const futureSlotExpired = isSlotExpired('2026-10-15', '12:00', now);

  assert(pastSlotExpired === true, 'Slot starting before reference time is marked expired');
  assert(exactCurrentSlotExpired === true, 'Slot starting at exact reference time is marked expired (<= new Date())');
  assert(futureSlotExpired === false, 'Slot starting in future is NOT expired');

  // TEST 3: Availability Rule
  // Future slot but booked -> marked as "fully_booked", status indicates booked
  const mockFutureBookedSlot: Slot = {
    id: 'slot-1',
    slot_date: '2026-10-15',
    start_time: '14:00',
    end_time: '15:00',
    total_capacity: 120,
    booked_capacity: 120,
    is_blocked: false,
    created_at: '2026-10-15T00:00:00Z'
  };

  const statusBooked = getSlotStatus(mockFutureBookedSlot, now);
  assert(statusBooked === 'fully_booked', 'Future slot with 120/120 booked capacity returns fully_booked status');

  const mockPastSlot: Slot = {
    id: 'slot-2',
    slot_date: '2026-10-15',
    start_time: '09:00',
    end_time: '10:00',
    total_capacity: 120,
    booked_capacity: 10,
    is_blocked: false,
    created_at: '2026-10-15T00:00:00Z'
  };
  const statusExpired = getSlotStatus(mockPastSlot, now);
  assert(statusExpired === 'expired', 'Past slot with available capacity returns expired status');

  const mockFutureAvailableSlot: Slot = {
    id: 'slot-3',
    slot_date: '2026-10-15',
    start_time: '15:00',
    end_time: '16:00',
    total_capacity: 120,
    booked_capacity: 20,
    is_blocked: false,
    created_at: '2026-10-15T00:00:00Z'
  };
  const statusAvailable = getSlotStatus(mockFutureAvailableSlot, now);
  assert(statusAvailable === 'available', 'Future slot with remaining capacity returns available status');

  // TEST 4: Backend API Validation:
  // Reject past slot submission with status 400: "This time slot has passed and cannot be booked."
  const pastSubmissionResult = await processBookingSubmission({
    slot_id: 'slot-past',
    slot_date: '2020-01-01',
    start_time: '09:00',
    slot_time: '09:00 AM – 10:00 AM',
    customer_name: 'Test Customer',
    phone: '9876543210'
  });

  assert(pastSubmissionResult.statusCode === 400, 'Backend API rejects past slot with status 400');
  assert(
    pastSubmissionResult.body.error === 'This time slot has passed and cannot be booked.',
    'Backend API returns exact error message: "This time slot has passed and cannot be booked."',
    `Got: "${pastSubmissionResult.body.error}"`
  );

  // TEST 5: Backend API Validation for explicit past requestedDateTime
  const explicitPastResult = await processBookingSubmission({
    slot_id: 'slot-past-2',
    slot_date: '2099-01-01',
    start_time: '10:00',
    requestedDateTime: Date.now() - 60000, // 1 minute in the past
    customer_name: 'Test Customer',
    phone: '9876543210'
  });
  assert(explicitPastResult.statusCode === 400, 'Backend API rejects past requestedDateTime timestamp with status 400');
  assert(
    explicitPastResult.body.error === 'This time slot has passed and cannot be booked.',
    'Backend API returns exact error message for past timestamp'
  );

  // TEST 6: Backend API Validation for future slot
  const futureDate = new Date(Date.now() + 86400000 * 2); // 2 days in future
  const y = futureDate.getFullYear();
  const m = String(futureDate.getMonth() + 1).padStart(2, '0');
  const d = String(futureDate.getDate()).padStart(2, '0');
  const futureDateStr = `${y}-${m}-${d}`;

  const futureSubmissionResult = await processBookingSubmission({
    slot_id: 'slot-future-valid',
    slot_date: futureDateStr,
    start_time: '11:00',
    slot_time: '11:00 AM – 12:00 PM',
    customer_name: 'Ravi Teja',
    phone: '9876543210'
  });

  assert(
    futureSubmissionResult.statusCode === 200,
    'Backend API accepts future slot booking with status 200',
    `Status: ${futureSubmissionResult.statusCode}, Error: ${futureSubmissionResult.body.error}`
  );
  assert(
    futureSubmissionResult.body.success === true && Boolean(futureSubmissionResult.body.booking?.booking_code),
    'Backend API returns confirmed booking object with booking code'
  );

  console.log(`\n=== RESULTS: ${passed} PASSED, ${failed} FAILED ===\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
