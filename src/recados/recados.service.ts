import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Recado } from './entities/recado.entity';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PessoasService } from 'src/pessoas/pessoas.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { RecadosUtils } from './recados.utils';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';

@Injectable()
export class RecadosService {
  constructor(
    @InjectRepository(Recado)
    private readonly recadoRepository: Repository<Recado>,
    private readonly pessoasService: PessoasService,
    private readonly recadosUtils: RecadosUtils,
  ) {}

  async findAll(paginationDto?: PaginationDto) {
    let limit: number | undefined;
    let offset: number | undefined;

    if (paginationDto) {
      limit = paginationDto?.limit;
      offset = paginationDto?.offset;
    }

    const recados = await this.recadoRepository.find({
      take: limit,
      skip: offset,
      relations: ['de', 'para'],
      order: { id: 'DESC' },
      select: {
        de: {
          id: true,
          nome: true,
        },
        para: {
          id: true,
          nome: true,
        },
      },
    });
    return recados;
  }

  throwNotFoundError() {
    throw new NotFoundException('Recado não encontrado');
  }

  async findOne(id: number) {
    const recado = await this.recadoRepository.findOne({
      where: {
        id: id,
      },
      relations: ['de', 'para'],
      select: {
        de: {
          id: true,
          nome: true,
        },
        para: {
          id: true,
          nome: true,
        },
      },
    });
    if (!recado) {
      this.throwNotFoundError();
    }

    if (recado) return recado;
  }

  async create(
    createRecadoDto: CreateRecadoDto,
    tokenPayload: TokenPayloadDto,
  ) {
    const { paraId } = createRecadoDto;

    const para = await this.pessoasService.findOne(paraId);

    const de = await this.pessoasService.findOne(tokenPayload.sub);

    const newRecado = {
      texto: createRecadoDto.texto,
      de: de,
      para: para,
      lido: false,
      data: new Date(),
    };

    const recado = await this.recadoRepository.create(newRecado);
    await this.recadoRepository.save(recado);
    return {
      ...recado,
      de: { id: recado.de.id, nome: recado.de.nome },
      para: { id: recado.para.id, nome: recado.para.nome },
    };
  }

  async update(
    id: number,
    updateRecadoDto: UpdateRecadoDto,
    tokenPayload: TokenPayloadDto,
  ) {
    const recado = await this.findOne(id);

    if (recado?.de.id !== tokenPayload.sub) {
      throw new ForbiddenException('Esse recado não é seu!');
    }

    if (!recado) {
      this.throwNotFoundError();
    } else {
      recado.texto = updateRecadoDto?.texto ?? recado?.texto;
      recado.lido = updateRecadoDto?.lido ?? recado?.lido;
      await this.recadoRepository.save(recado);
      return recado;
    }
  }

  async remove(id: number, tokenPayload: TokenPayloadDto) {
    const recado = await this.findOne(id);

    if (!recado) {
      this.throwNotFoundError();
      return;
    }

    if (recado?.de.id !== tokenPayload.sub) {
      throw new ForbiddenException('Esse recado não é seu!');
    }

    return this.recadoRepository.remove(recado);
  }
}
