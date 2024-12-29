import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { PlintDebetKredit } from "./schema/plint-debet-kredit.schema";
import { PlintBuyer } from "src/plintBuyer/schema/plint-buyer.schema";
import { PlintOrder } from "src/plint-order/schema/plint-order.schema";


@Injectable()
export class PlintDebetKreditService {
    constructor(
        @InjectModel(PlintDebetKredit.name) private plintDebetKreditModel: Model<PlintDebetKredit>,
        @InjectModel(PlintBuyer.name) private plintBuyerModel: Model<PlintBuyer>,
        @InjectModel(PlintOrder.name) private plintOrderModel: Model<PlintOrder>,
    ) { }

    async create(order: string, user: string, buyer: string, balance: number, prepayment: number) {

        const orderBuyerDocument = await this.plintBuyerModel.findById(buyer);
        if (!orderBuyerDocument) {
            throw new Error('Order buyer not found');
        }

        if (balance > 0) {
            const createdDebet = await this.plintDebetKreditModel.create({
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
            const createdKredit = await this.plintDebetKreditModel.create({
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
        const order = await this.plintOrderModel.findById(orderId)
        const buyer = await this.plintBuyerModel.findById(order.buyer)

        const createdKredit = await this.plintDebetKreditModel.create({
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
        return await this.plintBuyerModel.find().populate("debetKredit")
    }

    async findByOrder(orderId: string) {
        return await this.plintDebetKreditModel.find({ order: orderId })
    }

    async updateBalance(sum: number, id: string) {
        return await this.plintDebetKreditModel.findByIdAndUpdate(id, { amount: sum });
    }

    async updateBuyer(oldId: string, newId: string) {
        return await this.plintDebetKreditModel.updateMany({ buyer: oldId }, { $set: { buyer: newId } });
    }

    async findByDate(startDate: Date, endDate: Date) {
        return await this.plintDebetKreditModel.find({
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
                const deletedDoc = await this.plintDebetKreditModel.findByIdAndDelete(id).exec();
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