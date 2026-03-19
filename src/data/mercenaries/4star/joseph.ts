import type { MercenaryTemplate } from '../../../types/mercenary'

export const joseph: MercenaryTemplate = {
  id: 'joseph',
  name: '요제프',
  type: 'defender',
  star: 4,
  maxHp: 5898,
  atk: 794,
  def: 10,
  emoji: '🛡️',
  imageId: '615',
  critRate: 10,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'x_shape',
    rangeSize: 1,
    effects: [
      { type: 'on_death_trigger', value: 0, duration: 24, debuffClass: 'stat_weaken' },
      { type: 'silence', value: 0, duration: 12, debuffClass: 'cc' },
    ],
  },
}
