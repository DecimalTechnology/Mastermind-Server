export class BaseRepository<T> {
  constructor(protected Model: any) {}


  // Find
  async findById(id: string): Promise<T | null> {
    return this.Model.findById(id);
  }

 async searchBySearchQuery(query: string): Promise<any> {
  return this.Model.find({
    name: { $regex: query, $options: 'i' }
  })
}

  async findByEmail(email: string): Promise<T | null> {
    return this.Model.findOne({ email });
  }

  async findAll(): Promise<T[]> {
    return this.Model.find();
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
  


}
