import type { MercenaryTemplate } from '../../../types/mercenary'

export const zarka: MercenaryTemplate = {
  id: 'zarka',
  name: '자르카',
  type: 'mage',
  star: 4,
  maxHp: 3952,
  atk: 1276,
  def: 0,
  emoji: '🔮',
  imageId: '1165',
  critRate: 20,
  critDamage: 50,
  agility: 15,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'area_n',
    rangeSize: 1,
    effects: [
      { type: 'shield', value: 65, duration: 18, debuffClass: 'stat_weaken' },
      { type: 'all_stats_down', value: 35, duration: 18, debuffClass: 'stat_weaken' },
      { type: 'silence', value: 0, duration: 18, debuffClass: 'cc' },
    ],
  },
}
