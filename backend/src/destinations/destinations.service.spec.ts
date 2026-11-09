import { Model } from 'mongoose';
import { DestinationDto } from './dto/destination.dto';
import { Destination } from './schemas/destination.schema';
import { DestinationsService } from './destinations.service';

describe('DestinationsService', () => {
  const id = '507f1f77bcf86cd799439011';
  const destination = {
    _id: id,
    name: 'Ella',
    description: 'A hill-country town.',
    latitude: 6.8667,
    longitude: 81.0466,
  };
  const dto: DestinationDto = {
    name: destination.name,
    description: destination.description,
    latitude: destination.latitude,
    longitude: destination.longitude,
  };
  let service: DestinationsService;
  let model: {
    find: jest.Mock;
    findById: jest.Mock;
    create: jest.Mock;
    findByIdAndUpdate: jest.Mock;
    findByIdAndDelete: jest.Mock;
    updateOne: jest.Mock;
  };

  beforeEach(() => {
    model = {
      find: jest.fn(() => ({
        sort: jest.fn(() => ({
          lean: jest.fn(() => ({
            exec: jest.fn().mockResolvedValue([destination]),
          })),
        })),
      })),
      findById: jest.fn(() => ({
        lean: jest.fn(() => ({
          exec: jest.fn().mockResolvedValue(destination),
        })),
      })),
      create: jest.fn().mockResolvedValue(destination),
      findByIdAndUpdate: jest.fn(() => ({
        lean: jest.fn(() => ({
          exec: jest.fn().mockResolvedValue(destination),
        })),
      })),
      findByIdAndDelete: jest.fn(() => ({
        lean: jest.fn(() => ({
          exec: jest.fn().mockResolvedValue(destination),
        })),
      })),
      updateOne: jest.fn(() => ({
        exec: jest.fn().mockResolvedValue({ acknowledged: true }),
      })),
    };
    service = new DestinationsService(model as unknown as Model<Destination>);
  });

  it('inserts the required sample destinations when they are missing', async () => {
    await service.onModuleInit();

    expect(model.updateOne).toHaveBeenCalledTimes(52);
    expect(model.updateOne).toHaveBeenCalledWith(
      { name: 'Colombo' },
      {
        $setOnInsert: expect.objectContaining({
          latitude: 6.93548,
          longitude: 79.84868,
        }),
      },
      { upsert: true },
    );
    expect(model.updateOne).toHaveBeenCalledWith(
      { name: 'Kandy' },
      {
        $setOnInsert: expect.objectContaining({
          latitude: 7.2906,
          longitude: 80.6337,
        }),
      },
      { upsert: true },
    );
    expect(model.updateOne).toHaveBeenCalledWith(
      { name: 'Galle' },
      {
        $setOnInsert: expect.objectContaining({
          latitude: 6.0535,
          longitude: 80.221,
        }),
      },
      { upsert: true },
    );
  });

  it('adds the longer Colombo description to the original sample record only', async () => {
    await service.onModuleInit();

    expect(model.updateOne).toHaveBeenCalledWith(
      {
        name: 'Colombo',
        description: expect.stringContaining('vibrant coastal capital'),
        summary: { $exists: false },
      },
      {
        $set: {
          summary: expect.stringContaining('vibrant coastal capital'),
          description: expect.stringContaining('Fort district'),
        },
      },
    );
  });

  it('adds detailed copy and credited gallery photos to the original Ambewela sample', async () => {
    await service.onModuleInit();

    expect(model.updateOne).toHaveBeenCalledWith(
      {
        name: 'Ambewela Farm',
        description: expect.stringContaining('Visit a dairy farm'),
        summary: { $exists: false },
        $or: [{ images: { $exists: false } }, { images: { $size: 0 } }],
      },
      {
        $set: expect.objectContaining({
          summary: expect.stringContaining('Visit a dairy farm'),
          description: expect.stringContaining('cool, open highlands'),
          notes: expect.stringContaining('light jacket'),
          images: expect.arrayContaining([
            expect.stringContaining('Ambewela_New_Zealand_Dairy_Farm'),
          ]),
          imageCredits: expect.arrayContaining(['MRuwan']),
          imageSourceUrls: expect.arrayContaining([
            expect.stringContaining('commons.wikimedia.org/wiki/File'),
          ]),
        }),
      },
    );
  });

  it('seeds 50 unique places and credits every Commons photo', async () => {
    await service.onModuleInit();

    const seededDestinations = model.updateOne.mock.calls
      .map(([, update]) => update.$setOnInsert)
      .filter(Boolean);
    const creditedPhotos = seededDestinations.filter(
      (seed) => seed.imageCredit,
    );

    expect(new Set(seededDestinations.map((seed) => seed.name)).size).toBe(50);
    expect(creditedPhotos).toHaveLength(47);
    expect(
      creditedPhotos.every(
        (seed) => seed.imageUrl && seed.imageLicense && seed.imageSourceUrl,
      ),
    ).toBe(true);
  });

  it('lists destinations from MongoDB', async () => {
    await expect(service.findAll()).resolves.toEqual([destination]);
    expect(model.find).toHaveBeenCalledTimes(1);
  });

  it('reads a saved destination and rejects an invalid or missing id', async () => {
    await expect(service.findOne(id)).resolves.toEqual(destination);
    expect(model.findById).toHaveBeenCalledWith(id);

    await expect(service.findOne('not-an-id')).rejects.toMatchObject({
      status: 404,
    });
    expect(model.findById).toHaveBeenCalledTimes(1);
  });

  it('creates destinations in MongoDB', async () => {
    await expect(service.create(dto)).resolves.toEqual(destination);
    expect(model.create).toHaveBeenCalledWith(dto);
  });

  it('updates and deletes saved destinations in MongoDB', async () => {
    await expect(service.update(id, dto)).resolves.toEqual(destination);
    expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
      id,
      dto,
      { new: true, runValidators: true },
    );

    await expect(service.remove(id)).resolves.toEqual({ success: true });
    expect(model.findByIdAndDelete).toHaveBeenCalledWith(id);
  });
});
