import { Model, Document } from 'mongoose';
import { IRepository } from '../domain/IRepository';

export abstract class BaseRepository<T, D extends Document> implements IRepository<T> {
  protected model: Model<D>;

  constructor(model: Model<D>) {
    this.model = model;
  }

  async create(item: Partial<T>): Promise<T> {
    const createdItem = await this.model.create(item as any);
    return createdItem.toObject() as unknown as T;
  }

  async update(id: string, item: Partial<T>): Promise<T | null> {
    const updatedItem = await this.model.findByIdAndUpdate(id, item as any, { new: true }).exec();
    return updatedItem ? (updatedItem.toObject() as unknown as T) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async findById(id: string): Promise<T | null> {
    const item = await this.model.findById(id).exec();
    return item ? (item.toObject() as unknown as T) : null;
  }

  async findAll(): Promise<T[]> {
    const items = await this.model.find().exec();
    return items.map((item) => item.toObject() as unknown as T);
  }
}
