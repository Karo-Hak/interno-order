import { Injectable } from '@nestjs/common';
import { CreateStretchCeilingOrderDto } from './dto/create-stretch-ceiling-order.dto';
import { UpdateStretchCeilingOrderDto } from './dto/update-stretch-ceiling-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StretchCeilingOrder } from './schema/stretch-ceiling-order.schema';
import { StretchBuyer } from 'src/stretch-buyer/schema/stretch-buyer.schema';
import { User } from 'src/user/schema/user.schema';
import { StretchTexture } from 'src/stretch-texture/schema/stretch-texture.schema';
import { Bardutyun } from 'src/bardutyun/schema/bardutyun.schema';
import { Additional } from 'src/additional/schema/additional.schema';
import { Profil } from 'src/profil/schema/profil.schema';
import { ProfilService } from 'src/profil/profil.service';
import { LightRingService } from 'src/light-ring/light-ring.service';

@Injectable()
export class StretchCeilingOrderService {
  constructor(
    @InjectModel(StretchCeilingOrder.name) private stretchCeilingOrderModel: Model<StretchCeilingOrder>,
    @InjectModel(StretchBuyer.name) private stretchBuyerModel: Model<StretchBuyer>,
    @InjectModel(StretchTexture.name) private stretchTextureModel: Model<StretchTexture>,
    @InjectModel(Additional.name) private additionalModel: Model<Additional>,
    @InjectModel(Profil.name) private profilModel: Model<Profil>,
    @InjectModel('User') private userModel: Model<User>,

    private readonly profilService: ProfilService,
    private readonly lightRingService: LightRingService
  ) { }

  async create(createStretchCeilingOrderDto: any) {
    const orderBuyer = await this.stretchBuyerModel.findById(createStretchCeilingOrderDto.orderBuyer);
    const orderUser = await this.userModel.findById(createStretchCeilingOrderDto.user.userId);
    const createdOrder = await new this.stretchCeilingOrderModel({ ...createStretchCeilingOrderDto.stretchTextureOrder, user: orderUser.id, buyer: orderBuyer.id });
    await this.userModel.findByIdAndUpdate(createStretchCeilingOrderDto.user.userId, { order: [...orderUser.order, createdOrder.id] })
    await this.stretchBuyerModel.findByIdAndUpdate(createStretchCeilingOrderDto.orderBuyer, { order: [...orderBuyer.order, createdOrder.id] })
    return createdOrder.save();
  }

  async findNewOrders() {
    return await this.stretchCeilingOrderModel.find({ status: "progress" }).populate("buyer").sort({ date: -1 })
  }

  async findAll() {
    return await this.stretchCeilingOrderModel.find()
  }

  async findOne(id: string) {
    const data = await this.stretchCeilingOrderModel.findById(id).populate("buyer");
    const dataTexture = await this.stretchTextureModel.find();
    const additional = await this.additionalModel.find();
    const stretchProfil = await this.profilService.findAll();
    const dataLightRing = await this.lightRingService.findAll()
    console.log(dataLightRing);
    
    const textureMap = new Map(dataTexture.map(texture => [texture._id.toString(), texture.name]));
    const enhanceCeilingsWithNamesTexture = (groupedCeilings) => {
      const updatedCeilings = {};
      for (const key in groupedCeilings) {
        if (groupedCeilings.hasOwnProperty(key)) {
          const ceiling = groupedCeilings[key];
          const textureId = ceiling.stretchTexture.toString();
          const textureName = textureMap.get(textureId);
          if (textureName) {
            ceiling.textureName = textureName;
            updatedCeilings[key] = ceiling;
          }
        }
      }
      return updatedCeilings;
    };

    const additionalMap = new Map(additional.map(additional => [additional._id.toString(), additional.name]));
    const enhanceCeilingsWithNamesAdditional = (groupedAdditionals) => {
      const updatedAdditional = {};
      for (const key in groupedAdditionals) {
        if (groupedAdditionals.hasOwnProperty(key)) {
          const additionals = groupedAdditionals[key];
          const additionalId = additionals.additional.toString();
          const additionalName = additionalMap.get(additionalId);
          if (additionalName) {
            additionals.additionalName = additionalName;
            updatedAdditional[key] = additionals;
          }
        }
      }
      return updatedAdditional;
    };
    
    const profilMap = new Map(stretchProfil.map(profil => [profil._id.toString(), profil.name]));
    const enhanceCeilingsWithNameProfil = (groupedProfils) => {
      const updatedProfil = {};
      for (const key in groupedProfils) {
        if (groupedProfils.hasOwnProperty(key)) {
          const profils = groupedProfils[key];
          const profilId = profils.profil.toString();
          const profilName = profilMap.get(profilId);
          if (profilName) {
            profils.profilName = profilName;
            updatedProfil[key] = profils;
          }
        }
      }
      return updatedProfil;
    };

    const lightRingMap = new Map(dataLightRing.map(lightRing => [lightRing._id.toString(), lightRing.name]));
    const enhanceCeilingsWithNameLightRing = (groupedLightRings) => {
      const updatedLightRing = {};
      for (const key in groupedLightRings) {
        if (groupedLightRings.hasOwnProperty(key)) {
          const lightRings = groupedLightRings[key];
          const lightRingId = lightRings.lightRing.toString();
          const lightRingName = lightRingMap.get(lightRingId);
          if (lightRingName) {
            lightRings.lightRingName = lightRingName;
            updatedLightRing[key] = lightRings;
          }
        }
      }
      return updatedLightRing;
    };
    
    data.groupedStretchCeilings = enhanceCeilingsWithNamesTexture(data.groupedStretchCeilings);
    data.groupedAdditionals = enhanceCeilingsWithNamesAdditional(data.groupedAdditionals);
    data.groupedProfils = enhanceCeilingsWithNameProfil(data.groupedProfils);
    data.groupedLightRings = enhanceCeilingsWithNameLightRing(data.groupedLightRings);
    return data
  }

  update(id: number, updateStretchCeilingOrderDto: UpdateStretchCeilingOrderDto) {
    return `This action updates a #${id} stretchCeilingOrder`;
  }

  remove(id: number) {
    return `This action removes a #${id} stretchCeilingOrder`;
  }
}
