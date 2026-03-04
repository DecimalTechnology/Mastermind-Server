import cron from "node-cron";
import { updateEventStatuses } from "./updateEventStatus";
import { updateMeetingStatuses } from "./updateMeetingStatus";


cron.schedule("* * * * *", async () => {
  console.log("🕒 Cron triggered...");

  try {
    await updateEventStatuses();
    await updateMeetingStatuses()
  } catch (error) {
    console.error("❌ Error updating event statuses:", error);
  }
});