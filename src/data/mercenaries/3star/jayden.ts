import type { MercenaryTemplate } from '../../../types/mercenary'

export const jayden: MercenaryTemplate = {
  id: 'jayden',
  name: '제이든',
  type: 'mage',
  star: 3,
  maxHp: 15039,
  atk: 1266,
  def: 10,
  emoji: '🔮',
  critRate: 25,
  critDamage: 75,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_second',
    attackRange: 'single',
    effects: [
      { type: 'giant_strike', value: 40, duration: 1 },
      { type: 'on_kill_trigger', value: 0, triggerSkill: 'giant_strike_recovery' },
      { type: 'heal_percent', value: 100, target: 'self' },
      { type: 'crit_up', value: 14, duration: 50, buffType: 'stat_enhance', target: 'self' },
      { type: 'crit_up_stacking', value: 4, duration: 50, buffType: 'special', target: 'self' },
      { type: 'regeneration', value: 14, duration: 15, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
