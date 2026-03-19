import type { MercenaryTemplate } from '../../../types/mercenary'

export const enma: MercenaryTemplate = {
  id: 'enma',
  name: '엔마',
  type: 'mage',
  star: 5,
  maxHp: 3301,
  atk: 1494,
  def: 5,
  emoji: '🔮',
  imageId: '4435',
  critRate: 20,
  critDamage: 50,
  agility: 20,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'x_shape',
    rangeSize: 1,
    effects: [
      { type: 'revival', value: 0, duration: 999, buffType: 'special', target: 'self' },
      { type: 'equipment', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'heal_boost', value: 0.5, duration: 10, debuffClass: 'stat_weaken' },
      { type: 'shield', value: 35, duration: 25, buffType: 'shield', target: 'self' },
      { type: 'regeneration', value: 1, duration: 25, buffType: 'stat_enhance', target: 'self' },
      { type: 'damage_limit', value: 0.49, duration: 12, buffType: 'special', target: 'self' },
    ],
  },
}
