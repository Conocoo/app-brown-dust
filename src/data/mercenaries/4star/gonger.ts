import type { MercenaryTemplate } from '../../../types/mercenary'

export const gonger: MercenaryTemplate = {
  id: 'gonger',
  name: '쾡갈',
  type: 'defender',
  star: 4,
  maxHp: 5970,
  atk: 995,
  def: 35,
  emoji: '🛡️',
  imageId: '8328',
  critRate: 0,
  critDamage: 0,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'area_n',
    rangeSize: 1,
    effects: [
      { type: 'all_stats_down', value: 25, duration: 100, debuffClass: 'stat_weaken' },
      { type: 'shield', value: 35, duration: 100, debuffClass: 'stat_weaken' },
      { type: 'taunt_immune', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
