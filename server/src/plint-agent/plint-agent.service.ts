import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PlintAgent } from './schema/plint-agent.schema';
import { CreatePlintAgentDto } from './dto/create-plint-ahent.dto';
import { UpdatePlintAgentDto } from './dto/update-plint-agent.dto';


@Injectable()
export class PlintAgentService {
    constructor(
        @InjectModel(PlintAgent.name) private plintAgentModel: Model<PlintAgent>,
    ) { }


    async create(createPlintAgentDto: CreatePlintAgentDto) {
        const  phone1  = createPlintAgentDto.phone1;
        
        const oldAgenterate = await this.plintAgentModel.findOne({ phone1 });
        if (oldAgenterate) {
            throw new NotFoundException('agent already exists');
        }
        const createdAgent = new this.plintAgentModel(createPlintAgentDto);
        return createdAgent.save();
    }


    async findAll() {
        return await this.plintAgentModel.find()
    }

    async findOne(id: string) {
        return await this.plintAgentModel.findById(id)
    }

    async deleteFromArray(id: string, deleteId: string) {
        await this.plintAgentModel.findByIdAndUpdate(
            id,
            { $pull: { order: new Types.ObjectId(deleteId) } },
            { new: true }
        );
    }

    update(id: number, updatePlintAgentDto: UpdatePlintAgentDto) {
        return `This action updates a #${id} agent`;
    }

    remove(id: number) {
        return `This action removes a #${id} Agent`;
    }
}
