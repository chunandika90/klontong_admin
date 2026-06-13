import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';

const ALLOWED_SORT = ['name', 'price', 'stock', 'created_at', 'createdAt'];

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private repo: Repository<Product>,
    private dataSource: DataSource,
  ) {}

  async findAll(query: QueryProductDto) {
    const { page = 1, limit = 10, search, categoryId, isActive, sortBy = 'createdAt', sortOrder = 'DESC' } = query;

    const qb = this.repo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.deletedAt IS NULL');

    if (search) {
      qb.andWhere('(LOWER(product.name) LIKE :search OR LOWER(product.sku) LIKE :search)', {
        search: `%${search.toLowerCase()}%`,
      });
    }
    if (categoryId) {
      qb.andWhere('product.categoryId = :categoryId', { categoryId });
    }
    if (isActive !== undefined) {
      qb.andWhere('product.isActive = :isActive', { isActive });
    }

    const col = ALLOWED_SORT.includes(sortBy) ? `product.${sortBy}` : 'product.createdAt';
    qb.orderBy(col, sortOrder === 'ASC' ? 'ASC' : 'DESC');

    const total = await qb.getCount();
    const data = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      data: data.map(this.formatProduct),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getStats() {
    const total = await this.repo.count();
    const active = await this.repo.count({ where: { isActive: true } });
    const archived = await this.repo
      .createQueryBuilder('product')
      .withDeleted()
      .where('product.deletedAt IS NOT NULL')
      .getCount();
    const lowStock = await this.repo
      .createQueryBuilder('product')
      .where('product.deletedAt IS NULL')
      .andWhere('product.stock < 10')
      .getCount();

    const perCategory = await this.repo
      .createQueryBuilder('product')
      .leftJoin('product.category', 'category')
      .select('category.name', 'categoryName')
      .addSelect('COUNT(product.id)', 'count')
      .where('product.deletedAt IS NULL')
      .groupBy('category.name')
      .orderBy('count', 'DESC')
      .getRawMany();

    return {
      total,
      active,
      archived,
      lowStock,
      perCategory: perCategory.map(r => ({
        categoryName: r.categoryName ?? 'Tanpa Kategori',
        count: Number(r.count),
      })),
    };
  }

  async findOne(id: number) {
    const product = await this.repo.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!product) throw new NotFoundException(`Product #${id} not found`);
    return this.formatProduct(product);
  }

  async create(dto: CreateProductDto) {
    // Pakai transaction: kalau ada yang gagal di tengah, semua rollback otomatis
    return this.dataSource.transaction(async (manager) => {
      // Cek duplikat SKU di dalam transaction (lock-safe)
      const existing = await manager.findOne(Product, {
        where: { sku: dto.sku },
        lock: { mode: 'pessimistic_write' }, // lock row, cegah race condition
      });
      if (existing) throw new ConflictException(`SKU "${dto.sku}" is already in use`);

      const product = manager.create(Product, dto);
      const saved = await manager.save(product);

      // Fetch ulang dengan relasi category
      return manager.findOne(Product, {
        where: { id: saved.id },
        relations: ['category'],
      }).then(this.formatProduct);
    });
  }

  async update(id: number, dto: UpdateProductDto) {
    return this.dataSource.transaction(async (manager) => {
      // Lock row yang mau diupdate
      const product = await manager.findOne(Product, {
        where: { id },
        lock: { mode: 'pessimistic_write' },
      });
      if (!product) throw new NotFoundException(`Product #${id} not found`);

      // Kalau SKU diganti, cek duplikat SKU baru
      if (dto.sku && dto.sku !== product.sku) {
        const conflict = await manager.findOne(Product, { where: { sku: dto.sku } });
        if (conflict) throw new ConflictException(`SKU "${dto.sku}" is already in use`);
      }

      Object.assign(product, dto);
      await manager.save(product);

      return manager.findOne(Product, {
        where: { id },
        relations: ['category'],
      }).then(this.formatProduct);
    });
  }

  async remove(id: number) {
    return this.dataSource.transaction(async (manager) => {
      const product = await manager.findOne(Product, { where: { id } });
      if (!product) throw new NotFoundException(`Product #${id} not found`);

      await manager.softDelete(Product, id);
      return { message: `Product #${id} archived successfully` };
    });
  }

  async restore(id: number) {
    return this.dataSource.transaction(async (manager) => {
      const product = await manager.findOne(Product, {
        where: { id },
        withDeleted: true,
      });
      if (!product) throw new NotFoundException(`Product #${id} not found`);

      await manager.restore(Product, id);

      return manager.findOne(Product, {
        where: { id },
        relations: ['category'],
      }).then(this.formatProduct);
    });
  }

  private formatProduct(p: Product) {
    return {
      id: p.id,
      categoryId: p.categoryId,
      categoryName: p.category?.name ?? null,
      sku: p.sku,
      name: p.name,
      description: p.description,
      weight: Number(p.weight),
      width: Number(p.width),
      length: Number(p.length),
      height: Number(p.height),
      image: p.image,
      price: Number(p.price),
      isActive: p.isActive,
      stock: p.stock,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    };
  }
}
