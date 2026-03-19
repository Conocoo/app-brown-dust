import type { MercenaryTemplate } from '../../../types/mercenary'

export const hiro: MercenaryTemplate = {
  id: 'hiro',
  name: '히로',
  type: 'attacker',
  star: 5,
  maxHp: 4178,
  atk: 2457,
  def: 15,
  emoji: '⚔️',
  imageId: '4495',
  critRate: 10,
  critDamage: 50,
  agility: 10,
  skill: {
    timing: 'passive',
    target: 'enemy_front',
    attackRange: 'horizontal',
    rangeSize: 2,
    effects: [
      { type: 'insert_buff', value: 0, buffType: 'stat_enhance', target: 'self' },
      { type: 'char_type_buff', value: 1, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'equipment', value: 0, duration: 18, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
