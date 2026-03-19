import type { MercenaryTemplate } from '../../../types/mercenary'

export const eleaneer: MercenaryTemplate = {
  id: 'eleaneer',
  name: '에레니르',
  type: 'attacker',
  star: 5,
  maxHp: 4132,
  atk: 1220,
  def: 0,
  emoji: '⚔️',
  imageId: '3315',
  critRate: 75,
  critDamage: 50,
  agility: 65,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'back_n',
    rangeSize: 1,
    effects: [
      { type: 'atk_down', value: 65, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'on_attack_trigger', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'dot_pierce', value: 0.05, debuffClass: 'dot' },
      { type: 'temp_hp', value: 0.75, duration: 14, buffType: 'special', target: 'self' },
    ],
  },
}
