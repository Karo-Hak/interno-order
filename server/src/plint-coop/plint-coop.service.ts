import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PlintCoop } from './schema/plint-coop.schema';
import { CreatePlintCoopDto } from './dto/create-plint-coop.dto';
import { UpdatePlintCoopDto } from './dto/update-plint-coop.dto';

@Injectable()
export class PlintCoopService {
    constructor(
        @InjectModel(PlintCoop.name) private plintCoopModel: Model<PlintCoop>,
    ) { }


    async create(createPlintCoopDto: CreatePlintCoopDto) {
        const  phone1  = createPlintCoopDto.phone1;
        
        const oldCooperate = await this.plintCoopModel.findOne({ phone1 });
        if (oldCooperate) {
            throw new NotFoundException('cooperate already exists');
        }
        const createdCooperate = new this.plintCoopModel(createPlintCoopDto);
        return createdCooperate.save();
    }


    async findAll() {
        return await this.plintCoopModel.find()
    }

    async findOne(id: string) {
        return await this.plintCoopModel.findById(id)
    }

    async deleteFromArray(id: string, deleteId: string) {
        await this.plintCoopModel.findByIdAndUpdate(
            id,
            { $pull: { order: new Types.ObjectId(deleteId) } },
            { new: true }
        );
    }

    update(id: number, updatePlintCoopDto: UpdatePlintCoopDto) {
        return `This action updates a #${id} cooperate`;
    }

    remove(id: number) {
        return `This action removes a #${id} cooperate`;
    }
}
