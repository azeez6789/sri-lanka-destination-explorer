import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DestinationDocument = HydratedDocument<Destination>;

@Schema({ timestamps: true })
export class Destination {
  @Prop({ required: true, trim: true, maxlength: 100 })
  name: string;

  @Prop({ default: '', trim: true, maxlength: 160 })
  location: string;

  @Prop({ default: '', trim: true, maxlength: 240 })
  summary: string;

  @Prop({ required: true, trim: true, maxlength: 2000 })
  description: string;

  @Prop({ default: '', trim: true, maxlength: 4000 })
  notes: string;

  @Prop({ default: '', trim: true, maxlength: 80 })
  category: string;

  @Prop({ required: true, min: -90, max: 90 })
  latitude: number;

  @Prop({ required: true, min: -180, max: 180 })
  longitude: number;

  @Prop({ default: '', trim: true, maxlength: 2048 })
  imageUrl: string;

  @Prop({ default: '', trim: true, maxlength: 160 })
  imageCredit: string;

  @Prop({ default: '', trim: true, maxlength: 80 })
  imageLicense: string;

  @Prop({ default: '', trim: true, maxlength: 2048 })
  imageSourceUrl: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: [String], default: [] })
  imageCredits: string[];

  @Prop({ type: [String], default: [] })
  imageLicenses: string[];

  @Prop({ type: [String], default: [] })
  imageSourceUrls: string[];

  createdAt: Date;
  updatedAt: Date;
}

export const DestinationSchema = SchemaFactory.createForClass(Destination);
