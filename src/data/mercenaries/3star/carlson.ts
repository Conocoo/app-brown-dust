import type { MercenaryTemplate } from '../../../types/mercenary'

export const carlson: MercenaryTemplate = {
  id: 'carlson',
  name: '칼슨',
  type: 'defender',
  star: 3,
  maxHp: 6798,
  atk: 874,
  def: 12,
  emoji: '🛡️',
  imageId: '825',
  critRate: 10,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [
      { type: 'taunt', value: 0, duration: 12, buffType: 'special', target: 'self' },
      { type: 'shield', value: 35, duration: 12, buffType: 'shield', target: 'self' },
      { type: 'def_scaling_damage', value: 275 },
      { type: 'on_kill_heal_percent', value: 100, target: 'self' },
      { type: 'dot_immune', value: 0, duration: 18, buffType: 'special', target: 'self' },
      { type: 'shield', value: 50, duration: 18, buffType: 'shield', target: 'self' },
    ],
  },
}
