import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Visitor extends Document {
  @Prop({ required: true, unique: true, index: true })
  deviceId: string;

  @Prop()
  ip: string;

  @Prop()
  userAgent: string;

  @Prop()
  country: string;

  @Prop()
  region: string;

  @Prop()
  city: string;

  @Prop()
  isp: string; // Network Name

  @Prop({ default: 1 })
  visitCount: number;

  @Prop({ default: Date.now })
  firstVisit: Date;

  @Prop({ default: Date.now })
  lastVisit: Date;
}

export const VisitorSchema = SchemaFactory.createForClass(Visitor);
export type VisitorDocument = Visitor & Document;
