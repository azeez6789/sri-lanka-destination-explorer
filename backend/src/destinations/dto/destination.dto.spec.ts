import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { DestinationDto } from './destination.dto';

describe('DestinationDto', () => {
  it('requires a name, description, latitude, and longitude', () => {
    const dto = plainToInstance(DestinationDto, {});
    const errors = validateSync(dto);

    expect(errors.map((error) => error.property)).toEqual(
      expect.arrayContaining(['name', 'description', 'latitude', 'longitude']),
    );
  });

  it('accepts required destination fields without an image URL', () => {
    const dto = plainToInstance(DestinationDto, {
      name: 'Ella',
      description: 'A hill-country town.',
      latitude: 6.8667,
      longitude: 81.0466,
    });

    expect(validateSync(dto)).toHaveLength(0);
  });

  it('rejects coordinates outside valid latitude and longitude ranges', () => {
    const dto = plainToInstance(DestinationDto, {
      name: 'Ella',
      description: 'A hill-country town.',
      latitude: 91,
      longitude: 181,
    });

    expect(validateSync(dto).map((error) => error.property)).toEqual(
      expect.arrayContaining(['latitude', 'longitude']),
    );
  });

  it('accepts visitor notes up to 4,000 characters and rejects longer notes', () => {
    const base = {
      name: 'Colombo',
      description: 'A coastal capital.',
      latitude: 6.93548,
      longitude: 79.84868,
    };
    const validDto = plainToInstance(DestinationDto, {
      ...base,
      notes: 'Visit the city at your own pace.',
    });
    const invalidDto = plainToInstance(DestinationDto, {
      ...base,
      notes: 'n'.repeat(4001),
    });

    expect(validateSync(validDto)).toHaveLength(0);
    expect(validateSync(invalidDto).map((error) => error.property)).toContain(
      'notes',
    );
  });

  it('accepts attributed additional destination photos', () => {
    const dto = plainToInstance(DestinationDto, {
      name: 'Ambewela Farm',
      description: 'A highland dairy farm.',
      latitude: 6.884,
      longitude: 80.779,
      images: ['https://example.com/farm.jpg'],
      imageCredits: ['Photographer'],
      imageLicenses: ['CC BY-SA 4.0'],
      imageSourceUrls: ['https://commons.wikimedia.org/wiki/File:Farm.jpg'],
    });

    expect(validateSync(dto)).toHaveLength(0);
  });
});
