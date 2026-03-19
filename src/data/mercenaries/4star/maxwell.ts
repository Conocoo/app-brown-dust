import type { MercenaryTemplate } from '../../../types/mercenary'

export const maxwell: MercenaryTemplate = {
  id: 'maxwell',
  name: '맥스웰',
  type: 'attacker',
  star: 4,
  maxHp: 4220,
  atk: 1094,
  def: 0,
  emoji: '⚔️',
  imageId: '4075',
  critRate: 10,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'horizontal',
    rangeSize: 2,
    effects: [
      { type: 'regeneration', value: 5, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'def_up', value: 65, duration: 2, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
