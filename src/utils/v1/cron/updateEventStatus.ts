import cron from "node-cron";
import Event, { EventStatus } from "../../../models/eventModel";

cron.schedule("* * * * *", async () => {
  console.log("Running cron to update event statuses...");

  const now = new Date();

  // IST offset in milliseconds
  const IST_OFFSET = 5.5 * 60 * 60 * 1000;

  // Convert current UTC time to IST
  const localNow = new Date(now.getTime() + IST_OFFSET);

  const year = localNow.getUTCFullYear();
  const month = localNow.getUTCMonth();
  const day = localNow.getUTCDate();

  // Get today's IST start and end
  const todayStartIST = new Date(Date.UTC(year, month, day) - IST_OFFSET);
  const todayEndIST = new Date(todayStartIST.getTime() + 24 * 60 * 60 * 1000);

  // ✅ 1. Mark today's events as 'ongoing'
  const ongoingResult = await Event.updateMany(
    {
      date: {
        $gte: todayStartIST,
        $lt: todayEndIST,
      },
      status: { $ne: EventStatus.ONGOING },
    },
    { $set: { status: EventStatus.ONGOING } }
  );

  // ✅ 2. Mark past events as 'ended'
  const endedResult = await Event.updateMany(
    {
      date: { $lt: todayStartIST },
      status: { $nin: [EventStatus.ENDED] }, // Optional: only update if not already ended
    },
    { $set: { status: EventStatus.ENDED } }
  );

  console.log(`${ongoingResult.modifiedCount} event(s) updated to 'ongoing'.`);
  console.log(`${endedResult.modifiedCount} event(s) updated to 'ended'.`);
});
