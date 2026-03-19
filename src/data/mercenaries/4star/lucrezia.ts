import type { MercenaryTemplate } from '../../../types/mercenary'

export const lucrezia: MercenaryTemplate = {
  id: 'lucrezia',
  name: '루크레치아',
  type: 'mage',
  star: 4,
  maxHp: 2727,
  atk: 880,
  def: 0,
  emoji: '🔮',
  imageId: '1155',
  critRate: 10,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'cross',
    rangeSize: 1,
    effects: [
      { type: 'charm', value: 0, duration: 16, debuffClass: 'cc' },
      { type: 'position_change', value: 0, duration: 16, debuffClass: 'cc' },
      { type: 'summon', value: 0, duration: 16, debuffClass: 'stat_weaken' },
      { type: 'counter_attack', value: 0, duration: 24, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
