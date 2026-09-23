import * as migration_20260905_114530_initial_schema from './20260905_114530_initial_schema';
import * as migration_20260905_192854_add_mobile_hero_images from './20260905_192854_add_mobile_hero_images';
import * as migration_20260908_134812_add_multilingual_content from './20260908_134812_add_multilingual_content';
import * as migration_20260923_143116_add_original_family_tree_image from './20260923_143116_add_original_family_tree_image';

export const migrations = [
  {
    up: migration_20260905_114530_initial_schema.up,
    down: migration_20260905_114530_initial_schema.down,
    name: '20260905_114530_initial_schema',
  },
  {
    up: migration_20260905_192854_add_mobile_hero_images.up,
    down: migration_20260905_192854_add_mobile_hero_images.down,
    name: '20260905_192854_add_mobile_hero_images',
  },
  {
    up: migration_20260908_134812_add_multilingual_content.up,
    down: migration_20260908_134812_add_multilingual_content.down,
    name: '20260908_134812_add_multilingual_content',
  },
  {
    up: migration_20260923_143116_add_original_family_tree_image.up,
    down: migration_20260923_143116_add_original_family_tree_image.down,
    name: '20260923_143116_add_original_family_tree_image'
  },
];
