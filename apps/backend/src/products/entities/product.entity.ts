import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, Index,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  categoryId: number;

  @ManyToOne(() => Category, { eager: false })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Index({ unique: true })
  @Column({ length: 20 })
  sku: string;

  @Column({ length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  weight: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  width: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  length: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  height: number;

  @Column({ nullable: true })
  image: string;

  @Column({ type: 'bigint', default: 0 })
  price: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
