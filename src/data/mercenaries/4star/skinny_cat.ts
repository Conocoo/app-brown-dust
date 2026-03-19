import type { MercenaryTemplate } from '../../../types/mercenary'

export const skinny_cat: MercenaryTemplate = {
  id: 'skinny_cat',
  name: '말라깽이 고양이',
  type: 'attacker',
  star: 4,
  maxHp: 97510,
  atk: 21,
  def: 0,
  emoji: '⚔️',
  imageId: '8352',
  critRate: 0,
  critDamage: 0,
  agility: 0,
  skill: {
    timing: 'passive',
    target: 'enemy_front',
    attackRange: 'cross',
    rangeSize: 1,
    effects: [
      { type: 'counter_attack', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'equipment', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'shield', value: 70, duration: 999, buffType: 'shield', target: 'self' },
    ],
  },
}
