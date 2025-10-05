// import cron from "node-cron";
// import Event, { EventStatus } from "../../../models/eventModel";

// cron.schedule("* * * * *", async () => {
//   console.log("Running cron to update event statuses...");

//   const now = new Date();

//   // IST offset in milliseconds
//   const IST_OFFSET = 5.5 * 60 * 60 * 1000;

//   // Convert current UTC time to IST
//   const localNow = new Date(now.getTime() + IST_OFFSET);

//   const year = localNow.getUTCFullYear();
//   const month = localNow.getUTCMonth();
//   const day = localNow.getUTCDate();

//   // Get today's IST start and end
//   const todayStartIST = new Date(Date.UTC(year, month, day) - IST_OFFSET);
//   const todayEndIST = new Date(todayStartIST.getTime() + 24 * 60 * 60 * 1000);

//   // ✅ 1. Mark today's events as 'ongoing'
//   const ongoingResult = await Event.updateMany(
//     {
//       date: {
//         $gte: todayStartIST,
//         $lt: todayEndIST,
//       },
//       status: { $ne: EventStatus.TODAY },
//     },
//     { $set: { status: EventStatus.TODAY } }
//   );

//   // ✅ 2. Mark past events as 'ended'
//   const endedResult = await Event.updateMany(
//     {
//       date: { $lt: todayStartIST },
//       status: { $nin: [EventStatus.ENDED] }, // Optional: only update if not already ended
//     },
//     { $set: { status: EventStatus.ENDED } }
//   );

//   console.log(`${ongoingResult.modifiedCount} event(s) updated to today'.`);
//   console.log(`${endedResult.modifiedCount} event(s) updated to 'ended'.`);
// });


import cron from "node-cron";
import Event, { EventStatus } from "../../../models/eventModel";

cron.schedule("* * * * *", async () => {
  console.log("🔄 Running cron to update event statuses...");

  const now = new Date();

  // ✅ Calculate IST current date/time
  const IST_OFFSET = 5.5 * 60 * 60 * 1000;
  const localNow = new Date(now.getTime() + IST_OFFSET);

  const year = localNow.getUTCFullYear();
  const month = localNow.getUTCMonth();
  const day = localNow.getUTCDate();

  // Today's start and end in IST
  const todayStartIST = new Date(Date.UTC(year, month, day) - IST_OFFSET);
  const todayEndIST = new Date(todayStartIST.getTime() + 24 * 60 * 60 * 1000);

  // ✅ 1. Mark events that fall today as TODAY
  const todayResult = await Event.updateMany(
    {
      startDate: { $gte: todayStartIST, $lt: todayEndIST },
      status: { $nin: [EventStatus.CANCELLED, EventStatus.ENDED] },
    },
    { $set: { status: EventStatus.TODAY } }
  );

  // ✅ 2. Mark TODAY events as ONGOING if time is within range
  const ongoingResult = await Event.updateMany(
    {
      status: EventStatus.TODAY,
      startDate: { $lte: now },
      endDate: { $gte: now },
    },
    { $set: { status: EventStatus.ONGOING } }
  );

  // ✅ 3. Mark events as ENDED if their endDate is in the past
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
});
