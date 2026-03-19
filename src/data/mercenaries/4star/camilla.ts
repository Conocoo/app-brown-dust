import type { MercenaryTemplate } from '../../../types/mercenary'

export const camilla: MercenaryTemplate = {
  id: 'camilla',
  name: '카밀라',
  type: 'attacker',
  star: 4,
  maxHp: 3837,
  atk: 2299,
  def: 0,
  emoji: '⚔️',
  imageId: '2385',
  critRate: 10,
  critDamage: 50,
  agility: 60,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [
      { type: 'on_attack_trigger', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'crit_damage_up', value: 30, duration: 20, buffType: 'stat_enhance', target: 'self' },
      { type: 'shield', value: 80, duration: 8, debuffClass: 'stat_weaken' },
    ],
  },
}
