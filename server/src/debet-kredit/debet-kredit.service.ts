import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { DebetKredit } from "./schema/debet-kredit.schema";
import { StretchBuyer } from "src/stretch-buyer/schema/stretch-buyer.schema";
import { StretchCeilingOrder } from "src/stretch-ceiling-order/schema/stretch-ceiling-order.schema";


@Injectable()
export class DebetKreditService {
    constructor(
        @InjectModel(DebetKredit.name) private debetKreditModel: Model<DebetKredit>,
        @InjectModel(StretchBuyer.name) private stretchBuyerModel: Model<StretchBuyer>,
        @InjectModel(StretchCeilingOrder.name) private stretchCeilingOrderModel: Model<StretchCeilingOrder>,
    ) { }

    async create(order: string, user: string, buyer: string, balance: number, prepayment: number) {

        const orderBuyerDocument = await this.stretchBuyerModel.findById(buyer);
        if (!orderBuyerDocument) {
            throw new Error('Order buyer not found');
        }

        if (balance > 0) {
            const createdDebet = await this.debetKreditModel.create({
                type: "Գնում",
                user,
                buyer,
                order,
                amount: balance
            })
            orderBuyerDocument.debetKredit.push(createdDebet.id);
            await createdDebet.save()
        }

        if (prepayment > 0) {
            const createdKredit = await this.debetKreditModel.create({
                type: "Վճարում",
                user,
                buyer,
                order,
                amount: prepayment
            })
            orderBuyerDocument.debetKredit.push(createdKredit.id);
            await createdKredit
        }
        await Promise.all([
            orderBuyerDocument.save(),
        ]);
    }

    async creatPayment(orderId: Types.ObjectId, sum: number) {
        const order = await this.stretchCeilingOrderModel.findById(orderId)
        const buyer = await this.stretchBuyerModel.findById(order.buyer)

        const createdKredit = await this.debetKreditModel.create({
            type: "Վճարում",
            user: order.user.toString(),
            buyer: order.buyer.toString(),
            order: order._id.toString(),
            amount: sum
        })
        buyer.debetKredit.push(createdKredit.id);
        await createdKredit

        await Promise.all([
            buyer.save(),
        ]);
        return createdKredit.save()
    }

    async findAllByBuyer() {
        return await this.stretchBuyerModel.find().populate("debetKredit")
    }

    async findByOrder(orderId: string) {
        return await this.debetKreditModel.find({ order: orderId })
    }

    async updateBalance(sum: number, id: string) {
        return await this.debetKreditModel.findByIdAndUpdate(id, { amount: sum });
    }

    async updateBuyer(oldId: string, newId: string) {
        return await this.debetKreditModel.updateMany({ buyer: oldId }, { $set: { buyer: newId } });
    }

    async findByDate(startDate: Date, endDate: Date) {
        return await this.debetKreditModel.find({
            date: {
                $gte: startDate,
                $lte: endDate
            },
        })
            .sort({ date: -1 });
    }

    async deleteDocuments(ids: string[]) {
        try {
            let deletedCount = 0;
            
            for (const id of ids) {
                const deletedDoc = await this.debetKreditModel.findByIdAndDelete(id).exec();
                if (deletedDoc) {
                    deletedCount++;
                }
            }
            
            return { deletedCount };
        } catch (error) {
            throw new Error('Failed to delete documents: ' + error.message);
        }
    }
    
    

}