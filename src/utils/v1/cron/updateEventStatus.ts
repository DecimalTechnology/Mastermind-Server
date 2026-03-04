import Event, { EventStatus } from "../../../models/eventModel";


export const updateEventStatuses = async () => {
  console.log("🔄 Updating event statuses...");

  const now = new Date();

  // IST Calculation
  const IST_OFFSET = 5.5 * 60 * 60 * 1000;
  const localNow = new Date(now.getTime() + IST_OFFSET);

  const year = localNow.getUTCFullYear();
  const month = localNow.getUTCMonth();
  const day = localNow.getUTCDate();

  const todayStartIST = new Date(Date.UTC(year, month, day) - IST_OFFSET);
  const todayEndIST = new Date(todayStartIST.getTime() + 24 * 60 * 60 * 1000);

  // 1️⃣ Mark TODAY
  const todayResult = await Event.updateMany(
    {
      startDate: { $gte: todayStartIST, $lt: todayEndIST },
      status: { $nin: [EventStatus.CANCELLED, EventStatus.ENDED] },
    },
    { $set: { status: EventStatus.TODAY } }
  );

  // 2️⃣ Mark ONGOING
  const ongoingResult = await Event.updateMany(
    {
      status: EventStatus.TODAY,
      startDate: { $lte: now },
      endDate: { $gte: now },
    },
    { $set: { status: EventStatus.ONGOING } }
  );

  // 3️⃣ Mark ENDED
  const endedResult = await Event.updateMany(
    {
      endDate: { $lt: now },
      status: { $nin: [EventStatus.ENDED, EventStatus.CANCELLED] },
    },
    { $set: { status: EventStatus.ENDED } }
  );

  console.log(`📅 ${todayResult.modifiedCount} → TODAY`);
  console.log(`▶️ ${ongoingResult.modifiedCount} → ONGOING`);
  console.log(`⏹️ ${endedResult.modifiedCount} → ENDED`);

  return {
    today: todayResult.modifiedCount,
    ongoing: ongoingResult.modifiedCount,
    ended: endedResult.modifiedCount,
  };
};