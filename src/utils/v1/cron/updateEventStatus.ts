import cron from "node-cron";
import Event, { EventStatus } from "../../../models/eventModel";


cron.schedule("5 0 * * *", async () => {
  const now = new Date();
  const todayStart = new Date(now.toISOString().split("T")[0]); // Today at 00:00:00

  try {
    const result = await Event.updateMany(
      {
        status: { $in: [EventStatus.UPCOMING, EventStatus.ONGOING] },
        date: { $lt: todayStart },
      },
      { $set: { status: EventStatus.ENDED } }
    );

    if (result.modifiedCount > 0) {
      console.log(`[CRON] [${new Date().toISOString()}] Marked ${result.modifiedCount} events as ENDED.`);
    }
  } catch (error) {
    console.error("[CRON] Error while updating event statuses:", error);
  }
});
