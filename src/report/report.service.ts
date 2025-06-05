import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { parse } from 'json2csv';

@Injectable()
export class ReportService {
  constructor(private readonly prisma: PrismaService) {}

  async exportCsv(): Promise<string> {
    try {
      const raw = await this.prisma.url.findMany({
        include: {
          owner: {
            select: {
              username: true,
              email: true,
            },
          },
        },
      });

      const data = raw.map((item) => ({
        id: item.id,
        url: item.url,
        label: item.label,
        sslExpireDate: item.sslExpireDate?.toISOString() ?? '',
        isSslExpireSoon: item.isSslExpireSoon ?? '',
        status: item.status,
        lastCheckedAt: item.lastCheckedAt?.toISOString() ?? '',
        lastStatusCode: item.lastStatusCode ?? '',
        ownerUsername: item.owner?.username ?? '',
        ownerEmail: item.owner?.email ?? '',
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      }));

      const fields = [
        'id',
        'url',
        'label',
        'sslExpireDate',
        'isSslExpireSoon',
        'status',
        'lastCheckedAt',
        'lastStatusCode',
        'ownerUsername',
        'ownerEmail',
        'createdAt',
        'updatedAt',
      ];

      const csv = parse(data, { fields });
      return csv;
    } catch (error) {
      console.error('❌ Error during exportCsv:', error);
      throw new InternalServerErrorException('Export CSV failed');
    }
  }

  async exportCsvByDate(fromDate?: string, toDate?: string): Promise<string> {
    console.log(fromDate, toDate);
    try {
      const filters: any = {};
  
      if (fromDate || toDate) {
        filters.createdAt = {};
        if (fromDate) filters.createdAt.gte = new Date(fromDate);
        if (toDate) filters.createdAt.lte = new Date(toDate);
      }
  
      const raw = await this.prisma.url.findMany({
        where: filters,
        include: {
          owner: {
            select: {
              username: true,
              email: true,
            },
          },
        },
      });
  
      const data = raw.map((item) => ({
        id: item.id,
        url: item.url,
        label: item.label,
        sslExpireDate: item.sslExpireDate?.toISOString() ?? '',
        isSslExpireSoon: item.isSslExpireSoon ?? '',
        status: item.status,
        lastCheckedAt: item.lastCheckedAt?.toISOString() ?? '',
        lastStatusCode: item.lastStatusCode ?? '',
        ownerUsername: item.owner?.username ?? '',
        ownerEmail: item.owner?.email ?? '',
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      }));
  
      const csv = parse(data, {
        fields: [
          'id',
          'url',
          'label',
          'sslExpireDate',
          'isSslExpireSoon',
          'status',
          'lastCheckedAt',
          'lastStatusCode',
          'ownerUsername',
          'ownerEmail',
          'createdAt',
          'updatedAt',
        ],
      });
  
      return csv;
    } catch (error) {
      console.error('❌ Export CSV failed:', error);
      throw new InternalServerErrorException('Export CSV failed');
    }
  }
  
}
