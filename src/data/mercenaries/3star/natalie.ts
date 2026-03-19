import type { MercenaryTemplate } from '../../../types/mercenary'

export const natalie: MercenaryTemplate = {
  id: 'natalie',
  name: '나탈리',
  type: 'attacker',
  star: 3,
  maxHp: 3510,
  atk: 809,
  def: 5,
  emoji: '⚔️',
  imageId: '2645',
  critRate: 15,
  critDamage: 75,
  agility: 5,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [
      { type: 'focus_fire', value: 0, duration: 4, debuffClass: 'cc' },
      { type: 'shield', value: 35, duration: 6, debuffClass: 'stat_weaken' },
    ],
  },
}
