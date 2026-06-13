import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';

const mockRepo = () => ({
  createQueryBuilder: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  softDelete: jest.fn(),
  restore: jest.fn(),
});

// Mock DataSource.transaction — langsung jalankan callback dengan manager palsu
const mockManager = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  softDelete: jest.fn(),
  restore: jest.fn(),
};

const mockDataSource = {
  transaction: jest.fn((cb) => cb(mockManager)),
};

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: getRepositoryToken(Product), useFactory: mockRepo },
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('throws ConflictException when SKU already exists', async () => {
      mockManager.findOne.mockResolvedValueOnce({ id: 1, sku: 'EXIST' });
      await expect(service.create({ sku: 'EXIST' } as any)).rejects.toThrow(ConflictException);
    });

    it('creates product when SKU is unique', async () => {
      mockManager.findOne
        .mockResolvedValueOnce(null)                                          // cek duplikat SKU → null
        .mockResolvedValueOnce({ id: 1, sku: 'NEW', category: { name: 'Snacks' }, price: 1000, weight: 100, width: 5, length: 5, height: 5 }); // fetch after save
      mockManager.create.mockReturnValue({ sku: 'NEW' });
      mockManager.save.mockResolvedValue({ id: 1 });

      await service.create({ sku: 'NEW', categoryId: 1, name: 'Test', weight: 100, width: 5, length: 5, height: 5, price: 1000, stock: 10 } as any);
      expect(mockManager.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('throws NotFoundException when product does not exist', async () => {
      mockManager.findOne.mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });

    it('soft deletes product when found', async () => {
      mockManager.findOne.mockResolvedValue({ id: 5, name: 'Produk' });
      mockManager.softDelete.mockResolvedValue({});
      const result = await service.remove(5);
      expect(mockManager.softDelete).toHaveBeenCalledWith(Product, 5);
      expect(result.message).toContain('5');
    });
  });
});
