import type { MercenaryTemplate } from '../../../types/mercenary'

export const aie: MercenaryTemplate = {
  id: 'aie',
  name: '아이',
  type: 'mage',
  star: 5,
  maxHp: 4076,
  atk: 2016,
  def: 0,
  emoji: '🔮',
  imageId: '3025',
  critRate: 20,
  critDamage: 65,
  agility: 15,
  skill: {
    timing: 'after_attack',
    target: 'enemy_second',
    attackRange: 'area_n',
    rangeSize: 1,
    effects: [
      { type: 'shield', value: 200, duration: 18, debuffClass: 'stat_weaken' },
      { type: 'equipment', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'dot', value: 1.5, debuffClass: 'dot' },
    ],
  },
}
