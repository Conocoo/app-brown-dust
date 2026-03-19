import type { MercenaryTemplate } from '../../../types/mercenary'

export const ors: MercenaryTemplate = {
  id: 'ors',
  name: '오르스',
  type: 'mage',
  star: 4,
  maxHp: 3738,
  atk: 1872,
  def: 0,
  emoji: '🔮',
  imageId: '1465',
  critRate: 20,
  critDamage: 50,
  agility: 5,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'area_n',
    rangeSize: 1,
    effects: [
      { type: 'dot', value: 0.1, duration: 15, debuffClass: 'dot', atkScaling: true },
      { type: 'atk_up', value: 50, duration: 32, buffType: 'stat_enhance', target: 'self' },
      { type: 'dot', value: 1, debuffClass: 'dot', atkScaling: true },
    ],
  },
}
