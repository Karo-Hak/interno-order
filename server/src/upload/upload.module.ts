import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from 'src/order/schema/order.schema';
import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from 'mongoose';
import { StretchCeilingOrder, StretchCeilingOrderSchema } from 'src/stretch-ceiling-order/schema/stretch-ceiling-order.schema';


export type UploadDocument = HydratedDocument<Upload>;

@Schema()
export class Upload {

};


export const UploadSchema = SchemaFactory.createForClass(Upload);


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: StretchCeilingOrder.name, schema: StretchCeilingOrderSchema },

    ]),
  ],
  providers: [UploadService],
  controllers: [UploadController],
})
export class UploadModule { }
