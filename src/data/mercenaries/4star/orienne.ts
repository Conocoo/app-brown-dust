import type { MercenaryTemplate } from '../../../types/mercenary'

export const orienne: MercenaryTemplate = {
  id: 'orienne',
  name: '오리엔느',
  type: 'attacker',
  star: 4,
  maxHp: 4695,
  atk: 985,
  def: 5,
  emoji: '⚔️',
  imageId: '985',
  critRate: 20,
  critDamage: 75,
  agility: 25,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'cross',
    rangeSize: 1,
    effects: [
      { type: 'shield', value: 50, duration: 18, debuffClass: 'stat_weaken' },
      { type: 'summon', value: 0, duration: 12, debuffClass: 'stat_weaken' },
    ],
  },
}
