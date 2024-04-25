import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CoopDebetKredit } from "./schema/coop-debet-kredit.schema";
import { CoopStretchBuyer } from "src/coop-stretch-buyer/schema/coop-stretch-buyer.schema";
import { CoopCeilingOrder } from "src/coop-ceiling-order/schema/coop-ceiling-order.schema";


@Injectable()
export class CoopDebetKreditService {
    constructor(
        @InjectModel(CoopDebetKredit.name) private coopDebetKreditModel: Model<CoopDebetKredit>,
        @InjectModel(CoopStretchBuyer.name) private coopStretchBuyerModel: Model<CoopStretchBuyer>,
        @InjectModel(CoopCeilingOrder.name) private coopCeilingOrderModel: Model<CoopCeilingOrder>,
    ) { }

    async create(order: string, user: string, buyer: string, balance: number, prepayment: number) {

        const orderBuyerDocument = await this.coopStretchBuyerModel.findById(buyer);
        if (!orderBuyerDocument) {
            throw new Error('Order buyer not found');
        }

        if (balance > 0) {
            const createdDebet = await this.coopDebetKreditModel.create({
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
            const createdKredit = await this.coopDebetKreditModel.create({
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
        const order = await this.coopCeilingOrderModel.findById(orderId)
        const buyer = await this.coopStretchBuyerModel.findById(order.buyer)

        const createdKredit = await this.coopDebetKreditModel.create({
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
        return await this.coopStretchBuyerModel.find().populate("debetKredit")
    }

    async findByOrder(orderId: string) {
        return await this.coopDebetKreditModel.find({ order: orderId })
    }

    async updateBalance(sum: number, id: string) {
        return await this.coopDebetKreditModel.findByIdAndUpdate(id, { amount: sum });
    }

    async updateBuyer(oldId: string, newId: string) {
        return await this.coopDebetKreditModel.updateMany({ buyer: oldId }, { $set: { buyer: newId } });
    }

    async findByDate(startDate: Date, endDate: Date) {
        return await this.coopDebetKreditModel.find({
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
                const deletedDoc = await this.coopDebetKreditModel.findByIdAndDelete(id).exec();
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