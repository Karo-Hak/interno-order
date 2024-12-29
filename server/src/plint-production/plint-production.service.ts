import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { UserService } from 'src/user/user.service';
import { PlintProduct } from 'src/plint-product/schema/plint-product.schema';
import { PlintProduction } from './schema/plint-production.schema';
import { PlintProductService } from 'src/plint-product/plint-product.service';

@Injectable()
export class PlintProductionService {
  constructor(
    @InjectModel(PlintProduction.name) private plintProductionModel: Model<PlintProduction>,
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel(PlintProduct.name) private plintProductModel: Model<PlintProduct>,


    private readonly userService: UserService,
    private readonly plintProductService: PlintProductService
  ) { }
  async create(createPlintProductionDto: any) {

    const orderUserDocument = await this.userModel.findById(createPlintProductionDto.user);
    if (!orderUserDocument) {
      throw new Error('Пользователь не найден');
    }

    const orderPlintDocument = await this.plintProductModel.findById(createPlintProductionDto.plint);
    if (!orderPlintDocument) {
      throw new Error('Плит не найден');
    }

    const createdOrder: any = await this.plintProductionModel.create({
      ...createPlintProductionDto.plintProduction,
      user: orderUserDocument.id,
      plint: orderPlintDocument.id,
    });

    const quantity = {
      [orderPlintDocument.id]: +createPlintProductionDto.plintProduction.quantity + +orderPlintDocument.quantity,
    };

    try {
      await this.plintProductService.update(quantity);
    } catch (error) {
      throw new Error('Ошибка при обновлении количества плита');
    }
    return createdOrder;
  }


  async findOne(id: string) {
    const data = (await this.plintProductionModel.findById(id))
    return data
  }

  //   async findNewOrders() {
  //     return await this.plintOrderModel.find({ done: false, }).populate("buyer").sort({ date: -1 })
  //   }

  //   async filterOrder(startDate: Date, endDate: Date) {
  //     return await this.plintOrderModel.find({
  //       date: {
  //         $gte: startDate,
  //         $lte: endDate
  //       }
  //     }).populate("buyer").populate("user").sort({ date: -1 })
  //   }

  //   async findOne(id: string) {
  //     const data = (await this.plintOrderModel.findById(id).populate("buyer"))
  //     return data
  //   }

  //   async updateStatus(id: string) {
  //     return await this.plintOrderModel.findByIdAndUpdate(id, { done: true })
  //   }

  //   findAll() {
  //     return `This action returns all coopCeilingOrder`;
  //   }



  //   update(id: number, updatePlintOrderDto: UpdatePlintOrderDto) {
  //     return `This action updates a #${id} coopCeilingOrder`;
  //   }

  //   remove(id: number) {
  //     return `This action removes a #${id} coopCeilingOrder`;
  //   }
}
