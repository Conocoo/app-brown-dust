import type { MercenaryTemplate } from '../../../types/mercenary'

export const niya: MercenaryTemplate = {
  id: 'niya',
  name: '니야',
  type: 'attacker',
  star: 4,
  maxHp: 3375,
  atk: 1422,
  def: 5,
  emoji: '⚔️',
  imageId: '2415',
  critRate: 10,
  critDamage: 50,
  agility: 20,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [
      { type: 'atk_down', value: 70, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'on_attack_trigger', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'crit_buff', value: 0, debuffClass: 'stat_weaken' },
    ],
  },
}
