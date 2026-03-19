import type { MercenaryTemplate } from '../../../types/mercenary'

export const thalos: MercenaryTemplate = {
  id: 'thalos',
  name: '탈로스',
  type: 'attacker',
  star: 3,
  maxHp: 3009,
  atk: 902,
  def: 0,
  emoji: '⚔️',
  imageId: '3385',
  critRate: 15,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'horizontal',
    rangeSize: 1,
    effects: [
      { type: 'def_down', value: 20, duration: 8, debuffClass: 'stat_weaken' },
      { type: 'equipment', value: 0, duration: 2, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
