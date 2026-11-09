import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { Admin, AdminSchema } from './auth/schemas/admin.schema';
import { DestinationsController } from './destinations/destinations.controller';
import { DestinationsService } from './destinations/destinations.service';
import {
  Destination,
  DestinationSchema,
} from './destinations/schemas/destination.schema';
import { WeatherService } from './weather/weather.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const uri = config.getOrThrow<string>('MONGODB_URI');
        if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
          throw new Error(
            'MONGODB_URI must be set to a valid MongoDB connection string.',
          );
        }

        return {
          uri,
          authSource: 'admin',
          dbName: config.get<string>(
            'MONGODB_DATABASE',
            'sri_lanka_destination_explorer',
          ),
        };
      },
    }),
    MongooseModule.forFeature([
      { name: Destination.name, schema: DestinationSchema },
      { name: Admin.name, schema: AdminSchema },
    ]),
  ],
  controllers: [AppController, AuthController, DestinationsController],
  providers: [AuthService, DestinationsService, WeatherService],
})
export class AppModule {}
