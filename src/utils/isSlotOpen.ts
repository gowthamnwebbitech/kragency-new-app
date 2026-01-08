export const isSlotOpen = (
  slotTime: string,
  closeMinutes: number
): boolean => {
  const now = new Date();

  let slotDate = new Date();

  if (/AM|PM/i.test(slotTime)) {
    const [time, modifier] = slotTime.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier.toUpperCase() === 'PM' && hours < 12) hours += 12;
    if (modifier.toUpperCase() === 'AM' && hours === 12) hours = 0;

    slotDate.setHours(hours, minutes, 0, 0);
  }
  else {
    const [hours, minutes] = slotTime.split(':').map(Number);
    slotDate.setHours(hours, minutes, 0, 0);
  }

  const closeTime = new Date(
    slotDate.getTime() - closeMinutes * 60 * 1000
  );

  return now < closeTime;
};
