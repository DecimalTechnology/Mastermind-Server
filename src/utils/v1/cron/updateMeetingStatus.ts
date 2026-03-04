import MeetingModel from "../../../models/MeetingModel";

export const updateMeetingStatuses = async () => {
  console.log("🔄 Updating meeting statuses...");

  const now = new Date();

  // =========================
  // 1️⃣ Mark ENDED Meetings
  // =========================
  const meetings = await MeetingModel.find({
    status: { $in: ["Upcoming", "Next"] },
  });

  let endedCount = 0;

  for (const meeting of meetings) {
    if (!meeting.dates || meeting.dates.length === 0) continue;

    // Check if ALL dates are in the past (including time)
    const allDatesEnded = meeting.dates.every((date: Date) => {
      const meetingDate = new Date(date);
      return meetingDate < now;
    });

    if (allDatesEnded) {
      meeting.status = "Ended";
      await meeting.save();
      endedCount++;
    }
  }

  // =========================
  // 2️⃣ Reset Old "Next" - ONLY if their next date has passed
  // =========================
  const nextMeetings = await MeetingModel.find({ status: "Next" });
  
  for (const meeting of nextMeetings) {
    if (!meeting.dates || meeting.dates.length === 0) {
      // If no dates, reset to Upcoming
      meeting.status = "Upcoming";
      await meeting.save();
      continue;
    }

    // Find the next future date for this meeting
    const futureDates = meeting.dates
      .map((date: Date) => new Date(date))
      .filter(date => date > now);

    if (futureDates.length === 0) {
      // No future dates left, mark as Ended
      meeting.status = "Ended";
      await meeting.save();
      endedCount++;
    } else {
      // Still has future dates, but we'll recalculate the next meeting
      meeting.status = "Upcoming";
      await meeting.save();
    }
  }

  // =========================
  // 3️⃣ Find Nearest Upcoming (considering time)
  // =========================
  const upcomingMeetings = await MeetingModel.find({
    status: "Upcoming",
  });

  let nextMeetingId: any = null;
  let nearestTime = Infinity;

  for (const meeting of upcomingMeetings) {
    if (!meeting.dates || meeting.dates.length === 0) continue;

    // Get all future dates (including time)
    const futureDates = meeting.dates
      .map((date: Date) => new Date(date))
      .filter(date => date > now);

    if (futureDates.length === 0) continue;

    // Find the nearest future date for this meeting
    const nearestDate = new Date(
      Math.min(...futureDates.map(date => date.getTime()))
    );

    // Compare timestamps to find the globally nearest meeting
    if (nearestDate.getTime() < nearestTime) {
      nearestTime = nearestDate.getTime();
      nextMeetingId = meeting._id;
    }
  }

  // =========================
  // 4️⃣ Set New "Next"
  // =========================
  let nextUpdated = false;
  if (nextMeetingId) {
    await MeetingModel.updateOne(
      { _id: nextMeetingId },
      { $set: { status: "Next" } }
    );
    nextUpdated = true;
    
    // Log the next meeting time for debugging
    const nextMeeting = await MeetingModel.findById(nextMeetingId);
    if (nextMeeting) {
      const futureDates = nextMeeting.dates
        .map((date: Date) => new Date(date))
        .filter(date => date > now);
      const nextDateTime = new Date(Math.min(...futureDates.map(d => d.getTime())));
      console.log(`⭐ Next meeting scheduled for: ${nextDateTime.toLocaleString()}`);
    }
  }

  console.log(`⏹️ ${endedCount} meetings marked as Ended`);
  console.log(`⭐ Next meeting updated: ${nextUpdated}`);

  return {
    ended: endedCount,
    nextUpdated: nextUpdated,
  };
};