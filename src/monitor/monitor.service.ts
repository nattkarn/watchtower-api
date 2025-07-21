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
    let findId;
    let sslDate: Date | null = null;
    let statusCode: number | string | null = null;
    let status: 'active' | 'inactive' = 'inactive';
    let isSslExpireSoon = false;
  
    try {
      // 1️⃣ หา URL ใน DB
      findId = await this.prisma.url.findUnique({
        where: { url },
      });
  
      if (!findId || !findId.id) {
        throw new Error(`URL not found in database: ${url}`);
      }
  
      // 2️⃣ ลองยิง HTTP GET
      const res = await axios.get(url, { timeout: 5000 });
      statusCode = res.status;
      status = res.status >= 200 && res.status < 400 ? 'active' : 'inactive';
  
      // 3️⃣ ลองดึง SSL date
      sslDate = await getSSLCertificateExpiry(url);
  
      if (sslDate) {
        isSslExpireSoon =
          new Date(sslDate).getTime() - Date.now() <= 7 * 24 * 60 * 60 * 1000;
      } else {
        // console.warn(`⚠️ Cannot get SSL expiry for URL: ${url}`);
      }
    } catch (error) {
      // console.error(`❌ Error checking URL ${url}:`, error);
  
      // ถ้า error จาก HTTP หรือ SSL → force inactive
      status = 'inactive';
      statusCode = error.response?.status || error.code || 'unknown_error';
      sslDate = null;
      isSslExpireSoon = false;
    }
  
    // 4️⃣ พยายาม update DB เสมอถ้ามี findId
    if (findId?.id) {
      try {
        await this.prisma.url.update({
          where: { id: Number(findId.id) },
          data: {
            sslExpireDate: sslDate,
            isSslExpireSoon: isSslExpireSoon,
            status: status,
            lastStatusCode: typeof statusCode === 'number' ? statusCode : null,
            lastCheckedAt: new Date(),
          },
        });
      } catch (updateError) {
        console.error(`❌ Error updating DB for URL ${url}:`);
      }
    }
  
    // 5️⃣ return object ที่ field ครบเสมอ
    return {
      url,
      statusCode,
      status,
      previousStatus: findId?.status || 'unknown',  // ⭐ ใส่ previousStatus
      sslExpireDate: sslDate ? sslDate.toISOString() : null,
      isSslExpireSoon,
      lastCheck: new Date(),
    };
  }
  

  async testUrl() {
    const url = 'https://httpstat.us/400';
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

  async createUrl(dto: CreateUrlDto, ownerId: string) {
    // console.log('dto',dto)
    // console.log('ownerId',ownerId)

    let sslDate: Date | null | undefined = null;
    
    try {
      // Step 1: Create URL in DB
      const created = await this.prisma.url.create({
        data: {
          url: dto.url,
          label: dto.label,
          sslExpireDate: undefined, // let checkUrl handle this
          ownerId,
        },
      });
  
      // Step 2: Immediately check URL status + SSL
      const checkResult = await this.checkUrl(dto.url); // ⚠️ This updates DB internally
  
      // Step 3: Return combined result
      return {
        ...created,
        status: checkResult.status,
        statusCode: checkResult.statusCode,
        sslExpireDate: checkResult.sslExpireDate,
        isSslExpireSoon: checkResult.isSslExpireSoon,
        lastCheckedAt: checkResult.lastCheck,
      };
    } catch (error) {
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

  async getHomepageUrl() {
    
    const urls = await this.prisma.url.findMany({
      select: {
        status: true,
        url: true,
        sslExpireDate: true,
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

    const sslDate = dto.sslExpireDate ? new Date(dto.sslExpireDate).toISOString() : undefined;
    const url = await this.prisma.url.update({
      where: {
        id: Number(id),
      },
      data: {
        url: dto.url,
        label: dto.label,
        sslExpireDate: sslDate,
        status: dto.status,
      },
    });
    return url;
  }
}
