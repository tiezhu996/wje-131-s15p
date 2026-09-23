import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Material } from '../models/material.entity';
import { MaterialUsage } from '../models/materialUsage.entity';
import { AuditService } from './audit.service';

@Injectable()
export class MaterialService {
  constructor(
    @InjectRepository(Material) private readonly materialRepository: Repository<Material>,
    @InjectRepository(MaterialUsage) private readonly usageRepository: Repository<MaterialUsage>,
    private readonly auditService: AuditService
  ) {}

  async findAll() {
    return this.materialRepository.find({ order: { id: 'ASC' } });
  }

  async usage(projectId?: number, phaseId?: number) {
    return this.usageRepository.find({
      where: {
        ...(projectId ? { projectId } : {}),
        ...(phaseId ? { phaseId } : {})
      },
      relations: ['material', 'receiver'],
      order: { usedAt: 'DESC' }
    });
  }

  async receive(id: number, quantity: number, actorId = 1) {
    const material = await this.materialRepository.findOneBy({ id });
    if (!material) {
      throw new NotFoundException('材料不存在');
    }
    material.stockQuantity = String(Number(material.stockQuantity) + quantity);
    const updated = await this.materialRepository.save(material);
    await this.auditService.record('material.receive', 'Material', id, actorId, { quantity });
    return updated;
  }

  async issue(payload: Partial<MaterialUsage>, actorId = 1) {
    if (!payload.materialId || !payload.quantity) {
      throw new BadRequestException('材料和领用数量必填');
    }
    const material = await this.materialRepository.findOneBy({ id: payload.materialId });
    if (!material) {
      throw new NotFoundException('材料不存在');
    }
    const nextStock = Number(material.stockQuantity) - Number(payload.quantity);
    if (nextStock < 0) {
      throw new BadRequestException('库存不足');
    }
    material.stockQuantity = String(nextStock);
    await this.materialRepository.save(material);
    const usage = await this.usageRepository.save(this.usageRepository.create(payload));
    await this.auditService.record('material.issue', 'MaterialUsage', usage.id, actorId, payload);
    return usage;
  }
}
