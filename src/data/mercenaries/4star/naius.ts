import type { MercenaryTemplate } from '../../../types/mercenary'

export const naius: MercenaryTemplate = {
  id: 'naius',
  name: '나이어스',
  type: 'mage',
  star: 4,
  maxHp: 4312,
  atk: 4861,
  def: 10,
  emoji: '🔮',
  imageId: '3865',
  critRate: 20,
  critDamage: 50,
  agility: 50,
  skill: {
    timing: 'passive',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [
      { type: 'counter_attack', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'regeneration', value: 10, duration: 7, buffType: 'stat_enhance', target: 'self' },
      { type: 'counter_attack', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
