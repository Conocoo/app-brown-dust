import type { MercenaryTemplate } from '../../../types/mercenary'

export const xenon: MercenaryTemplate = {
  id: 'xenon',
  name: '제논',
  type: 'attacker',
  star: 4,
  maxHp: 6523,
  atk: 1840,
  def: 10,
  emoji: '⚔️',
  imageId: '975',
  critRate: 10,
  critDamage: 50,
  agility: 10,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [
      { type: 'dot_drain', value: 0.18, debuffClass: 'dot' },
      { type: 'hp_up', value: 6000, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'shield', value: 80, duration: 16, debuffClass: 'stat_weaken' },
      { type: 'counter_attack', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
