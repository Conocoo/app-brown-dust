import type { MercenaryTemplate } from '../../../types/mercenary'

export const trumpeto: MercenaryTemplate = {
  id: 'trumpeto',
  name: '트럼페토',
  type: 'attacker',
  star: 4,
  maxHp: 4975,
  atk: 2985,
  def: 35,
  emoji: '⚔️',
  imageId: '8327',
  critRate: 100,
  critDamage: 100,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'area_n',
    rangeSize: 1,
    effects: [
      { type: 'equipment', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'shield', value: 35, duration: 999, buffType: 'shield', target: 'self' },
      { type: 'taunt_immune', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
