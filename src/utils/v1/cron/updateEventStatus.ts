import cron from "node-cron";
import Event, { EventStatus } from "../../../models/eventModel";

cron.schedule("* * * * *", async () => {
  console.log("Running cron to update 'ongoing' events...");

  const now = new Date();

  // IST offset in milliseconds
  const IST_OFFSET = 5.5 * 60 * 60 * 1000;

  // Convert current UTC time to IST
  const localNow = new Date(now.getTime() + IST_OFFSET);

  // Get the IST date boundaries: 00:00 to 23:59:59.999
  const year = localNow.getUTCFullYear();
  const month = localNow.getUTCMonth();
  const day = localNow.getUTCDate();

  const todayStartIST = new Date(Date.UTC(year, month, day) - IST_OFFSET);
  const todayEndIST = new Date(todayStartIST.getTime() + 24 * 60 * 60 * 1000);

  // Update events with 'date' between todayStart and todayEnd
  // Set their status to 'ongoing' only if it's not already
  const result = await Event.updateMany(
    {
      date: {
        $gte: todayStartIST,
        $lt: todayEndIST,
      },
      status: { $ne: EventStatus.ONGOING },
    },
    { $set: { status: EventStatus.ONGOING } }
  );

  console.log(`${result.modifiedCount} event(s) updated to 'ongoing'.`);
});
