import type { MercenaryTemplate } from '../../../types/mercenary'

export const rigenette: MercenaryTemplate = {
  id: 'rigenette',
  name: '리즈넷',
  type: 'attacker',
  star: 3,
  maxHp: 3077,
  atk: 942,
  def: 0,
  emoji: '⚔️',
  imageId: '1015',
  critRate: 15,
  critDamage: 50,
  agility: 35,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'single',
    effects: [
      { type: 'stun', value: 0, duration: 12, debuffClass: 'cc', dmgTakenUp: 65 },
      { type: 'crit_scaling_damage', value: 150 },
      { type: 'on_kill_heal_percent', value: 50, target: 'self' },
      { type: 'crit_damage_up', value: 15, duration: 30, buffType: 'stat_enhance', target: 'self' },
      { type: 'crit_damage_up_stacking', value: 15, duration: 30, buffType: 'special', target: 'self' },
    ],
  },
}
