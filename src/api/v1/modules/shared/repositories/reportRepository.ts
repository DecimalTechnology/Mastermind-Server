import { IReport } from "../../../../../interfaces/models/IReport";
import { Chapter } from "../../../../../models/chapterModal";
import Report from "../../../../../models/reportSchema";

export class ReportRepository {
    constructor() {}

    async createReport(reportData: any): Promise<any> {
        const newReport = new Report(reportData);

        await newReport.save();
        return newReport;
    }
    async findAllReportsForLocalAdmin(adminId: any, query: any): Promise<any> {
        const { search, filter } = query;
        const chapterIds = await Chapter.find({ createdBy: adminId }).distinct("_id");

        const match: any = { chapterId: { $in: chapterIds } };
        if (filter) {
            match.status = filter;
        }

        const reports = await Report.find(match).populate("eventId").populate("reportedBy").populate("reviewedBy").populate("chapterId");
        return reports;
    }
}
