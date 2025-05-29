import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import axios from 'axios';
import { CreateUrlDto } from './dto/create-url.dto';
import { getSSLCertificateExpiry } from 'src/auth/utils/getSSLCertificateExpiry';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UpdateUrlDto } from './dto/update-url.dto';

@Injectable()
export class MonitorService {
  constructor(private readonly prisma: PrismaService) {}

  async checkUrl(url: string) {
    try {
      const res = await axios.get(url, { timeout: 5000 });

      const sslDate = await getSSLCertificateExpiry(url);

      if (!sslDate) {
        console.warn('⚠️ ไม่สามารถดึงวันหมดอายุ SSL ได้');
      }

      let findId;
      try {
        findId = await this.prisma.url.findUnique({
          where: {
            url,
          },
        });
      } catch (error) {
        console.error('❌ Error finding URL:', error);
      }

      try {
        const updateUrl = await this.prisma.url.update({
          where: {
            id: Number(findId.id),
          },
          data: {
            sslExpireDate: sslDate,
            status:
              res.status >= 200 && res.status < 400 ? 'active' : 'inactive',
            lastCheckedAt: new Date(),
          },
        });
      } catch (error) {
        console.error('❌ Error updating URL:', error);
      }

      // Convert Date to Readable Format
      const sslDateString = sslDate?.toISOString();

      return {
        url,
        statusCode: res.status,
        status: res.status >= 200 && res.status < 400 ? 'active' : 'inactive',
        sslExpireDate: sslDateString,
        lastCheck: new Date(),
      };
    } catch (error) {
      return {
        statusCode: error.response?.status || error.code,
        status: 'inactive',
        lastCheck: new Date(),
      };
    }
  }

  async testUrl() {
    const url = 'https://meet.wee-ed.org/';
    const checkUrl = await this.checkUrl(url);

    const sslDate = await getSSLCertificateExpiry(url);

    if (!sslDate) {
      console.warn('⚠️ ไม่สามารถดึงวันหมดอายุ SSL ได้');
    }

    // Convert Date to Readable Format
    const sslDateString = sslDate?.toISOString();
    console.log('✅ checkUrl:', checkUrl);
    console.log('✅ SSL Expiry:', sslDateString ?? 'ไม่พบข้อมูล SSL');
  }

  async createUrl(dto: CreateUrlDto, ownerId: number) {
    let sslDate: Date | null | undefined = null;

    console.log('ownerId', ownerId);
    if (dto.sslExpireDate) {
      sslDate = new Date(dto.sslExpireDate);
    } else {
      const resolved = await getSSLCertificateExpiry(dto.url);
      if (!resolved) {
        console.warn('⚠️ ไม่สามารถดึงวันหมดอายุ SSL ได้');
      }
      sslDate = resolved ?? null;
    }

    try {
      const url = await this.prisma.url.create({
        data: {
          url: dto.url,
          label: dto.label,
          sslExpireDate: sslDate ?? undefined,
          ownerId,
        },
      });
      return url;
    } catch (error) {
      // ตรวจสอบ Prisma unique constraint error (เช่น username หรือ email ซ้ำ)
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const field = error.meta?.target?.[0] ?? 'Field';
        throw new BadRequestException(`${field} already exists`);
      }

      console.error('❌ Unexpected error during URL creation:', error);
      throw new InternalServerErrorException('URL creation failed');
    }
  }

  async getAllUrl() {
    const urls = await this.prisma.url.findMany({
      select: {
        id: true,
        url: true,
        label: true,
        sslExpireDate: true,
        status: true,
        lastCheckedAt: true,
        lastStatusCode: true,
        ownerId: true,
      },
    });
    return urls;
  }

  async getUrl(url: string) {
    const result = await this.prisma.url.findUnique({
      where: {
        url,
      },
    });
    return result;
  }

  async updateUrl(dto: UpdateUrlDto, id: number) {
    const url = await this.prisma.url.update({
      where: {
        id: Number(id),
      },
      data: {
        label: dto.label,
        sslExpireDate: dto.sslExpireDate ?? undefined,
        status: dto.status,
      },
    });
    return url;
  }
}
