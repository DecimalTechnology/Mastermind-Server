export class BaseRepository<T> {
    constructor(protected Model: any) {}

    // Find
    async findById(id: string): Promise<T | null> {
        return this.Model.findById(id);
    }

    async searchBySearchQuery(query: string): Promise<any> {
        return this.Model.find({
            name: { $regex: query, $options: "i" },
        });
    }

    async findByEmail(email: string): Promise<T | null> {
        return this.Model.findOne({ email });
    }

    async findAll(): Promise<T[]> {
        return this.Model.find();
    }
    async findByName(name: string): Promise<T[]> {
        return this.Model.findOne({ name: name });
    }

    // Delete
    async deleteById(id: string): Promise<T | null> {
        return this.Model.findByIdAndDelete(id);
    }

    async deleteAll(): Promise<{ deletedCount?: number }> {
        return this.Model.deleteMany({});
    }

    async findByIdAndUpdate(id: string, data: any): Promise<any | null> {
        return this.Model.findByIdAndUpdate(id, data, { new: true });
    }

    // Add
    async create(data: Partial<T>): Promise<T> {
        const newData = new this.Model(data);
        await newData.save();
        return newData;
    }

    async countDocuments(): Promise<any> {
        return await this.Model.countDocuments();
    }

    async find(query: any): Promise<any> {
        return await this.Model.find(query);
    }

    async aggregate(pipeline: any): Promise<any> {
        return await this.Model.aggregate(pipeline);
    }

    async findByFilter(filter: any, limit: any, skip: any) {
        return await this.Model.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
    }
}
