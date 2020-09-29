import L from '../../common/logger';

import { getCordinatesByAddress } from '../geocodding';

let id = 0;
interface Example {
  id: number;
  name: string;
}

const examples: Example[] = [
  { id: id++, name: 'example 0' },
  { id: id++, name: 'example 1' },
];

export class ExamplesService {
  all(): Promise<Example[]> {
    L.info(examples, 'fetch all examples');
    return Promise.resolve(examples);
  }

  byId(id: number): Promise<Example> {
    L.info(`fetch example with id ${id}`);
    return this.all().then((r) => r[id]);
  }

  async create(
    name: string
  ): Promise<{ example: Example; coords: [number, number] }> {
    L.info(`create example with name ${name}`);
    const example: Example = {
      id: id++,
      name,
    };
    examples.push(example);

    try {
      const coords = await getCordinatesByAddress(name);
      return Promise.resolve({ example, coords });
    } catch (e) {
      L.error(e);
      return { example, coords: [0, 0] };
    }
  }
}

export default new ExamplesService();
